import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const taglineRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main title animation with cinematic reveal
      gsap.fromTo(titleRef.current,
        { scale: 0.5, opacity: 0, y: 80, filter: 'blur(20px)' },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 2,
          ease: 'power4.out',
          delay: 0.3
        }
      )

      // Subtitle animation
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: 40, letterSpacing: '0.5em' },
        {
          opacity: 1,
          y: 0,
          letterSpacing: '0.8em',
          duration: 1.5,
          ease: 'power3.out',
          delay: 1.5
        }
      )

      // Tagline with fade
      gsap.fromTo(taglineRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          delay: 2.2
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Semi-transparent overlay - NOT solid black */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 pointer-events-none z-10" />

      {/* Content */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-20 text-center px-4"
      >
        {/* Main Logo */}
        <div ref={titleRef} className="mb-6">
          <h1
            className="gold-text text-7xl md:text-9xl lg:text-[10rem] font-bold tracking-[0.1em] drop-shadow-[0_0_30px_rgba(212,175,55,0.5)]"
            style={{ fontFamily: 'var(--font-heading)', textShadow: '0 0 60px rgba(212,175,55,0.3)' }}
          >
            UP16
          </h1>
          <motion.div
            className="w-48 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 2, duration: 1.2, ease: 'power2.out' }}
          />
        </div>

        {/* Company Name */}
        <motion.p
          ref={subtitleRef}
          className="text-platinum/90 text-xl md:text-2xl lg:text-3xl tracking-[0.8em] uppercase mb-4 font-light"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Properties
        </motion.p>

        {/* Tagline */}
        <motion.p
          ref={taglineRef}
          className="text-white/70 text-lg md:text-xl tracking-wider max-w-xl mx-auto mt-10 font-light"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Redefining Luxury Living
        </motion.p>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <span className="text-gold/70 text-xs tracking-[0.3em] uppercase font-medium">Explore</span>
        <motion.div
          className="w-px h-16 bg-gradient-to-b from-gold/80 to-transparent relative"
        >
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-gold rounded-full blur-[1px]"
            animate={{ y: [0, 56, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>

      {/* Decorative corner accents - hidden on mobile */}
      <div className="hidden md:block absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-gold/20 z-20" />
      <div className="hidden md:block absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-gold/20 z-20" />
      <div className="hidden md:block absolute bottom-8 left-8 w-24 h-24 border-l-2 border-b-2 border-gold/20 z-20" />
      <div className="hidden md:block absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-gold/20 z-20" />
    </section>
  )
}