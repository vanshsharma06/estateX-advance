import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshReflectorMaterial, Plane } from '@react-three/drei'
import * as THREE from 'three'

export default function LuxuryFloor() {
  const floorRef = useRef()

  // Subtle animation for the floor
  useFrame(({ clock }) => {
    if (floorRef.current) {
      // Subtle reflection intensity change
      floorRef.current.mirror = 0.75 + Math.sin(clock.getElapsedTime() * 0.3) * 0.03
    }
  })

  return (
    <group>
      {/* Main reflective floor */}
      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -10, -20]}
      >
        <planeGeometry args={[200, 200]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={1.8}
          roughness={0.15}
          depthScale={1.5}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.8}
          color="#050508"
          metalness={0.9}
          mirror={0.75}
        />
      </mesh>

      {/* Gold accent lines on floor */}
      <group position={[0, -9.98, -20]}>
        {/* Horizontal gold lines */}
        {[-40, -20, 0, 20, 40].map((x, i) => (
          <mesh key={`h-${i}`} position={[x, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.05, 150]} />
            <meshStandardMaterial
              color="#D4AF37"
              emissive="#D4AF37"
              emissiveIntensity={0.4}
              transparent
              opacity={0.3}
            />
          </mesh>
        ))}

        {/* Vertical gold lines */}
        {[-60, -40, -20, 0, 20, 40, 60].map((z, i) => (
          <mesh key={`v-${i}`} position={[0, 0, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[120, 0.05]} />
            <meshStandardMaterial
              color="#D4AF37"
              emissive="#D4AF37"
              emissiveIntensity={0.4}
              transparent
              opacity={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Subtle gradient glow near monument */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -9.95, -15]}>
        <circleGeometry args={[15, 64]} />
        <meshStandardMaterial
          color="#D4AF37"
          emissive="#D4AF37"
          emissiveIntensity={0.2}
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  )
}