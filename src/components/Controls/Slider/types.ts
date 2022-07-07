export type SliderProps = {
  onChange?: (value: number) => void
  defaults?: SliderConfig
  plane?: THREE.Plane
  [x:string]: any
}

export type SliderConfig = {
  minVal?: number
  maxVal?: number
  base?: number
  lowerBound?: number 
  upperBound?: number,
  curve?: number
}
