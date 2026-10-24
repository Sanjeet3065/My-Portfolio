import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AppReadyContext } from './context/AppReadyContext'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { scrollToSection, scrollToTop } from './lib/scroll'
import { siteConfig } from './config/site'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { CustomCursor } from './components/layout/CustomCursor'
import { Preloader } from './components/layout/Preloader'
import Home from './pages/Home'

gsap.registerPlugin(ScrollTrigger)

const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const NotFound = lazy(() => import('./pages/NotFound'))

function RouteFallback() {
  return (
    <div className="flex min-h-[70svh] items-center justify-center pt-[76px]">
      <div className="relative grid h-16 w-16 place-items-center rounded-2xl border border-line/15 bg-surface/60">
        <span className="font-display text-sm font-semibold">{siteConfig.monogram}</span>
        <span className="absolute -right-1 -top-1 h-1.5 w-1.5 animate-pulse rounded-full bg-ember shadow-[0_0_12px_rgba(255,59,78,0.9)]" />
      </div>
    </div>
  )
}

export default function App() {
  const reduced = useReducedMotion()
  const location = useLocation()
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const handleReady = useCallback(() => setReady(true), [])

  useSmoothScroll(reduced)

  useEffect(() => {
    scrollToTop(true)
    if (location.hash) {
      navigate(`${location.pathname}${location.search}`, { replace: true })
    }
    // Initial load only: a reload always starts fresh at the top/home.
  }, [])

  useEffect(() => {
    if (!ready) return

    if (location.hash) {
      const id = location.hash.replace('#', '')
      const timer = window.setTimeout(() => scrollToSection(id), 380)
      return () => window.clearTimeout(timer)
    }

    scrollToTop(true)
  }, [location.pathname, location.hash, ready])

  useEffect(() => {
    if (!ready) return
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 700)
    return () => window.clearTimeout(timer)
  }, [ready, location.pathname])

  return (
    <AppReadyContext.Provider value={ready}>
      <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ember focus:px-5 focus:py-3 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-paper"
        >
          Skip to content
        </a>

        <Preloader onDone={handleReady} />
        <CustomCursor />
        <Navbar />

        <main id="main" key={location.pathname} tabIndex={-1} className="route-fade outline-none">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
    </AppReadyContext.Provider>
  )
}
