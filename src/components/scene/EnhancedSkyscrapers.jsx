import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Single detailed skyscraper component
function DetailedSkyscraper({ position, height, width, depth, index }) {
  const groupRef = useRef()
  const windowsRef = useRef([])
  const ledRefs = useRef([])

  // Generate window grid pattern
  const windowData = useMemo(() => {
    const windows = []
    const rows = Math.floor(height / 2)
    const cols = Math.floor(width / 1.2)

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Random window lighting
        const isLit = Math.random() > 0.4
        const brightness = isLit ? 0.2 + Math.random() * 0.6 : 0
        windows.push({
          position: [
            (col - cols / 2 + 0.5) * 1.1,
            (row - rows / 2 + 0.5) * 2.1,
            depth / 2 + 0.02
          ],
          brightness,
          flickerSpeed: Math.random() * 2 + 1
        })
      }
    }
    return windows
  }, [height, width, depth])

  // LED strip positions on building edges
  const ledStrips = useMemo(() => {
    return [
      { position: [width / 2 + 0.05, 0, 0], rotation: [0, Math.PI / 2, 0], side: 'right' },
      { position: [-width / 2 - 0.05, 0, 0], rotation: [0, -Math.PI / 2, 0], side: 'left' }
    ]
  }, [width])

  // Building materials
  const buildingMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#080808',
    metalness: 0.6,
    roughness: 0.7
  }), [])

  const glassMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0a0a15',
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.85
  }), [])

  const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#D4AF37',
    emissive: '#D4AF37',
    emissiveIntensity: 2,
    metalness: 0.95,
    roughness: 0.05
  }), [])

  // Animate windows and LEDs
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    windowsRef.current.forEach((window, i) => {
      if (window && windowData[i]) {
        const flicker = Math.sin(t * windowData[i].flickerSpeed + index) * 0.1
        window.material.emissiveIntensity = windowData[i].brightness + flicker
      }
    })

    ledRefs.current.forEach((led, i) => {
      if (led) {
        const pulse = (Math.sin(t * 3 + i * 0.5) + 1) * 0.5
        led.material.emissiveIntensity = 1 + pulse * 1.5
      }
    })
  })

  const crownHeight = height * 0.08
  const baseHeight = height * 0.15

  return (
    <group ref={groupRef} position={position}>
      {/* Base section - wider foundation */}
      <mesh position={[0, baseHeight / 2, 0]} material={buildingMaterial}>
        <boxGeometry args={[width * 1.2, baseHeight, depth * 1.2]} />
      </mesh>

      {/* Main building body */}
      <mesh position={[0, baseHeight + (height - baseHeight - crownHeight) / 2, 0]} material={buildingMaterial}>
        <boxGeometry args={[width, height - baseHeight - crownHeight, depth]} />
      </mesh>

      {/* Glass facade front */}
      <mesh position={[0, baseHeight + (height - baseHeight - crownHeight) / 2, depth / 2 + 0.01]} material={glassMaterial}>
        <planeGeometry args={[width * 0.9, height * 0.85]} />
      </mesh>

      {/* Glass facade back */}
      <mesh position={[0, baseHeight + (height - baseHeight - crownHeight) / 2, -depth / 2 - 0.01]} rotation={[0, Math.PI, 0]} material={glassMaterial}>
        <planeGeometry args={[width * 0.9, height * 0.85]} />
      </mesh>

      {/* Glass facade left */}
      <mesh position={[-width / 2 - 0.01, baseHeight + (height - baseHeight - crownHeight) / 2, 0]} rotation={[0, -Math.PI / 2, 0]} material={glassMaterial}>
        <planeGeometry args={[depth * 0.9, height * 0.85]} />
      </mesh>

      {/* Glass facade right */}
      <mesh position={[width / 2 + 0.01, baseHeight + (height - baseHeight - crownHeight) / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={glassMaterial}>
        <planeGeometry args={[depth * 0.9, height * 0.85]} />
      </mesh>

      {/* Crown/attic section */}
      <mesh position={[0, height - crownHeight / 2, 0]} material={buildingMaterial}>
        <boxGeometry args={[width * 0.7, crownHeight, depth * 0.7]} />
      </mesh>

      {/* Crown glass */}
      <mesh position={[0, height - crownHeight / 2, depth * 0.36]} material={glassMaterial}>
        <planeGeometry args={[width * 0.6, crownHeight * 0.8]} />
      </mesh>

      {/* Antenna/Spire */}
      {height > 40 && (
        <mesh position={[0, height + crownHeight * 0.5, 0]} material={accentMaterial}>
          <cylinderGeometry args={[0.1, 0.15, crownHeight, 8]} />
        </mesh>
      )}

      {/* LED accent strips */}
      {ledStrips.map((led, i) => (
        <mesh
          key={i}
          ref={el => ledRefs.current[i] = el}
          position={led.position}
          rotation={led.rotation}
          material={accentMaterial.clone()}
        >
          <planeGeometry args={[height * 0.7, 0.08]} />
        </mesh>
      ))}

      {/* Windows (simplified - could be instanced for performance) */}
      {windowData.slice(0, 50).map((win, i) => (
        <mesh
          key={i}
          ref={el => windowsRef.current[i] = el}
          position={win.position}
        >
          <planeGeometry args={[0.6, 1.2]} />
          <meshStandardMaterial
            color="#0a0a15"
            emissive="#FFE4B5"
            emissiveIntensity={win.brightness}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function EnhancedSkyscrapers() {
  const groupRef = useRef()

  // Generate diverse skyscraper configurations
  const buildings = useMemo(() => {
    const buildingData = []
    const count = 18

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.PI / 4 // Offset for better composition
      const radius = 25 + Math.random() * 20

      const height = 30 + Math.random() * 50
      const width = 3 + Math.random() * 4
      const depth = 3 + Math.random() * 4

      buildingData.push({
        position: [
          Math.cos(angle) * radius,
          -10, // Base at ground level
          Math.sin(angle) * radius - 15 // Offset forward
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
      // Very slow rotation for dynamic feel
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {buildings.map((building, index) => (
        <DetailedSkyscraper
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