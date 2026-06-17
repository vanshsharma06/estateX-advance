import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const interests = [
  'Property Acquisition',
  'Investment Opportunities',
  'Development Partnership',
  'Property Management',
  'Private Client Services',
  'Other'
]

export default function ContactSection() {
  const sectionRef = useRef(null)
  const formRef = useRef(null)
  const inView = useInView(formRef, { once: true, margin: '-100px' })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-form-element',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%'
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.interest) {
      newErrors.interest = 'Please select an interest'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log('Form submitted:', formData)
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (isSubmitted) {
    return (
      <section ref={sectionRef} className="relative py-16 md:py-32 bg-black">
        <div className="max-w-xl mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-6">✓</div>
            <h2 className="text-3xl text-white-off mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Thank You
            </h2>
            <p className="text-silver-muted">
              Your inquiry has been received. Our team will contact you within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-32 bg-black overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/30 to-black" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left - Form */}
          <div>
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="text-gold text-sm tracking-[0.3em] uppercase">
                Contact Us
              </span>
              <h2
                className="text-4xl md:text-5xl mt-4 mb-2 text-white-off"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Begin Your Journey
              </h2>
              <p className="text-silver-muted mb-10">
                Tell us about your interests and our team will craft a bespoke experience.
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="contact-form-element">
                <label className="block text-silver-muted text-sm mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-gray-900/50 border ${errors.name ? 'border-red-500' : 'border-gold/20 focus:border-gold'} px-4 py-3 text-white-off outline-none transition-colors`}
                  placeholder="Enter your name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="contact-form-element">
                <label className="block text-silver-muted text-sm mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-gray-900/50 border ${errors.email ? 'border-red-500' : 'border-gold/20 focus:border-gold'} px-4 py-3 text-white-off outline-none transition-colors`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="contact-form-element">
                <label className="block text-silver-muted text-sm mb-2" htmlFor="phone">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-gold/20 focus:border-gold px-4 py-3 text-white-off outline-none transition-colors"
                  placeholder="Enter your phone"
                />
              </div>

              {/* Interest */}
              <div className="contact-form-element">
                <label className="block text-silver-muted text-sm mb-2" htmlFor="interest">
                  Area of Interest
                </label>
                <select
                  id="interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className={`w-full bg-gray-900/50 border ${errors.interest ? 'border-red-500' : 'border-gold/20 focus:border-gold'} px-4 py-3 text-white-off outline-none transition-colors`}
                >
                  <option value="">Select an interest</option>
                  {interests.map(interest => (
                    <option key={interest} value={interest}>{interest}</option>
                  ))}
                </select>
                {errors.interest && <p className="text-red-500 text-xs mt-1">{errors.interest}</p>}
              </div>

              {/* Message */}
              <div className="contact-form-element">
                <label className="block text-silver-muted text-sm mb-2" htmlFor="message">
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-gray-900/50 border border-gold/20 focus:border-gold px-4 py-3 text-white-off outline-none transition-colors resize-none"
                  placeholder="Tell us more about your requirements..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="contact-form-element w-full bg-gold text-black font-medium py-4 tracking-wider uppercase hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Inquiry'
                )}
              </motion.button>
            </form>
          </div>

          {/* Right - Info */}
          <div className="lg:pl-16">
            <motion.div
              className="h-full flex flex-col justify-center"
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {/* Decorative */}
              <div className="text-6xl text-gold/100 mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
                <div>UP16</div>
                <div className="text-3xl tracking-widest">PROPERTIES</div>
              </div>

              <h3
                className="text-2xl text-white-off mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Global Presence
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-gold text-sm uppercase tracking-wider mb-2">Headquarters</h4>
                  <p className="text-silver-muted">
                    432 Park Avenue<br />
                    New York, NY 10022<br />
                    United States
                  </p>
                </div>

                <div>
                  <h4 className="text-gold text-sm uppercase tracking-wider mb-2">Contact</h4>
                  <p className="text-silver-muted">
                    +1 (212) 555-0160<br />
                    inquiries@up16.properties
                  </p>
                </div>

                <div>
                  <h4 className="text-gold text-sm uppercase tracking-wider mb-2">Global Offices</h4>
                  <p className="text-silver-muted">
                    London • Dubai • Singapore<br />
                    Hong Kong • Los Angeles
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="mt-10 pt-10 border-t border-gold/20">
                <h4 className="text-gold text-sm uppercase tracking-wider mb-2">Concierge Hours</h4>
                <p className="text-silver-muted">
                  Available 24/7 for our private clients
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}