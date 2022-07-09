import update from 'immutability-helper'
import { useMemo, useReducer } from 'react'
import RotaryKnob from '../../Controls/Rotary/RotaryKnob/RotaryKnob'
import SlideSwitch from '../../Controls/Switch/SlideSwitch/SlideSwitch'
import { Value } from '../../Controls/Rotary/RotaryKnob/types'
import { Action, State } from '../../Controls/types'
import { initialDelayState } from './init'

const availableControls = { RotaryKnob, SlideSwitch }

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_VALUE':
      const id = action.payload.id
      if (!id) throw new Error ('ID of value not specified')
      const value = action.payload.value

      return update(state, { [id]: { value: { $set: value }}})
    default:
      return {...state}
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
        value={values.value}
        defaults={values.defaults}
        onChange={handleChange}
        {...values.props}
      />
    })
  ), [state])

  return (
    <>
      {Controls}
      <RotaryKnob
      onChange={console.log}
      position={[-5,0,0]}
      />
    </>
  )
}

export default Delay