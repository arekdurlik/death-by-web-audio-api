import { useGesture } from '@use-gesture/react'
import { FC, useEffect, useRef, useState } from 'react'
import { clamp, degToRad } from 'three/src/math/MathUtils'
import { initializeKnob } from './utils'
import { KnobProps } from './types'
import { handleInteraction } from '../../../utils'
import { useOrbit } from '../../../../contexts/OrbitContext'

const RotaryKnob: FC<KnobProps> = ({ 
  onChange, 
  defaults, 
  ...props 
}) => {
  const { base, minVal, maxVal, minRad, maxRad, initialRad, getTaperedValue } = initializeKnob(defaults)
  const orbit = useOrbit()
  const knob = useRef<THREE.Group | null>(null)
  const [value, setValue] = useState(base)

  useEffect(() => {
    knob.current!.rotation.y = initialRad
  }, [])

  const bind = useGesture({
    onDrag: ({ event, delta: [_, dy] }) => {
      event.stopPropagation()

      if (orbit.current?.enableRotate) orbit.current.enableRotate = false
      
      if (knob.current === null
      || (dy > 0 && value === minVal)
      || (dy < 0 && value === maxVal)
      || dy === 0) return

      knob.current.rotation.y = clamp(knob.current.rotation.y + degToRad(dy), minRad, maxRad)
      
      handleValueChange()
    },
    onWheel: ({ event, movement: [_, y]}) => {
      event.stopPropagation()
      
      if (orbit.current) orbit.current.enableZoom = false

      if (knob.current === null  
      || (y < 0 && value === minVal)
      || (y > 0 && value === maxVal)
      || orbit.changing) return
        
      const newRad = knob.current.rotation.y - degToRad(y/100)

      knob.current.rotation.y = clamp(newRad, minRad, maxRad)

      handleValueChange()
    },
    onWheelEnd: () => { 
      if (orbit.current) orbit.current.enableZoom = true 
    },
    ...handleInteraction(orbit.current),
  })

  const handleValueChange = () => {
    const newValue = getTaperedValue(knob.current!.rotation.y)
    setValue(newValue)
    if (typeof onChange === 'function') onChange(newValue)
  }
  return (
    <group
      ref={knob}
      {...bind() as any} 
      {...props}
    >
      <mesh>
        <cylinderBufferGeometry args={[1, 1, 1, 64]}/>
        <meshLambertMaterial color="yellow"/>
      </mesh>
      <mesh position={[0, 0.5, -0.5]}>
        <boxBufferGeometry args={[0.2, 0.1, 1]}/>
        <meshBasicMaterial color="white"/>
      </mesh>
    </group>
  )
}

export default RotaryKnob