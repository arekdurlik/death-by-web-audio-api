export type KnobProps = {
  id?: string | number,
  onChange?: (value: Value) => void
  defaults?: RotaryKnobConfig
  plane?: THREE.Plane
  [x:string]: any
}

export type RotaryKnobConfig = {
  minVal?: number
  maxVal?: number
  initialVal?: number
  ramp?: number
  curve?: number
} 

export type RotaryKnobInit = {
  minVal: number 
  maxVal: number
  initialVal: number 
  minDeg: number
  maxDeg: number
  degToVal: Function
  valToRad: Function
}

export type Value = {
  id?: string | number
  value?: number
  step?: number
}