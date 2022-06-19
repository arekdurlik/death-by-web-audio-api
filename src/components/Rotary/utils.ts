import { percentToValue, valueToPercent } from '../../helpers'

export const taper = (val: number, minVal: number, maxVal: number, curve: number) => { 
  return (maxVal - minVal) * ((val/100) ** curve) + minVal
}

export const getTaperedValue = (rot: number, minVal: number, maxVal: number, minRot: number, maxRot: number, curve: number) => {
  return maxVal - ((maxVal - minVal) * taper(valueToPercent(rot, minRot, maxRot), 0, 100, curve)/100 + minVal) + minVal
}

export const getInitialRotation = (val: number, minVal: number , maxVal: number, minRot: number, maxRot: number, curve: number) => {
  const rotationPercentage = valueToPercent(val, minVal, maxVal)
  const taperedPercentage = taper(rotationPercentage, 100, 0, curve)
  const rotation = percentToValue(taperedPercentage, minRot, maxRot)

  return rotation
}

