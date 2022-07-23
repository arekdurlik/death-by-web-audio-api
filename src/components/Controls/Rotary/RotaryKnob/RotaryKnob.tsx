import { useGesture } from '@use-gesture/react'
import { FC, useEffect, useRef, useState } from 'react'
import { clamp, degToRad, radToDeg } from 'three/src/math/MathUtils'
import { KnobProps, RotaryKnobInit } from './types'
import { handleInteraction } from '../../../utils'
import { useOrbit } from '../../../../contexts/OrbitContext'
import { clip360, invertQuaternion, smod } from '../../../../helpers'
import { Plane, Vector3 } from 'three'
import { usePrevious } from '../../../../hooks/usePrevious'
import { initializeKnob } from './utils'

const RotaryKnob: FC<KnobProps> = ({
  id, defaults, value: valueProp, onChange, ...props
}) => {
  const [{
    minVal, maxVal, initialVal, minDeg, maxDeg, degToVal, valToRad
  }, setInit] = useState({} as RotaryKnobInit)
  const [internalVal, setInternalVal] = useState(0)
  const [correctedDeg, setCorrectedDeg] = useState(0)
  const [isMin, setIsMin] = useState(false)
  const [isMax, setIsMax] = useState(false)
  const prevInternalVal = usePrevious(internalVal)
  const prevCorrectedDeg = usePrevious(correctedDeg)
  
  const plane = useRef(new Plane(new Vector3(0, 1, 0), 0))
  const planeIntersect = useRef(new Vector3())
  const control = useRef<THREE.Group | null>(null)
  const knob = useRef<THREE.Group>(null)
  const startDeg = useRef<number | null>(null)
  const endDeg = useRef<number | null>(null)
  const orbit = useOrbit()

  useEffect(() => {
    setInit(initializeKnob(defaults, id))
  }, [])

  useEffect(() => {
    if (initialVal === undefined) return

    const initRad = valToRad(initialVal)
    knob.current!.rotation.y = -initRad
    endDeg.current = clip360(radToDeg(initRad))
    handleValueChange(initialVal)  
  }, [initialVal])

  useEffect(() => {
    if (valueProp === undefined || valueProp === internalVal) return

    const newRad = valToRad(valueProp)
    knob.current!.rotation.y = -newRad
    startDeg.current = null
    endDeg.current = clip360(radToDeg(newRad))

    if (valueProp === minVal) {
      setIsMin(true)
      setIsMax(false)
    } else if (valueProp === maxVal) {
      setIsMax(true)
      setIsMin(false)
    }

    handleValueChange(valueProp)  
  }, [valueProp])

  useEffect(() => {
    if (control.current === null) return

    control.current.updateMatrixWorld()
    plane.current.translate(new Vector3(0, 0.25, 0))
    plane.current.applyMatrix4(control.current.matrixWorld)
  }, [control])

  const dragBind = useGesture({
    onDragStart: ({ event }) => {
      event.stopPropagation()
      
      if (orbit.current?.enableRotate) orbit.current.enableRotate = false
    },
    onDrag: ({ event, direction: [x,y] }) => {
      event.stopPropagation()
      
      if (control.current === null
      || knob.current === null
      || (x === 0 && y === 0)) return

      // @ts-ignore Property does not exist
      event.ray.intersectPlane(plane.current, planeIntersect.current)
      
      const knobPos = knob.current.localToWorld(new Vector3())

      const invQuat = invertQuaternion(control.current.quaternion)
      planeIntersect.current.applyQuaternion(invQuat)
      knobPos.applyQuaternion(invQuat)

      const newDeg = radToDeg(Math.atan2(
        knobPos.z - planeIntersect.current.z, 
        knobPos.x - planeIntersect.current.x
      )) - 180 
      
      if (startDeg.current === null) startDeg.current = newDeg
      
      // offset new rotation by the distance to the old one so the knob stays in place on click
      const rotationDiff = endDeg.current! - startDeg.current
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
    onDragEnd: ({ event }) => {
      event.stopPropagation()

      if (orbit.current) orbit.current.enableZoom = true
      startDeg.current = null
      endDeg.current = radToDeg(-knob.current!.rotation.y)
    },
    ...handleInteraction(orbit.current),
  })

  const wheelBind = useGesture({
    onWheelStart: ({ event }) => {
      event.stopPropagation()

      if (orbit.current) orbit.current.enableZoom = false
    },
    onWheel: ({ event, direction: [_, y] }) => {  
      event.stopPropagation()

      if (knob.current === null) return

      const newDeg = radToDeg(knob.current.rotation.y) - y * 3
      knob.current.rotation.y = degToRad(clamp(newDeg, minDeg, maxDeg))

      const newVal = degToVal(knob.current.rotation.y)
      handleValueChange(newVal)
    },
    onWheelEnd: ({ event }) => {
      event.stopPropagation()
      
      endDeg.current = radToDeg(-knob.current!.rotation.y)
      if (orbit.current) orbit.current.enableZoom = true
    }
  })

  const handleValueChange = (newValue: number) => {
    setInternalVal(newValue)

    if (typeof onChange === 'function') {
      // suppress changes in value caused by trying to drag the knob out of bounds
      if (internalVal === maxVal
      || internalVal === minVal
      || newValue === prevInternalVal) return

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
    >
      <group
        ref={knob}
        {...dragBind() as any} 
        {...wheelBind() as any} 
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