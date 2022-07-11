import { FC, ReactNode } from 'react'
import { KnobConfig, KnobProps } from './Rotary/RotaryKnob/types'
import { SwitchConfig, SwitchProps } from './Rotary/RotarySwitch/types'
import { SliderConfig, SliderProps } from './Slider/types'
import { SlideSwitchConfig, SlideSwitchProps } from './Switch/SlideSwitch/types'

export type InitialState = {
  [key: string]: {
    type: 'RotaryKnob',
    defaults: KnobConfig
    props: any 
  } | {
    type: 'RotarySwitch',
    defaults: SwitchConfig
    props: any
  } | {
    type: 'SlideSwitch',
    defaults: SlideSwitchConfig
    props: any
  } | {
    type: 'Slider',
    defaults: SliderConfig
    props: any
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