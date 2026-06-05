import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

export default function MassiveUP16Text() {
  const groupRef = useRef()
  const glowRef = useRef()

  // Premium gold metallic material
  const goldMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#D4AF37',
    metalness: 0.95,
    roughness: 0.08,
    envMapIntensity: 3,
    emissive: '#D4AF37',
    emissiveIntensity: 0.3
  }), [])

  // Glowing accent material
  const glowMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#FFD700',
    emissive: '#FFD700',
    emissiveIntensity: 2,
    transparent: true,
    opacity: 0.6,
    metalness: 0.9,
    roughness: 0.1
  }), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (groupRef.current) {
      // Gentle rotation for depth
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.25
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.02

      // Subtle floating
      groupRef.current.position.y = Math.sin(t * 0.4) * 0.2 - 2
    }

    if (glowRef.current) {
      // Pulsing glow effect
      const pulse = (Math.sin(t * 2) + 1) * 0.5
      glowRef.current.material.emissiveIntensity = 1.5 + pulse * 1.5
    }
  })

  const textString = "UP16"
  const propertiesText = "PROPERTIES"

  return (
    <group ref={groupRef} position={[0, -2, -35]} rotation={[0, 0, 0]}>
      {/* Main UP16 text */}
      {textString.split('').map((char, index) => (
        <Text
          key={index}
          position={[(index - 1.5) * 7, 3, 0]}
          fontSize={8}
          material={goldMaterial}
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6BoWgz.woff2"
          bevelEnabled
          bevelThickness={0.2}
          bevelSize={0.15}
          bevelOffset={0}
          bevelSegments={6}
        >
          {char}
        </Text>
      ))}

      {/* PROPERTIES text below */}
      <Text
        position={[0, -4, 0]}
        fontSize={3}
        material={goldMaterial}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYrEtFmS.woff2"
        letterSpacing={0.8}
        bevelEnabled
        bevelThickness={0.1}
        bevelSize={0.08}
        bevelOffset={0}
        bevelSegments={4}
      >
        {propertiesText}
      </Text>

      {/* Glow backing plane */}
      <RoundedBox
        ref={glowRef}
        args={[55, 20, 0.5]}
        radius={0.5}
        position={[0, 0, -1]}
      >
        <meshStandardMaterial
          color="#FFD700"
          emissive="#D4AF37"
          emissiveIntensity={2}
          transparent
          opacity={0.15}
        />
      </RoundedBox>

      {/* Accent lines */}
      {[-1, 1].map((dir) => (
        <mesh key={dir} position={[dir * 28, 0, 0.5]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 18, 8]} />
          <meshStandardMaterial
            color="#D4AF37"
            emissive="#D4AF37"
            emissiveIntensity={2}
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}