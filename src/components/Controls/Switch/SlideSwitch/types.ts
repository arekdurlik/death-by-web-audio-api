export type SlideSwitchProps = {
  defaults?: SlideSwitchConfig
  onChange?: (value: Value) => void
  plane?: THREE.Plane 
  [x:string]: any
}

export type SlideSwitchConfig = {
  steps?: number
  initialStep?: number
  length?: number
  minVal?: number
  maxVal?: number
}

export type SlideSwitchInit = {
  steps: number
  initialStep: number
  startPos: number
  endPos: number
  stepPositions: Array<number>
  stepValues: Array<number>
 }

export type Value = {
  id?: string | number
  value?: number
  step?: number
}