import { degToRad, lerp } from 'three/src/math/MathUtils'
import { invlerp, taper } from '../../../../helpers'
import { KnobConfig } from './types'

export const initializeKnob = (defaults: KnobConfig | undefined) => {
  const { 
    minVal = 0, 
    maxVal = 1, 
    baseVal = 0.5, 
    curve = 1
  } = {...defaults}

  const minDeg = -135, maxDeg = 135 

  const degToVal = (rot: number) => {
    const fraction = invlerp(minDeg, maxDeg, rot)
    const value = lerp(minVal, maxVal, fraction)
    return taper(maxVal - value, minVal, maxVal, curve)
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
    baseVal, 
    curve, 
    minDeg,
    maxDeg,
    degToVal, 
    valToRad
  }
}