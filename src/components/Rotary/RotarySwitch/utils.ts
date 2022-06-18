import { degToRad } from 'three/src/math/MathUtils'
import { SwitchConfig } from './types'

export const initializeSwitch = (initialValues: SwitchConfig) => {
  const minVal = initialValues?.minVal || 0,
        maxVal = initialValues?.maxVal || 1,
        base   = initialValues?.base   || 0,
        steps  = initialValues?.steps  || 2,
        torque = initialValues?.torque || 20,
        minDeg = initialValues?.minDeg || -135,
        maxDeg = initialValues?.maxDeg || 135,
        minRad = degToRad(minDeg),
        maxRad = degToRad(maxDeg)
  
  return { minVal, maxVal, base, steps, torque, minDeg, maxDeg, minRad, maxRad }
}

export const getSteps = (lower: number, upper: number, steps: number) => {
  const difference = upper - lower
  const increment = difference / (steps - 1)

  return [lower, ...Array(steps - 2).fill('').map((_, index) => 
    lower + (increment * (index + 1))
  ), upper]
}