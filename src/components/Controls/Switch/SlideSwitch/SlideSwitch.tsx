import { useSpring, a } from '@react-spring/three'
import { FC, useRef } from 'react'
import { getSteps } from '../../../utils'
import { SlideSwitchProps } from './types'
import { initializeSlideSwitch } from './utils'
import { handleInteraction } from '../../../utils'
import { useGesture } from '@use-gesture/react'
import { useOrbit } from '../../../../contexts/OrbitContext'
import { Vector3 } from 'three'
import { invertQuaternion, clamp } from '../../../../helpers'

const SlideSwitch: FC<SlideSwitchProps> = ({
  onChange, 
  defaults,
  plane, 
  ...props 
}) => {
  const { base, steps, stepValues } = initializeSlideSwitch(defaults)
  const stepPositions = getSteps(-0.45, 0.45, steps)
  const planeIntersect = useRef(new Vector3())
  const group = useRef<THREE.Group | null>(null)
  const cap = useRef<THREE.Mesh | null>(null)
  const delayScroll = useRef(false)
  const step = useRef(base - 1)
  const capOffset= useRef(0)
  const orbit = useOrbit()

  const dragBind = useGesture({
    onDragStart: ({ event }) => {
      event.stopPropagation()

      /* @ts-ignore Property does not exist */
      event.ray.intersectPlane(plane, planeIntersect.current)
        
      const invertedQuaternion = invertQuaternion(group.current!.quaternion)
      planeIntersect.current.applyQuaternion(invertedQuaternion)

      capOffset.current = cap.current!.position.x - planeIntersect.current.x
    },
    onDrag: ({ event, active }) => {
      event.stopPropagation()

      if (active && group.current) {
        /* @ts-ignore Property does not exist */
        event.ray.intersectPlane(plane, planeIntersect.current)
        
        const invertedQuaternion = invertQuaternion(group.current.quaternion)
        planeIntersect.current.applyQuaternion(invertedQuaternion)
        
        const dragPos = clamp(planeIntersect.current.x + capOffset.current, -0.45, 0.45)

        const next = dragPos >= stepPositions[step.current + 1]
        const prev = dragPos <= stepPositions[step.current - 1]
        const dir = next ? 1 : prev ? -1 : null

        if (dir) handleStepChange(dir)
      }
    },
    ...handleInteraction(orbit.current)
  })

  const wheelBind = useGesture({
    onWheelStart: () => {
      if (orbit.current) orbit.current.enableZoom = false
    },
    onWheel: ({ event, direction: [_, y]}) => {  
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
    step.current = clamp(step.current + direction, 0, steps - 1)
    api.set({ x: stepPositions[step.current] })
    
    if (typeof onChange === 'function') onChange({ 
      step: step.current + 1, 
      value: stepValues[step.current]
    })
  }
  
  const [{ x }, api ] = useSpring(() => ({ 
    x: stepPositions[step.current], 
    config: { mass: 1, tension: 2000, friction: 100, precision: 0.01, bounce: 0 }
  }))

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