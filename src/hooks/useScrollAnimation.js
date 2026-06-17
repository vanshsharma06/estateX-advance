import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollAnimation(options = {}) {
  const {
    animation = { opacity: 1, y: 0 },
    initial = { opacity: 0, y: 50 },
    duration = 1,
    ease = 'power3.out',
    trigger = 'top 70%',
    toggleActions = 'play none none reverse',
    scrub = false
  } = options

  const ref = useRef(null)
  const scrollTriggerRef = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Create the animation with ScrollTrigger
    gsap.fromTo(
      element,
      initial,
      {
        ...animation,
        duration,
        ease,
        scrollTrigger: {
          trigger: element,
          start: trigger,
          toggleActions,
          scrub
        }
      }
    )

    // Store reference for cleanup
    scrollTriggerRef.current = element

    // Cleanup function - CRITICAL for preventing memory leaks and removeChild errors
    return () => {
      if (scrollTriggerRef.current) {
        // Kill any ScrollTriggers associated with this element
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === scrollTriggerRef.current) {
            st.kill()
          }
        })
        // Clear the reference
        scrollTriggerRef.current = null
      }
    }
  }, [animation, initial, duration, ease, trigger, toggleActions, scrub])

  return ref
}

export function useStaggerAnimation(items, options = {}) {
  const {
    animation = { opacity: 1, y: 0 },
    initial = { opacity: 0, y: 30 },
    duration = 0.8,
    ease = 'power3.out',
    stagger = 0.1,
    trigger = 'top 70%',
    toggleActions = 'play none none reverse'
  } = options

  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    gsap.fromTo(
      element.querySelectorAll('.stagger-item') || element.children,
      initial,
      {
        ...animation,
        duration,
        ease,
        stagger,
        scrollTrigger: {
          trigger: element,
          start: trigger,
          toggleActions
        }
      }
    )

    // Cleanup
    return () => {
      // Kill ScrollTriggers for this element
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === element) {
          st.kill()
        }
      })
    }
  }, [animation, initial, duration, ease, stagger, trigger, toggleActions])

  return ref
}

export function useParallax(speed = 0.5) {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    gsap.to(element, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === element) {
          st.kill()
        }
      })
    }
  }, [speed])

  return ref
}