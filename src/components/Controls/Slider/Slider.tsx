import { FC, useEffect, useRef, useState } from 'react'
import { SliderInit, SliderProps } from './types'
import { initializeSlider } from './utils'
import { handleInteraction } from '../../utils'
import { useGesture } from '@use-gesture/react'
import { useOrbit } from '../../../contexts/OrbitContext'
import { Plane, Vector3 } from 'three'
import { clamp, degToRad, radToDeg } from 'three/src/math/MathUtils'
import { invertQuaternion } from '../../../helpers'
import { start } from 'repl'

const Slider: FC<SliderProps> = ({
  id, defaults, value: valueProp, onChange, ...props 
}) => {
  const [{ 
    minVal, maxVal, startPos, endPos, initialPos, initialVal, posToVal, valToPos
  }, setInit] = useState({} as SliderInit)
  const [internalVal, setInternalVal] = useState(0)
  const control = useRef<THREE.Group | null>(null)
  const cap = useRef<THREE.Mesh | null>(null)
  const capOffset = useRef<number | null>(null)
  const plane = useRef(new Plane(new Vector3(0, 1, 0), 0))
  const planeIntersect = useRef(new Vector3())
  const orbit = useOrbit()

  useEffect(() => {
    setInit(initializeSlider(defaults, id))
  }, [])

  useEffect(() => {
    if (cap.current === null || initialPos === undefined) return

    cap.current.position.x = initialPos
    setInternalVal(initialVal)
  }, [initialPos, initialVal])

  useEffect(() => {
    if (valueProp === undefined || valueProp === internalVal) return
      
    const newPos = valToPos(valueProp)
    cap.current!.position.x = newPos
    setInternalVal(valueProp)
  }, [valueProp])
  
  useEffect(() => {
    if (control.current === null) return

    control.current.updateMatrixWorld()
    plane.current.applyMatrix4(control.current.matrixWorld)
  }, [control])

  const dragBind = useGesture({
    onDrag: ({ event, direction: [x, y] }) => {
      event.stopPropagation()
      
      if (control.current === null 
      || cap.current === null) return

      /* @ts-ignore Property does not exist */
      event.ray.intersectPlane(plane.current, planeIntersect.current)

      const invertedQuaternion = invertQuaternion(control.current.quaternion)
      planeIntersect.current.applyQuaternion(invertedQuaternion)

      if (capOffset.current === null) {
        capOffset.current = cap.current!.position.x - planeIntersect.current.x
      }

      const correctedPos = planeIntersect.current.x + capOffset.current
      const dragPos = clamp(correctedPos, startPos, endPos)
      
      if ((x === 0 && y === 0)
      || (dragPos === startPos && internalVal === minVal)
      || (dragPos === endPos && internalVal === maxVal)) return

      cap.current.position.x = dragPos

      const newValue = posToVal(dragPos)

      handleValueChange(newValue)
    },
    onDragEnd: ({ event }) => {
      event.stopPropagation()

      capOffset.current = null
    },
    ...handleInteraction(orbit.current)
  })

  const wheelBind = useGesture({
    onWheelStart: ({ event }) => {
      event.stopPropagation()

      if (orbit.current) orbit.current.enableZoom = false
    },
    onWheel: ({ event, direction: [_, y] }) => {  
      event.stopPropagation()

      if (cap.current === null) return

      const newPos = cap.current.position.x + degToRad(y * 4)
      cap.current.position.x = clamp(newPos, startPos, endPos)

      const newVal = posToVal(cap.current.position.x, startPos, endPos)
      handleValueChange(newVal)
    },
    onWheelEnd: ({ event }) => {
      event.stopPropagation()
      
      if (orbit.current) orbit.current.enableZoom = true
    }
  })

  const handleValueChange = (newValue: number) => {
    if(newValue === internalVal) return

    setInternalVal(newValue)
    
    if (typeof onChange === 'function') {
      onChange({ 
        ...(id) && {id}, 
        value: newValue 
      })
    }
  }

  return (
    <group 
      ref={control}
      {...props} 
      {...wheelBind() as any}

    >
      <mesh>
        <boxBufferGeometry args={[2.6, 0.3, 0.6]}/>
        <meshBasicMaterial color="#333"/>
      </mesh>
      <mesh 
        ref={cap}
        position-y={0.1}
        {...dragBind() as any}
      >
        <boxBufferGeometry args={[0.5, 0.3, 0.5]}/>
        <meshBasicMaterial color="#222"/>
      </mesh>
    </group>
  )
}

export default Slider