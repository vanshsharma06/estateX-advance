import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleField() {
  const pointsRef = useRef()
  const particleCount = 800

  // Generate particle positions and attributes
  const { positions, colors, sizes, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = []

    const goldColor = new THREE.Color('#D4AF37')
    const whiteColor = new THREE.Color('#FFFFFF')
    const platinumColor = new THREE.Color('#E5E4E2')

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      // Position - spread throughout the scene
      positions[i3] = (Math.random() - 0.5) * 50
      positions[i3 + 1] = (Math.random() - 0.5) * 30
      positions[i3 + 2] = (Math.random() - 0.5) * 50 - 10

      // Color - mix of gold, white, and platinum
      const colorChoice = Math.random()
      let color
      if (colorChoice < 0.4) {
        color = goldColor
      } else if (colorChoice < 0.7) {
        color = whiteColor
      } else {
        color = platinumColor
      }

      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b

      // Size - varied but small
      sizes[i] = Math.random() * 3 + 1

      // Velocity - slow random movement
      velocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      })
    }

    return { positions, colors, sizes, velocities }
  }, [particleCount])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return

    const positionArray = pointsRef.current.geometry.attributes.position.array

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const vel = velocities[i]

      // Update positions with velocity + subtle wave
      positionArray[i3] += vel.x + Math.sin(clock.getElapsedTime() + i) * 0.002
      positionArray[i3 + 1] += vel.y + Math.cos(clock.getElapsedTime() + i) * 0.002
      positionArray[i3 + 2] += vel.z

      // Wrap around boundaries
      if (positionArray[i3] > 25) positionArray[i3] = -25
      if (positionArray[i3] < -25) positionArray[i3] = 25
      if (positionArray[i3 + 1] > 15) positionArray[i3 + 1] = -15
      if (positionArray[i3 + 1] < -15) positionArray[i3 + 1] = 15
      if (positionArray[i3 + 2] > 15) positionArray[i3 + 2] = -35
      if (positionArray[i3 + 2] < -35) positionArray[i3 + 2] = 15
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}