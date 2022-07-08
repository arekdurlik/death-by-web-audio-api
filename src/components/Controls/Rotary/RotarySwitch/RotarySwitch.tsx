import { useGesture } from '@use-gesture/react'
import { FC, useRef, useState } from 'react'
import { clamp } from 'three/src/math/MathUtils'
import { initializeRotarySwitch } from './utils'
import { SwitchProps } from './types'
import { handleInteraction } from '../../../utils'
import { useSpring, a } from '@react-spring/three'
import { useOrbit } from '../../../../contexts/OrbitContext'

const RotarySwitch: FC<SwitchProps> = ({ 
  onChange, 
  defaults, 
  ...props 
}) => {
  const { base, steps, torque, stepValues, stepRotations } = initializeRotarySwitch(defaults)
  const orbit = useOrbit()
  const [step, setStep] = useState(base - 1)
  const offset = useRef(0)
  const delayScroll = useRef(false)

  const bind = useGesture({
    onDrag: ({ event, delta: [_, dy] }) => {
      event.stopPropagation()

      if (dy === 0
      || (dy > 0 && step === 0)
      || (dy < 0 && step === steps - 1)) return

      offset.current += dy

      if (Math.abs(offset.current) > torque) {
        handleStepChange(dy)
        offset.current = 0
      }
    },
    onWheelStart: () => {
      if (orbit.current) orbit.current.enableZoom = false
    },
    onWheel: ({ direction: [_, y]}) => {

      if (delayScroll.current === true
      || (y > 0 && step === 0)
      || (y < 0 && step === steps - 1)) return

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
    setStep((prevStep: number) => {
      const newStep = clamp(prevStep - direction, 0, steps - 1)
      
      if (typeof onChange === 'function') 
        onChange({ 
          step: newStep + 1, 
          value: stepValues[newStep] 
        })
      return newStep
    })
  }

  const { rotation } = useSpring({
    rotation: stepRotations[step],
    config: { mass: 1, tension: 2000, friction: 100, precision: 0.01, bounce: 0 }
  })

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