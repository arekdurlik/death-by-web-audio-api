import { useSpring, a } from '@react-spring/three'
import { FC, useEffect, useRef, useState } from 'react'
import { SlideSwitchInit, SlideSwitchProps } from './types'
import { initializeSlideSwitch, slideSwitchSpring } from './utils'
import { handleInteraction } from '../../../utils'
import { useGesture } from '@use-gesture/react'
import { useOrbit } from '../../../../contexts/OrbitContext'
import { Plane, Vector3 } from 'three'
import { invertQuaternion, clamp } from '../../../../helpers'

const SlideSwitch: FC<SlideSwitchProps> = ({
  id, defaults, step: stepProp, onChange, ...props 
}) => {
  const [{
    steps, initialStep, stepPositions, stepValues, startPos, endPos
  }, setInit] = useState({} as SlideSwitchInit)
  const [internalStep, setInternalStep] = useState(0)

  const plane = useRef(new Plane(new Vector3(0, 1, 0), 0))
  const planeIntersect = useRef(new Vector3())
  const control = useRef<THREE.Group | null>(null)
  const cap = useRef<THREE.Mesh | null>(null)
  const delayScroll = useRef(false)
  const capOffset= useRef<number | null>(null)

  const orbit = useOrbit()
  const [{ x }, spring] = useSpring(() => ({ x: 0, config: slideSwitchSpring }))
  const firstStep = 0
  const lastStep = steps - 1

  useEffect(() => {
    setInit(initializeSlideSwitch(defaults))
  }, [])

  useEffect(() => {
    if (initialStep === undefined || stepPositions === undefined) return

    handleStepChange(initialStep, false)
  }, [initialStep, spring, stepPositions])

  useEffect(() => {
    if (stepProp === undefined || stepProp === internalStep) return

    const clampedStep = clamp(stepProp, firstStep, lastStep)
    handleStepChange(clampedStep, false)
  }, [stepProp])

  useEffect(() => {
    if (control.current === null) return

    control.current.updateMatrixWorld()
    plane.current.applyMatrix4(control.current.matrixWorld)
  }, [control])

  const dragBind = useGesture({
    onDrag: ({ event }) => {
      event.stopPropagation()

      if (control.current === null) return
      
      /* @ts-ignore Property does not exist */
      event.ray.intersectPlane(plane.current, planeIntersect.current)
      
      const invertedQuaternion = invertQuaternion(control.current.quaternion)
      planeIntersect.current.applyQuaternion(invertedQuaternion)

      if (capOffset.current === null) {
        capOffset.current = cap.current!.position.x - planeIntersect.current.x
      }
      
      const dragPos = clamp(planeIntersect.current.x + capOffset.current, startPos, endPos)
      
      const next = dragPos >= stepPositions[internalStep + 1]
      const prev = dragPos <= stepPositions[internalStep - 1]
      const stepChange = next ? 1 : prev ? -1 : 0
      const newStep = clamp(internalStep + stepChange, firstStep, lastStep)

      handleStepChange(newStep)
    },
    onDragEnd: ({ event }) => {
      event.stopPropagation()

      capOffset.current = null
    },
    ...handleInteraction(orbit.current)
  })

  const wheelBind = useGesture({
    onWheelStart: ({ event }) => {
      event.stopPropagation()

      if (orbit.current) orbit.current.enableZoom = false
    },
    onWheel: ({ event, direction: [_, y] }) => {  
      event.stopPropagation()

      if (delayScroll.current === true) return

      delayScroll.current = true

      const newStep = clamp(internalStep + y, firstStep, lastStep)
      handleStepChange(newStep)
      setTimeout(() => delayScroll.current = false, 200)
    },
    onWheelEnd: ({ event }) => {
      event.stopPropagation()

      if (orbit.current) orbit.current.enableZoom = true
    }
  })

  const handleStepChange = (newStep: number, animate = true) => {
    if (newStep === internalStep || newStep === internalStep) return
    setInternalStep(newStep)

    if (animate) {
      spring.start({ x: stepPositions[newStep] })
    } else {
      spring.set({ x: stepPositions[newStep] })
    }
    
    if (typeof onChange === 'function') onChange({ 
      ...(id) && {id},
      step: newStep, 
      ...(stepValues.length) && {value: stepValues[newStep]} 
    })
  }

  return (
    <group rotation={[0, 0, 0]}
      ref={control}
      {...wheelBind() as any}
      {...props} 
    >
      <mesh>
        <boxBufferGeometry args={[2.5, 0.3, 0.6]}/>
        <meshBasicMaterial color="#333"/>
      </mesh>
      <a.mesh 
        ref={cap}
        position-y={0.1}
        position-x={x}
        {...dragBind() as any}
      >
        <boxBufferGeometry args={[0.5, 0.3, 0.5]}/>
        <meshBasicMaterial color="#222"/>
      </a.mesh>
    </group>
  )
}

export default SlideSwitch