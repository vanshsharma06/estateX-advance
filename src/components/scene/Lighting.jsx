import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function SceneLighting() {
  const keyLightRef = useRef()
  const rimLightRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (keyLightRef.current) {
      keyLightRef.current.position.x = Math.sin(t * 0.2) * 2
      keyLightRef.current.position.y = 5 + Math.cos(t * 0.3) * 0.5
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity = 1.5 + Math.sin(t * 0.5) * 0.3
    }
  })

  return (
    <>
      {/* Ambient Light */}
      <ambientLight color="#1a1a1a" intensity={0.3} />

      {/* Key Light - Warm */}
      <directionalLight
        ref={keyLightRef}
        color="#FFF8E7"
        intensity={2}
        position={[5, 5, 5]}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Fill Light - Cool blue rim */}
      <directionalLight
        color="#E8F4FF"
        intensity={0.5}
        position={[-5, 3, -5]}
      />

      {/* Rim Light - Golden accent */}
      <pointLight
        ref={rimLightRef}
        color="#D4AF37"
        intensity={1.5}
        position={[0, 0, -5]}
        distance={20}
      />

      {/* Spot Light for drama */}
      <spotLight
        color="#FFFFFF"
        intensity={0.8}
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={1}
        distance={30}
      />
    </>
  )
}