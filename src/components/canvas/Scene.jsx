import { Suspense, useRef, useEffect, useCallback, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Founders from '../scene/Founders'
import LuxuryMonument from '../scene/LuxuryMonument'
import LuxuryCitySkyline from '../scene/LuxuryCitySkyline'
import LuxuryFloor from '../scene/LuxuryFloor'
import VolumetricLights from '../scene/VolumetricLights'
import LuxuryParticles from '../scene/LuxuryParticles'

import { isLowPerformanceDevice, shouldEnablePostProcessing, getRecommendedDPR } from '../../utils/mobileDetect'

gsap.registerPlugin(ScrollTrigger)

console.log('[Scene] Loading luxury cinematic scene')

// Cinematic camera with scroll-based animation
function CinematicCamera() {
  const { camera } = useThree()
  const scrollProgress = useRef(0)
  const targetPosition = useRef({ x: 0, y: 3, z: 22 })
  const targetLookAt = useRef({ x: 0, y: 0, z: -10 })

  useEffect(() => {
    // Initial position
    camera.position.set(0, 3, 22)
    camera.lookAt(0, 0, -10)

    // Check if required elements exist before creating ScrollTriggers
    const heroElement = document.querySelector('#hero')
    const foundersElement = document.querySelector('#founders')

    // Use gsap.context() for proper cleanup
    const ctx = gsap.context(() => {
      // Only create scroll triggers if elements exist
      if (heroElement) {
        ScrollTrigger.create({
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          onUpdate: (self) => {
            // During hero section - pull back camera
            scrollProgress.current = self.progress * 0.3
            targetPosition.current.z = 22 + self.progress * 3
            targetPosition.current.y = 3 - self.progress * 0.5
          }
        })
      }

      if (foundersElement) {
        ScrollTrigger.create({
          trigger: '#founders',
          start: 'top top',
          end: 'bottom top',
          onUpdate: (self) => {
            // During founder section - camera moves in and orbits
            const progress = self.progress
            scrollProgress.current = 0.3 + progress * 0.7

            // Orbit around founders
            const orbitAngle = progress * Math.PI * 0.5
            const orbitRadius = 18 - progress * 5

            targetPosition.current.x = Math.sin(orbitAngle) * orbitRadius * 0.3
            targetPosition.current.y = 2.5 + Math.sin(progress * Math.PI) * 1
            targetPosition.current.z = 18 - progress * 4

            targetLookAt.current.y = progress * 1.5
          }
        })
      }
    })

    return () => {
      ctx.revert() // Clean up all GSAP animations created in this context
    }
  }, [camera])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Base orbital movement
    const baseX = Math.sin(t * 0.08) * 2
    const baseZ = 18 + Math.cos(t * 0.06) * 2

    // Blend scroll-based position with subtle animation
    const blendFactor = 0.015

    camera.position.x += (targetPosition.current.x + baseX * (1 - scrollProgress.current) - camera.position.x) * blendFactor
    camera.position.y += (targetPosition.current.y - camera.position.y) * blendFactor
    camera.position.z += (targetPosition.current.z + baseZ * 0.2 - camera.position.z) * blendFactor

    // Look at target
    camera.lookAt(
      targetLookAt.current.x,
      targetLookAt.current.y,
      targetLookAt.current.z
    )
  })

  return null
}

// Scene atmosphere with fog
function SceneAtmosphere() {
  const { scene } = useThree()

  useEffect(() => {
    scene.fog = new (require('three').FogExp2)('#050508', 0.012)
  }, [scene])

  return null
}

