import { Quaternion } from 'three'
import { SlideSwitchConfig } from './types'
import { getSteps } from '../../../utils'

export const initializeSlideSwitch = (
  defaults: SlideSwitchConfig | undefined
) => {
  const minVal = defaults?.minVal || 0,
        maxVal = defaults?.maxVal || 1,
        base   = defaults?.base   || 1,
        steps  = defaults?.steps  || 3,
        torque = defaults?.torque || 1,
        stepValues = getSteps(minVal, maxVal, steps)

  if (steps === 1) 
    throw new Error('Illegal value for steps in a slide switch')
  if (base >= steps || base < 0) 
    throw new Error('Illegal base value in a slide switch')

  return { minVal, maxVal, base, steps, torque, stepValues }
}

export const invertQuaternion = (quaternion: Quaternion) => {
  return new Quaternion(
    -quaternion.x,
    -quaternion.y,
    -quaternion.z,
    quaternion.w
  )
}