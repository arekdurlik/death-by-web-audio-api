import { useSpring, a } from '@react-spring/three'
import { FC, useContext, useEffect, useRef, useState } from 'react'
import { getSteps } from '../../Rotary/RotarySwitch/utils'
import { SlideProps } from './types'
import { initializeSlideSwitch } from './utils'
import { handleInteraction } from '../../utils'
import { useGesture } from '@use-gesture/react'
import { Orbit } from '../../../App'
import { clamp } from 'three/src/math/MathUtils'

const SlideSwitch: FC<SlideProps> = ({
  onChange, 
  initialValues, 
  ...props 
}) => {
  const { minVal, maxVal, base, steps, torque } = initializeSlideSwitch(initialValues!)
  const orbitControls = useContext(Orbit)
  const [stepPositions, setStepPositions] = useState<Array<number>>([])
  const [stepValues, setStepValues] = useState<Array<number>>([])
  const [step, setStep] = useState(base)
  const offset = useRef<number>(0)

  useEffect(() => {
    setStepPositions(getSteps(-0.45, 0.45, steps))
    setStepValues(getSteps(minVal, maxVal, steps))
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
    ...handleInteraction(orbitControls),
  })
  
  const { x } = useSpring({
    x: stepPositions[step],
    config: { mass: 1, tension: 2000, friction: 0, precision: 0.05, bounce: 0 }
  })

  return (
    <group>
      <mesh>
        <boxBufferGeometry args={[1.5, 0.3, 0.6]}/>
        <meshBasicMaterial color="#333"/>
      </mesh>
      <a.mesh position-y={0.1}
      position-x={x}
      {...bind() as any}
      >
        <boxBufferGeometry args={[0.5, 0.3, 0.5]}/>
        <meshBasicMaterial color="#222"/>
      </a.mesh>
    </group>
  )
}

export default SlideSwitch