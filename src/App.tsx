import { Canvas } from '@react-three/fiber'
import { PCFShadowMap, Plane, Vector3 } from 'three'
import RotarySwitch from './components/Controls/Rotary/RotarySwitch/RotarySwitch'
import Slider from './components/Controls/Slider/Slider'
import SlideSwitch from './components/Controls/Switch/SlideSwitch/SlideSwitch'
import Delay from './components/Stompboxes/Delay/Delay'
import { OrbitProvider } from './contexts/OrbitContext'

const knobDefaults = {
  minVal: 0,
  maxVal: 4,
  curve: 1,
  base: 2
}

const switchDefaults = {
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
            {JSON.stringify(knobDefaults, null, 2)}
          </pre>
        </div>

        <div>
          <span>initial rotary switch state:</span>
          <pre>
            {JSON.stringify(switchDefaults, null, 2)}
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
          <RotarySwitch 
            position={[2, 0, 0]}
            onChange={console.log}
            defaults={switchDefaults}
            />
          <SlideSwitch
            position={[0, 0, -1]}
            onChange={console.log}
            plane={plane}
            />
          <Slider
            position={[0, 0, 1]}
            plane={plane}
            onChange={console.log}
          />
          <Delay />
        </OrbitProvider>
      </Canvas>
    </>
  )
}

export default App
