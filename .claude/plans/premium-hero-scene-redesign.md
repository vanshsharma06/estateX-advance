# Premium Hero Scene Redesign Plan

## Overview
Redesign the hero scene to achieve Awwwards-winning quality with ultra-premium futuristic architecture.

## Implementation Files to Modify/Create

### 1. Scene.jsx - Main 3D Canvas Setup
- Camera: Perspective with 45° FOV for cinematic feel
- Enhanced post-processing: Bloom, Vignette, ChromaticAberration, ToneMapping
- HDR environment using Environment from Drei
- Fog: Exponential fog for depth
- ScrollTrigger camera animation

### 2. EnhancedSkyscrapers.jsx - New Building Component
- Detailed futuristic skyscrapers with:
  - Multiple architectural sections (base, mid, crown)
  - Glass facades with realistic window patterns
  - Antenna/spire details
  - LED accent strips (gold/white glow)
  - Ground-level entrance details
- 15-20 buildings arranged in circular pattern
- Varied heights: 30-80 units
- Metallic dark materials with reflective glass

### 3. ReflectiveFloor.jsx - Mirror Floor
- MeshReflectorMaterial from Drei
- Mirror: 0.75 reflectivity
- Blur: 0.2 for subtle diffusion
- Gold tint in reflections
- Grid pattern overlay

### 4. MassiveUP16Text.jsx - 3D Brand Text
- Text behind founders as backdrop
- Massive scale (fills background)
- Metallic gold PBR material
- Emissive glow effect
- Continuous slow rotation
- Billboard effect facing camera

### 5. CitySkyline.jsx - Background City
- Distant city silhouettes (50+ buildings)
- Various heights and widths
- Dark silhouettes with scattered lit windows
- Positioned at z = -80 to -100
- Subtle fog fade

### 6. EnhancedLighting.jsx - Volumetric Setup
- HDR Environment map (city/night)
- Volumetric SpotLights with god rays
- Animated key light
- Gold accent rim lights
- Real-time shadow casting

### 7. LuxuryParticles.jsx - Enhanced Particles
- 2000+ particles
- Mix of gold, white, platinum colors
- Sparkle/shimmer effect
- Varying velocities and sizes
- Additive blending

### 8. LightStreaks.jsx - Animated Light Rays
- 5-8 light streak lines
- Sweeping across scene
- Gold/white gradient
- Loop animation
- Volumetric appearance

### 9. CinematicReveal.jsx - Entrance Animation
- Initial camera position: far and high
- GSAP timeline animation on mount:
  - Camera zooms in and settles
  - Buildings fade in from darkness
  - Text scales up with glow pulse
  - Particles activate with burst
  - Lights sweep in sequence

### 10. HeroSection.jsx - Updated HTML Overlay
- Update for new 3D scene context
- Add GSAP ScrollTrigger for parallax
- Maintain current content structure
- Enhanced scroll indicator animation

## Technical Specifications

### Color Palette
- Primary Gold: #D4AF37
- Gold Light: #E5C76B
- Gold Dark: #B8962E
- Black: #0A0A0A
- Glass Tint: #1a1a2e

### Performance Targets
- 60 FPS on modern hardware
- Level of Detail (LOD) for distant buildings
- Instanced meshes where possible

### Dependencies (already installed)
- @react-three/drei
- @react-three/fiber
- @react-three/postprocessing
- three
- gsap with ScrollTrigger
- framer-motion

## Acceptance Criteria
1. ✅ Buildings are detailed, futuristic skyscrapers (not simple boxes)
2. ✅ Floor shows clear gold-tinted reflections
3. ✅ Volumetric light rays visible in scene
4. ✅ "UP16 PROPERTIES" text massive and glowing behind founders
5. ✅ City skyline visible in far background
6. ✅ Camera smoothly animates on scroll
7. ✅ Cinematic reveal plays on page load
8. ✅ Particles and light streaks animate continuously
9. ✅ No empty space - environment feels rich
10. ✅ Overall quality matches luxury brand aesthetic