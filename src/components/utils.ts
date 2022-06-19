import { MutableRefObject } from 'react'

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