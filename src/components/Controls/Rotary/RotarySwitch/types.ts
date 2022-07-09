export type SwitchProps = {
  id?: string | number,
  onChange?: (value: Value) => void
  defaults?: SwitchConfig
  [x:string]: any
}

export type SwitchConfig = {
  minVal?: number
  maxVal?: number
  minDeg?: number
  maxDeg?: number
  torque?: number
  steps?: number
  base?: number
  value?: number
} 

export type Value = {
  id?: string | number
  value: number
  step?: number
}