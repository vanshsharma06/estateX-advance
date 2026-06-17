import { Component } from 'react'

/**
 * Error boundary to prevent Three.js crashes from breaking the entire application
 * If Scene fails, the app continues to work normally
 */
export default class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[SceneErrorBoundary] Scene crashed:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Render nothing - the main app content will be visible behind
      console.log('[SceneErrorBoundary] Rendering fallback - Scene crashed')
      return null
    }

    return this.props.children
  }
}