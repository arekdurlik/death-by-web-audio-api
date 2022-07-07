export type SlideSwitchProps = {
  onChange?: (object: Step) => void
  defaults?: SlideSwitchConfig
  plane?: THREE.Plane 
  [x:string]: any
}

export type SlideSwitchConfig = {
  minVal?: number
  maxVal?: number
  steps?: number
  torque?: number
  base?: number
}

export type Step = {
  step: number
  value: number
}