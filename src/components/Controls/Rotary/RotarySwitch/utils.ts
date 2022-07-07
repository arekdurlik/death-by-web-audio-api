import { degToRad } from 'three/src/math/MathUtils'
import { SwitchConfig } from './types'

export const initializeSwitch = (defaults: SwitchConfig | undefined) => {
  const minVal = defaults?.minVal || 0,
        maxVal = defaults?.maxVal || 1,
        base   = defaults?.base   || 0.5,
        steps  = defaults?.steps  || 5,
        torque = defaults?.torque || 20,
        minDeg = defaults?.minDeg || -135,
        maxDeg = defaults?.maxDeg || 135
      
  const minRad = degToRad(minDeg),
        maxRad = degToRad(maxDeg)
  
  return { minVal, maxVal, base, steps, torque, minDeg, maxDeg, minRad, maxRad }
}

