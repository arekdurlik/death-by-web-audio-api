import { useGesture } from '@use-gesture/react'
import { FC, useRef, useState } from 'react'
import { initializeRotarySwitch } from './utils'
import { SwitchProps } from './types'
import { handleInteraction } from '../../../utils'
import { useSpring, a } from '@react-spring/three'
import { useOrbit } from '../../../../contexts/OrbitContext'
import { clip360, smod } from '../../../../helpers'
import { Plane, Vector3 } from 'three'
import { degToRad, radToDeg } from 'three/src/math/MathUtils'
import { usePrevious } from '../../../../hooks/usePrevious'

const RotarySwitch: FC<SwitchProps> = ({ 
  id, 
  onChange, 
  defaults, 
  ...props 
}) => {
  // TODO somehow move this to useEffect
  const { 
    stop,
    lowerStepBound,
    upperStepBound,
    baseStep,
    steps, 
    stepValues, 
    stepDegrees, 
    stepGap, 
    minVal,
    maxVal
  } = initializeRotarySwitch(defaults, id)
  const [correctedDeg, setCorrectedDeg] = useState(0)
  const prevCorrectedDeg = usePrevious(correctedDeg)
  const totalDegrees = useRef(stepDegrees[baseStep])
  const plane = new Plane(new Vector3(0, 1, 0), 0)
  const knob = useRef<THREE.Group>(null)
  const step = useRef(baseStep)
  const orbit = useOrbit()
  const dragging = useRef(false)
  const startDeg = useRef<number | null>(null)

  const bind = useGesture({
    onDragStart: () => {
      dragging.current = true
      if (orbit.current?.enableRotate) orbit.current.enableRotate = false
    },
    onDrag: ({ event, direction: [x,y] }) => {
      event.stopPropagation()
      
      if (knob.current === null
      || (x === 0 && y === 0)) return

      const planeIntersect = new Vector3()
      
      // @ts-ignore Property does not exist
      event.ray.intersectPlane(plane, planeIntersect)

      const knobPos = knob.current.localToWorld(new Vector3())

      const newDeg = radToDeg(Math.atan2(
        knobPos.z - planeIntersect.z, 
        knobPos.x - planeIntersect.x
      )) - 180 
      
      const newCorrectedDeg = clip360(newDeg)
      setCorrectedDeg(newCorrectedDeg)
      
      if (startDeg.current === null) startDeg.current = newCorrectedDeg
      
      const offset = smod(clip360(-startDeg.current + newCorrectedDeg), 360)
      const difference = prevCorrectedDeg - newCorrectedDeg
      const direction = difference < 0 ? 'cw' : difference > 0 ? 'ccw' : null
      const firstStep = lowerStepBound ? lowerStepBound : 0
      const lastStep = upperStepBound ? upperStepBound : steps - 1

      // check if switch can enter next position
      if (direction === 'cw' && offset > stepGap) {
        startDeg.current = null

        if (stop && step.current === lastStep) return
        
        step.current = (step.current + 1) % steps
        totalDegrees.current -= stepGap
      } else if (direction === 'ccw' && offset < -stepGap) {
        startDeg.current = null

        if (stop && step.current === firstStep) return
        
        step.current = (step.current + steps - 1) % steps
        totalDegrees.current += stepGap
      } else return

      api.start({ rotation: degToRad(totalDegrees.current) })
      handleStepChange()
    },
    onDragEnd: () => {
      if (orbit.current) orbit.current.enableZoom = true
      startDeg.current = null
      dragging.current = false
    },
    ...handleInteraction(orbit.current)
  })
  
  const handleStepChange = () => {
    
    if (typeof onChange === 'function') onChange({ 
      step: step.current, 
      ...(minVal !== null && maxVal !== null) && {value: stepValues[step.current]} 
    })
  }

  const [{ rotation }, api ] = useSpring(() => ({
      rotation: degToRad(totalDegrees.current), 
      config: { mass: 1, tension: 2000, friction: 100, precision: 0.01, bounce: 0}, immediate: true
  }))

  return (
    <a.group 
      ref={knob}
      rotation-y={rotation} 
      {...bind() as any} 
      {...props}
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
  )
}

export default RotarySwitch