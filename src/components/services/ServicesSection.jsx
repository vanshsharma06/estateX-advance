import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    icon: '🏢',
    title: 'Acquisition',
    description: 'Strategic property acquisition in prime locations worldwide, curating exceptional portfolios for discerning investors.',
    features: ['Prime Location Sourcing', 'Market Analysis', 'Due Diligence', 'Investment Strategy']
  },
  {
    icon: '🏗️',
    title: 'Development',
    description: 'Bespoke development projects from concept to completion, pushing the boundaries of architectural excellence.',
    features: ['Architectural Design', 'Project Management', 'Quality Assurance', 'Sustainable Building']
  },
  {
    icon: '📈',
    title: 'Investment',
    description: 'High-yield investment opportunities with comprehensive risk assessment and portfolio management.',
    features: ['Portfolio Diversification', 'Risk Assessment', 'Market Intelligence', 'Asset Management']
  },
  {
    icon: '✨',
    title: 'Management',
    description: 'White-glove property management ensuring your investments maintain their pristine condition and value.',
    features: ['24/7 Concierge', 'Maintenance', 'Tenant Relations', 'Financial Reporting']
  }
]

export default function ServicesSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    let ctx
    try {
      ctx = gsap.context(() => {
        gsap.fromTo('.service-card',
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }, sectionRef)
    } catch (e) {
      console.warn('[ServicesSection] GSAP initialization error:', e)
    }

    return () => {
      if (ctx) {
        try {
          ctx.revert()
        } catch (e) {
          console.warn('[ServicesSection] GSAP cleanup error:', e)
        }
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-black"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            className="text-gold text-sm tracking-[0.3em] uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Services
          </motion.span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl mt-4 text-white-off"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Excellence in Every Detail
          </h2>
          <p className="text-silver-muted text-lg mt-6 max-w-2xl mx-auto">
            Comprehensive real estate solutions tailored to the world&apos;s most discerning clientele.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="service-card group relative bg-gradient-to-b from-gray-900/50 to-black border border-gold/10 hover:border-gold/30 transition-all duration-500"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              {/* Card Content */}
              <div className="p-8">
                {/* Icon */}
                <div className="text-4xl mb-6">{service.icon}</div>

                {/* Title */}
                <h3
                  className="text-xl text-white-off mb-3"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-silver-muted text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map(feature => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-silver-muted text-xs"
                    >
                      <span className="w-1 h-1 bg-gold rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}