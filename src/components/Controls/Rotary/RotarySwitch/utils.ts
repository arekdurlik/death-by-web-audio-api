import { degToRad } from 'three/src/math/MathUtils'
import { getSteps } from '../../../utils'
import { SwitchConfig } from './types'

export const initializeRotarySwitch = (defaults: SwitchConfig | undefined) => {
  const minVal = defaults?.minVal || 0,
        maxVal = defaults?.maxVal || 1,
        base   = defaults?.base   || 4,
        steps  = defaults?.steps  || 10,
        torque = defaults?.torque || 40,
        minDeg = defaults?.minDeg || -135,
        maxDeg = defaults?.maxDeg || 135

  const minRad        = degToRad(minDeg),
        maxRad        = degToRad(maxDeg),
        stepRotations = getSteps(minRad, maxRad, steps).reverse(),
        stepValues    = getSteps(minVal, maxVal, steps)

  return { 
    base, 
    steps, 
    torque, 
    minDeg, 
    maxDeg, 
    stepRotations, 
    stepValues 
  }
}

