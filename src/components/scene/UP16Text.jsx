import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

export default function UP16Text() {
  const groupRef = useRef()
  const textRefs = useRef([])

  // Custom gold material with high reflectivity
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#D4AF37',
      metalness: 0.95,
      roughness: 0.05,
      envMapIntensity: 2
    })
  }, [])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime()

      // Gentle continuous rotation
      groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.3

      // Subtle floating animation
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.1
    }
  })

  const letters = ['U', 'P', '1', '6']

  return (
    <group ref={groupRef} position={[0, 0, -15]} scale={2}>
      {letters.map((letter, index) => (
        <Text
          key={index}
          ref={el => textRefs.current[index] = el}
          position={[(index - 1.5) * 1.8, 0, 0]}
          fontSize={2}
          material={material}
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKd3vXDXbtXK-F2qO0g.woff"
        >
          {letter}
        </Text>
      ))}
    </group>
  )
}