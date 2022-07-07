import { SlideConfig } from './types'

export const initializeSlideSwitch = (initialValues: SlideConfig | undefined) => {
  const minVal = initialValues?.minVal || 0,
        maxVal = initialValues?.maxVal || 1,
        base   = initialValues?.base   || 0,
        steps  = initialValues?.steps  || 3,
        torque = initialValues?.torque || ((25 * steps) / steps)
  
  return { minVal, maxVal, base, steps, torque }
}