import { lerp } from 'three/src/math/MathUtils'

export const valueToPercent = (val: number, min: number, max: number) => {
  return ((val - min) * 100) / (max - min)
}

export const percentToValue = (
  percent: number, min: number, max: number
) => {
  return (((max - min) / 100) * percent) + min
}

export const taper = (val: number, minVal: number, maxVal: number, curve: number) => { 
  return (maxVal - minVal) * (normalize(val, minVal, maxVal) ** curve) + minVal
}

export const normalize = (val: number, min: number, max: number) => {
	return (val - min) / (max - min)
}

