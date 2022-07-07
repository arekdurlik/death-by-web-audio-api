import { Canvas } from '@react-three/fiber'
import { PCFShadowMap, Plane, Vector3 } from 'three'
import RotaryKnob from './components/Controls/Rotary/RotaryKnob/RotaryKnob'
import RotarySwitch from './components/Controls/Rotary/RotarySwitch/RotarySwitch'
import SlideSwitch from './components/Controls/Switch/SlideSwitch/SlideSwitch'
import { OrbitProvider } from './contexts/OrbitContext'

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
  const plane = new Plane(new Vector3(0, 1, 0), 0);

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
        <ambientLight intensity={0.1}/>
        <directionalLight position={[1, 1, 1]} />

        <OrbitProvider>
          <RotaryKnob 
            position={[-2, 0, 0]}
            />
          <RotarySwitch 
            initialValues={initialSwitchState}
            position={[2, 0, 0]}
            onChange={console.log}
            />
          <SlideSwitch
            position={[0, 0, 0]}
            onChange={console.log}
            plane={plane}
          />
        </OrbitProvider>
      </Canvas>
    </>
  )
}

export default App
