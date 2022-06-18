import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { createContext, MutableRefObject, useRef } from 'react'
import { PCFShadowMap } from 'three'
import RotaryKnob from './components/Rotary/RotaryKnob/RotaryKnob'
import RotarySwitch from './components/Rotary/RotarySwitch/RotarySwitch'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

export const Orbit = createContext<MutableRefObject<any> | null>(null)

const initialKnobState = {
  minVal: 0,
  maxVal: 4,
  curve: 1,
  base: 2
}

const initialSwitchState = {
  minVal: 0,
  maxVal: 10,
  steps: 8, 
  base: 5
}

const App = () => {
  const orbitControls = useRef<OrbitControlsImpl>(null)

  return (
    <>
      <div className="debug">
        <div>
          <span>initial rotary knob state:</span>
          <pre>
            {JSON.stringify(initialKnobState, null, 2)}
          </pre>
        </div>

        <div>
          <span>initial rotary switch state:</span>
          <pre>
            {JSON.stringify(initialSwitchState, null, 2)}
          </pre>
        </div>
      </div>
      <Canvas 
        dpr={2}
        camera={{ 
          fov: 60, 
          position: [0, 6, 3]
        }} 
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true
          gl.shadowMap.type = PCFShadowMap
        }}
      >
        <OrbitControls 
          makeDefault 
          ref={orbitControls} 
        />
        <ambientLight intensity={0.1}/>
        <directionalLight position={[1, 1, 1]} />

        <Orbit.Provider value={orbitControls}>
          <RotaryKnob 
            position={[-1.5, 0, 0]}
            />
          <RotarySwitch 
            initialValues={initialSwitchState}
            position={[1.5, 0, 0]}
          />
        </Orbit.Provider>
      </Canvas>
    </>
  )
}

export default App
