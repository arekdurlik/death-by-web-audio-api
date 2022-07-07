import { Quaternion } from 'three'
import { percentToValue, taper, valueToPercent } from '../../../helpers'
import { SliderConfig } from './types'

export const initializeSlider = (defaults: SliderConfig | undefined) => {
  const minVal     = defaults?.minVal || 0,
        maxVal     = defaults?.maxVal || 5,
        base       = defaults?.base   || 2.5,
        curve      = defaults?.curve  || 2

  const getInitialPos = (minPos: number, maxPos: number) => {
    const taperedVal = taper(base, minVal, maxVal, curve)
    const percentage = valueToPercent(taperedVal, minVal, maxVal)
    return percentToValue(percentage, minPos, maxPos)
  }

  const getTaperedValue = (dragPos: number, lowerBound: number, upperBound: number) => {
    const positionPercentage = valueToPercent(dragPos, lowerBound, upperBound)
    const value = percentToValue(positionPercentage, minVal, maxVal)
    return taper(value, maxVal, minVal, curve)
  }

  return { minVal, maxVal, base, curve, getInitialPos, getTaperedValue }
}

export const invertQuaternion = (quaternion: Quaternion) => {
  return new Quaternion(
    -quaternion.x,
    -quaternion.y,
    -quaternion.z,
    quaternion.w
  )
}