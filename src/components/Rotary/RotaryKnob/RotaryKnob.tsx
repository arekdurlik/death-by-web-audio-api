import { useGesture } from '@use-gesture/react'
import { FC, useEffect, useRef, useState } from 'react'
import { clamp, degToRad } from 'three/src/math/MathUtils'
import { initializeKnob } from './utils'
import { KnobProps } from './types'
import { handleInteraction } from '../../utils'
import { useOrbit } from '../../Canvas/OrbitContext'
import { OrbitControls } from 'three-stdlib'

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
    /* @ts-ignore Property does not exist */
    onDrag: ({ event, delta: [_, dy] }) => {
      event.stopPropagation()

      if (orbit.current?.enableRotate) orbit.current.enableRotate = false
      
      if (knob.current === null
      || dy === 0
      || (dy < 0 && value === maxVal)
      || (dy > 0 && value === minVal)) return

      knob.current.rotation.y = clamp(knob.current.rotation.y + degToRad(dy), minRad, maxRad)
      const newValue = getTaperedValue(knob.current.rotation.y)

      setValue(newValue)
      if (typeof onChange === 'function') onChange(newValue)
    },
    /* @ts-ignore Property does not exist */
    onWheel: ({ event, direction: [_, y]}) => {
      event.stopPropagation()
      if (knob.current === null || orbit.current === null || orbit.changing) return
      
      orbit.current.enableZoom = false
      const newRad = knob.current.rotation.y + degToRad(y * 10)
      
      knob.current.rotation.y = clamp(newRad, minRad, maxRad)
    },
    onWheelEnd: () => { 
      if (orbit.current) orbit.current.enableZoom = true 
    },
    ...handleInteraction(orbit.current),
  })

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