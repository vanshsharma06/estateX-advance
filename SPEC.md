# UP16 PROPERTIES - Ultra-Premium Cinematic Website Specification

## Project Overview
- **Project Name**: UP16 PROPERTIES
- **Type**: Luxury Real Estate Brand Website
- **Core Functionality**: Cinematic 3D experience showcasing a premium real estate company to high-net-worth clients
- **Target Users**: High-net-worth individuals, luxury property investors, architecture enthusiasts

---

## Technology Stack
- React 18 + Vite
- Tailwind CSS
- Three.js + React Three Fiber + Drei
- GSAP + ScrollTrigger
- Framer Motion
- Lenis Smooth Scroll

---

## Visual & Rendering Specification

### Scene Setup
- **Camera**: Perspective camera with scroll-driven movement
- **Controls**: ScrollTrigger-controlled camera transitions (no manual orbit)
- **Environment**: Dark luxury atmosphere with volumetric lighting
- **Background**: Deep black (#000000) with subtle gradient

### Color Palette
- **Primary**: Champagne Gold (#D4AF37)
- **Secondary**: Pure White (#FFFFFF)
- **Accent**: Warm Platinum (#E5E4E2)
- **Background**: Rich Black (#0A0A0A)
- **Text Primary**: Off-White (#F5F5F5)
- **Text Secondary**: Muted Silver (#A0A0A0)

### Typography
- **Headlines**: Playfair Display (serif, elegant)
- **Body**: Outfit (modern, clean)
- **Accent**: Cormorant Garamond (refined, luxury)

### Lighting Setup
- **Key Light**: Warm directional light (color: #FFF8E7, intensity: 2)
- **Fill Light**: Cool blue-rim light (color: #E8F4FF, intensity: 0.5)
- **Rim Light**: Golden accent (color: #D4AF37, intensity: 1.5)
- **Ambient**: Low intensity warm ambient (#1A1A1A, intensity: 0.3)

### Materials & Effects
- **3D Text**: MeshStandardMaterial with metalness: 0.9, roughness: 0.1
- **Founders**: Human geometry with custom shader materials
- **City**: Low-poly buildings with emissive windows
- **Particles**: Custom point material with glow

### Post-Processing
- Bloom (intensity: 0.8, threshold: 0.6)
- Vignette (darkness: 0.5)
- Chromatic Aberration (subtle, offset: 0.002)

---

## Section Specifications

### 1. Cinematic Loading Screen
- Full-screen black background
- Animated progress bar with gold gradient
- "UP16" text revealing letter by letter
- Smooth fade out transition (1.5s)
- Total load time: 3 seconds minimum for effect

### 2. Hero Section
- Full viewport height (100vh)
- Animated UP16 PROPERTIES logo reveal
- Tagline: "Redefining Luxury Living"
- Scroll indicator with animated arrow
- Entrance animation: Logo scales from 0 to 1 with rotation

### 3. Founder Showcase Section
- Two founders positioned center-left and center-right
- Photo-realistic portraits with subtle parallax
- Name and title overlay
- Quote appearing on scroll
- Background: Giant rotating 3D "UP16" text

### 4. 3D UP16 Text
- Giant extruded text behind founders
- Continuous slow rotation (Y-axis, 0.1 rad/s)
- Gold metallic material with reflections
- Scroll-driven animation: scales and tilts

### 5. City Environment Section
- Low-poly cityscape in background
- Buildings with emissive windows (warm yellow)
- Subtle fog for depth
- Camera dolly through city
- 20+ building instances with varying heights

### 6. Particle System
- 500+ floating particles
- Gold/white color scheme
- Varying sizes (0.01 - 0.05)
- Slow random movement
- Depth-based opacity

### 7. Services Section
- Four service cards with 3D tilt effect
- Icons: Acquisition, Development, Investment, Management
- Hover: Card lifts, glow intensifies
- Staggered entrance animation

### 8. Timeline Section
- Vertical timeline with connecting line
- Animated counter points
- Year markers with fade-in
- Milestones: Founded, First Project, Expansion, Awards, Global Reach

### 9. Testimonials Section
- Carousel with 3 testimonials
- Large quote marks
- Client photo, name, property
- Smooth slide transitions
- Auto-advance with pause on hover

### 10. Statistics Section
- Four animated counters
- Properties Sold, Total Value, Years Experience, Awards Won
- Number animation on scroll into view
- Gold accent underlines

### 11. Contact Section
- Split layout: Form left, info right
- Gold border accents
- Floating labels on inputs
- Submit button with hover animation
- Map or 3D element on right side

### 12. Lead Generation Form
- Fields: Name, Email, Phone, Interest, Message
- Validation with error states
- Success animation on submit
- Data captured to console (demo)

---

## Interaction Specification

### Scroll Behavior
- Lenis smooth scroll with damping: 0.1
- ScrollTrigger for all section animations
- Pin sections where needed
- Smooth scrub values (1-1.5s)

### Mouse Interaction
- Subtle parallax on mouse move (hero section)
- Cursor changes on interactive elements
- Hover effects on all clickable elements

### Mobile Gestures
- Touch-friendly scroll
- Swipe for testimonial carousel
- Responsive 3D scene (simplified on mobile)

---

## Performance Targets
- 60 FPS on desktop
- 30+ FPS on mobile
- Total bundle size < 500KB (excluding Three.js)
- Lazy load 3D sections where possible

---

## Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
- Large Desktop: > 1440px

---

## Component Structure
```
src/
├── components/
│   ├── loading/
│   │   └── LoadingScreen.jsx
│   ├── hero/
│   │   └── HeroSection.jsx
│   ├── founders/
│   │   └── FounderShowcase.jsx
│   ├── scene/
│   │   ├── UP16Text.jsx
│   │   ├── CityEnvironment.jsx
│   │   ├── ParticleField.jsx
│   │   └── Lighting.jsx
│   ├── services/
│   │   └── ServicesSection.jsx
│   ├── timeline/
│   │   └── TimelineSection.jsx
│   ├── testimonials/
│   │   └── TestimonialsSection.jsx
│   ├── stats/
│   │   └── StatsSection.jsx
│   ├── contact/
│   │   └── ContactSection.jsx
│   ├── common/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   └── canvas/
│       └── Scene.jsx
├── hooks/
│   └── useScrollAnimation.js
├── styles/
│   └── index.css
├── App.jsx
└── main.jsx
```

---

## Acceptance Criteria

1. ✅ Loading screen displays with animated logo reveal
2. ✅ Hero section has smooth entrance animation
3. ✅ 3D UP16 text rotates behind founders
4. ✅ City environment renders with lit windows
5. ✅ Particles float throughout the scene
6. ✅ All sections animate on scroll
7. ✅ Testimonials carousel functions
8. ✅ Contact form validates and submits
9. ✅ Statistics animate counting up
10. ✅ Mobile responsive with touch support
11. ✅ Smooth scroll throughout
12. ✅ No console errors
13. ✅ Maintains 30+ FPS
14. ✅ Professional luxury aesthetic