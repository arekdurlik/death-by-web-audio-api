import { Canvas } from '@react-three/fiber'
import { PCFShadowMap, Plane, Vector3 } from 'three'
import RotarySwitch from './components/Controls/Rotary/RotarySwitch/RotarySwitch'
import Slider from './components/Controls/Slider/Slider'
import SlideSwitch from './components/Controls/Switch/SlideSwitch/SlideSwitch'
import Delay from './components/Stompboxes/Delay/Delay'
import { OrbitProvider } from './contexts/OrbitContext'

const App = () => {
  const plane = new Plane(new Vector3(0, 1, 0), 0);

  return (
    <>
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
            position={[2, 0, -4]}
            rotation={[Math.PI / 2.5, 0, Math.PI / 4]}
            onChange={console.log}
            />
          <SlideSwitch
            position={[0, 0, -2]}
            onChange={console.log}
            plane={plane}
            />
          <Slider
            position={[0, 0, 1.5]}
            rotation={[-Math.PI/2.4, Math.PI/3, Math.PI/3]}
            onChange={console.log}
          />
          <Delay />
        </OrbitProvider>
      </Canvas>
    </>
  )
}

export default App
