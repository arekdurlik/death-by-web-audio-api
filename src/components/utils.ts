import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

export const handleInteraction = (orbit: OrbitControlsImpl | null): any => {
  return {
    onPointerDown: () => {
      if (orbit) orbit.enableRotate = false
      document.body.style.cursor =  'grabbing'
    },
    onPointerUp: () => { 
      if (orbit) orbit.enableRotate = true
      document.body.style.cursor =  'auto'
    },
    onPointerOver: () => { if (document.body.style.cursor !== 'grabbing') document.body.style.cursor = 'grab' },
    onPointerOut: () => { if (document.body.style.cursor !== 'grabbing') document.body.style.cursor = 'auto' },
  }
}
