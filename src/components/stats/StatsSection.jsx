import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: 500, suffix: '+', label: 'Properties Sold', prefix: '' },
  { value: 1.2, suffix: 'B', label: 'Total Portfolio Value', prefix: '$' },
  { value: 10, suffix: '+', label: 'Years Experience', prefix: '' },
  { value: 25, suffix: '+', label: 'Industry Awards', prefix: '' }
]

function AnimatedCounter({ value, suffix, prefix, inView }) {
  const [count, setCount] = useState(0)
  const duration = 2 // seconds

  useEffect(() => {
    if (!inView) return

    let startTime
    let animationFrame

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(value * easeOut)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [inView, value])

  const displayValue = value >= 1 ? count.toFixed(1) : count.toFixed(0)

  return (
    <span>
      {prefix}{displayValue}{suffix}
    </span>
  )
}

function StatCard({ stat, index, inView }) {
  return (
    <motion.div
      className="text-center group"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6 }}
    >
      <div className="text-5xl md:text-6xl lg:text-7xl font-bold gold-text mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
        <AnimatedCounter
          value={stat.value}
          suffix={stat.suffix}
          prefix={stat.prefix}
          inView={inView}
        />
      </div>
      <div className="text-silver-muted text-lg tracking-wide">{stat.label}</div>
      <motion.div
        className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ delay: index * 0.15 + 0.5, duration: 0.8 }}
      />
    </motion.div>
  )
}

export default function StatsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      className="relative py-24 bg-black"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}