import { useRef } from 'react'
import { MeshReflectorMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export default function ReflectiveFloor() {
  const materialRef = useRef()

  useFrame(({ clock }) => {
    if (materialRef.current) {
      // Subtle animation for living feel
      materialRef.current.mirror = 0.75 + Math.sin(clock.getElapsedTime() * 0.5) * 0.02
    }
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, -20]}>
      <planeGeometry args={[200, 200]} />
      <MeshReflectorMaterial
        ref={materialRef}
        blur={[300, 100]}
        resolution={1024}
        mixBlur={0.8}
        mixStrength={1.5}
        roughness={0.1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#0a0805"
        metalness={0.8}
        mirror={0.75}
      />
    </mesh>
  )
}