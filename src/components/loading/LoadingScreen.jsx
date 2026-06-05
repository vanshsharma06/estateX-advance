import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsComplete(true), 500)
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        onComplete?.()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isComplete, onComplete])

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          {/* Logo Reveal */}
          <motion.div
            className="relative mb-16"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <h1 className="gold-text text-8xl font-bold tracking-[0.3em]" style={{ fontFamily: 'var(--font-heading)' }}>
              UP16
            </h1>
            <motion.div
              className="absolute -bottom-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="text-silver-muted text-lg tracking-[0.5em] uppercase mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Properties
          </motion.p>

          {/* Progress Bar */}
          <div className="w-64 h-px bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress Text */}
          <motion.p
            className="text-silver-muted text-xs mt-4 tracking-widest"
            key={progress}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
          >
            {progress}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}