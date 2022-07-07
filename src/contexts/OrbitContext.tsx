import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { OrbitControls } from '@react-three/drei'
import { createContext, FC, ReactNode, useContext, useEffect, useRef, useState } from 'react'

type Props = { 
  children: ReactNode 
}

type Value = { 
  current: OrbitControlsImpl | null, 
  changing: boolean 
}

export const Orbit = createContext<Value>({ current: null, changing: false })
export const useOrbit = () => useContext(Orbit)

export const OrbitProvider: FC<Props> = ({ children }) => {
  const controls = useRef<OrbitControlsImpl>(null)
  const [changing, setChanging] = useState(false)

  useEffect(() => {
    const ref = controls.current
    ref?.addEventListener('start', handleOrbitStart)

    return () => {
      ref?.removeEventListener('start', handleOrbitStart)
    }
  }, [controls])

  const handleOrbitStart = () => {
    window.addEventListener('pointerup', handleOrbitEnd)
    setChanging(true)
  }
  const handleOrbitEnd = () => {
    window.removeEventListener('pointerup', handleOrbitEnd)
    setChanging(false)
  }

  return (
    <>
      <OrbitControls ref={controls}/>
      <Orbit.Provider value={{ current: controls.current!, changing }}>
        {children}
      </Orbit.Provider>
    </>
  )
}