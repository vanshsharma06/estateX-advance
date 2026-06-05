import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Cylinder } from '@react-three/drei'
import * as THREE from 'three'

// Single founder figure - stylized premium look
function Founder({ position, side }) {
  const groupRef = useRef()
  const suitMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0a0a0a',
    metalness: 0.3,
    roughness: 0.8
  }), [])

  const skinMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#d4a574',
    metalness: 0.1,
    roughness: 0.9
  }), [])

  const shirtMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffffff',
    metalness: 0.1,
    roughness: 0.9
  }), [])

  const tieMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8B0000',
    metalness: 0.2,
    roughness: 0.8
  }), [])

  const hairMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.1,
    roughness: 0.9
  }), [])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Subtle breathing animation
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.5) * 0.02
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Body/Torso - suit jacket */}
      <mesh position={[0, 1.4, 0]} material={suitMaterial}>
        <boxGeometry args={[0.7, 1.2, 0.4]} />
      </mesh>

      {/* Shoulders */}
      <mesh position={[0, 1.95, 0]} material={suitMaterial}>
        <boxGeometry args={[0.9, 0.15, 0.45]} />
      </mesh>

      {/* Shirt collar */}
      <mesh position={[0, 2.05, 0.15]} material={shirtMaterial}>
        <boxGeometry args={[0.25, 0.15, 0.1]} />
      </mesh>

      {/* Tie */}
      <mesh position={[0, 1.85, 0.22]} material={tieMaterial}>
        <boxGeometry args={[0.08, 0.5, 0.05]} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 2.2, 0]} material={skinMaterial}>
        <cylinderGeometry args={[0.1, 0.12, 0.2, 16]} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 2.55, 0]} material={skinMaterial}>
        <sphereGeometry args={[0.22, 32, 32]} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 2.7, -0.05]} material={hairMaterial}>
        <sphereGeometry args={[0.23, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* Left arm */}
      <mesh position={[-0.45, 1.5, 0]} rotation={[0, 0, 0.15]} material={suitMaterial}>
        <boxGeometry args={[0.18, 0.9, 0.25]} />
      </mesh>

      {/* Right arm */}
      <mesh position={[0.45, 1.5, 0]} rotation={[0, 0, -0.15]} material={suitMaterial}>
        <boxGeometry args={[0.18, 0.9, 0.25]} />
      </mesh>

      {/* Hands */}
      <mesh position={[-0.5, 1.0, 0]} material={skinMaterial}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </mesh>
      <mesh position={[0.5, 1.0, 0]} material={skinMaterial}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.15, 0.4, 0]} material={suitMaterial}>
        <boxGeometry args={[0.22, 0.8, 0.3]} />
      </mesh>
      <mesh position={[0.15, 0.4, 0]} material={suitMaterial}>
        <boxGeometry args={[0.22, 0.8, 0.3]} />
      </mesh>

      {/* Shoes */}
      <mesh position={[-0.15, 0.05, 0.05]} material={suitMaterial}>
        <boxGeometry args={[0.22, 0.1, 0.35]} />
      </mesh>
      <mesh position={[0.15, 0.05, 0.05]} material={suitMaterial}>
        <boxGeometry args={[0.22, 0.1, 0.35]} />
      </mesh>
    </group>
  )
}

export default function Founders() {
  const groupRef = useRef()

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Very subtle sway
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.02
    }
  })

  return (
    <group ref={groupRef} position={[0, -3.5, -5]}>
      {/* Founder 1 - left side */}
      <Founder position={[-1.2, 3.5, 0]} side="left" />

      {/* Founder 2 - right side */}
      <Founder position={[1.2, 3.5, 0]} side="right" />

      {/* Spotlight on founders for dramatic effect */}
      <spotLight
        position={[0, 10, 5]}
        intensity={2}
        color="#FFFFFF"
        angle={0.4}
        penumbra={0.8}
        distance={20}
        castShadow
      />
    </group>
  )
}