import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteConfig } from '../../config/site'
import { lockScroll, scrollToTop, unlockScroll } from '../../lib/scroll'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useSectionNavigation } from '../../hooks/useSectionNavigation'
import { useReducedMotion } from '../../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const SECTION_IDS = siteConfig.navigation.map((item) => item.id)

export function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const active = useActiveSection(SECTION_IDS)
  const { goToSection, goHome } = useSectionNavigation()
  const reduced = useReducedMotion()

  const visibilityRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const glassBgRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const pendingSection = useRef<string | null>(null)
  const onHome = location.pathname === '/'

  // GSAP ScrollTrigger: Scroll-Linked Scrub Animation ending at Technology Marquee + Separate Directional Hide/Reveal
  useEffect(() => {
    if (!pillRef.current || !visibilityRef.current) return

    const isMobile = window.innerWidth < 640
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1280
    const targetWidth = isMobile ? 'calc(100% - 20px)' : isTablet ? '90%' : '88%'
    const targetMaxWidth = isMobile ? '100%' : '1240px'
    const targetMarginTop = isMobile ? '10px' : '14px'
    const targetPaddingX = isMobile ? '16px' : isTablet ? '22px' : '28px'

    const ctx = gsap.context(() => {
      const homeSection = document.getElementById('home')
      const marqueeSection = document.getElementById('skills-marquee')

      if (homeSection && !reduced) {
        // 1. Slow, scroll-linked scrub animation synchronized from Home top until Technology Marquee reaches designated position
        const endTriggerEl = marqueeSection || homeSection

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: homeSection,
            endTrigger: endTriggerEl,
            start: 'top top',
            end: 'top 80px', // Reaches 100% compact floating pill when the Technology Marquee reaches under the navbar
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        })

        // Interpolate container shape & geometry
        tl.fromTo(
          pillRef.current,
          {
            width: '100%',
            maxWidth: '100%',
            borderRadius: '0px',
            marginTop: '0px',
            height: '76px',
            paddingLeft: isMobile ? '16px' : '32px',
            paddingRight: isMobile ? '16px' : '32px',
          },
          {
            width: targetWidth,
            maxWidth: targetMaxWidth,
            borderRadius: '9999px',
            marginTop: targetMarginTop,
            height: '66px',
            paddingLeft: targetPaddingX,
            paddingRight: targetPaddingX,
            ease: 'none',
          },
          0
        )

        // Interpolate jelly glass opacity on dedicated background layer
        if (glassBgRef.current) {
          tl.fromTo(
            glassBgRef.current,
            { opacity: 0 },
            { opacity: 1, ease: 'none' },
            0
          )
        }

        // 2. Separate Directional Hide/Reveal strictly AFTER the Technology Marquee threshold
        let lastScrollY = window.scrollY
        let isHidden = false

        const getThreshold = () => {
          if (marqueeSection) {
            return marqueeSection.offsetTop - 85
          }
          return homeSection.offsetTop + homeSection.offsetHeight - 85
        }

        const handleScroll = () => {
          if (!visibilityRef.current) return
          const currentScrollY = window.scrollY
          const threshold = getThreshold()

          // While inside the Home / shrink range: ALWAYS fully visible
          if (currentScrollY <= threshold) {
            if (isHidden) {
              gsap.to(visibilityRef.current, {
                yPercent: 0,
                opacity: 1,
                duration: 0.35,
                ease: 'power3.out',
                overwrite: 'auto',
              })
              isHidden = false
            }
            lastScrollY = currentScrollY
            return
          }

          // Past the Technology Marquee threshold: hide on downward scroll, reveal on upward scroll
          const delta = currentScrollY - lastScrollY
          const SCROLL_TOLERANCE = 6

          if (Math.abs(delta) > SCROLL_TOLERANCE) {
            if (delta > 0 && !isHidden) {
              // Scrolling down -> smoothly slide upward and hide (350-500ms)
              gsap.to(visibilityRef.current, {
                yPercent: -140,
                opacity: 0,
                duration: 0.42,
                ease: 'power3.inOut',
                overwrite: 'auto',
              })
              isHidden = true
            } else if (delta < 0 && isHidden) {
              // Scrolling up -> smoothly slide down and reveal compact floating jelly glass
              gsap.to(visibilityRef.current, {
                yPercent: 0,
                opacity: 1,
                duration: 0.35,
                ease: 'power3.out',
                overwrite: 'auto',
              })
              isHidden = false
            }
            lastScrollY = currentScrollY
          }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
      } else {
        // Fallback for subpages or reduced motion preferences
        const isScrolled = window.scrollY > 30
        gsap.set(pillRef.current, {
          width: isScrolled ? targetWidth : '100%',
          maxWidth: isScrolled ? targetMaxWidth : '100%',
          borderRadius: isScrolled ? '9999px' : '0px',
          marginTop: isScrolled ? targetMarginTop : '0px',
          height: isScrolled ? '66px' : '76px',
          paddingLeft: isScrolled ? targetPaddingX : (isMobile ? '16px' : '32px'),
          paddingRight: isScrolled ? targetPaddingX : (isMobile ? '16px' : '32px'),
        })
        if (glassBgRef.current) {
          gsap.set(glassBgRef.current, {
            opacity: isScrolled ? 1 : 0,
          })
        }
      }
    })

    const handleResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      ctx.revert()
    }
  }, [location.pathname, reduced])

  // Sync mobile menu open state
  useEffect(() => {
    if (open && visibilityRef.current) {
      gsap.to(visibilityRef.current, {
        yPercent: 0,
        opacity: 1,
        duration: 0.25,
        ease: 'power3.out',
        overwrite: 'auto',
      })
      if (pillRef.current) {
        gsap.to(pillRef.current, {
          width: '100%',
          maxWidth: '100%',
          borderRadius: '0px',
          marginTop: '0px',
          height: '76px',
          duration: 0.25,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }
      if (glassBgRef.current) {
        gsap.to(glassBgRef.current, {
          opacity: 1,
          duration: 0.25,
          overwrite: 'auto',
        })
      }
    }
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!open) return

    lockScroll()
    const main = document.getElementById('main')
    const footer = document.getElementById('site-footer')
    main?.setAttribute('inert', '')
    footer?.setAttribute('inert', '')
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      unlockScroll()
      main?.removeAttribute('inert')
      footer?.removeAttribute('inert')
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (open || !pendingSection.current) return
    const id = pendingSection.current
    pendingSection.current = null
    goToSection(id)
  }, [open, goToSection])

  const handleSection = (id: string) => {
    if (open) {
      pendingSection.current = id
      setOpen(false)
    } else {
      goToSection(id)
    }
  }

  const handleLogo = () => {
    setOpen(false)
    goHome()
  }

  const handleFocusCapture = () => {
    if (visibilityRef.current) {
      gsap.to(visibilityRef.current, {
        yPercent: 0,
        opacity: 1,
        duration: 0.3,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }
  }

  const linkClasses = (id: string) =>
    `relative inline-flex min-h-[38px] items-center px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-200 select-none ${
      onHome && active === id
        ? 'text-[#FFFFFF] font-semibold drop-shadow-[0_1px_8px_rgba(255,255,255,0.25)]'
        : 'text-[#D4D0DA] hover:text-[#FF455F] font-medium'
    }`

  return (
    <>
      {/* Outer Visibility / Directional Slide Wrapper (translates yPercent -140% to 0%) */}
      <header
        ref={visibilityRef}
        onFocusCapture={handleFocusCapture}
        className="fixed inset-x-0 top-0 z-[90] flex justify-center pointer-events-none transform-gpu will-change-transform"
      >
        {/* Scroll-Linked Floating Capsule Pill (Scrubbed by GSAP ScrollTrigger from Home top to Technology Marquee) */}
        <div
          ref={pillRef}
          className="pointer-events-auto relative flex items-center justify-between will-change-[width,border-radius,margin-top,height,padding]"
          style={{
            width: '100%',
            maxWidth: '100%',
            borderRadius: '0px',
            marginTop: '0px',
            height: '76px',
          }}
        >
          {/* Dedicated Red-Purple Jelly Glass Background Layer */}
          <div
            ref={glassBgRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] border transition-opacity duration-300"
            style={{
              opacity: 0,
              background:
                'linear-gradient(135deg, rgba(11, 10, 16, 0.82) 0%, rgba(71, 23, 37, 0.45) 35%, rgba(56, 32, 68, 0.40) 70%, rgba(11, 10, 16, 0.85) 100%)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              borderColor: 'rgba(255, 75, 95, 0.18)',
              boxShadow:
                'inset 0 1px 1px 0 rgba(255, 255, 255, 0.18), inset 0 0 20px 0 rgba(71, 23, 37, 0.22), inset 0 -1px 1px 0 rgba(165, 115, 200, 0.15), 0 16px 40px -10px rgba(8, 6, 12, 0.65), 0 0 25px 0 rgba(255, 59, 85, 0.08)',
            }}
          />

          {/* Micro Specular Upper Rim Highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-[1px] -z-10 rounded-full opacity-60 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.35)] to-transparent"
          />

          {/* Monogram Logo & Brand Name */}
          <button
            onClick={handleLogo}
            className="group relative z-10 flex items-center gap-3 text-left shrink-0"
            aria-label={`${siteConfig.name} — home`}
          >
            <span className="relative grid h-10 w-10 place-items-center rounded-lg border border-line/20 bg-surface/80 font-display text-sm font-semibold text-[#F5F3F7] transition-all duration-300 group-hover:border-ember/60 group-hover:shadow-[0_0_12px_rgba(255,59,78,0.35)]">
              {siteConfig.monogram}
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_10px_rgba(255,59,78,0.95)]" />
            </span>
            <span className="hidden font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.2em] sm:block">
              <span className="text-[#F5F3F7] font-medium">{siteConfig.firstName}</span>{' '}
              <span className="text-white font-semibold">{siteConfig.lastName}</span>
            </span>
          </button>

          {/* Desktop Navigation Links (Razor-sharp foreground with accessible contrast) */}
          <nav className="relative z-10 hidden items-center gap-0.5 xl:flex" aria-label="Primary">
            {siteConfig.navigation.map((item) => (
              <a
                key={item.id}
                href={`/#${item.id}`}
                onClick={(event) => {
                  event.preventDefault()
                  handleSection(item.id)
                }}
                aria-current={onHome && active === item.id ? 'page' : undefined}
                className={linkClasses(item.id)}
              >
                {item.label}
                <span
                  className={`absolute bottom-0.5 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-ember shadow-[0_0_10px_rgba(255,59,78,1)] transition-all duration-300 ${
                    onHome && active === item.id ? 'w-3.5 opacity-100' : 'w-0 opacity-0'
                  }`}
                />
              </a>
            ))}
          </nav>

          {/* Right Action / Contact Button & Mobile Hamburger */}
          <div className="relative z-10 flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleSection('contact')}
              className="group hidden min-h-[38px] items-center gap-2 rounded-full border border-line/20 bg-surface/50 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white transition-all duration-300 hover:border-ember/60 hover:bg-ember/10 hover:text-white hover:shadow-[0_0_16px_rgba(255,59,78,0.25)] sm:inline-flex"
            >
              <span>Let&apos;s talk</span>
              <ArrowUpRight className="h-3 w-3 text-[#D4D0DA] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember" />
            </button>

            <button
              ref={menuButtonRef}
              onClick={() => setOpen((current) => !current)}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-line/20 bg-surface/50 text-white transition-colors hover:border-ember/50 hover:text-ember xl:hidden"
              aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer (Rendered as sibling to preserve viewport positioning) */}
      {open ? (
        <div
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="menu-overlay fixed inset-x-0 bottom-0 top-[76px] z-[85] overflow-y-auto overscroll-contain bg-ink/95 backdrop-blur-2xl xl:hidden"
          data-lenis-prevent
        >
          <div className="shell flex min-h-[calc(100dvh-76px)] flex-col justify-between pb-10 pt-8">
            <nav aria-label="Mobile primary" className="flex flex-col">
              {siteConfig.navigation.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleSection(item.id)}
                  className="menu-link group flex items-center justify-between border-b border-line/10 py-2.5 sm:py-3 text-left"
                  style={{ animationDelay: `${80 + index * 45}ms` }}
                >
                  <span className="flex items-baseline gap-3.5 sm:gap-4">
                    <span className="font-mono text-[9px] tracking-[0.2em] text-muted">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-2xl tracking-tight text-paper transition-colors duration-300 group-hover:text-ember sm:text-3xl">
                      {item.label}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted transition-colors group-hover:text-ember" />
                </button>
              ))}
            </nav>

            <div className="mt-8 flex flex-col gap-5">
              {siteConfig.availability.available ? (
                <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-ember/25 bg-ember/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ember sm:text-[9px] sm:tracking-[0.16em]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="pulse-ember absolute inset-0 rounded-full" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-ember" />
                  </span>
                  {siteConfig.availability.label}
                </span>
              ) : null}
              <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted sm:gap-4 sm:text-[9px] sm:tracking-[0.18em]">
                <span className="min-w-0">{siteConfig.degree}</span>
                <button
                  onClick={() => {
                    setOpen(false)
                    scrollToTop()
                  }}
                  className="inline-flex min-h-[40px] shrink-0 items-center whitespace-nowrap text-paper/70 hover:text-ember"
                >
                  Back to top
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
