import { useGesture } from '@use-gesture/react'
import { FC, useEffect, useRef, useState } from 'react'
import { clamp, degToRad, radToDeg } from 'three/src/math/MathUtils'
import { KnobProps } from './types'
import { handleInteraction } from '../../../utils'
import { useOrbit } from '../../../../contexts/OrbitContext'
import { clip360, smod } from '../../../../helpers'
import { Plane, Vector3 } from 'three'
import { usePrevious } from '../../../../hooks/usePrevious'
import { initializeKnob } from './utils'

const RotaryKnob: FC<KnobProps> = ({
  id, 
  onChange,
  value: valueProp,
  defaults,
  rotation,
  ...props 
}) => {
  const { minVal, maxVal, baseVal, minDeg, maxDeg, degToVal, valToRad } = initializeKnob(defaults, id)

  const [internalVal, setInternalVal] = useState(0)
  const prevInternalVal = usePrevious(internalVal)
  const [isMin, setIsMin] = useState(false)
  const [isMax, setIsMax] = useState(false)
  const [correctedDeg, setCorrectedDeg] = useState(0)
  const prevCorrectedDeg = usePrevious(correctedDeg)
  
  const plane = new Plane(new Vector3(0, 1, 0), 0)
  const knob = useRef<THREE.Group>(null)
  const dragging = useRef(false)
  const startDeg = useRef<number | null>(null)
  const endDeg = useRef(minDeg)
  
  const orbit = useOrbit()

  useEffect(() => {
    const initRad = valToRad(baseVal)
    knob.current!.rotation.y = -initRad
    endDeg.current = clip360(radToDeg(initRad))
    handleValueChange(baseVal)  
  }, [])

  useEffect(() => {
    if (dragging.current || valueProp === undefined) return

    const newRad = valToRad(valueProp)
    knob.current!.rotation.y = -newRad
    startDeg.current = null
    endDeg.current = clip360(radToDeg(newRad))
  }, [valueProp])

  const bind = useGesture({
    onDragStart: () => {
      dragging.current = true
      if (orbit.current?.enableRotate) orbit.current.enableRotate = false
    },
    onDrag: ({ event, direction: [x,y] }) => {
      event.stopPropagation()
      
      if (knob.current === null
      || (x === 0 && y === 0)) return

      const planeIntersect = new Vector3()
      
      // @ts-ignore Property does not exist
      event.ray.intersectPlane(plane, planeIntersect)

      const knobPos = knob.current.localToWorld(new Vector3())

      const newDeg = radToDeg(Math.atan2(
        knobPos.z - planeIntersect.z, 
        knobPos.x - planeIntersect.x
      )) - 180 
      
      if (startDeg.current === null) startDeg.current = newDeg
      
      // offset new rotation by the distance to the old one so the knob stays in place on click
      const rotationDiff = endDeg.current - startDeg.current
      const newCorrectedDeg = clip360(newDeg + rotationDiff) // 0-360
      const symDeg = smod(newCorrectedDeg, 360) // -180-180
      
      setCorrectedDeg(newCorrectedDeg)
      const difference = prevCorrectedDeg - newCorrectedDeg
      const direction = difference < 0 ? 'cw' : difference > 0 ? 'ccw' : null
      const maxDegChange = 90

      // check if knob isn't out of bounds
      if (internalVal === maxVal && direction === 'cw') {
        setIsMax(true)
      } else if (internalVal === minVal && direction === 'ccw') {
        setIsMin(true)
      }
      
      // check if knob is rotating away from bounds
      if (isMax && Math.abs(difference) < maxDegChange && direction === 'ccw') {
        endDeg.current = maxDeg - .1
        startDeg.current = null
        setIsMax(false)
      } else if (isMin && Math.abs(difference) < maxDegChange && direction === 'cw') {
        endDeg.current = minDeg + .1
        startDeg.current = null
        setIsMin(false)
      }
      
      if (isMin || isMax) return

      knob.current.rotation.y = degToRad(clamp(-symDeg, minDeg, maxDeg))

      const newVal = degToVal(symDeg)
      handleValueChange(newVal)
    },
    onDragEnd: () => {
      if (orbit.current) orbit.current.enableZoom = true
      dragging.current = false
      startDeg.current = null
      endDeg.current = radToDeg(-knob.current!.rotation.y)
    },
    ...handleInteraction(orbit.current),
  })

  const handleValueChange = (value: number) => {
    setInternalVal(value)

    if (typeof onChange === 'function') {

      // suppress changes in value caused by trying to drag the knob out of bounds
      if (internalVal === maxVal
      || internalVal === minVal
      || prevInternalVal === value) return

      onChange({ ...(id) && {id}, value: value })
    }
  }

  return (
    <group 
      rotation={rotation}
    >
      <group
        ref={knob}
        {...bind() as any} 
        {...props}
      >
        <mesh>
          <cylinderBufferGeometry args={[1, 1, 1, 64]}/>
          <meshLambertMaterial color="yellow"/>
        </mesh>
        <mesh position={[0, 0.5, -0.5]}>
          <boxBufferGeometry args={[0.2, 0.1, 1]}/>
          <meshBasicMaterial color="white"/>
        </mesh>
      </group>
    </group>
  )
}

export default RotaryKnob