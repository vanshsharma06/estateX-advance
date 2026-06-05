import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, SpotLight } from '@react-three/drei'

export default function EnhancedLighting() {
  const keyLightRef = useRef()
  const rimLight1Ref = useRef()
  const rimLight2Ref = useRef()
  const spotLight1Ref = useRef()
  const spotLight2Ref = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Animate key light - gentle sweeping motion
    if (keyLightRef.current) {
      keyLightRef.current.position.x = Math.sin(t * 0.15) * 8
      keyLightRef.current.position.y = 8 + Math.cos(t * 0.1) * 2
      keyLightRef.current.intensity = 2.5 + Math.sin(t * 0.3) * 0.5
    }

    // Animate rim lights
    if (rimLight1Ref.current) {
      rimLight1Ref.current.intensity = 2 + Math.sin(t * 0.5 + 1) * 0.8
    }
    if (rimLight2Ref.current) {
      rimLight2Ref.current.intensity = 1.5 + Math.sin(t * 0.4) * 0.5
    }

    // Animate spotlights - sweeping beams
    if (spotLight1Ref.current) {
      spotLight1Ref.current.position.x = Math.sin(t * 0.2) * 15
      spotLight1Ref.current.target.position.x = Math.sin(t * 0.2) * 15
    }
    if (spotLight2Ref.current) {
      spotLight2Ref.current.position.x = Math.cos(t * 0.18) * 15
      spotLight2Ref.current.target.position.x = Math.cos(t * 0.18) * 15
    }
  })

  return (
    <>
      {/* HDR Environment map for reflections */}
      <Environment
        preset="night"
        background={false}
      />

      {/* Ambient base light */}
      <ambientLight color="#1a1a2e" intensity={0.2} />

      {/* Main key light - warm white */}
      <directionalLight
        ref={keyLightRef}
        color="#FFF8E7"
        intensity={2.5}
        position={[5, 8, 5]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0001}
      />

      {/* Fill light - cool blue from opposite side */}
      <directionalLight
        color="#E8F4FF"
        intensity={0.4}
        position={[-8, 5, -5]}
      />

      {/* Gold rim light 1 - left side */}
      <pointLight
        ref={rimLight1Ref}
        color="#D4AF37"
        intensity={2}
        position={[-15, 5, 0]}
        distance={50}
        decay={2}
      />

      {/* Gold rim light 2 - right side */}
      <pointLight
        ref={rimLight2Ref}
        color="#E5C76B"
        intensity={1.5}
        position={[15, 5, 0]}
        distance={50}
        decay={2}
      />

      {/* Volumetric spotlight 1 */}
      <SpotLight
        ref={spotLight1Ref}
        color="#FFFFFF"
        intensity={100}
        position={[-10, 20, 10]}
        angle={0.4}
        penumbra={0.8}
        distance={60}
        anglePower={4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Volumetric spotlight 2 */}
      <SpotLight
        ref={spotLight2Ref}
        color="#D4AF37"
        intensity={80}
        position={[10, 20, 10]}
        angle={0.35}
        penumbra={0.9}
        distance={60}
        anglePower={4}
      />

      {/* Ground bounce light */}
      <pointLight
        color="#1a1a1a"
        intensity={0.3}
        position={[0, -8, 0]}
        distance={30}
      />

      {/* Accent blue light from below for dramatic effect */}
      <pointLight
        color="#1a237e"
        intensity={0.5}
        position={[0, -5, 10]}
        distance={40}
      />
    </>
  )
}