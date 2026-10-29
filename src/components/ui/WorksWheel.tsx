import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react'
import type { ProjectStatus, ArtworkVariant } from '../../types'
import { ProjectArtwork } from '../projects/ProjectArtwork'
import { scrollToTop } from '../../lib/scroll'

export interface WorksWheelItem {
  id: string
  slug: string
  title: string
  category: string
  number: string
  year: string
  status: ProjectStatus
  tagline?: string
  summary?: string
  href: string
  image?: string
  imageAlt?: string
  artwork?: ArtworkVariant
  accent?: 'violet' | 'cyan' | 'ember'
}

export interface WorksWheelProps {
  items: WorksWheelItem[]
  label?: string
  action?: string
  className?: string
  initialIndex?: number
  onActiveChange?: (index: number) => void
}

// 21st.dev Works-Wheel mathematical constants
const AY = 0.38 // Card height fraction relative to container height
const ZY = 0.34 // Card width fraction relative to container width
const YD = 1.45 // Card aspect ratio (cardW / cardH)
const STEP_DEG = 40 // Degrees of rotation per item on the 3D drum
const DRUM_R_FACTOR = 2.22 // Drum radius relative to cardH
const DEPTH_FACTOR = 2.7 // Perspective depth relative to cardH
const RING_R_FACTOR = 1.14 // Planar ring radius relative to cardH
const BOW_FACTOR = 1.82 // Gentle cylindrical bow curve factor
const TITLE_FONT_FACTOR = 0.124 // Title font size relative to cardH
const INDEX_FONT_FACTOR = 0.042 // List index font size relative to cardH
const OPACITY_CUTOFF = 1.6 // Fade out items further than ~1.6 cards from the front
const WHEEL_SENSITIVITY = 850 // Wheel delta divisor
const DRAG_SENSITIVITY = 380 // Pointer drag delta divisor
const SNAP_TIMEOUT_MS = 140 // Snap timeout after wheel ends
const LERP_FACTOR = 0.12 // Inertial smoothing factor

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const rad = (deg: number) => (deg * Math.PI) / 180
const bowAt = (deg: number, bow: number) => -bow * (1 - Math.cos(rad(deg)))

function calculateTransform(
  degZ: number,
  degX: number,
  ringR: number,
  drumR: number,
  bow: number,
  progress: number,
) {
  return `translateX(${progress * bowAt(degX, bow)}px) rotateZ(${(1 - progress) * degZ}deg) translateY(${-(1 - progress) * ringR}px) rotateX(${progress * degX}deg) translateZ(${progress * drumR}px)`
}

