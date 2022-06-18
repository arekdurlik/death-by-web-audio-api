export const valueToPercent = (val: number, min: number, max: number) => {
  return ((val - min) * 100) / (max - min)
}

export const percentToValue = (percent: number, min: number, max: number) => {
  return (((max - min) / 100) * percent) + min
}

