export type SwitchProps = {
  id?: string | number,
  onChange?: (value: Value) => void
  defaults?: SwitchConfig
  [x:string]: any
}

export type SwitchConfig = {
  minVal?: number
  maxVal?: number
  stop?: boolean
  lowerStepBound?: number,
  upperStepBound?: number,
  baseStep?: number,
  value?: number
} 

export type Value = {
  id?: string | number
  value?: number
  step: number
}