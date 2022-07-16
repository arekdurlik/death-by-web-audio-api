export type KnobProps = {
  id?: string | number,
  onChange?: (value: Value) => void
  defaults?: KnobConfig
  plane?: THREE.Plane
  [x:string]: any
}

export type KnobConfig = {
  minVal?: number
  maxVal?: number
  baseVal?: number
  ramp?: number
  curve?: number
  value?: number
} 

export type Value = {
  id?: string | number
  value: number
  step?: number
}