import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Building({ position, height, width, depth }) {
  const meshRef = useRef()
  const windowsRef = useRef()

  // Create window pattern
  const windowMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#1a1a1a',
      emissive: '#FFE4B5',
      emissiveIntensity: 0.3,
      metalness: 0.2,
      roughness: 0.8
    })
  }, [])

  const buildingMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#0a0a0a',
      metalness: 0.5,
      roughness: 0.7
    })
  }, [])

  // Animate windows subtly
  useFrame(({ clock }) => {
    if (windowsRef.current) {
      const t = clock.getElapsedTime()
      windowsRef.current.material.emissiveIntensity = 0.2 + Math.sin(t * 2 + position[0]) * 0.1
    }
  })

  return (
    <group position={position}>
      {/* Building body */}
      <mesh ref={meshRef} material={buildingMaterial}>
        <boxGeometry args={[width, height, depth]} />
      </mesh>

      {/* Windows on front */}
      <mesh position={[0, 0, depth / 2 + 0.01]} ref={windowsRef} material={windowMaterial}>
        <planeGeometry args={[width * 0.8, height * 0.8]} />
      </mesh>

      {/* Windows on back */}
      <mesh position={[0, 0, -depth / 2 - 0.01]} rotation={[0, Math.PI, 0]} material={windowMaterial}>
        <planeGeometry args={[width * 0.8, height * 0.8]} />
      </mesh>
    </group>
  )
}

export default function CityEnvironment() {
  const groupRef = useRef()

  // Generate buildings with varied positions
  const buildings = useMemo(() => {
    const buildingData = []
    const count = 25

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 20 + Math.random() * 30

      buildingData.push({
        position: [
          Math.cos(angle) * radius,
          -5 + Math.random() * 2,
          Math.sin(angle) * radius - 20
        ],
        height: 5 + Math.random() * 15,
        width: 2 + Math.random() * 3,
        depth: 2 + Math.random() * 3
      })
    }

    return buildingData
  }, [])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, -20]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#050505" metalness={0.8} roughness={0.9} />
      </mesh>

      {/* Buildings */}
      {buildings.map((building, index) => (
        <Building
          key={index}
          position={building.position}
          height={building.height}
          width={building.width}
          depth={building.depth}
        />
      ))}
    </group>
  )
}