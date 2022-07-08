import { lerp, invlerp, taper } from '../../../helpers'
import { SliderConfig } from './types'

export const initializeSlider = (defaults: SliderConfig | undefined) => {
  const minVal     = defaults?.minVal || 0,
        maxVal     = defaults?.maxVal || 5,
        base       = defaults?.base   || 2.5,
        curve      = defaults?.curve  || 2

  const getInitialPos = (minPos: number, maxPos: number) => {
    const taperedVal = taper(base, minVal, maxVal, curve)
    const fraction = invlerp(minVal, maxVal, taperedVal)
    return lerp(minPos, maxPos, fraction)
  }

  const getTaperedValue = (dragPos: number, lowerBound: number, upperBound: number) => {
    const fraction = invlerp(lowerBound, upperBound, dragPos)
    const value = lerp(minVal, maxVal, fraction)
    return taper(value, maxVal, minVal, curve)
  }

  return { 
    minVal, 
    maxVal, 
    base, 
    curve, 
    getInitialPos, 
    getTaperedValue 
  }
}