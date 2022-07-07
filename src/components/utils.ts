import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

export const handleInteraction = (controls: OrbitControlsImpl | null): any => {
  return {
    onPointerDown: () => {
      if (controls) controls.enableRotate = false
      document.body.style.cursor =  'grabbing'
    },
    onPointerUp: () => { 
      if (controls) controls.enableRotate = true
      document.body.style.cursor =  'auto'
    },
    onPointerOver: () => { if (document.body.style.cursor !== 'grabbing') document.body.style.cursor = 'grab' },
    onPointerOut: () => { if (document.body.style.cursor !== 'grabbing') document.body.style.cursor = 'auto' },
  }
}

export const getSteps = (lower: number, upper: number, steps: number) => {
  const difference = upper - lower
  const increment = difference / (steps - 1)

  return [lower, ...Array(steps - 2).fill('').map((_, index) => 
    lower + (increment * (index + 1))
  ), upper]
}