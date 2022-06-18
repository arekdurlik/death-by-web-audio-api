import { MutableRefObject } from 'react'
import { percentToValue, valueToPercent } from '../../helpers'

export const handleInteraction = (orbitControls: MutableRefObject<any> | null): any => {
  return {
    onDragStart: () => {
      orbitControls!.current.enableRotate = false
      document.body.style.cursor =  'grabbing'
    },
    onDragEnd: () => { 
      orbitControls!.current.enableRotate = true
      document.body.style.cursor =  'auto'
    },
    onPointerOver: () => { if (document.body.style.cursor !== 'grabbing') document.body.style.cursor = 'grab' },
    onPointerOut: () => { if (document.body.style.cursor !== 'grabbing') document.body.style.cursor = 'auto' },
  }
}

export const taper = (val: number, minVal: number, maxVal: number, curve: number) => { 
  return (maxVal - minVal) * ((val/100) ** curve) + minVal
}

export const getTaperedValue = (rot: number, minVal: number, maxVal: number, minRot: number, maxRot: number, curve: number) => {
  return maxVal - ((maxVal - minVal) * taper(valueToPercent(rot, minRot, maxRot), 0, 100, curve)/100 + minVal) + minVal
}

export const getInitialRotation = (val: number, minVal: number , maxVal: number, minRot: number, maxRot: number, curve: number) => {
  const rotationPercentage = valueToPercent(val, minVal, maxVal)
  const taperedPercentage = taper(rotationPercentage, 100, 0, curve)
  const rotation = percentToValue(taperedPercentage, minRot, maxRot)

  return rotation
}

