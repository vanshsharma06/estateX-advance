import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

export default function LuxuryMonument() {
  const groupRef = useRef()
  const glowPlaneRef = useRef()

  // Premium metallic gold material
  const goldMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#D4AF37',
    metalness: 0.95,
    roughness: 0.08,
    envMapIntensity: 4,
    emissive: '#D4AF37',
    emissiveIntensity: 0.4
  }), [])

  // Dark gold accent
  const darkGoldMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#B8962E',
    metalness: 0.9,
    roughness: 0.15,
    emissive: '#B8962E',
    emissiveIntensity: 0.2
  }), [])

  // Glowing backdrop material
  const glowMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#FFD700',
    emissive: '#D4AF37',
    emissiveIntensity: 1.5,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide
  }), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (groupRef.current) {
      // Gentle floating and rotation
      groupRef.current.position.y = -2 + Math.sin(t * 0.3) * 0.15
      groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.15
    }

    if (glowPlaneRef.current) {
      // Pulsing glow
      const pulse = (Math.sin(t * 1.5) + 1) * 0.5
      glowPlaneRef.current.material.emissiveIntensity = 1.2 + pulse * 0.8
      glowPlaneRef.current.material.opacity = 0.1 + pulse * 0.08
    }
  })

  const mainText = 'UP16'
  const subText = 'PROPERTIES'

  return (
    <group ref={groupRef} position={[0, -2, -25]}>
      {/* Main UP16 text */}
      <group position={[0, 4, 0]}>
        {mainText.split('').map((char, index) => (
          <Text
            key={index}
            position={[(index - 1.5) * 5.5, 0, 0]}
            fontSize={8}
            material={goldMaterial}
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6BoWgz.woff2"
            bevelEnabled
            bevelThickness={0.3}
            bevelSize={0.2}
            bevelOffset={0}
            bevelSegments={8}
          >
            {char}
          </Text>
        ))}
      </group>

      {/* PROPERTIES text below */}
      <Text
        position={[0, -3, 0]}
        fontSize={2.5}
        material={goldMaterial}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYrEtFmS.woff2"
        letterSpacing={1}
        bevelEnabled
        bevelThickness={0.15}
        bevelSize={0.1}
        bevelOffset={0}
        bevelSegments={4}
      >
        {subText}
      </Text>

      {/* Decorative architectural frame */}
      <group position={[0, 0, -1]}>
        {/* Top bar */}
        <RoundedBox args={[60, 1.5, 0.5]} radius={0.1} position={[0, 10, 0]}>
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.8}
            roughness={0.3}
          />
        </RoundedBox>

        {/* Bottom bar */}
        <RoundedBox args={[60, 1.5, 0.5]} radius={0.1} position={[0, -6, 0]}>
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.8}
            roughness={0.3}
          />
        </RoundedBox>

        {/* Vertical pillars */}
        {[-28, 28].map((x, i) => (
          <RoundedBox key={i} args={[2, 18, 1]} radius={0.2} position={[x, 2, 0]}>
            <meshStandardMaterial
              color="#0a0a0a"
              metalness={0.7}
              roughness={0.4}
            />
          </RoundedBox>
        ))}

        {/* Gold accent lines on pillars */}
        {[-28, 28].map((x, i) => (
          <group key={`gold-${i}`} position={[x, 2, 0.51]}>
            {[0, 3, 6, 9].map((yOffset, j) => (
              <mesh key={j} position={[0, yOffset - 4.5, 0]}>
                <boxGeometry args={[0.15, 2, 0.05]} />
                <meshStandardMaterial
                  color="#D4AF37"
                  emissive="#D4AF37"
                  emissiveIntensity={2}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Glowing backdrop panel */}
      <RoundedBox
        ref={glowPlaneRef}
        args={[65, 25, 0.5]}
        radius={0.5}
        position={[0, 1, -3]}
      >
        <meshStandardMaterial
          color="#D4AF37"
          emissive="#D4AF37"
          emissiveIntensity={1.5}
          transparent
          opacity={0.12}
        />
      </RoundedBox>

      {/* Floor glow reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, -2]}>
        <planeGeometry args={[70, 30]} />
        <meshStandardMaterial
          color="#D4AF37"
          emissive="#D4AF37"
          emissiveIntensity={0.3}
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  )
}