import { useGesture } from '@use-gesture/react'
import { FC, useEffect, useRef } from 'react'
import { clamp, degToRad } from 'three/src/math/MathUtils'
import { initializeKnob } from './utils'
import { KnobProps } from './types'
import { handleInteraction } from '../../../utils'
import { useOrbit } from '../../../../contexts/OrbitContext'
import { range } from '../../../../helpers'

const RotaryKnob: FC<KnobProps> = ({
  id, 
  onChange,
  value: valueProp,
  defaults,
  ...props 
}) => {
  const {minVal, base, maxVal, minRad, maxRad, initialRad, getTaperedValue } = initializeKnob(defaults)
  const orbit = useOrbit()
  const knob = useRef<THREE.Group | null>(null)
  const internalVal = useRef(0)

  useEffect(() => {
    knob.current!.rotation.y = initialRad
    internalVal.current = base
    handleValueChange()  
  }, [base, initialRad])

  useEffect(() => {
    if (valueProp === undefined) return
    setRotationFromValue(valueProp)
  }, [valueProp])

  const bind = useGesture({
    onDrag: ({ event, delta: [_, dy] }) => {
      event.stopPropagation()
      
      if (orbit.current?.enableRotate) orbit.current.enableRotate = false
      
      if (knob.current === null
      || (dy > 0 && internalVal.current === minVal)
      || (dy < 0 && internalVal.current === maxVal)
      || dy === 0) return

      const newRad = clamp(knob.current.rotation.y + degToRad(dy), minRad, maxRad)
      handleRotation(newRad)
    },
    onWheel: ({ event, movement: [_, y]}) => {
      event.stopPropagation()
      
      if (orbit.current) orbit.current.enableZoom = false

      if (knob.current === null  
      || (y < 0 && internalVal.current === minVal)
      || (y > 0 && internalVal.current === maxVal)
      || orbit.changing) return
        
      const newRad =  clamp(knob.current.rotation.y - degToRad(y/100), minRad, maxRad)
      handleRotation(newRad)
    },
    onWheelEnd: () => { 
      if (orbit.current) orbit.current.enableZoom = true 
    },
    ...handleInteraction(orbit.current),
  })

  const handleRotation = (radians: number) => {
    const taperedVal = getTaperedValue(radians)
    internalVal.current = taperedVal
    if (valueProp === undefined) setRotationFromValue(internalVal.current)
    
    handleValueChange()
  }

  const handleValueChange = () => {
    if (typeof onChange === 'function') onChange({
      ...(id) && {id},
      value: internalVal.current
    })
  }

  const setRotationFromValue = (value: number) => {
    knob.current!.rotation.y = -range(minVal, maxVal, minRad, maxRad, value)
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