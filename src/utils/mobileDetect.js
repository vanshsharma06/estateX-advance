// Mobile device and performance detection utilities

/**
 * Check if the device is a mobile device
 */
export function isMobileDevice() {
  if (typeof window === 'undefined') return false

  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const isMobile = mobileRegex.test(navigator.userAgent)

  // Also check for small screens and touch devices
  const isSmallScreen = window.innerWidth < 768
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  return isMobile || (isSmallScreen && isTouchDevice)
}

/**
 * Check if the device is likely low-performance
 * This helps determine if we should disable heavy effects
 */
export function isLowPerformanceDevice() {
  if (typeof window === 'undefined') return false

  // Check for mobile devices
  if (isMobileDevice()) return true

  // Check for older devices by detecting hardware concurrency
  const cores = navigator.hardwareConcurrency || 2
  if (cores <= 4) return true

  // Check device memory if available (experimental)
  // Use bracket notation to avoid TypeScript syntax
  const nav = navigator
  const memory = nav.deviceMemory
  if (memory && memory <= 4) return true

  return false
}

/**
 * Get the recommended DPR (Device Pixel Ratio) based on device performance
 */
export function getRecommendedDPR() {
  if (isLowPerformanceDevice()) {
    return 1 // Lower DPR for mobile/low-performance devices
  }
  return Math.min(window.devicePixelRatio, 2) // Cap at 2 for desktop
}

/**
 * Check if post-processing should be enabled
 */
export function shouldEnablePostProcessing() {
  return !isLowPerformanceDevice()
}