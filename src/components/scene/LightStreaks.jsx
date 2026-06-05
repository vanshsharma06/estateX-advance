import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function LightStreak({ startPos, endPos, color, speed, delay }) {
  const meshRef = useRef()

  const geometry = useMemo(() => {
    const points = [
      new THREE.Vector3(startPos[0], startPos[1], startPos[2]),
      new THREE.Vector3(endPos[0], endPos[1], endPos[2])
    ]
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    return geometry
  }, [startPos, endPos])

  const material = useMemo(() => new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0,
    linewidth: 2
  }), [color])

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const t = clock.getElapsedTime()
    const cycleTime = (t + delay) % speed
    const progress = cycleTime / speed

    // Fade in and out during traversal
    const opacity = Math.sin(progress * Math.PI) * 0.8

    // Calculate current position along the streak
    const currentPos = new THREE.Vector3(
      startPos[0] + (endPos[0] - startPos[0]) * progress,
      startPos[1] + (endPos[1] - startPos[1]) * progress,
      startPos[2] + (endPos[2] - startPos[2]) * progress
    )

    meshRef.current.position.copy(currentPos)
    meshRef.current.material.opacity = opacity
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.15, 8, 8]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
      />
      {/* Trail effect using additional spheres */}
      {[0.5, 1, 1.5].map((offset, i) => (
        <mesh key={i} scale={1 - offset * 0.2}>
          <sphereGeometry args={[0.1 * (1 - offset * 0.2), 6, 6]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </mesh>
  )
}

export default function LightStreaks() {
  const groupRef = useRef()

  const streaks = useMemo(() => [
    // Gold streaks sweeping across
    {
      startPos: [-30, 15, -20],
      endPos: [30, 5, 10],
      color: '#D4AF37',
      speed: 8,
      delay: 0
    },
    {
      startPos: [30, 20, -25],
      endPos: [-30, 0, 5],
      color: '#E5C76B',
      speed: 10,
      delay: 2
    },
    {
      startPos: [-25, 25, -15],
      endPos: [25, 10, 15],
      color: '#FFD700',
      speed: 12,
      delay: 4
    },
    // White streaks
    {
      startPos: [0, 30, -30],
      endPos: [0, -5, 20],
      color: '#FFFFFF',
      speed: 15,
      delay: 1
    },
    {
      startPos: [-20, 18, 0],
      endPos: [20, 8, 0],
      color: '#FFF8E7',
      speed: 9,
      delay: 3
    },
    // Secondary gold
    {
      startPos: [25, 12, -10],
      endPos: [-25, 22, 10],
      color: '#B8962E',
      speed: 11,
      delay: 5
    },
    {
      startPos: [-30, 8, 5],
      endPos: [30, 18, -5],
      color: '#E5C76B',
      speed: 7,
      delay: 6
    }
  ], [])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.05) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {streaks.map((streak, index) => (
        <LightStreak key={index} {...streak} />
      ))}
    </group>
  )
}