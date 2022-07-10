import { InitialState } from '../../Controls/types'

export const initialDelayState: InitialState = {
  gain: {
    type: 'RotaryKnob',
    defaults: { base: 1, minVal: 0, maxVal: 5 },
    props: { position: [-2, 0 , 0] }
  }
}