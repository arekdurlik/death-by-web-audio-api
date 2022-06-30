import { degToRad } from 'three/src/math/MathUtils'
import { percentToValue, valueToPercent } from '../../../helpers'
import { taper } from '../utils'
import { KnobConfig } from './types'

export const initializeKnob = (defaults: KnobConfig | undefined) => {
  const minVal = defaults?.minVal || 0,
        maxVal = defaults?.maxVal || 5,
        base   = defaults?.base   || 2.5,
        ramp   = defaults?.ramp   || 0,
        curve  = defaults?.curve  || 1,
        minDeg = defaults?.minDeg || -135,
        maxDeg = defaults?.maxDeg || 135,
        minRad = degToRad(minDeg),
        maxRad = degToRad(maxDeg)

  const rotationPercentage = valueToPercent(base, minVal, maxVal)
  const taperedPercentage = taper(rotationPercentage, 0, 100, curve)
  const initialDeg = percentToValue(taperedPercentage, minDeg, maxDeg)
  const initialRad = degToRad(initialDeg)
  
  const getTaperedValue = (rot: number): number => {
    return maxVal - ((maxVal - minVal) * taper(valueToPercent(rot, minRad, maxRad), 0, 100, curve)/100 + minVal) + minVal
  }

  return { 
    minVal, 
    maxVal, 
    base, 
    ramp, 
    curve, 
    minDeg, 
    maxDeg, 
    minRad, 
    maxRad, 
    initialDeg, 
    initialRad, 
    getTaperedValue 
  }
}

