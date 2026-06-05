import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Single luxury building
function LuxuryBuilding({ position, height, width, depth, index }) {
  const windowsRef = useRef()
  const roofLightRef = useRef()

  // Building materials
  const buildingMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#050508',
    metalness: 0.6,
    roughness: 0.7
  }), [])

  const glassMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0a0a15',
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.7
  }), [])

  const windowEmissive = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a2e',
    emissive: '#FFE4B5',
    emissiveIntensity: 0,
    transparent: true,
    opacity: 0.8
  }), [])

  const goldAccentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#D4AF37',
    emissive: '#D4AF37',
    emissiveIntensity: 1.5
  }), [])

  // Generate window pattern
  const windowPattern = useMemo(() => {
    const windows = []
    const rows = Math.floor(height / 2.5)
    const cols = Math.floor(width / 1.5)

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const isLit = Math.random() > 0.5
        windows.push({
          position: [
            (col - cols / 2 + 0.5) * 1.4,
            (row - rows / 2 + 0.5) * 2.4,
            depth / 2 + 0.02
          ],
          isLit,
          intensity: isLit ? 0.3 + Math.random() * 0.5 : 0
        })
      }
    }
    return windows
  }, [height, width, depth])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (windowsRef.current) {
      windowsRef.current.children.forEach((child, i) => {
        if (child.material && windowPattern[i]) {
          const flicker = Math.sin(t * 1.5 + index + i * 0.1) * 0.1
          child.material.emissiveIntensity = windowPattern[i].intensity + flicker
        }
      })
    }

    if (roofLightRef.current) {
      const pulse = (Math.sin(t * 2 + index) + 1) * 0.5
      roofLightRef.current.material.emissiveIntensity = 1 + pulse * 1
    }
  })

  const crownHeight = height * 0.1

  return (
    <group position={position}>
      {/* Main building body */}
      <mesh material={buildingMaterial}>
        <boxGeometry args={[width, height, depth]} />
      </mesh>

      {/* Glass facade */}
      <mesh position={[0, 0, depth / 2 + 0.01]} material={glassMaterial}>
        <planeGeometry args={[width * 0.95, height * 0.9]} />
      </mesh>

      {/* Back glass */}
      <mesh position={[0, 0, -depth / 2 - 0.01]} rotation={[0, Math.PI, 0]} material={glassMaterial}>
        <planeGeometry args={[width * 0.95, height * 0.9]} />
      </mesh>

      {/* Side glass */}
      <mesh position={[-width / 2 - 0.01, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={glassMaterial}>
        <planeGeometry args={[depth * 0.95, height * 0.9]} />
      </mesh>
      <mesh position={[width / 2 + 0.01, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={glassMaterial}>
        <planeGeometry args={[depth * 0.95, height * 0.9]} />
      </mesh>

      {/* Crown section */}
      <mesh position={[0, height / 2 + crownHeight / 2, 0]} material={buildingMaterial}>
        <boxGeometry args={[width * 0.6, crownHeight, depth * 0.6]} />
      </mesh>

      {/* Roof light */}
      <mesh ref={roofLightRef} position={[0, height / 2 + crownHeight, 0]}>
        <boxGeometry args={[width * 0.3, 0.3, depth * 0.3]} />
        <meshStandardMaterial
          color="#D4AF37"
          emissive="#D4AF37"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Windows */}
      <group ref={windowsRef}>
        {windowPattern.slice(0, 40).map((win, i) => (
          <mesh key={i} position={win.position}>
            <planeGeometry args={[0.8, 1.5]} />
            <meshStandardMaterial
              color="#1a1a2e"
              emissive="#FFE4B5"
              emissiveIntensity={win.intensity}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* Gold vertical accent lines */}
      {[-1, 1].map((dir) => (
        <mesh key={dir} position={[dir * width * 0.48, 0, depth / 2 + 0.02]}>
          <planeGeometry args={[0.1, height * 0.8]} />
          <meshStandardMaterial
            color="#D4AF37"
            emissive="#D4AF37"
            emissiveIntensity={0.3}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function LuxuryCitySkyline() {
  const groupRef = useRef()

  // Generate diverse luxury buildings
  const buildings = useMemo(() => {
    const buildingData = []
    const count = 35

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.PI / 6
      const radius = 45 + Math.random() * 35

      const height = 25 + Math.random() * 55
      const width = 3 + Math.random() * 5
      const depth = 3 + Math.random() * 5

      buildingData.push({
        position: [
          Math.cos(angle) * radius,
          -10 + height / 2,
          Math.sin(angle) * radius - 20
        ],
        height,
        width,
        depth,
        index: i
      })
    }

    return buildingData
  }, [])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.008
    }
  })

  return (
    <group ref={groupRef}>
      {buildings.map((building, index) => (
        <LuxuryBuilding
          key={index}
          position={building.position}
          height={building.height}
          width={building.width}
          depth={building.depth}
          index={building.index}
        />
      ))}
    </group>
  )
}