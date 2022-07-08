import { Quaternion } from 'three'

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

export const invertQuaternion = (quaternion: Quaternion) => {
  return new Quaternion(
    -quaternion.x,
    -quaternion.y,
    -quaternion.z,
    quaternion.w
  )
}