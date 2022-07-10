import { FC, ReactNode } from 'react'
import { KnobConfig, KnobProps } from './Rotary/RotaryKnob/types'
import { SwitchConfig, SwitchProps } from './Rotary/RotarySwitch/types'
import { SliderConfig, SliderProps } from './Slider/types'
import { SlideSwitchConfig, SlideSwitchProps } from './Switch/SlideSwitch/types'

export type InitialState = {
  [key: string]: {
    type: 'RotaryKnob',
    defaults: KnobConfig
    props: KnobProps 
  } | {
    type: 'RotarySwitch',
    defaults: SwitchConfig
    props: SwitchProps
  } | {
    type: 'SlideSwitch',
    defaults: SlideSwitchConfig
    props: SlideSwitchProps
  } | {
    type: 'Slider',
    defaults: SliderConfig
    props: SliderProps
  }
}

type ControlConfig = KnobConfig | SwitchConfig | SliderConfig | SlideSwitchConfig

export type Action = {
  type: string
  payload: {
    id?: string | number
    [x:string]: any
  }
}

export type State = {
  [x: string]: {
    type: string
    value?: number
    defaults: ControlConfig
    props?: {
      [x: string]: any
    }
  }
}