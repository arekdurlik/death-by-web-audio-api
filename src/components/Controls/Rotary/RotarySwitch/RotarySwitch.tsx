import { useGesture } from '@use-gesture/react'
import { FC, useRef } from 'react'
import { initializeRotarySwitch } from './utils'
import { SwitchProps } from './types'
import { handleInteraction } from '../../../utils'
import { useSpring, a } from '@react-spring/three'
import { useOrbit } from '../../../../contexts/OrbitContext'
import { clamp } from '../../../../helpers'

const RotarySwitch: FC<SwitchProps> = ({ 
  onChange, 
  defaults, 
  ...props 
}) => {
  const { base, steps, torque, stepValues, stepRotations } = initializeRotarySwitch(defaults)
  const orbit = useOrbit()
  const step = useRef(base - 1)
  const offset = useRef(0)
  const delayScroll = useRef(false)

  const bind = useGesture({
    onDrag: ({ event, direction: [_, dy] }) => {
      event.stopPropagation()

      if (dy === 0
      || (dy > 0 && step.current === 0)
      || (dy < 0 && step.current === steps - 1)) return

      offset.current += dy

      if (Math.abs(offset.current) > torque) {
        handleStepChange(dy)
        offset.current = 0
      }
    },
    onWheelStart: () => {
      if (orbit.current) orbit.current.enableZoom = false
    },
    onWheel: ({event, direction: [_, y]}) => {
      event.stopPropagation()
      
      if (delayScroll.current === true
      || (y > 0 && step.current === 0)
      || (y < 0 && step.current === steps - 1)) return
      
      delayScroll.current = true
      handleStepChange(y)
      
      setTimeout(() => delayScroll.current = false, 200)
    },
    onWheelEnd: () => {
      if (orbit.current) orbit.current.enableZoom = true
    },
    ...handleInteraction(orbit.current)
  })
  
  const handleStepChange = (direction: number) => {
    step.current = clamp(step.current - direction, 0, steps - 1)
    api.start({ rotation: stepRotations[step.current] })

    if (typeof onChange === 'function') onChange({ 
      step: step.current + 1, 
      value: stepValues[step.current] 
    })
  }

  const [{ rotation }, api ] = useSpring(() => ({
      rotation: stepRotations[step.current], 
      config: { mass: 1, tension: 2000, friction: 100, precision: 0.01, bounce: 0}
  }))

  return (
    <a.group 
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