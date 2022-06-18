import { degToRad } from 'three/src/math/MathUtils'
import { KnobConfig } from './types'

export const initializeKnob = (initialValues: KnobConfig) => {
  const minVal = initialValues?.minVal || 0,
        maxVal = initialValues?.maxVal || 1,
        base   = initialValues?.base   || minVal,
        ramp   = initialValues?.ramp   || 0,
        curve  = initialValues?.curve  || 1,
        minDeg = initialValues?.minDeg || -135,
        maxDeg = initialValues?.maxDeg || 135,
        minRad = degToRad(minDeg),
        maxRad = degToRad(maxDeg)
  
  return { minVal, maxVal, base, ramp, curve, minDeg, maxDeg, minRad, maxRad }
}