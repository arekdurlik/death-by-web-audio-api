export type SliderProps = {
  id?: string | number,
  onChange?: (value: Value) => void
  defaults?: SliderConfig
  plane?: THREE.Plane
  [x:string]: any
}

export type SliderConfig = {
  minVal?: number
  maxVal?: number
  length?: number
  initialVal?: number
  curve?: number
}

export type SliderInit = {
  minVal: number
  maxVal: number
  initialVal: number
  startPos: number
  endPos: number
  initialPos: number 
  posToVal: Function
  valToPos: Function
}

export type Value = {
  id?: string | number
  value?: number
}
