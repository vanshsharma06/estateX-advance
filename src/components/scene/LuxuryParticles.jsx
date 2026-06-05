import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function LuxuryParticles() {
  const pointsRef = useRef()
  const sparkleRef = useRef()
  const particleCount = 2000

  const { positions, colors, sizes, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = []

    const goldColor = new THREE.Color('#D4AF37')
    const whiteColor = new THREE.Color('#FFFFFF')
    const warmWhite = new THREE.Color('#FFF8E7')
    const platinum = new THREE.Color('#E5E4E2')

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      // Spread throughout scene
      positions[i3] = (Math.random() - 0.5) * 80
      positions[i3 + 1] = (Math.random() - 0.5) * 50 - 5
      positions[i3 + 2] = (Math.random() - 0.5) * 80 - 10

      // Color selection
      const colorChoice = Math.random()
      let color
      if (colorChoice < 0.4) {
        color = goldColor
      } else if (colorChoice < 0.6) {
        color = warmWhite
      } else if (colorChoice < 0.8) {
        color = whiteColor
      } else {
        color = platinum
      }

      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b

      // Varied sizes
      sizes[i] = Math.random() * 3 + 0.5

      // Velocities
      velocities.push({
        x: (Math.random() - 0.5) * 0.006,
        y: Math.random() * 0.004 + 0.001,
        z: (Math.random() - 0.5) * 0.006
      })
    }

    return { positions, colors, sizes, velocities }
  }, [particleCount])

  // Sparkle particles
  const sparkleData = useMemo(() => {
    const positions = new Float32Array(150 * 3)
    const sizes = new Float32Array(150)

    for (let i = 0; i < 150; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 50
      positions[i3 + 1] = (Math.random() - 0.5) * 35
      positions[i3 + 2] = (Math.random() - 0.5) * 50 - 5
      sizes[i] = Math.random() * 5 + 2
    }

    return { positions, sizes }
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return

    const t = clock.getElapsedTime()
    const positionArray = pointsRef.current.geometry.attributes.position.array

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const vel = velocities[i]

      // Update with velocity + wave
      positionArray[i3] += vel.x + Math.sin(t + i * 0.02) * 0.002
      positionArray[i3 + 1] += vel.y + Math.cos(t * 0.7 + i * 0.02) * 0.002
      positionArray[i3 + 2] += vel.z

      // Wrap around
      if (positionArray[i3] > 40) positionArray[i3] = -40
      if (positionArray[i3] < -40) positionArray[i3] = 40
      if (positionArray[i3 + 1] > 30) positionArray[i3 + 1] = -25
      if (positionArray[i3 + 1] < -25) positionArray[i3 + 1] = 30
      if (positionArray[i3 + 2] > 20) positionArray[i3 + 2] = -50
      if (positionArray[i3 + 2] < -50) positionArray[i3 + 2] = 20
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Animate sparkles
    if (sparkleRef.current) {
      const sparkleArray = sparkleRef.current.geometry.attributes.position.array
      const sizeArray = sparkleRef.current.geometry.attributes.size.array

      for (let i = 0; i < 150; i++) {
        const i3 = i * 3

        // Pulsing size
        const pulse = Math.sin(t * 4 + i * 0.3) * 0.5 + 0.5
        sizeArray[i] = sparkleData.sizes[i] * (0.3 + pulse * 0.7)

        // Gentle movement
        sparkleArray[i3] += Math.sin(t * 0.4 + i) * 0.008
        sparkleArray[i3 + 1] += Math.cos(t * 0.3 + i) * 0.008
      }

      sparkleRef.current.geometry.attributes.position.needsUpdate = true
      sparkleRef.current.geometry.attributes.size.needsUpdate = true
    }
  })

  return (
    <>
      {/* Ambient particles */}
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
          size={0.1}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Sparkle particles */}
      <points ref={sparkleRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={150}
            array={sparkleData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={150}
            array={sparkleData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          color="#FFD700"
          transparent
          opacity={0.65}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  )
}