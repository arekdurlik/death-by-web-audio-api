import { Quaternion } from 'three'
import { SlideSwitchConfig } from './types'
import { getSteps } from '../../../utils'

export const initializeSlideSwitch = (
  initialValues: SlideSwitchConfig | undefined
) => {
  const minVal = initialValues?.minVal || 0,
        maxVal = initialValues?.maxVal || 1,
        base   = initialValues?.base   || 2,
        steps  = initialValues?.steps  || 3,
        torque = initialValues?.torque || 1,
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