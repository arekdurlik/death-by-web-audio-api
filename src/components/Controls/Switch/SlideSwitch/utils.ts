import { SlideSwitchConfig, SlideSwitchInit } from './types'
import { getSteps } from '../../../utils'

export const initializeSlideSwitch = (
  defaults: SlideSwitchConfig | undefined
): SlideSwitchInit => {
  const {
    steps = 3,
    baseStep = 0,
    length = 1.9,
    minVal = null,
    maxVal = null
  } = {...defaults}

  const startPos = -length / 2
  const endPos = length / 2
  const stepPositions = getSteps(startPos, endPos, steps)
  const stepValues = minVal !== null && maxVal !== null ? getSteps(minVal, maxVal, steps) : []

  if (steps === 1) 
    throw new Error('Illegal value for steps in a slide switch')
  if (baseStep >= steps || baseStep < 0) 
    throw new Error('Illegal base value in a slide switch')

  return { 
    steps, 
    baseStep,
    startPos, 
    endPos, 
    stepPositions,
    stepValues
  }
}

export const slideSwitchSpring = {
  mass: 1, tension: 2000, friction: 100, precision: 0.01, bounce: 0 
}