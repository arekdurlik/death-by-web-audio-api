import { lerp, invlerp, taper } from '../../../helpers'
import { SliderConfig, SliderInit } from './types'

export const initializeSlider = (
  defaults: SliderConfig | undefined,
  id: string | number | undefined): SliderInit => {
  let {
    minVal = 0,
    maxVal = 1,
    length = 2,
    initialVal = 0.5,
    curve = 2
  } = {...defaults}
  
  const valToPos = (value: number) => {
    const tapered = taper(value, minVal, maxVal, curve)
    const fraction = invlerp(minVal, maxVal, tapered)
    const position = lerp(startPos, endPos, fraction)
    return position // curve > 1 - logarithmic growth, curve < 1 - exponential growth
  }
  // TODO: make tapering more accurate
  const posToVal = (dragPos: number) => {
    const fraction = invlerp(startPos, endPos, dragPos)
    const value = lerp(minVal, maxVal, fraction)
    return taper(value, maxVal, minVal, curve) 
  }

  initialVal = initialVal !== undefined? initialVal : minVal
  const startPos = -length / 2
  const endPos = length / 2
  const initialPos = valToPos(initialVal)
  
  return { 
    minVal, 
    maxVal, 
    initialVal, 
    startPos,
    endPos,
    initialPos, 
    posToVal,
    valToPos
  }
}