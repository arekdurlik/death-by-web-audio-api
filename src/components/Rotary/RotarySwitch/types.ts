export type SwitchProps = {
  onChange?: (object: Step) => void
  initialValues?: SwitchConfig
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
} 

export type Step = {
  step: number
  value: number
}