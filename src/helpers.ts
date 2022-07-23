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

export const smod = (x: number, m: number) => {
  return x - ((Math.floor(x / m + 0.5)) * m)
}

export const clip360 = (x: number) => {
  x = x % 360
  return (x < 0) ? x + 360 : x
}

export const invertQuaternion = (quaternion: Quaternion) => {
  return new Quaternion(
    -quaternion.x,
    -quaternion.y,
    -quaternion.z,
    quaternion.w
  )
}

export const getSteps = (lower: number, upper: number, steps: number) => {
  const difference = upper - lower
  const increment = difference / (steps - 1)

  return [
    lower, 
    ...Array(steps - 2).fill('').map((_, index) => 
      lower + (increment * (index + 1))
    ), 
    upper
  ]
}