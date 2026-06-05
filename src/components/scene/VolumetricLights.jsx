import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { SpotLight, Cylinder } from '@react-three/drei'
import * as THREE from 'three'

// Volumetric light beam effect
function LightBeam({ position, color, intensity, angle, height = 30 }) {
  const beamRef = useRef()

  useFrame(({ clock }) => {
    if (beamRef.current) {
      const t = clock.getElapsedTime()
      // Subtle pulsing
      beamRef.current.material.opacity = 0.08 + Math.sin(t * 2) * 0.02
    }
  })

  return (
    <group position={position}>
      {/* Light beam cone */}
      <mesh ref={beamRef} rotation={[Math.PI, 0, 0]} position={[0, -height / 2 + 15, 0]}>
        <coneGeometry args={[Math.tan(angle) * height, height, 32, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

export default function VolumetricLights() {
  const keyLightRef = useRef()
  const rimLight1Ref = useRef()
  const rimLight2Ref = useRef()
  const spotLight1Ref = useRef()
  const spotLight2Ref = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Animate key light
    if (keyLightRef.current) {
      keyLightRef.current.position.x = Math.sin(t * 0.1) * 5
      keyLightRef.current.position.y = 12 + Math.cos(t * 0.15) * 2
    }

    // Animate rim lights
    if (rimLight1Ref.current) {
      rimLight1Ref.current.intensity = 2 + Math.sin(t * 0.4 + 1) * 0.8
    }
    if (rimLight2Ref.current) {
      rimLight2Ref.current.intensity = 1.5 + Math.sin(t * 0.35) * 0.5
    }

    // Sweeping spotlights
    if (spotLight1Ref.current) {
      spotLight1Ref.current.position.x = Math.sin(t * 0.15) * 12
      spotLight1Ref.current.target.position.x = Math.sin(t * 0.15) * 12
    }
    if (spotLight2Ref.current) {
      spotLight2Ref.current.position.x = Math.cos(t * 0.12) * 12
      spotLight2Ref.current.target.position.x = Math.cos(t * 0.12) * 12
    }
  })

  return (
    <>
      {/* Ambient base */}
      <ambientLight intensity={0.15} color="#1a1a2e" />

      {/* Main key light - warm white */}
      <directionalLight
        ref={keyLightRef}
        color="#FFF8E7"
        intensity={2}
        position={[5, 12, 8]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
      />

      {/* Fill light - cool blue */}
      <directionalLight
        color="#4466aa"
        intensity={0.4}
        position={[-10, 8, -8]}
      />

      {/* Gold rim light - left */}
      <pointLight
        ref={rimLight1Ref}
        color="#D4AF37"
        intensity={2}
        position={[-15, 8, 0]}
        distance={50}
        decay={2}
      />

      {/* Gold rim light - right */}
      <pointLight
        ref={rimLight2Ref}
        color="#E5C76B"
        intensity={1.5}
        position={[15, 8, 0]}
        distance={50}
        decay={2}
      />

      {/* Spotlight 1 - sweeping */}
      <spotLight
        ref={spotLight1Ref}
        color="#FFFFFF"
        intensity={150}
        position={[-8, 25, 10]}
        angle={0.35}
        penumbra={0.9}
        distance={50}
        anglePower={5}
        castShadow
      />
      <LightBeam position={[-8, 25, 10]} color="#FFFFFF" intensity={150} angle={0.35} />

      {/* Spotlight 2 - gold accent */}
      <spotLight
        ref={spotLight2Ref}
        color="#D4AF37"
        intensity={100}
        position={[8, 25, 10]}
        angle={0.3}
        penumbra={0.95}
        distance={50}
        anglePower={5}
      />
      <LightBeam position={[8, 25, 10]} color="#D4AF37" intensity={100} angle={0.3} />

      {/* Center spotlight on founders */}
      <spotLight
        color="#FFFFFF"
        intensity={80}
        position={[0, 20, 8]}
        angle={0.4}
        penumbra={0.8}
        distance={30}
        anglePower={4}
        castShadow
      />
      <LightBeam position={[0, 20, 8]} color="#FFFFFF" intensity={80} angle={0.4} />

      {/* Accent blue from below */}
      <pointLight
        color="#1a237e"
        intensity={0.6}
        position={[0, -5, 15]}
        distance={40}
      />

      {/* Ground reflection light */}
      <pointLight
        color="#D4AF37"
        intensity={0.5}
        position={[0, -9, 0]}
        distance={30}
      />
    </>
  )
}