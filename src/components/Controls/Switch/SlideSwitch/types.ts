export type SlideProps = {
  onChange?: (object: Step) => void
  defaults?: SlideConfig
  [x:string]: any
}

export type SlideConfig = {
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