import { getSteps } from '../../../utils'
import { SwitchConfig } from './types'

export const initializeRotarySwitch = (
  defaults: SwitchConfig | undefined,
  id: string | number | undefined
) => {
  let {
    stop = true, 
    lowerStepBound = null, 
    upperStepBound = null, 
    baseStep = 0, 
    minVal = null, 
    maxVal = null 
  } = {...defaults}
  
  const steps  = 12
  const minDeg = -165 
  const maxDeg = 165
  const stepDegrees = getSteps(minDeg, maxDeg, steps).reverse()
  const stepValues = (minVal !== null && maxVal !== null) ? getSteps(minVal, maxVal, steps) : []
  const stepGap = Math.abs(stepDegrees[0] - stepDegrees[1])

  // TODO cleanup this mess
  lowerStepBound = lowerStepBound !== null ? lowerStepBound : upperStepBound !== null ? 0 : null
  upperStepBound = upperStepBound !== null ? upperStepBound : lowerStepBound !== null ? steps - 1 : null
  stop = stop ? stop : lowerStepBound !== null && upperStepBound !== null ? true : false

  if ((minVal === null && maxVal !== null) || (minVal !== null && maxVal === null)) throw new Error('_')

  return { 
    minVal,
    maxVal,
    stop,
    lowerStepBound,
    upperStepBound,
    baseStep,
    steps, 
    minDeg, 
    maxDeg,
    stepDegrees, 
    stepValues,
    stepGap 
  }
}

