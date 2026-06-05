import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Timeline', href: '#timeline' }
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isPropertiesVisible, setIsPropertiesVisible] = useState(false)

  const logoRef = useRef(null)
  const propertiesRef = useRef(null)
  const propertiesLettersRef = useRef([])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 50)

      // Show "PROPERTIES" after scrolling 10-20% of viewport
      const triggerPoint = window.innerHeight * 0.15
      setIsPropertiesVisible(scrollY > triggerPoint)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // GSAP animation for "PROPERTIES" text
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isPropertiesVisible) {
        // Animate IN - "PROPERTIES" appears
        gsap.fromTo(propertiesRef.current,
          { opacity: 0, y: 10, filter: 'blur(10px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power3.out'
          }
        )

        // Letter-by-letter reveal for "PROPERTIES"
        gsap.fromTo(propertiesLettersRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: 'power3.out',
            delay: 0.2
          }
        )
      } else {
        // Animate OUT - "PROPERTIES" disappears
        gsap.to(propertiesRef.current, {
          opacity: 0,
          y: -10,
          filter: 'blur(5px)',
          duration: 0.6,
          ease: 'power3.in'
        })

        gsap.to(propertiesLettersRef.current, {
          opacity: 0,
          y: -10,
          duration: 0.4,
          stagger: 0.02,
          ease: 'power3.in'
        })
      }
    })

    return () => ctx.revert()
  }, [isPropertiesVisible])

  const scrollToSection = (href) => {
    // Don't scroll if it's a route path
    if (href.startsWith('/')) {
      setIsMobileMenuOpen(false)
      return
    }
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  const isRouteLink = (href) => href.startsWith('/')

  // Split "PROPERTIES" into letters for animation
  const propertiesText = "PROPERTIES"

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || isPropertiesVisible
          ? 'bg-black/95 backdrop-blur-md border-b border-gold/10'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Single line, premium luxury brand style */}
          <Link to="/" className="flex items-center gap-3 md:gap-4 cursor-pointer group">
            <motion.span
              ref={logoRef}
              className="gold-text text-2xl md:text-3xl font-bold tracking-[0.1em] whitespace-nowrap"
              style={{ fontFamily: 'var(--font-heading)' }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              UP16
            </motion.span>

            {/* PROPERTIES - Animated on scroll */}
            <motion.span
              ref={propertiesRef}
              className="text-gold/70 text-sm md:text-lg font-light tracking-[0.4em] whitespace-nowrap overflow-hidden"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {propertiesText.split('').map((letter, index) => (
                <span
                  key={index}
                  ref={el => propertiesLettersRef.current[index] = el}
                  className="inline-block"
                  style={{ opacity: 0 }}
                >
                  {letter}
                </span>
              ))}
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              isRouteLink(link.href) ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-silver-muted hover:text-gold transition-colors text-sm tracking-wider uppercase"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="text-silver-muted hover:text-gold transition-colors text-sm tracking-wider uppercase"
                >
                  {link.label}
                </button>
              )
            ))}

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/properties"
                className="bg-gold text-black px-6 py-2 text-sm tracking-wider uppercase hover:bg-gold-light transition-colors inline-block"
              >
                Properties
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="w-6 h-0.5 bg-gold"
              animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className="w-6 h-0.5 bg-gold"
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            />
            <motion.span
              className="w-6 h-0.5 bg-gold"
              animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-black/95 backdrop-blur-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-8 space-y-4">
              {navLinks.map(link => (
                isRouteLink(link.href) ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="block w-full text-left text-silver-muted hover:text-gold transition-colors text-lg py-2"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.href)}
                    className="block w-full text-left text-silver-muted hover:text-gold transition-colors text-lg py-2"
                  >
                    {link.label}
                  </button>
                )
              ))}
              <button
                onClick={() => scrollToSection('#contact')}
                className="block w-full text-left text-gold text-lg py-2"
              >
                Inquire Now →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}