function SceneContent() {
  const enablePostProcessing = shouldEnablePostProcessing()

  console.log('[Scene] Rendering luxury cinematic content', { enablePostProcessing })

  return (
    <>
      {/* Background */}
      <color attach="background" args={['#050508']} />

      {/* Atmosphere */}
      <SceneAtmosphere />

      {/* HDR Environment */}
      <Suspense fallback={null}>
        <Environment preset="city" background={false} />
      </Suspense>

      {/* Cinematic Camera */}
      <CinematicCamera />

      {/* Lighting */}
      <VolumetricLights />

      {/* Black marble floor */}
      <LuxuryFloor />

      {/* Giant UP16 PROPERTIES monument */}
      <LuxuryMonument />

      {/* City skyline */}
      <LuxuryCitySkyline />

      {/* Founders at center */}
      <Founders />

      {/* Particles */}
      <LuxuryParticles />

      {/* Post-processing - only enable on high-performance devices */}
      {enablePostProcessing ? (
        <EffectComposer>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette
            offset={0.35}
            darkness={0.5}
          />
        </EffectComposer>
      ) : (
        // Simplified post-processing for mobile - just Vignette
        <EffectComposer>
          <Vignette
            offset={0.35}
            darkness={0.4}
          />
        </EffectComposer>
      )}
    </>
  )
}

export default function Scene() {
  const canvasRef = useRef(null)
  const [hasFailed, setHasFailed] = useState(false)
  const [contextLost, setContextLost] = useState(false)

  console.log('[Scene] Canvas rendering')

  // Check device performance once
  const isLowPerf = isLowPerformanceDevice()
  const dpr = getRecommendedDPR()

  console.log('[Scene] Device performance check:', { isLowPerf, dpr })

  // Handle WebGL context loss gracefully
  const handleContextLost = useCallback((event) => {
    event.preventDefault()
    console.warn('[Scene] WebGL context lost')
    setContextLost(true)
  }, [])

  const handleContextRestored = useCallback(() => {
    console.log('[Scene] WebGL context restored')
    setContextLost(false)
  }, [])

  // Handle renderer errors
  const handleError = useCallback((error) => {
    console.error('[Scene] Renderer error:', error)
    setHasFailed(true)
  }, [])

  // If Scene has failed, render nothing (error boundary will show main content)
  if (hasFailed) {
    console.log('[Scene] Scene failed, rendering nothing')
    return null
  }

  // If context is lost, render nothing temporarily
  if (contextLost) {
    console.log('[Scene] Context lost, rendering nothing')
    return null
  }

  return (
    <div
      className="fixed inset-0"
      style={{
        height: '100vh',
        width: '100vw'
      }}
    >
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 3, 22], fov: 50 }}
        gl={{
          antialias: !isLowPerf, // Disable antialias on mobile
          alpha: false,
          powerPreference: isLowPerf ? 'low-power' : 'high-performance',
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false // Don't preserve on mobile to save memory
        }}
        dpr={dpr}
        onCreated={({ gl, renderer }) => {
          console.log('[Scene] Canvas created - luxury scene ready')

          // Set up error handling for the renderer
          try {
            renderer?.setErrorHandler?.(handleError)
          } catch (e) {
            console.warn('[Scene] setErrorHandler not available')
          }

          // Handle context loss with try-catch
          try {
            gl.domElement.addEventListener('webglcontextlost', handleContextLost, false)
            gl.domElement.addEventListener('webglcontextrestored', handleContextRestored, false)
          } catch (e) {
            console.warn('[Scene] Event listener setup failed:', e)
          }
        }}
        onUnmounted={({ gl }) => {
          // Clean up event listeners with try-catch to prevent errors
          try {
            if (gl?.domElement) {
              gl.domElement.removeEventListener('webglcontextlost', handleContextLost, false)
              gl.domElement.removeEventListener('webglcontextrestored', handleContextRestored, false)
            }
          } catch (e) {
            console.warn('[Scene] Event listener cleanup failed:', e)
          }

          // Dispose renderer with error handling
          try {
            gl?.dispose?.()
          } catch (e) {
            console.warn('[Scene] Renderer dispose failed:', e)
          }
        }}
        onError={handleError}
      >
        <Suspense fallback={null}>
          <SceneContent />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}