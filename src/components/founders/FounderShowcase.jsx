import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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
    quote: 'We don\'t build properties. We curate legacies.',
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
    setHasError(true)
    setImgSrc(placeholder)
    setIsLoaded(true)
  }

  const handleLoad = () => {
    setIsLoaded(true)
  }

  // Show placeholder immediately if no valid src, or after error/load
  const showPlaceholder = !isValidSrc || hasError || isLoaded

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-black/20 ${className}`}
      style={{ opacity: 1, visibility: 'visible' }}
    >
      <img
        src={showPlaceholder ? imgSrc : placeholder}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        style={{
          opacity: 1,
          visibility: 'visible',
          display: 'block'
        }}
        className="w-full h-full object-cover group-hover:scale-105"
      />
    </div>
  )
}

export default function FounderShowcase() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.founder-card',
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-16 md:py-32 overflow-hidden"
    >
      {/* Section Title */}
      <motion.div
        ref={textRef}
        style={{ y, opacity }}
        className="text-center mb-20"
      >
        <motion.span
          className="text-gold text-sm tracking-[0.3em] uppercase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Leadership
        </motion.span>
        <h2
          className="text-2xl md:text-4xl lg:text-6xl mt-2 md:mt-4 text-white-off"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Meet Our Founders
        </h2>
      </motion.div>

      {/* Founders Grid */}
      <div className="max-w-6xl mx-auto px-2 md:px-4 flex flex-row flex-wrap justify-center gap-3 md:gap-8 lg:gap-16">
        {founders.map((founder, index) => (
          <motion.div
            key={founder.name}
            className="founder-card relative group w-[45%] md:w-[45%] lg:w-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
          >
            {/* Card Container */}
            <div className="relative overflow-hidden">
              {/* Image */}
              <div className="relative h-[140px] md:h-[300px] lg:aspect-[3/4] overflow-hidden">
                <FounderImage
                  src={founder.image}
                  placeholder={founder.placeholder}
                  alt={founder.name}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-8">
                  {/* Name & Title */}
                  <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                    <h3
                      className="text-lg md:text-2xl lg:text-3xl text-white-off mb-0.5"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {founder.name}
                    </h3>
                    <p className="text-gold text-xs md:text-sm tracking-wider uppercase mb-2 md:mb-4">
                      {founder.title}
                    </p>
                    <p className="text-silver-muted text-xs md:text-sm italic">
                      {founder.location}
                    </p>
                  </div>

                  {/* Quote - Appears on hover */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-3 md:p-8 bg-gradient-to-t from-black to-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-platinum text-xs md:text-lg italic border-l-2 border-gold pl-2 md:pl-4">
                      "{founder.quote}"
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Border Accent */}
              <div className="absolute inset-0 border border-gold/20 transition-all duration-500 group-hover:border-gold/50" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}