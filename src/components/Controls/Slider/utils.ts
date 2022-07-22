import { lerp, invlerp, taper } from '../../../helpers'
import { SliderConfig, SliderInit } from './types'

export const initializeSlider = (
  defaults: SliderConfig | undefined,
  id: string | number | undefined): SliderInit => {
  let {
    minVal = 0,
    maxVal = 1,
    length = 2,
    baseVal = 1,
    curve = 1
  } = {...defaults}

  baseVal = baseVal !== undefined? baseVal : minVal
  const startPos = -length / 2
  const endPos = length / 2

  const taperedVal = taper(baseVal!, minVal, maxVal, curve)
  const fraction = invlerp(minVal, maxVal, taperedVal)
  const initialPos = lerp(startPos, endPos, fraction)


  const posToVal = (dragPos: number, lowerBound: number, upperBound: number) => {
    const fraction = invlerp(lowerBound, upperBound, dragPos)
    const value = lerp(minVal, maxVal, fraction)
    return taper(value, maxVal, minVal, curve) // curve > 1 - logarithmic growth, curve < 1 - exponential growth
  }

  return { 
    minVal, 
    maxVal, 
    baseVal, 
    startPos,
    endPos,
    initialPos, 
    posToVal 
  }
}