export function WorksWheel({
  items,
  label = 'ALL PROJECTS',
  action = 'View Case Study',
  className = '',
  initialIndex = 0,
  onActiveChange,
}: WorksWheelProps) {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const drumRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLElement | null)[]>([])
  const centerLabelRef = useRef<HTMLDivElement>(null)
  const activeTitleRef = useRef<HTMLDivElement>(null)

  // Motion positions: W = target scroll, q = smoothed interpolated scroll
  const currentScroll = useRef(0)
  const targetScroll = useRef(0)

  // Drag interaction tracking
  const pointerStart = useRef<number | null>(null)
  const dragStartPos = useRef<{ x: number; y: number } | null>(null)
  const isDragging = useRef(false)
  const snapTimer = useRef<number>(0)

  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)

  const count = items.length
  const maxScroll = Math.max(count - 1, 0)

  // Detect reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReducedMotion(mq.matches)
    updateMotion()
    mq.addEventListener('change', updateMotion)
    return () => mq.removeEventListener('change', updateMotion)
  }, [])

  // Track container dimensions with ResizeObserver
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const updateSize = () => {
      setSize({
        w: el.clientWidth,
        h: el.clientHeight,
      })
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Geometry calculations
  const geometry = useMemo(() => {
    const { w, h } = size
    if (!w || !h) {
      return {
        cardW: 360,
        cardH: 248,
        ringR: 280,
        ringScale: 0.8,
        drumR: 550,
        bow: 450,
        depth: 670,
        titleSize: 32,
        indexSize: 13,
      }
    }

    const isMobile = w < 640
    const isTablet = w >= 640 && w < 1024

    const actualZy = isMobile ? 0.72 : isTablet ? 0.46 : ZY
    const actualAy = isMobile ? 0.46 : isTablet ? 0.42 : AY

    const cardW = Math.min(h * actualAy * YD, w * actualZy)
    const cardH = cardW / YD
    const drumR = cardH * DRUM_R_FACTOR
    const ringR = cardH * RING_R_FACTOR
    const ringScale = count
      ? clamp(((2 * Math.PI * ringR) / count) * 0.82 / (cardW || 1), 0.16, 1)
      : 1

    return {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW_FACTOR,
      depth: cardH * DEPTH_FACTOR,
      titleSize: Math.max(cardH * TITLE_FONT_FACTOR, 20),
      indexSize: Math.max(cardH * INDEX_FONT_FACTOR, 11),
    }
  }, [size, count])

  // Scroll position setter with bounds
  const setTarget = useCallback(
    (target: number) => {
      targetScroll.current = clamp(target, 0, maxScroll + 1)
    },
    [maxScroll],
  )

  // Animation frame loop
  useEffect(() => {
    if (!size.h) return

    let rafId = 0
    const { ringR, ringScale, drumR, bow } = geometry

    const tick = () => {
      rafId = requestAnimationFrame(tick)

      const diff = targetScroll.current - currentScroll.current
      if (Math.abs(diff) < 0.0004) {
        currentScroll.current = targetScroll.current
      } else {
        currentScroll.current += diff * (reducedMotion ? 1 : LERP_FACTOR)
      }

      const S = currentScroll.current
      const progress = clamp(S, 0, 1)
      const offset = Math.max(0, S - 1)

      // Transform inner rotating 3D cylinder
      if (drumRef.current) {
        drumRef.current.style.transform = `translateZ(${-progress * drumR}px)`
      }

      // Transform individual item cards
      for (let i = 0; i < count; i++) {
        const itemOffset = i - offset
        const degX = itemOffset * STEP_DEG
        const degZ = itemOffset * (360 / count)
        const el = itemRefs.current[i]

        if (el) {
          el.style.transform = calculateTransform(
            degZ,
            degX,
            ringR,
            drumR,
            bow,
            progress,
          )

          // Smooth opacity fading for cards behind the cylinder
          const isFar = progress > 0.5 && Math.abs(itemOffset) > OPACITY_CUTOFF
          el.style.opacity = isFar ? '0' : '1'
          el.style.pointerEvents = isFar ? 'none' : 'auto'
          el.style.zIndex = String(Math.round(100 - Math.abs(itemOffset) * 2))

          const child = el.firstElementChild as HTMLElement | null
          if (child) {
            child.style.transform = `scale(${lerp(ringScale, 1, progress)})`
          }
        }
      }

      // Smoothly cross-fade center label and active title HUD
      if (centerLabelRef.current) {
        centerLabelRef.current.style.opacity = String(1 - progress)
      }
      if (activeTitleRef.current) {
        activeTitleRef.current.style.opacity = String(progress)
      }

      const newActive = clamp(Math.round(offset), 0, maxScroll)
      setActiveIndex((prev) => {
        if (prev !== newActive) {
          onActiveChange?.(newActive)
          return newActive
        }
        return prev
      })
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [geometry, size.h, count, maxScroll, reducedMotion, onActiveChange])

  // Mouse wheel listener
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      // Prevent default page scrolling when wheeling inside active WorksWheel
      const next = targetScroll.current + e.deltaY / WHEEL_SENSITIVITY
      if (next > 0 && next < maxScroll + 1) {
        e.preventDefault()
      }
      setTarget(next)

      window.clearTimeout(snapTimer.current)
      snapTimer.current = window.setTimeout(() => {
        if (targetScroll.current > 0.5) {
          setTarget(Math.round(targetScroll.current))
        } else {
          setTarget(0)
        }
      }, SNAP_TIMEOUT_MS)
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', handleWheel)
      window.clearTimeout(snapTimer.current)
    }
  }, [setTarget, maxScroll])

  // Pointer drag gesture handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStart.current = e.clientY
    dragStartPos.current = { x: e.clientX, y: e.clientY }
    isDragging.current = false
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current !== null) {
      if (dragStartPos.current) {
        const dist = Math.hypot(
          e.clientX - dragStartPos.current.x,
          e.clientY - dragStartPos.current.y,
        )
        if (dist > 6) {
          isDragging.current = true
        }
      }
      const diff = pointerStart.current - e.clientY
      setTarget(targetScroll.current + diff / DRAG_SENSITIVITY)
      pointerStart.current = e.clientY
    }
  }

  const handlePointerUp = () => {
    pointerStart.current = null
    dragStartPos.current = null
    if (targetScroll.current > 0.5) {
      setTarget(Math.round(targetScroll.current))
    } else {
      setTarget(0)
    }
    // Prevent accidental click triggering right after drag release
    window.setTimeout(() => {
      isDragging.current = false
    }, 60)
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      setTarget(Math.round(targetScroll.current) + 1)
      e.preventDefault()
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      setTarget(Math.round(targetScroll.current) - 1)
      e.preventDefault()
    } else if (e.key === 'Home') {
      setTarget(0)
      e.preventDefault()
    } else if (e.key === 'End') {
      setTarget(maxScroll + 1)
      e.preventDefault()
    }
  }

  const handleCardClick = (
    e: React.MouseEvent,
    item: WorksWheelItem,
    index: number,
  ) => {
    if (isDragging.current) {
      e.preventDefault()
      return
    }

    // If clicking an inactive card while in 3D drum mode, spin it to front
    const currentActive = clamp(Math.round(Math.max(0, targetScroll.current - 1)), 0, maxScroll)
    if (targetScroll.current > 0.5 && currentActive !== index) {
      e.preventDefault()
      setTarget(index + 1)
      return
    }

    // Navigate to project detail page
    e.preventDefault()
    window.scrollTo(0, 0)
    scrollToTop(true)
    navigate(item.href)
  }

  const activeProject = items[activeIndex]

  return (
    <section
      aria-label={label}
      className={`relative h-[650px] sm:h-[720px] lg:h-[780px] w-full select-none overflow-hidden rounded-3xl border border-line/15 bg-gradient-to-b from-surface/40 via-surface/20 to-ink/90 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl ${className}`}
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-ember/10 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-ink via-ink/60 to-transparent" />

      {/* Interactive 3D Viewport */}
      <div
        ref={containerRef}
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`works-wheel-${activeIndex}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        style={{ perspective: `${geometry.depth}px` }}
        className="absolute inset-0 cursor-grab touch-pan-y outline-none focus-visible:ring-1 focus-visible:ring-ember/50 active:cursor-grabbing"
      >
        {/* Rotating 3D Drum Container */}
        <div
          ref={drumRef}
          className="absolute left-1/2 top-1/2 [transform-style:preserve-3d] will-change-transform"
        >
          {items.map((item, index) => {
            const isSelected = index === activeIndex

            return (
              <div
                key={item.slug}
                id={`works-wheel-${index}`}
                role="option"
                aria-selected={isSelected}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                onClick={(e) => handleCardClick(e, item, index)}
                className="group absolute cursor-pointer [backface-visibility:hidden] will-change-transform"
                style={{
                  width: geometry.cardW,
                  height: geometry.cardH,
                  marginLeft: -geometry.cardW / 2,
                  marginTop: -geometry.cardH / 2,
                }}
              >
                {/* Scaled Card Box */}
                <div className="relative block h-full w-full overflow-hidden rounded-2xl border border-line/20 bg-surface/90 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9),0_0_40px_-10px_rgba(255,59,78,0.2)] transition-all duration-300 group-hover:border-ember/60 group-hover:shadow-[0_0_50px_-5px_rgba(255,59,78,0.45)]">
                  {/* Artwork / Image Container */}
                  <div className="relative h-full w-full overflow-hidden bg-ink">
                    {item.image ? (
                      <picture>
                        <source
                          srcSet={item.image.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
                          type="image/webp"
                        />
                        <img
                          src={item.image}
                          alt={item.imageAlt ?? `${item.title} project visual`}
                          draggable={false}
                          className="h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                        />
                      </picture>
                    ) : (
                      <ProjectArtwork
                        variant={item.artwork ?? 'grid'}
                        accent={item.accent ?? 'ember'}
                        label={`Artwork for ${item.title}`}
                        className="h-full w-full transition-transform duration-700 ease-editorial group-hover:scale-105"
                      />
                    )}

                    {/* Gradient Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />

                    {/* Card Top Badges */}
                    <div className="absolute inset-x-3.5 top-3.5 flex items-center justify-between sm:inset-x-4 sm:top-4">
                      <span className="rounded-full border border-white/10 bg-ink/75 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/90 backdrop-blur-md">
                        {item.number}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[8.5px] uppercase tracking-[0.12em] backdrop-blur-md ${
                          item.status === 'Completed'
                            ? 'border-line/20 bg-ink/75 text-paper/80'
                            : item.status === 'In Development'
                              ? 'border-accent/40 bg-ink/75 text-accent'
                              : 'border-line/15 bg-ink/75 text-muted'
                        }`}
                      >
                        <span
                          className={`h-1 w-1 rounded-full ${
                            item.status === 'Completed'
                              ? 'bg-paper/70'
                              : item.status === 'In Development'
                                ? 'bg-accent shadow-[0_0_6px_rgba(56,189,248,0.8)]'
                                : 'bg-muted'
                          }`}
                        />
                        {item.status}
                      </span>
                    </div>

                    {/* Card Bottom Content */}
                    <div className="absolute inset-x-3.5 bottom-3.5 flex flex-col gap-1 sm:inset-x-4 sm:bottom-4">
                      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                        {item.category}
                      </div>
                      <h3 className="display text-lg font-bold leading-tight text-paper transition-colors duration-300 group-hover:text-ember sm:text-xl">
                        {item.title}
                      </h3>
                    </div>

                    {/* Hover Floating Action Pill */}
                    <div className="pointer-events-none absolute bottom-3.5 right-3.5 flex translate-y-1.5 items-center gap-1.5 rounded-full border border-ember/40 bg-ink/85 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ember opacity-0 shadow-[0_0_20px_rgba(255,59,78,0.4)] backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:bottom-4 sm:right-4">
                      <span>{action}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* State A: Center Planar Ring Title (Visible when progress = 0) */}
      <div
        ref={centerLabelRef}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-300"
      >
        <div className="rounded-full border border-line/20 bg-surface/60 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ember backdrop-blur-md">
          Interactive 3D Carousel
        </div>
        <h2
          className="display mt-3 font-bold tracking-tight text-paper drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
          style={{ fontSize: geometry.titleSize * 1.25 }}
        >
          {label}
        </h2>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Scroll or drag to rotate wheel
        </p>
      </div>

      {/* State B: Active Project HUD on Left (Fades in as wheel rotates) */}
      <div
        ref={activeTitleRef}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 max-w-[280px] sm:left-8 sm:max-w-sm lg:left-12 lg:max-w-md opacity-0 transition-opacity duration-300"
      >
        {activeProject && (
          <div className="rounded-2xl border border-line/15 bg-ink/75 p-5 backdrop-blur-xl sm:p-7 shadow-[0_16px_50px_rgba(0,0,0,0.7)]">
            <div className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.18em] text-ember">
              <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_8px_rgba(255,59,78,0.9)]" />
              <span>Project / {activeProject.number}</span>
              <span className="text-line/40">·</span>
              <span className="text-muted">{activeProject.year}</span>
            </div>

            <h2 className="display mt-2 text-2xl font-bold tracking-tight text-paper sm:text-3xl lg:text-4xl">
              {activeProject.title}
            </h2>

            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              {activeProject.category}
            </div>

            {activeProject.tagline && (
              <p className="mt-3 font-display text-sm leading-snug text-paper/85 sm:text-base line-clamp-2">
                {activeProject.tagline}
              </p>
            )}

            <div className="pointer-events-auto mt-5">
              <button
                type="button"
                onClick={(e) => handleCardClick(e, activeProject, activeIndex)}
                className="group inline-flex items-center gap-2 rounded-full border border-ember/50 bg-ember px-5 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink font-medium shadow-[0_0_25px_-5px_rgba(255,59,78,0.6)] transition-all duration-300 hover:bg-paper hover:border-paper hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
              >
                <span>Open Case Study</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Index List: Clickable project selector */}
      <div className="absolute right-3.5 top-6 sm:right-6 lg:right-10 flex flex-col items-end">
        <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-muted/60">
          Index ({String(count).padStart(2, '0')})
        </div>
        <ol className="flex flex-col items-end gap-1.5 text-right font-mono" style={{ fontSize: geometry.indexSize }}>
          {items.map((item, index) => {
            const isSelected = index === activeIndex
            return (
              <li key={item.slug}>
                <button
                  type="button"
                  onClick={() => setTarget(index + 1)}
                  className={`cursor-pointer rounded-md px-2.5 py-1 text-right font-mono transition-all duration-300 ${
                    isSelected
                      ? 'border border-ember/40 bg-ember/15 text-ember shadow-[0_0_16px_rgba(255,59,78,0.3)] font-medium'
                      : 'text-muted hover:text-paper hover:bg-surface/50'
                  }`}
                >
                  <span className="mr-1.5 opacity-60">{item.number}</span>
                  <span>{item.title}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Quick Wheel Navigation Controls (Bottom Right) */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTarget(Math.max(0, targetScroll.current - 1))}
          aria-label="Previous project in wheel"
          className="grid h-8 w-8 place-items-center rounded-full border border-line/20 bg-surface/70 text-muted backdrop-blur-md transition-all duration-300 hover:border-ember/50 hover:bg-ember hover:text-ink shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
        >
          <ChevronUp className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setTarget(Math.min(maxScroll + 1, targetScroll.current + 1))}
          aria-label="Next project in wheel"
          className="grid h-8 w-8 place-items-center rounded-full border border-line/20 bg-surface/70 text-muted backdrop-blur-md transition-all duration-300 hover:border-ember/50 hover:bg-ember hover:text-ink shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
        >
          <ChevronDown className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setTarget(0)}
          aria-label="Reset wheel to overview ring"
          title="Reset to Overview Ring"
          className="grid h-8 w-8 place-items-center rounded-full border border-line/20 bg-surface/70 text-muted backdrop-blur-md transition-all duration-300 hover:border-ember/50 hover:bg-surface hover:text-ember shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Bottom Center Interaction Guide */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-line/15 bg-ink/75 px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted backdrop-blur-md">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" />
        <span>Scroll or drag vertically · Click card for details</span>
      </div>
    </section>
  )
}
