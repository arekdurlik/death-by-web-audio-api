import { degToRad, lerp } from 'three/src/math/MathUtils'
import { invlerp, taper } from '../../../../helpers'
import { RotaryKnobConfig, RotaryKnobInit } from './types'

export const initializeKnob = (
  defaults: RotaryKnobConfig | undefined, 
  id: string | number | undefined
): RotaryKnobInit => {
  let { minVal = 0, maxVal = 1, initialVal, curve = 1} = {...defaults}
  const minDeg = -135, maxDeg = 135 

  initialVal = initialVal ? initialVal : minVal

  if (initialVal < minVal || initialVal > maxVal) {
    throw new Error('illegal base value for rotary knob' + (id ? `: ${id}` : ''))
  }

  const degToVal = (deg: number) => {
    const fraction = invlerp(minDeg, maxDeg, deg)
    const value = lerp(minVal, maxVal, fraction)
    return taper(value, maxVal, minVal, curve) // curve > 1 - logarithmic growth, curve < 1 - exponential growth
  } 
  
  const valToRad = (value: number) => {
    const fraction = invlerp(minVal, maxVal, value)
    const rotation = lerp(minDeg, maxDeg, fraction)
    const tapered = taper(rotation, minDeg, maxDeg, curve)
    return degToRad(tapered)
  }

  return {
    minVal, 
    maxVal, 
    initialVal, 
    minDeg,
    maxDeg,
    degToVal, 
    valToRad
  }
}