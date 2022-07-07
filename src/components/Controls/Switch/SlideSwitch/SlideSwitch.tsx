import { useSpring, a } from '@react-spring/three'
import { FC, useEffect, useRef, useState } from 'react'
import { getSteps } from '../../../utils'
import { SlideSwitchProps } from './types'
import { initializeSlideSwitch, invertQuaternion } from './utils'
import { handleInteraction } from '../../../utils'
import { useGesture } from '@use-gesture/react'
import { clamp } from 'three/src/math/MathUtils'
import { useOrbit } from '../../../../contexts/OrbitContext'
import { Vector3 } from 'three'

const SlideSwitch: FC<SlideSwitchProps> = ({
  onChange, 
  defaults,
  plane, 
  ...props 
}) => {
  const { base, steps, stepValues } = initializeSlideSwitch(defaults)
  const stepPositions = getSteps(-0.45, 0.45, steps)
  const orbit = useOrbit()
  const [step, setStep] = useState(base)
  const group = useRef<THREE.Group | null>(null)
  const planeIntersect = useRef(new Vector3())
  const delayScroll = useRef(false)
  const dragPos = useRef(0)


  const dragBind = useGesture({
    onDrag: ({ event, active }) => {
      event.stopPropagation()

      if (active && group.current) {
        /* @ts-ignore Property does not exist */
        event.ray.intersectPlane(plane, planeIntersect.current)
        
        const invertedQuaternion = invertQuaternion(group.current.quaternion)
        planeIntersect.current.applyQuaternion(invertedQuaternion)
        
        const newDragPos = planeIntersect.current.x

        const next = (newDragPos > (stepPositions[step + 1])
        && (newDragPos - dragPos.current > 0))
        const prev = (newDragPos < (stepPositions[step - 1])
        && (newDragPos - dragPos.current < 0))

        dragPos.current! = newDragPos

        const direction = next ? 1 : prev ? -1 : null
        if (direction) handleStepChange(direction)
      }
    },
    ...handleInteraction(orbit.current)
  })

  const wheelBind = useGesture({
    onWheelStart: () => {
      if (orbit.current) orbit.current.enableZoom = false
    },
    onWheel: ({ direction: [_, y]}) => {
      if (delayScroll.current === true) return

      delayScroll.current = true

      handleStepChange(y)
      setTimeout(() => delayScroll.current = false, 200)
    },
    onWheelEnd: () => {
      if (orbit.current) orbit.current.enableZoom = true
    }
  })
  
  const { x } = useSpring({
    x: stepPositions[step],
    config: { mass: 1, tension: 2000, friction: 0, precision: 0.05, bounce: 0 }
  })

  const handleStepChange = (direction: number) => {
    setStep((prevStep: number) => {
      const newStep = clamp(prevStep + direction, 0, steps - 1)

        if (newStep === prevStep) return prevStep

        if (typeof onChange === 'function') onChange({ 
          step: newStep, 
          value: stepValues[newStep]
        })

        return newStep
    })
  }

  return (
    <group rotation={[0, 0, 0]}
      ref={group}
      {...wheelBind() as any}
      {...props} 
    >
      <mesh>
        <boxBufferGeometry args={[1.5, 0.3, 0.6]}/>
        <meshBasicMaterial color="#333"/>
      </mesh>
      <a.mesh 
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