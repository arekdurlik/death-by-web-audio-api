import { GroupProps } from '@react-three/fiber'
import { RotaryKnobConfig } from './Rotary/RotaryKnob/types'
import { RotarySwitchConfig } from './Rotary/RotarySwitch/types'
import { SliderConfig } from './Slider/types'
import { SlideSwitchConfig } from './Switch/SlideSwitch/types'

export type InitialState = {
  [key: string]: {
    type: 'RotaryKnob',
    defaults?: RotaryKnobConfig
    props?: GroupProps
  } | {
    type: 'RotarySwitch',
    defaults?: RotarySwitchConfig
    props?: GroupProps
  } | {
    type: 'SlideSwitch',
    defaults?: SlideSwitchConfig
    props?: GroupProps
  } | {
    type: 'Slider',
    defaults?: SliderConfig
    props?: GroupProps
  }
}

type ControlConfig = RotaryKnobConfig | RotarySwitchConfig | SliderConfig | SlideSwitchConfig

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
    step?: number,
    defaults?: ControlConfig
    props?: GroupProps
  }
}