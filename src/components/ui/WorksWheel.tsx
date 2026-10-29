import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowUpRight,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  MousePointer,
  ArrowDown,
} from 'lucide-react'
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
  onScrollPageDown?: () => void
}

// Proportional geometry constants calibrated for standard viewports
const STEP_DEG = 40 // Degrees of rotation per item on 3D drum
const DRUM_R_FACTOR = 2.1 // Drum radius relative to cardH
const DEPTH_FACTOR = 2.6 // Perspective depth relative to cardH
const RING_R_FACTOR = 1.15 // Planar ring radius relative to cardH
const BOW_FACTOR = 1.6 // Gentle bow curvature
const OPACITY_CUTOFF = 1.6 // Fade out cards behind the cylinder
const WHEEL_SENSITIVITY = 260 // Highly responsive wheel delta divisor (was sluggish 850)
const DRAG_SENSITIVITY = 300 // Pointer drag sensitivity divisor
const SNAP_TIMEOUT_MS = 150 // Snap timeout after scroll ends
const LERP_FACTOR = 0.14 // Inertial smoothing factor

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
  onScrollPageDown,
}: WorksWheelProps) {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const drumRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLElement | null)[]>([])
  const centerLabelRef = useRef<HTMLDivElement>(null)
  const activeTitleRef = useRef<HTMLDivElement>(null)

  // Motion positions: currentScroll lerps smoothly towards targetScroll
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

  // Screen-calibrated geometry: ensures the entire ring fits inside container without clipping
  const geometry = useMemo(() => {
    const { w, h } = size
    if (!w || !h) {
      return {
        cardW: 220,
        cardH: 152,
        ringR: 175,
        ringScale: 0.8,
        drumR: 320,
        bow: 240,
        depth: 395,
        titleSize: 22,
        indexSize: 11,
      }
    }

    const isMobile = w < 640
    const isTablet = w >= 640 && w < 1024

    // Keep generous 60-70px padding so ring never clips at top or bottom borders
    const verticalPadding = isMobile ? 50 : 70
    const usableH = Math.max(h - verticalPadding, 220)
    const maxRadius = usableH / 2

    // Ring top edge = ringR + cardH/2 = cardH * 1.65.
    // By bounding cardH to maxRadius / 1.65, ring height is guaranteed to stay within usableH!
    let cardH = Math.min(maxRadius / 1.65, isMobile ? 115 : isTablet ? 135 : 150)
    let cardW = cardH * 1.45

    // Horizontal containment
    const maxCardW = isMobile ? w * 0.58 : isTablet ? w * 0.32 : w * 0.23
    if (cardW > maxCardW) {
      cardW = maxCardW
      cardH = cardW / 1.45
    }

    const drumR = cardH * DRUM_R_FACTOR
    const ringR = cardH * RING_R_FACTOR
    const ringScale = count
      ? clamp(((2 * Math.PI * ringR) / count) * 0.82 / (cardW || 1), 0.2, 1)
      : 1

    return {
      cardW: Math.round(cardW),
      cardH: Math.round(cardH),
      ringR: Math.round(ringR),
      ringScale,
      drumR: Math.round(drumR),
      bow: Math.round(cardH * BOW_FACTOR),
      depth: Math.round(cardH * DEPTH_FACTOR),
      titleSize: Math.max(Math.round(cardH * 0.17), 18),
      indexSize: Math.max(Math.round(cardH * 0.08), 11),
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

  // Wheel listener: Stops page scroll when hovering on wheel, spins 3D wheel reliably
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let overscrollCount = 0

    const handleWheel = (e: WheelEvent) => {
      // Intercept wheel event inside the wheel zone to prevent accidental page jumping
      e.preventDefault()
      e.stopPropagation()

      const delta = e.deltaY / WHEEL_SENSITIVITY
      const next = targetScroll.current + delta

      // If already at the end and user scrolls down deliberately 3 times, scroll page down
      if (next > maxScroll + 1) {
        overscrollCount++
        if (overscrollCount >= 3) {
          onScrollPageDown?.()
          overscrollCount = 0
        }
      } else if (next < 0) {
        overscrollCount++
        if (overscrollCount >= 3) {
          window.scrollBy({ top: -140, behavior: 'smooth' })
          overscrollCount = 0
        }
      } else {
        overscrollCount = 0
        setTarget(next)
      }

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
  }, [setTarget, maxScroll, onScrollPageDown])

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
    const currentActive = clamp(
      Math.round(Math.max(0, targetScroll.current - 1)),
      0,
      maxScroll,
    )
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
    <div className="relative w-full">
      {/* Outer Wheel Section - with data-lenis-prevent so Lenis never intercepts wheel events inside it */}
      <section
        aria-label={label}
        data-lenis-prevent="true"
        className={`relative h-[500px] sm:h-[540px] lg:h-[570px] w-full max-w-5xl mx-auto select-none overflow-hidden rounded-3xl border border-line/20 bg-gradient-to-b from-surface/40 via-surface/20 to-ink/95 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl ${className}`}
      >
        {/* Subtle atmospheric ambient glows */}
        <div className="pointer-events-none absolute -top-20 left-1/2 h-60 w-80 -translate-x-1/2 rounded-full bg-ember/10 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-ink via-ink/60 to-transparent" />

        {/* Top zone indicator badge */}
        <div className="pointer-events-none absolute left-4 top-4 z-20 hidden items-center gap-2 rounded-full border border-line/15 bg-ink/70 px-3 py-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted backdrop-blur-md sm:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" />
          <span>Interactive 3D Wheel Zone</span>
        </div>

        {/* Interactive 3D Viewport with data-lenis-prevent */}
        <div
          ref={containerRef}
          tabIndex={0}
          role="listbox"
          data-lenis-prevent="true"
          aria-label={label}
          aria-activedescendant={`works-wheel-${activeIndex}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          style={{ perspective: `${geometry.depth}px` }}
          className="absolute inset-0 cursor-grab touch-none outline-none focus-visible:ring-1 focus-visible:ring-ember/50 active:cursor-grabbing"
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
                  <div className="relative block h-full w-full overflow-hidden rounded-xl border border-line/20 bg-surface/90 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.9),0_0_25px_-5px_rgba(255,59,78,0.2)] transition-all duration-300 group-hover:border-ember/60 group-hover:shadow-[0_0_40px_-5px_rgba(255,59,78,0.45)]">
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
                      <div className="absolute inset-x-2.5 top-2.5 flex items-center justify-between sm:inset-x-3 sm:top-3">
                        <span className="rounded-full border border-white/10 bg-ink/75 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-paper/90 backdrop-blur-md">
                          {item.number}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] backdrop-blur-md ${
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
                      <div className="absolute inset-x-2.5 bottom-2.5 flex flex-col gap-0.5 sm:inset-x-3 sm:bottom-3">
                        <div className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-muted truncate">
                          {item.category}
                        </div>
                        <h3 className="display text-sm font-bold leading-tight text-paper transition-colors duration-300 group-hover:text-ember sm:text-base truncate">
                          {item.title}
                        </h3>
                      </div>

                      {/* Hover Floating Action Pill */}
                      <div className="pointer-events-none absolute bottom-2.5 right-2.5 flex translate-y-1 items-center gap-1 rounded-full border border-ember/40 bg-ink/85 px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-ember opacity-0 shadow-[0_0_15px_rgba(255,59,78,0.4)] backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:bottom-3 sm:right-3">
                        <span>{action}</span>
                        <ArrowUpRight className="h-2.5 w-2.5" />
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
          <div className="rounded-full border border-line/20 bg-surface/70 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ember backdrop-blur-md">
            Interactive 3D Carousel
          </div>
          <h2
            className="display mt-2 font-bold tracking-tight text-paper drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
            style={{ fontSize: geometry.titleSize * 1.15 }}
          >
            {label}
          </h2>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Scroll or drag inside to rotate
          </p>
        </div>

        {/* State B: Active Project HUD on Left (Fades in as wheel rotates) */}
        <div
          ref={activeTitleRef}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 max-w-[240px] sm:left-6 sm:max-w-[280px] lg:left-8 lg:max-w-xs opacity-0 transition-opacity duration-300"
        >
          {activeProject && (
            <div className="rounded-xl border border-line/15 bg-ink/80 p-4 backdrop-blur-xl sm:p-5 shadow-[0_16px_50px_rgba(0,0,0,0.7)]">
              <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ember">
                <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_8px_rgba(255,59,78,0.9)]" />
                <span>Project / {activeProject.number}</span>
                <span className="text-line/40">·</span>
                <span className="text-muted">{activeProject.year}</span>
              </div>

              <h2 className="display mt-1.5 text-xl font-bold tracking-tight text-paper sm:text-2xl">
                {activeProject.title}
              </h2>

              <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted truncate">
                {activeProject.category}
              </div>

              {activeProject.tagline && (
                <p className="mt-2 font-display text-xs leading-snug text-paper/85 line-clamp-2">
                  {activeProject.tagline}
                </p>
              )}

              <div className="pointer-events-auto mt-3.5">
                <button
                  type="button"
                  onClick={(e) => handleCardClick(e, activeProject, activeIndex)}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-ember/50 bg-ember px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink font-semibold shadow-[0_0_20px_-5px_rgba(255,59,78,0.6)] transition-all duration-300 hover:bg-paper hover:border-paper"
                >
                  <span>Open Case Study</span>
                  <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Index List: Clickable project selector */}
        <div className="absolute right-3 top-4 sm:right-5 lg:right-6 flex flex-col items-end">
          <div className="mb-1.5 font-mono text-[8.5px] uppercase tracking-[0.16em] text-muted/60">
            Index ({String(count).padStart(2, '0')})
          </div>
          <ol
            className="flex flex-col items-end gap-1 text-right font-mono"
            style={{ fontSize: geometry.indexSize }}
          >
            {items.map((item, index) => {
              const isSelected = index === activeIndex
              return (
                <li key={item.slug}>
                  <button
                    type="button"
                    onClick={() => setTarget(index + 1)}
                    className={`cursor-pointer rounded px-2 py-0.5 text-right font-mono transition-all duration-300 ${
                      isSelected
                        ? 'border border-ember/40 bg-ember/15 text-ember shadow-[0_0_12px_rgba(255,59,78,0.3)] font-medium'
                        : 'text-muted hover:text-paper hover:bg-surface/50'
                    }`}
                  >
                    <span className="mr-1 opacity-60">{item.number}</span>
                    <span>{item.title}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Manual Step Controls (Bottom Right) */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTarget(Math.max(0, targetScroll.current - 1))}
            aria-label="Previous project in wheel"
            title="Previous project"
            className="grid h-7 w-7 place-items-center rounded-full border border-line/20 bg-surface/70 text-muted backdrop-blur-md transition-all duration-300 hover:border-ember/50 hover:bg-ember hover:text-ink shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() =>
              setTarget(Math.min(maxScroll + 1, targetScroll.current + 1))
            }
            aria-label="Next project in wheel"
            title="Next project"
            className="grid h-7 w-7 place-items-center rounded-full border border-line/20 bg-surface/70 text-muted backdrop-blur-md transition-all duration-300 hover:border-ember/50 hover:bg-ember hover:text-ink shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setTarget(0)}
            aria-label="Reset wheel to overview ring"
            title="Reset to Overview Ring"
            className="grid h-7 w-7 place-items-center rounded-full border border-line/20 bg-surface/70 text-muted backdrop-blur-md transition-all duration-300 hover:border-ember/50 hover:bg-surface hover:text-ember shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>

        {/* Bottom Center Interaction Guide */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-line/15 bg-ink/75 px-3 py-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted backdrop-blur-md">
          <MousePointer className="h-3 w-3 text-ember" />
          <span>Scroll/drag here to spin · Scroll side to move page</span>
        </div>
      </section>

      {/* Page Scroll Jugaad: Dedicated Floating Scroll-Down Bar below the wheel */}
      <div className="mt-4 flex items-center justify-between px-2 sm:px-4">
        <div className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted/70 sm:flex">
          <span className="h-1 w-1 rounded-full bg-ember" />
          <span>Tip: Hover in side margins to scroll webpage naturally</span>
        </div>

        <button
          type="button"
          onClick={onScrollPageDown}
          className="group mx-auto sm:mx-0 inline-flex items-center gap-2 rounded-full border border-line/20 bg-surface/60 px-4 py-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted backdrop-blur-md transition-all duration-300 hover:border-ember/40 hover:bg-surface hover:text-paper hover:shadow-[0_0_20px_rgba(255,59,78,0.25)]"
        >
          <span>Scroll Down to Project Details</span>
          <ArrowDown className="h-3.5 w-3.5 text-ember transition-transform group-hover:translate-y-0.5" />
        </button>
      </div>
    </div>
  )
}
