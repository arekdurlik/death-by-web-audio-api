
export const taper = (val: number, minVal: number, maxVal: number, curve: number) => { 
  return (maxVal - minVal) * ((val/100) ** curve) + minVal
}



