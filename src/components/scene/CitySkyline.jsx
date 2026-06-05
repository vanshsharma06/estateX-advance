import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function SkylineBuilding({ position, height, width, depth }) {
  const windowsRef = useRef()

  const windowMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#050505',
    emissive: '#FFE4B5',
    emissiveIntensity: 0,
    transparent: true,
    opacity: 0.3
  }), [])

  // Generate random lit windows
  const windowPositions = useMemo(() => {
    const positions = []
    const rows = Math.floor(height / 3)
    const cols = Math.floor(width / 2)

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (Math.random() > 0.6) { // 40% of windows are lit
          positions.push({
            pos: [(col - cols / 2 + 0.5) * 1.8, (row - rows / 2 + 0.5) * 2.8, depth / 2 + 0.01],
            intensity: Math.random() * 0.4 + 0.1
          })
        }
      }
    }
    return positions
  }, [height, width, depth])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (windowsRef.current) {
      // Subtle flicker effect
      windowsRef.current.children.forEach((child, i) => {
        if (child.material && windowPositions[i]) {
          const flicker = Math.sin(t * 2 + i * 0.3) * 0.1
          child.material.emissiveIntensity = windowPositions[i].intensity + flicker
        }
      })
    }
  })

  return (
    <group position={position}>
      {/* Building silhouette */}
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#020202" />
      </mesh>

      {/* Lit windows group */}
      <group ref={windowsRef}>
        {windowPositions.map((win, i) => (
          <mesh key={i} position={win.pos} material={windowMaterial.clone()}>
            <planeGeometry args={[0.8, 1.5]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default function CitySkyline() {
  const groupRef = useRef()

  const buildings = useMemo(() => {
    const buildingData = []
    const count = 60

    for (let i = 0; i < count; i++) {
      // Position in a wider arc in the background
      const angle = (i / count) * Math.PI * 2
      const radius = 80 + Math.random() * 40
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius - 30

      const height = 20 + Math.random() * 60
      const width = 2 + Math.random() * 5
      const depth = 2 + Math.random() * 5

      buildingData.push({
        position: [x, -10 + height / 2, z],
        height,
        width,
        depth
      })
    }

    return buildingData
  }, [])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Very subtle rotation - almost static
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.003
    }
  })

  return (
    <group ref={groupRef}>
      {buildings.map((building, index) => (
        <SkylineBuilding
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