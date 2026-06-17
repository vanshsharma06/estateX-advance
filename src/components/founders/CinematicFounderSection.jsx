import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Fallback placeholder images for founders
const founderPlaceholders = {
  alexander: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"%3E%3Crect fill="%23222" width="400" height="500"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EAlexander Chen%3C/text%3E%3C/svg%3E',
  victoria: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"%3E%3Crect fill="%23222" width="400" height="500"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EVictoria Sterling%3C/text%3E%3C/svg%3E'
}

const founders = [
  {
    name: 'Alexander Chen',
    title: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    placeholder: founderPlaceholders.alexander,
    quote: "We don't build properties. We curate legacies.",
    location: 'New York'
  },
  {
    name: 'Victoria Sterling',
    title: 'Co-Founder & Design Director',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face',
    placeholder: founderPlaceholders.victoria,
    quote: 'Every space tells a story. We ensure yours is extraordinary.',
    location: 'London'
  }
]

// Founder Image Component with error handling
function FounderImage({ src, placeholder, alt, className = '' }) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Force show placeholder immediately if src is invalid
  const isValidSrc = src && src.startsWith('http')

  const handleError = () => {
    console.log('[FounderImage] Error loading image, using placeholder')
    setHasError(true)
    setImgSrc(placeholder)
    setIsLoaded(true)
  }

  const handleLoad = () => {
    console.log('[FounderImage] Image loaded successfully')
    setIsLoaded(true)
  }

  // Show placeholder only if no valid src or there was an error
  const showPlaceholder = !isValidSrc || hasError

  return (
    <div
      className={`founder-image-container relative w-full h-full overflow-hidden bg-black/20 ${className}`}
    >
      <img
        src={showPlaceholder ? placeholder : imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className="founder-image w-full h-full object-cover group-hover:scale-105 grayscale-[30%] group-hover:grayscale-0"
      />
    </div>
  )
}

export default function CinematicFounderSection() {
  const sectionRef = useRef(null)
  const founder1Ref = useRef(null)
  const founder2Ref = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    // Use try-catch to prevent errors from breaking the component
    let ctx
    try {
      ctx = gsap.context(() => {
        // Set initial states - founders start hidden and off-screen
        gsap.set(founder1Ref.current, { x: -300, opacity: 0, scale: 0.9 })
        gsap.set(founder2Ref.current, { x: 300, opacity: 0, scale: 0.9 })
        gsap.set(titleRef.current, { opacity: 0, y: 30 })

        // Set initial states for images inside each founder card
        gsap.set('.founder-image-container', { opacity: 0 })
        gsap.set('.founder-image', { opacity: 0 })

        // Pinned section animation - scroll-driven timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 1,
            anticipatePin: 1
          }
        })

        // Title reveal - fades in and moves up
        tl.to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out'
        }, 0)

        // Founder 1 slides in from far left with opacity and scale
        tl.to(founder1Ref.current,
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out'
          },
          0.15
        )

        // Founder 2 slides in from far right with opacity and scale
        tl.to(founder2Ref.current,
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out'
          },
          0.3
        )

        // Image reveal after card is visible
        tl.to('.founder-image-container', {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        }, 0.5)

        tl.to('.founder-image', {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        }, 0.6)

      }, sectionRef)
    } catch (e) {
      console.warn('[CinematicFounderSection] GSAP initialization error:', e)
    }

    // Cleanup with error handling
    return () => {
      if (ctx) {
        try {
          ctx.revert()
        } catch (e) {
          console.warn('[CinematicFounderSection] GSAP cleanup error:', e)
        }
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="founders"
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Dark overlay - z-10 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 pointer-events-none z-10" />

      {/* Section Title - animated by GSAP */}
      <div
        ref={titleRef}
        className="absolute top-20 left-0 right-0 text-center px-4 z-50"
      >
        {/* Subtitle - White, fully visible */}
        <div
          className="text-sm tracking-[0.5em] uppercase"
          style={{
            color: 'rgba(255,255,255,0.95)',
            letterSpacing: '0.5em',
            fontWeight: 400,
            marginBottom: '0.5rem'
          }}
        >
          Visionary Leadership
        </div>

        {/* Main Heading - Gold, fully visible */}
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-light"
          style={{
            fontFamily: 'var(--font-heading)',
            color: '#D4AF37',
            textShadow: `
              0 0 30px rgba(212,175,55,0.6),
              0 0 60px rgba(212,175,55,0.4),
              0 2px 4px rgba(0,0,0,0.8)
            `,
            fontWeight: 400,
            letterSpacing: '0.05em',
            lineHeight: 1.2
          }}
        >
          Meet Our Founders
        </h2>
      </div>

      {/* Founders Container - z-30 to be above overlays */}
      <div
        className="relative z-30 flex items-center justify-center gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto px-4"
        style={{ marginTop: '2rem' }}
      >
        {/* Founder 1 - Left */}
        <motion.div
          ref={founder1Ref}
          className="relative group"
        >
          <div className="relative w-48 md:w-56 lg:w-64 h-64 md:h-80 lg:h-96 overflow-hidden">
            <FounderImage
              src={founders[0].image}
              placeholder={founders[0].placeholder}
              alt={founders[0].name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <h3
                className="text-xl md:text-2xl text-white font-light"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {founders[0].name}
              </h3>
              <p className="text-gold text-xs md:text-sm tracking-wider uppercase mt-1">
                {founders[0].title}
              </p>
              <p className="text-silver-muted text-xs mt-2">
                {founders[0].location}
              </p>
              <motion.p
                className="text-platinum text-sm italic mt-3 border-l-2 border-gold pl-3 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                "{founders[0].quote}"
              </motion.p>
            </div>
            <div className="absolute inset-0 border border-gold/30 transition-all duration-500 group-hover:border-gold/60" />
          </div>
          <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-700" />
        </motion.div>

        {/* Founder 2 - Right */}
        <motion.div
          ref={founder2Ref}
          className="relative group"
        >
          <div className="relative w-48 md:w-56 lg:w-64 h-64 md:h-80 lg:h-96 overflow-hidden">
            <FounderImage
              src={founders[1].image}
              placeholder={founders[1].placeholder}
              alt={founders[1].name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <h3
                className="text-xl md:text-2xl text-white font-light"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {founders[1].name}
              </h3>
              <p className="text-gold text-xs md:text-sm tracking-wider uppercase mt-1">
                {founders[1].title}
              </p>
              <p className="text-silver-muted text-xs mt-2">
                {founders[1].location}
              </p>
              <motion.p
                className="text-platinum text-sm italic mt-3 border-l-2 border-gold pl-3 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                "{founders[1].quote}"
              </motion.p>
            </div>
            <div className="absolute inset-0 border border-gold/30 transition-all duration-500 group-hover:border-gold/60" />
          </div>
          <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-700" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
        <span className="text-gold/50 text-xs tracking-widest uppercase">Scroll to continue</span>
        <div className="w-px h-8 bg-gradient-to-b from-gold/50 to-transparent" />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-gold/30 z-30" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-gold/30 z-30" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-gold/30 z-30" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-gold/30 z-30" />
    </section>
  )
}