import { FC, useEffect, useRef, useState } from 'react'
import { SliderInit, SliderProps } from './types'
import { initializeSlider } from './utils'
import { handleInteraction } from '../../utils'
import { useGesture } from '@use-gesture/react'
import { useOrbit } from '../../../contexts/OrbitContext'
import { Plane, Vector3 } from 'three'
import { clamp } from 'three/src/math/MathUtils'
import { invertQuaternion } from '../../../helpers'

const Slider: FC<SliderProps> = ({
  id,
  onChange, 
  defaults,
  ...props 
}) => {
  const [{ 
    minVal, maxVal, startPos, endPos, initialPos, baseVal, posToVal 
  }, setInit] = useState({} as SliderInit)
  const control = useRef<THREE.Group | null>(null)
  const cap = useRef<THREE.Mesh | null>(null)
  const capOffset = useRef<number | null>(null)
  const plane = useRef(new Plane(new Vector3(0, 1, 0), 0))
  const planeIntersect = useRef(new Vector3())
  const internalVal = useRef(0)
  const orbit = useOrbit()

  useEffect(() => {
    setInit(initializeSlider(defaults, id))
  }, [])

  useEffect(() => {
    if (cap.current === null
    || initialPos === undefined) return

    cap.current.position.x = initialPos
    internalVal.current = baseVal
  }, [initialPos])
  
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
      || (dragPos === startPos && internalVal.current === minVal)
      || (dragPos === endPos && internalVal.current === maxVal)) return

      cap.current.position.x = dragPos

      const newValue = posToVal(dragPos, startPos, endPos)

      internalVal.current = newValue
    },
    onDragEnd: ({ event }) => {
      event.stopPropagation()

      capOffset.current = null
    },
    ...handleInteraction(orbit.current)
  })

  return (
    <group 
      ref={control}
      {...props} 
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