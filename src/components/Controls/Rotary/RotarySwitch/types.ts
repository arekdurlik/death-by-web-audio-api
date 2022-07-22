export type RotarySwitchProps = {
  id?: string | number,
  onChange?: (value: Value) => void
  defaults?: RotarySwitchConfig
  [x:string]: any
}

export type RotarySwitchConfig = {
  minVal?: number
  maxVal?: number
  stop?: boolean
  lowerStepBound?: number,
  upperStepBound?: number,
  baseStep?: number,
  value?: number
} 

export type RotarySwitchInit = {
  stop: boolean
  lowerStepBound: number | null
  upperStepBound: number | null
  baseStep: number
  steps: number
  stepDegrees: Array<number> 
  stepValues: Array<number> 
  stepGap: number 
}

export type Value = {
  id?: string | number
  step: number
  value?: number
}