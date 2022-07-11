import { useGesture } from '@use-gesture/react'
import { FC, useEffect, useRef, useState } from 'react'
import { degToRad, radToDeg } from 'three/src/math/MathUtils'
import { KnobProps } from './types'
import { handleInteraction } from '../../../utils'
import { useOrbit } from '../../../../contexts/OrbitContext'
import { clip360, invertQuaternion, invlerp, lerp, smod, taper } from '../../../../helpers'
import { Plane, Vector3 } from 'three'

const RotaryKnob: FC<KnobProps> = ({
  id, 
  onChange,
  value: valueProp,
  defaults,
  ...props 
}) => {
  const { minVal = 0, maxVal = 1, base = 0, curve = 1 } = {...defaults} 
  const minDeg = -135, maxDeg = 135
  const plane = new Plane(new Vector3(0, 1, 0), 0)
  const [dragging, setDragging] = useState(false)
  const group = useRef<THREE.Group | null>(null)
  const knob = useRef<THREE.Group>(null)
  const internalVal = useRef(0)
  const startDeg = useRef<number | null>(null)
  const endDeg = useRef(minDeg)
  const orbit = useOrbit()

  useEffect(() => {
    const initRad = getRadiansFromValue(base)
    knob.current!.rotation.y = initRad
    endDeg.current = clip360(radToDeg(-initRad))
    handleValueChange(base)  
  }, [])

  useEffect(() => {
    if (dragging || valueProp === undefined) return

    const newRad = getRadiansFromValue(valueProp)
    knob.current!.rotation.y = newRad
    startDeg.current = null
    endDeg.current = clip360(radToDeg(-newRad))
  }, [valueProp])
  
  const bind = useGesture({
    onDragStart: () => {
      setDragging(true)
      if (orbit.current?.enableRotate) orbit.current.enableRotate = false
    },
    onDrag: ({ event }) => {
      event.stopPropagation()
      
      if (knob.current === null) return

      const planeIntersect = new Vector3()
      
      /* @ts-ignore Property does not exist */
      event.ray.intersectPlane(plane, planeIntersect)
        
      const invQuat = invertQuaternion(group.current!.quaternion)
      planeIntersect.applyQuaternion(invQuat)

      const knobPos = knob.current?.localToWorld(new Vector3())

      const newDeg = radToDeg(Math.atan2(
        knobPos.z - planeIntersect.z, 
        knobPos.x - planeIntersect.x
      )) - 180
      
      if (startDeg.current === null) startDeg.current = clip360(newDeg)
      
      const diff = endDeg.current - startDeg.current
      const correctedDeg = smod(-clip360(newDeg) - diff, 360)
      
      const newVal = getTaperedValue(smod(correctedDeg, 360)) 
      const taperedVal = taper(newVal, minVal, maxVal, curve)

      if (correctedDeg > maxDeg + 1 
      || correctedDeg < minDeg - 1 
      || taperedVal === internalVal.current) return

      knob.current!.rotation.y = degToRad(correctedDeg)

      handleValueChange(taperedVal)
    },
    onDragEnd: () => {
      setDragging(false)
      if (orbit.current) orbit.current.enableZoom = true
      startDeg.current = null
      endDeg.current = clip360(radToDeg(-knob.current!.rotation.y))
    },
    ...handleInteraction(orbit.current),
  })

  const handleValueChange = (taperedVal: number) => {
    internalVal.current = taperedVal
    if (typeof onChange === 'function') onChange({
      ...(id) && {id},
      value: internalVal.current
    })
  }

  const getTaperedValue = (rot: number) => {
    const fraction = invlerp(minDeg, maxDeg, rot)
    const value = lerp(minVal, maxVal, fraction)
    return taper(maxVal - value, minVal, maxVal, curve)
  }

  const getRadiansFromValue = (value: number) => {
    const fraction = invlerp(minVal, maxVal, value)
    const rotation = lerp(minDeg, maxDeg, fraction)
    return degToRad(-rotation)
  }
  
  return (
    <group ref={group}>
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