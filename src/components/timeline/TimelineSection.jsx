import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const milestones = [
  {
    year: '2015',
    title: 'Foundation',
    description: 'UP16 Properties was established with a vision to transform luxury real estate.',
    achievement: true
  },
  {
    year: '2017',
    title: 'First Landmark',
    description: 'Completed our first $100M+ development in Manhattan.',
    achievement: true
  },
  {
    year: '2019',
    title: 'Global Expansion',
    description: 'Expanded operations to London, Dubai, and Singapore.',
    achievement: false
  },
  {
    year: '2021',
    title: 'Industry Recognition',
    description: 'Awarded &quot;Best Luxury Real Estate Developer&quot; by International Property Awards.',
    achievement: true
  },
  {
    year: '2023',
    title: 'Billion Dollar Portfolio',
    description: 'Reached $1B in managed luxury properties across 12 countries.',
    achievement: true
  },
  {
    year: '2025',
    title: 'Future Vision',
    description: 'Pioneering sustainable luxury developments for the next generation.',
    achievement: false
  }
]

function TimelineItem({ item, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      className={`relative flex gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      {/* Content */}
      <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
        <div className="bg-gradient-to-b from-gray-900/80 to-black border border-gold/10 p-6 hover:border-gold/30 transition-all duration-300">
          <span className="text-gold text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            {item.year}
          </span>
          <h3 className="text-xl text-white-off mt-2 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {item.title}
          </h3>
          <p className="text-silver-muted text-sm">
            {item.description}
          </p>
          {item.achievement && (
            <div className={`mt-4 flex items-center gap-2 text-gold text-xs ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'} justify-start`}>
              <span className="text-lg">★</span>
              <span>Milestone Achievement</span>
            </div>
          )}
        </div>
      </div>

      {/* Center Line Node */}
      <div className="hidden md:flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full border-2 ${item.achievement ? 'bg-gold border-gold' : 'bg-black border-gold/50'} transition-all duration-300`} />
        <div className="w-px h-24 bg-gradient-to-b from-gold/50 to-transparent" />
      </div>

      {/* Empty Space for Alternate Layout */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  )
}

export default function TimelineSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    let ctx
    try {
      ctx = gsap.context(() => {
        gsap.fromTo('.timeline-line',
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }, sectionRef)
    } catch (e) {
      console.warn('[TimelineSection] GSAP initialization error:', e)
    }

    return () => {
      if (ctx) {
        try {
          ctx.revert()
        } catch (e) {
          console.warn('[TimelineSection] GSAP cleanup error:', e)
        }
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-black overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            className="text-gold text-sm tracking-[0.3em] uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Journey
          </motion.span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl mt-4 text-white-off"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            A Legacy of Excellence
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <div className="timeline-line w-full h-full origin-top bg-gradient-to-b from-gold via-gold/50 to-transparent" />
          </div>

          {/* Timeline Items */}
          <div className="space-y-12">
            {milestones.map((item, index) => (
              <TimelineItem key={item.year} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}