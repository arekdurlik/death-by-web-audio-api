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
          <Delay />
        </OrbitProvider>
      </Canvas>
    </>
  )
}

export default App
