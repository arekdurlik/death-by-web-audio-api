import { useGesture } from '@use-gesture/react'
import { FC, useContext, useEffect, useRef } from 'react'
import { useState } from 'react'
import { clamp } from 'three/src/math/MathUtils'
import { Orbit } from '../../../App'
import { getSteps } from './utils'
import { initializeSwitch } from './utils'
import { SwitchProps } from './types'
import { handleInteraction } from '../../utils'
import { useSpring, a } from '@react-spring/three'

const RotarySwitch: FC<SwitchProps> = ({ 
  onChange, 
  initialValues, 
  ...props 
}) => {
  const { minVal, maxVal, base, steps, torque, minRad, maxRad } = initializeSwitch(initialValues!)
  const orbitControls = useContext(Orbit)
  const [stepRotations, setStepRotations] = useState<Array<number>>([])
  const [stepValues, setStepValues] = useState<Array<number>>([])
  const [step, setStep] = useState(base)
  const offset = useRef<number>(0)

  useEffect(() => {
    setStepRotations(getSteps(minRad, maxRad, steps).reverse())
    setStepValues(getSteps(minVal, maxVal, steps).reverse())
  }, [])

  const bind = useGesture({
    /* @ts-ignore Property does not exist */
    onDrag: ({ down, event, direction: [dx] }) => {
      event.stopPropagation()

      offset.current = down ? offset.current + 1 : 0
      
      if (offset.current < torque
      || (dx > 0 && step === steps - 1)
      || (dx < 0 && step === 0)) return

      offset.current = 0
      
      setStep((prevStep: number) => {
        const newStep = clamp(prevStep + dx, 0, steps - 1)
        
        if (typeof onChange === 'function') onChange({ step: newStep, value: stepValues[newStep]})
        return newStep
      })
    },
    ...handleInteraction(orbitControls)
  })

  const { rotation } = useSpring({
    rotation: stepRotations[step],
    config: { mass: 1, tension: 2000, friction: 0, precision: 0.05, bounce: 0 }
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