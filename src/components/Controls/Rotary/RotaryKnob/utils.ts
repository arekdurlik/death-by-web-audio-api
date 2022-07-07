import { degToRad } from 'three/src/math/MathUtils'
import { percentToValue, valueToPercent } from '../../../../helpers'
import { taper } from '../../../../helpers'
import { KnobConfig } from './types'

export const initializeKnob = (defaults: KnobConfig | undefined) => {
  const minVal = defaults?.minVal || 0,
        maxVal = defaults?.maxVal || 5,
        base   = defaults?.base   || 2.5,
        ramp   = defaults?.ramp   || 0,
        curve  = defaults?.curve  || 2,
        minDeg = defaults?.minDeg || -135,
        maxDeg = defaults?.maxDeg || 135

  const minRad              = degToRad(minDeg),
        maxRad              = degToRad(maxDeg),
        taperedVal          = taper(base, minVal, maxVal, curve),
        percentage          = valueToPercent(taperedVal, minVal, maxVal),
        initialDeg          = percentToValue(percentage, minDeg, maxDeg),
        initialRad          = degToRad(initialDeg)

  const getTaperedValue = (rot: number) => {
    const positionPercentage = valueToPercent(rot, minRad, maxRad)
    const value = percentToValue(positionPercentage, minVal, maxVal)
    return maxVal - taper(value, minVal, maxVal, curve)
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

