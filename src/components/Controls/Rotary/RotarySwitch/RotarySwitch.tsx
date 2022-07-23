import { useGesture } from '@use-gesture/react'
import { FC, useEffect, useRef, useState } from 'react'
import { initializeRotarySwitch, RotarySwitchSpring } from './utils'
import { RotarySwitchInit, RotarySwitchProps } from './types'
import { handleInteraction } from '../../../utils'
import { useSpring, a } from '@react-spring/three'
import { useOrbit } from '../../../../contexts/OrbitContext'
import { clamp, clip360, invertQuaternion, smod } from '../../../../helpers'
import { Plane, Vector3 } from 'three'
import { degToRad, radToDeg } from 'three/src/math/MathUtils'
import { usePrevious } from '../../../../hooks/usePrevious'

const RotarySwitch: FC<RotarySwitchProps> = ({
  id, defaults, step: stepProp, onChange, ...props
}) => {
  const [{
    stop, lowerStepBound, upperStepBound, initialStep, steps, stepValues, stepDegrees, stepGap
  }, setInit] = useState({} as RotarySwitchInit)
  const [internalStep, setInternalStep] = useState(0)
  const [correctedDeg, setCorrectedDeg] = useState(0)
  const prevCorrectedDeg = usePrevious(correctedDeg)

  const totalDegrees = useRef(0)
  const plane = useRef(new Plane(new Vector3(0, 1, 0), 0))
  const planeIntersect = useRef(new Vector3())
  const control = useRef<THREE.Group | null>(null)
  const knob = useRef<THREE.Group>(null)
  const dragging = useRef(false)
  const delayScroll = useRef(false)
  const startDeg = useRef<number | null>(null)
  const firstStep = lowerStepBound ? lowerStepBound : 0
  const lastStep = upperStepBound ? upperStepBound : steps - 1

  const orbit = useOrbit()
  const [{ rotation }, spring] = useSpring(() => ({
    rotation: 0, config: RotarySwitchSpring
  }))

  useEffect(() => {
    setInit(initializeRotarySwitch(defaults, id))
  }, [])

  useEffect(() => {
    if (stepDegrees === undefined || initialStep === undefined) return

    const initialDegrees = stepDegrees[initialStep]
    handleStepChange(initialStep, initialDegrees, false)
  }, [initialStep, stepDegrees, spring])

  useEffect(() => {
    if (stepProp === undefined || stepProp === internalStep) return

    const clampedStep = clamp(stepProp, firstStep, lastStep)
    const newDegrees = stepDegrees[clampedStep]
    handleStepChange(clampedStep, newDegrees, false)
  }, [stepProp])

  useEffect(() => {
    if (control.current === null || knob.current === null) return

    control.current.updateMatrixWorld()
    plane.current.translate(new Vector3(0, 0.25, 0))
    plane.current.applyMatrix4(control.current.matrixWorld)
  }, [control, knob])

  const dragBind = useGesture({
    onDragStart: ({ event }) => {
      event.stopPropagation()

      dragging.current = true
    },
    onDrag: ({ event, direction: [x,y] }) => {
      event.stopPropagation()
      
      if (knob.current === null
      || control.current === null
      || (x === 0 && y === 0)) return

      // @ts-ignore Property does not exist
      event.ray.intersectPlane(plane.current, planeIntersect.current)

      const knobPos = knob.current.localToWorld(new Vector3())
      
      const invQuat = invertQuaternion(control.current.quaternion)
      planeIntersect.current.applyQuaternion(invQuat)
      knobPos.applyQuaternion(invQuat)

      const newDeg = radToDeg(Math.atan2(
        knobPos.z - planeIntersect.current.z, 
        knobPos.x - planeIntersect.current.x
      )) - 180 
      
      const newCorrectedDeg = clip360(newDeg)
      setCorrectedDeg(newCorrectedDeg)
      
      if (startDeg.current === null) startDeg.current = newCorrectedDeg
      
      const dragOffset = smod(clip360(-startDeg.current + newCorrectedDeg), 360)
      const difference = prevCorrectedDeg - newCorrectedDeg
      const direction = difference < 0 ? 'cw' : difference > 0 ? 'ccw' : null
      
      let newStep: number, newRotation: number

      // check if switch can enter next position
      if (direction === 'cw' && dragOffset > stepGap) {
        startDeg.current = null
        newStep = (internalStep + 1) % steps
        newRotation = totalDegrees.current - stepGap
      } else if (direction === 'ccw' && dragOffset < -stepGap) {
        startDeg.current = null
        newStep = (internalStep + steps - 1) % steps
        newRotation = totalDegrees.current + stepGap
      } else return

      handleStepChange(newStep, newRotation)
    },
    onDragEnd: ({ event }) => {
      event.stopPropagation()
      
      startDeg.current = null
      dragging.current = false
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

      if (delayScroll.current) return
      delayScroll.current = true
      
      const direction = y === 1 ? 'cw' : 'ccw'
      let newStep: number, newRotation: number
      
      if (direction === 'cw') {
        newStep = (internalStep + 1) % steps
        newRotation = totalDegrees.current - stepGap
      }  else {
        newStep = (internalStep + steps - 1) % steps
        newRotation = totalDegrees.current + stepGap
      }

      handleStepChange(newStep, newRotation)
      setTimeout(() => delayScroll.current = false, 200)
    },
    onWheelEnd: ({ event }) => {
      event.stopPropagation()

      if (orbit.current) orbit.current.enableZoom = true
    }
  })
  
  const handleStepChange = (newStep: number, newRotation: number, animate = true) => {
    if (stop && (internalStep === lastStep || internalStep === firstStep)) return

    setInternalStep(newStep)
    totalDegrees.current = newRotation

    if (animate) {
      spring.start({ rotation: degToRad(totalDegrees.current) })
    } else {
      spring.set({ rotation: degToRad(totalDegrees.current) })
    }

    if (typeof onChange === 'function') {
      onChange({ 
        ...(id) && {id},
        step: newStep,
        ...(stepValues.length) && {value: stepValues[newStep]} 
      })
    }
  }

  return (
    <group 
      ref={control}
      {...props}
    >
      <a.group 
        ref={knob}
        rotation-y={rotation} 
        {...dragBind() as any} 
        {...wheelBind() as any} 
      >
        <mesh>
          <cylinderBufferGeometry args={[1, 1, 1, 64]}/>
          <meshLambertMaterial color="hotpink"/>
        </mesh>
        <mesh position={[0, 0.5, -0.5]}>
          <boxBufferGeometry args={[0.2, 0.1, 1]}/>
          <meshBasicMaterial color="white"/>
        </mesh>
      </a.group>
    </group>
  )
}

export default RotarySwitch