import { degToRad } from 'three/src/math/MathUtils'
import { lerp, invlerp } from '../../../../helpers'
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

  const minRad     = degToRad(minDeg),
        maxRad     = degToRad(maxDeg),

        taperedVal = taper(base, minVal, maxVal, curve),
        fraction   = invlerp(minVal, maxVal, taperedVal),
        initialDeg = -lerp(minDeg, maxDeg, fraction),
        initialRad = degToRad(initialDeg)

  const getTaperedValue = (rot: number) => {
    const fraction = invlerp(minRad, maxRad, rot)
    const value = lerp(minVal, maxVal, fraction)
    return taper(maxVal - value, minVal, maxVal, curve)
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
    initialRad, 
    getTaperedValue 
  }
}

