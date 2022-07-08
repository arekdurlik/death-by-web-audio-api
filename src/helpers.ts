import { Quaternion } from 'three'

export const taper = (val: number, min: number, max: number, curve: number) => { 
  return (max - min) * (normalize(val, min, max) ** curve) + min
}

export const normalize = (val: number, min: number, max: number) => {
	return (val - min) / (max - min)
}

export const lerp = (x: number, y: number, a: number) => {
  return x * (1 - a) + y * a
}

export const invlerp = (x: number, y: number, a: number) => {
  return clamp((a - x) / (y - x))
}

export const clamp = (a: number, min = 0, max = 1) => {
  return Math.min(max, Math.max(min, a))
}

export const range = (x1: number, y1: number, x2: number, y2: number, a: number) => {
  return lerp(x2, y2, invlerp(x1, y1, a))
}

export const invertQuaternion = (quaternion: Quaternion) => {
  return new Quaternion(
    -quaternion.x,
    -quaternion.y,
    -quaternion.z,
    quaternion.w
  )
}