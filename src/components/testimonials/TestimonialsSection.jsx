import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const testimonials = [
  {
    id: 1,
    quote: "UP16 Properties transformed our vision of the perfect home into reality. Their attention to detail and commitment to excellence is unmatched in the industry.",
    name: "Jonathan & Sarah Mitchell",
    title: "Private Collection Owners",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    quote: "Working with UP16 on our investment portfolio has been exceptional. Their market insight and strategic approach delivered returns beyond our expectations.",
    name: "Robert Chen",
    title: "Family Office Director",
    location: "Singapore",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    quote: "The level of service and discretion UP16 provides is exactly what our family requires. They understand the nuances of ultra-high-net-worth clientele.",
    name: "Elena Rodriguez",
    title: "HNW Individual",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
  }
]

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrent(prev => (prev + 1) % testimonials.length)
      }, 6000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused])

  const goToSlide = (index) => {
    setCurrent(index)
  }

  const goToPrev = () => {
    setCurrent(prev => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToNext = () => {
    setCurrent(prev => (prev + 1) % testimonials.length)
  }

  return (
    <section
      className="relative py-32 bg-black overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/30 to-black" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            className="text-gold text-sm tracking-[0.3em] uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Testimonials
          </motion.span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl mt-4 text-white-off"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            What Our Clients Say
          </h2>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* Large Quote Mark */}
              <div className="text-gold/20 text-[120px] leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
                &ldquo;
              </div>

              {/* Quote */}
              <blockquote className="relative -mt-16 mb-12">
                <p className="text-2xl md:text-3xl lg:text-4xl text-white-off leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-heading)' }}>
                  {testimonials[current].quote}
                </p>
              </blockquote>

              {/* Author */}
              <div className="flex flex-col items-center">
                <img
                  src={testimonials[current].image}
                  alt={testimonials[current].name}
                  className="w-20 h-20 rounded-full border-2 border-gold/30 mb-4 object-cover"
                />
                <cite className="not-italic">
                  <div className="text-white-off text-lg font-medium" style={{ fontFamily: 'var(--font-heading)' }}>
                    {testimonials[current].name}
                  </div>
                  <div className="text-gold text-sm mt-1">
                    {testimonials[current].title}
                  </div>
                  <div className="text-silver-muted text-xs mt-1">
                    {testimonials[current].location}
                  </div>
                </cite>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  current === index
                    ? 'bg-gold w-8'
                    : 'bg-gold/30 hover:bg-gold/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Arrow Navigation */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-gold/50 hover:text-gold transition-colors"
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-gold/50 hover:text-gold transition-colors"
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}