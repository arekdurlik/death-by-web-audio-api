import { InitialState } from '../../Controls/types'

export const initialDelayState: InitialState = {
  rotaryKnob: {
    type: 'RotaryKnob',
    defaults: { minVal: 0, maxVal: 5, initialVal: 1 },
    props: { position: [-6, 0, 0], rotation: [Math.PI/2.5, 0, -Math.PI/4] }
  },
  slider: {
    type: 'Slider',
    props: { position: [-2, 0, 0], rotation: [Math.PI/2.5, Math.PI/2, -Math.PI/4] }
  },
  rotarySwitch: {
    type: 'RotarySwitch',
    props: { position: [2, 0, 0], rotation: [-Math.PI/4, 0, Math.PI/4] }
  },
  slideSwitch: {
    type: 'SlideSwitch',
    props: { position: [6, 0, 0], rotation: [Math.PI/2.3, 0, Math.PI/4] }
  }
}