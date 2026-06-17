import { useState, useEffect, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import LoadingScreen from './components/loading/LoadingScreen'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import HeroSection from './components/hero/HeroSection'
import CinematicFounderSection from './components/founders/CinematicFounderSection'
import ServicesSection from './components/services/ServicesSection'
import TimelineSection from './components/timeline/TimelineSection'
import TestimonialsSection from './components/testimonials/TestimonialsSection'
import StatsSection from './components/stats/StatsSection'
import ContactSection from './components/contact/ContactSection'
import Scene from './components/canvas/Scene'
import PropertiesPage from './pages/properties/PropertiesPage'
import PropertyDetailsPage from './pages/properties/PropertyDetailsPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import { AdminProvider, ProtectedAdminRoute } from './context/AdminContext'

gsap.registerPlugin(ScrollTrigger)

// Inner component that has access to Router context
function AppContent({ isLoading, setIsLoading }) {
  const location = useLocation()

  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin')

  // Clean up ScrollTriggers on route change
  useEffect(() => {
    // Kill all ScrollTriggers when route changes
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    ScrollTrigger.refresh()
  }, [location.pathname])

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  return (
    <div className="relative">
      {/* Loading Screen */}
      <LoadingScreen onComplete={handleLoadingComplete} />

      {/* Main Content */}
      <main className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Navigation - only show on public routes, not admin */}
        {!isAdminRoute && <Navbar />}

        {/* 3D Background Scene - behind everything */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: -1 }}
        >
          <Suspense fallback={<div style={{ background: '#050508' }} />}>
            <Scene />
          </Suspense>
        </div>

        {/* Routes */}
        <Routes>
          {/* Home Page */}
          <Route path="/" element={
            <>
              {/* Hero Section */}
              <section id="hero">
                <HeroSection />
              </section>

              {/* Transition Space - 100vh breathing room */}
              <div className="h-[30vh]" />

              {/* Cinematic Founders Section - Pinned */}
              <CinematicFounderSection />

              {/* Services Section */}
              <div id="services">
                <ServicesSection />
              </div>

              {/* Stats Section */}
              <StatsSection />

              {/* Timeline Section */}
              <div id="timeline">
                <TimelineSection />
              </div>

              {/* Testimonials Section */}
              <TestimonialsSection />

              {/* Contact Section */}
              <div id="contact">
                <ContactSection />
              </div>

              {/* Footer */}
              <Footer />
            </>
          } />

          {/* Properties Page */}
          <Route path="/properties" element={
            <>
              <PropertiesPage />
              <Footer />
            </>
          } />

          {/* Property Details Page */}
          <Route path="/property/:id" element={
            <>
              <PropertyDetailsPage />
              <Footer />
            </>
          } />

          {/* Contact Page */}
          <Route path="/contact" element={
            <>
              <ContactSection />
              <Footer />
            </>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardPage />
              </ProtectedAdminRoute>
            }
          />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false
    })

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    // Cleanup
    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
      // Clean up all ScrollTriggers on unmount
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      ScrollTrigger.refresh()
    }
  }, [])

  return (
    <Router>
      <AdminProvider>
        <AppContent isLoading={isLoading} setIsLoading={setIsLoading} />
      </AdminProvider>
    </Router>
  )
}

export default App