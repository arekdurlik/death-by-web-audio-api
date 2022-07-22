import { KnobConfig } from './Rotary/RotaryKnob/types'
import { RotarySwitchConfig } from './Rotary/RotarySwitch/types'
import { SliderConfig } from './Slider/types'
import { SlideSwitchConfig } from './Switch/SlideSwitch/types'

export type InitialState = {
  [key: string]: {
    type: 'RotaryKnob',
    defaults: KnobConfig
    props: any 
  } | {
    type: 'RotarySwitch',
    defaults: RotarySwitchConfig
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

type ControlConfig = KnobConfig | RotarySwitchConfig | SliderConfig | SlideSwitchConfig

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