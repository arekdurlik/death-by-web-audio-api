import update from 'immutability-helper'
import { useMemo, useReducer } from 'react'
import RotaryKnob from '../../Controls/Rotary/RotaryKnob/RotaryKnob'
import RotarySwitch from '../../Controls/Rotary/RotarySwitch/RotarySwitch'
import SlideSwitch from '../../Controls/Switch/SlideSwitch/SlideSwitch'
import Slider from '../../Controls/Slider/Slider'
import { Value } from '../../Controls/Rotary/RotaryKnob/types'
import { Action, State } from '../../Controls/types'
import { initialDelayState } from './init'

const availableControls = {
  RotaryKnob,
  RotarySwitch,
  SlideSwitch,
  Slider
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_VALUE':
      const id = action.payload.id
      if (!id) throw new Error ('ID of value not specified')
      const value = action.payload.value
      const step = action.payload.step

      return update(state, { [id]: { 
        ...(value !== undefined) && { value: { $set: value }},
        ...(step !== undefined) && { step: { $set: step }}
      }})
    default:
      throw new Error(`Illegal action type "${action.type}" in Delay reducer`)
  } 
}

const Delay = () => {
  const [state, dispatch] = useReducer(reducer, initialDelayState)

  const handleChange = (payload: Value) => {
    dispatch({ 
      type: 'SET_VALUE', 
      payload
    })
  }

  const Controls = useMemo(() => (
    Object.keys(state).map((id, index) => {
      const values = state[id as keyof typeof state]
      const Control = availableControls[values.type as keyof typeof availableControls]

      if (Control === undefined) throw new Error ('Illegal control type')

      return <Control
        key={index}
        id={id}
        defaults={values.defaults}
        value={values.value}
        step={values.step}
        onChange={handleChange}
        {...values.props}
      />
    })
  ), [state])

  return (
    <>
      {Controls}
    </>
  )
}

export default Delay