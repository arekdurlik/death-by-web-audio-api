import { useGesture } from '@use-gesture/react'
import { FC, useContext, useEffect, useRef, useState } from 'react'
import { degToRad, clamp } from 'three/src/math/MathUtils'
import { Orbit } from '../../../App'
import { getInitialRotation, getTaperedValue } from '../utils'
import { initializeKnob } from './utils'
import { KnobProps } from './types'
import { handleInteraction } from '../../utils'

const RotaryKnob: FC<KnobProps> = ({ 
  onChange, 
  initialValues, 
  ...props 
}) => {
  const { minVal, maxVal, base, curve, minRad, maxRad } = initializeKnob(initialValues!)
  const orbitControls = useContext(Orbit)
  const knob = useRef<THREE.Group | null>(null)
  const [value, setValue] = useState<number>(0)

  useEffect(() => {
    knob.current!.rotation.y = getInitialRotation(base, minVal, maxVal, minRad, maxRad, curve)
  }, [])

  const bind = useGesture({
    /* @ts-ignore Property does not exist */
    onDrag: ({ event, delta: [dx] }) => {
      event.stopPropagation()

      if (knob.current === null
      || dx === 0
      || (dx > 0 && value === maxVal)
      || (dx < 0 && value === minVal)) return
      
      knob.current.rotation.y = clamp(knob.current.rotation.y + degToRad(-dx), minRad, maxRad)
      const newValue = getTaperedValue(knob.current.rotation.y, minVal, maxVal, minRad, maxRad, curve)

      setValue(newValue)
      if (typeof onChange === 'function') onChange(newValue)
    },
    ...handleInteraction(orbitControls)
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