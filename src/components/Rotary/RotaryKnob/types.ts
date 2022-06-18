export type KnobProps = {
  onChange?: (value: number) => void
  initialValues?: KnobConfig
  [x:string]: any
}

export type KnobConfig = {
  minVal?: number
  maxVal?: number
  base?: number
  ramp?: number
  curve?: number
  minDeg?: number
  maxDeg?: number
} 