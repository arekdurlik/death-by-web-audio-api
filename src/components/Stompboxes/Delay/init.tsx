import { InitialState } from '../../Controls/types'

export const initialDelayState: InitialState = {
  gain: {
    type: 'RotaryKnob',
    defaults: { minVal: 0, maxVal: 5, baseVal: 1 },
    props: { position: [-2, 0 , 0] }
  }
}