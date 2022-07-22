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
  onChange, 
  defaults,
  ...props 
}) => {
  const [{
    steps, baseStep, stepPositions, stepValues, startPos, endPos
  }, setInit] = useState({} as SlideSwitchInit)
  const plane = useRef(new Plane(new Vector3(0, 1, 0), 0))
  const planeIntersect = useRef(new Vector3())
  const control = useRef<THREE.Group | null>(null)
  const cap = useRef<THREE.Mesh | null>(null)
  const delayScroll = useRef(false)
  const step = useRef<number | null>()
  const capOffset= useRef(0)
  const orbit = useOrbit()
  const [{ x }, spring] = useSpring(() => ({ x: 0, config: slideSwitchSpring }))

  useEffect(() => {
    setInit(initializeSlideSwitch(defaults))
  }, [])

  useEffect(() => {
    if (baseStep === undefined
    || stepPositions === undefined) return

    step.current = baseStep
    spring.set({ x: stepPositions[step.current] })
  }, [spring, baseStep, stepPositions])

  useEffect(() => {
    if (control.current === null) return

    control.current.updateMatrixWorld()
    plane.current.applyMatrix4(control.current.matrixWorld)
  }, [control])

  const dragBind = useGesture({
    onDragStart: ({ event }) => {
      event.stopPropagation()

      /* @ts-ignore Property does not exist */
      event.ray.intersectPlane(plane.current, planeIntersect.current)
        
      const invertedQuaternion = invertQuaternion(control.current!.quaternion)
      planeIntersect.current.applyQuaternion(invertedQuaternion)

      capOffset.current = cap.current!.position.x - planeIntersect.current.x
    },
    onDrag: ({ event }) => {
      event.stopPropagation()

      if (control.current === null) return
      
      /* @ts-ignore Property does not exist */
      event.ray.intersectPlane(plane.current, planeIntersect.current)
      
      const invertedQuaternion = invertQuaternion(control.current.quaternion)
      planeIntersect.current.applyQuaternion(invertedQuaternion)
      
      const dragPos = clamp(planeIntersect.current.x + capOffset.current, startPos, endPos)
      
      const next = dragPos >= stepPositions[step.current! + 1]
      const prev = dragPos <= stepPositions[step.current! - 1]
      const direction = next ? 1 : prev ? -1 : null

      if (direction) handleStepChange(direction)
    },
    ...handleInteraction(orbit.current)
  })

  const wheelBind = useGesture({
    onWheelStart: () => {
      if (orbit.current) orbit.current.enableZoom = false
    },
    onWheel: ({ event, direction: [_, y] }) => {  
      event.stopPropagation()

      if (delayScroll.current === true) return

      delayScroll.current = true

      handleStepChange(y)
      setTimeout(() => delayScroll.current = false, 200)
    },
    onWheelEnd: () => {
      if (orbit.current) orbit.current.enableZoom = true
    }
  })

  const handleStepChange = (direction: number) => {
    step.current = clamp(step.current! + direction, 0, steps - 1)
    spring.start({ x: stepPositions[step.current] })
    
    if (typeof onChange === 'function') onChange({ 
      step: step.current, 
      ...(stepValues.length) && {value: stepValues[step.current]} 
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