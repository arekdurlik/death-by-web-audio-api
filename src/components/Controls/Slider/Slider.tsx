import { FC, useEffect, useRef, useState } from 'react'
import { SliderProps } from './types'
import { initializeSlider } from './utils'
import { handleInteraction } from '../../utils'
import { useGesture } from '@use-gesture/react'
import { useOrbit } from '../../../contexts/OrbitContext'
import { Plane, Vector3 } from 'three'
import { clamp, degToRad } from 'three/src/math/MathUtils'
import { invertQuaternion } from '../../../helpers'

const Slider: FC<SliderProps> = ({
  onChange, 
  defaults,
  plane, 
  ...props 
}) => {
  const { minVal, maxVal, getInitialPos, getTaperedValue } = initializeSlider(defaults)
  const capOffset = useRef(0)
  const value = useRef(0)
  const planeIntersect = useRef(new Vector3())
  const group = useRef<THREE.Group | null>(null)
  const cap = useRef<THREE.Mesh | null>(null)
  const orbit = useOrbit()
  const lowerBound = -0.45
  const upperBound = 0.45

  useEffect(() => {
    cap.current!.position.x = getInitialPos(lowerBound, upperBound)
  }, [])

  const dragBind = useGesture({
    onDragStart: ({ event }) => {
      event.stopPropagation()

      /* @ts-ignore Property does not exist */
      event.ray.intersectPlane(plane, planeIntersect.current)
        
      const invertedQuaternion = invertQuaternion(group.current!.quaternion)
      planeIntersect.current.applyQuaternion(invertedQuaternion)

      capOffset.current = cap.current!.position.x - planeIntersect.current.x
    },
    onDrag: ({ event, active, direction: [x, y] }) => {
      event.stopPropagation()

      if (active && group.current) {
        /* @ts-ignore Property does not exist */
        event.ray.intersectPlane(plane, planeIntersect.current)
        
        const invertedQuaternion = invertQuaternion(group.current.quaternion)
        planeIntersect.current.applyQuaternion(invertedQuaternion)

        const correctedPos = planeIntersect.current.x + capOffset.current

        const dragPos = clamp(correctedPos, lowerBound, upperBound)
        
        if ((x === 0 && y === 0)
        || (dragPos === lowerBound && value.current === minVal)
        || (dragPos === upperBound && value.current === maxVal)) return
        
        cap.current!.position.x = dragPos

        const newValue = getTaperedValue(dragPos, lowerBound, upperBound)

        value.current = newValue
        if (typeof onChange === 'function') onChange(newValue)
      }
    },
    ...handleInteraction(orbit.current)
  })

  const wheelBind = useGesture({
    onWheelStart: () => {
      if (orbit.current) orbit.current.enableZoom = false
    },
    onWheel: ({ event, movement: [_, y]}) => {
      event.stopPropagation()

      if (orbit.current === null
      || cap.current === null
      || (y < 0 && value.current === minVal)
      || (y > 0 && value.current === maxVal)) return

      orbit.current.enableZoom = false
        
      const newPos = clamp(cap.current.position.x + degToRad(y/100), lowerBound, upperBound)

      cap.current.position.x = newPos

      const newValue = getTaperedValue(newPos, lowerBound, upperBound)

      value.current = newValue
      if (typeof onChange === 'function') onChange(newValue)
    },
    onWheelEnd: () => { 
      if (orbit.current) orbit.current.enableZoom = true 
    },
  })
  
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
      <mesh 
        ref={cap}
        position-y={0.1}
        {...dragBind() as any}
      >
        <boxBufferGeometry args={[0.5, 0.3, 0.5]}/>
        <meshBasicMaterial color="#222"/>
      </mesh>
    </group>
  )
}

export default Slider