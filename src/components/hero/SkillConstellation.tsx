import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useAppReady } from '../../context/AppReadyContext'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type ConstellationWord = {
  id: string
  label: string
  category: string
  x: number
  y: number
  hub?: boolean
}

const WORDS: ConstellationWord[] = [
  { id: 'cse', label: 'CSE Student', category: 'Core · Third year', x: 19, y: 9, hub: true },
  { id: 'fullstack', label: 'Full Stack', category: 'Interfaces + APIs', x: 51, y: 15, hub: true },
  { id: 'btech', label: 'B.Tech', category: 'Computer science', x: 83, y: 7 },
  { id: 'typescript', label: 'TypeScript', category: 'Frontend', x: 10, y: 33 },
  { id: 'react', label: 'React', category: 'Frontend', x: 38, y: 40, hub: true },
  { id: 'node', label: 'Node.js', category: 'Backend', x: 67, y: 31 },
  { id: 'java', label: 'Java', category: 'Backend', x: 89, y: 39 },
  { id: 'problem', label: 'Problem Solver', category: 'Core CS', x: 22, y: 61, hub: true },
  { id: 'rest', label: 'REST APIs', category: 'Backend', x: 52, y: 67 },
  { id: 'dsa', label: 'DSA', category: 'Core CS', x: 81, y: 59, hub: true },
  { id: 'git', label: 'Git', category: 'Tooling', x: 10, y: 86 },
  { id: 'mongo', label: 'MongoDB', category: 'Database', x: 36, y: 88 },
  { id: 'docker', label: 'Docker', category: 'Tooling', x: 62, y: 84 },
  { id: 'postgres', label: 'PostgreSQL', category: 'Database', x: 88, y: 88 },
  { id: 'express', label: 'Express.js', category: 'Backend', x: 90, y: 20 },
  { id: 'tailwind', label: 'Tailwind CSS', category: 'Frontend', x: 60, y: 52 },
  { id: 'mysql', label: 'MySQL', category: 'Database', x: 8, y: 72 },
  { id: 'github', label: 'GitHub', category: 'Tooling', x: 33, y: 73 },
]

const EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 1], [0, 3], [0, 4], [0, 7],
  [1, 2], [1, 4], [1, 5], [1, 8],
  [2, 5], [2, 9],
  [3, 4], [3, 5], [3, 6], [3, 10],
  [4, 5], [4, 7], [4, 8],
  [5, 9], [5, 13],
  [6, 7], [6, 9], [6, 13],
  [7, 8], [7, 10], [7, 11],
  [8, 9], [8, 11], [8, 12],
  [9, 12], [9, 13],
  [10, 11],
  [11, 12], [11, 13],
  [12, 13],
  [1, 14], [14, 2], [14, 6],
  [4, 15], [5, 15], [8, 15], [9, 15],
  [3, 16], [7, 16], [10, 16],
  [7, 17], [8, 17], [11, 17],
]

const SEQUENCE = [0, 1, 14, 2, 6, 5, 4, 3, 7, 16, 10, 11, 17, 8, 15, 9, 13, 12]

export function SkillConstellation({ className = '' }: { className?: string }) {
  const ready = useAppReady()
  const reduced = useReducedMotion()
  const boxRef = useRef<HTMLDivElement>(null)
  const labelRefs = useRef<Array<HTMLSpanElement | null>>([])
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const hoveredRef = useRef(false)
  const focusedRef = useRef(false)
  const interactedRef = useRef(false)
  const holdUntilRef = useRef(0)
  const inViewRef = useRef(true)

  const reveal = useCallback((index: number, initial = false) => {
    const label = labelRefs.current[index]
    if (!label) return

    const previous = activeRef.current
    const previousLabel = labelRefs.current[previous]

    activeRef.current = index
    setActive(index)

    if (previous !== index && previousLabel) {
      if (reduced) gsap.set(previousLabel, { autoAlpha: 0.5 })
      else gsap.to(previousLabel, { autoAlpha: 0.5, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
    }

    if (reduced) {
      gsap.set(label, { x: 0, y: 0, autoAlpha: 1, filter: 'none' })
      return
    }

    let offsetX = 0
    let offsetY = -14

    if (!initial) {
      const from = WORDS[previous]
      const dx = WORDS[index].x - from.x
      const dy = WORDS[index].y - from.y
      if (Math.abs(dx) >= Math.abs(dy)) {
        offsetX = dx >= 0 ? -18 : 18
      } else {
        offsetY = dy >= 0 ? -13 : 13
      }
    }

    gsap.fromTo(
      label,
      { x: offsetX, y: offsetY, autoAlpha: 0, filter: 'blur(4px)' },
      {
        x: 0,
        y: 0,
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 0.85,
        ease: 'power3.out',
        overwrite: 'auto',
      },
    )
  }, [reduced])

  useEffect(() => {
    if (!ready) return
    const box = boxRef.current
    if (!box) return

    const edges = box.querySelectorAll<SVGLineElement>('.constellation-edge')
    const labels = labelRefs.current.filter((element): element is HTMLSpanElement => Boolean(element))

    if (reduced) {
      gsap.set(edges, { strokeDashoffset: 0, opacity: 1 })
      gsap.set(labels, { autoAlpha: 0.5 })
      return
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        box,
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' },
      )
      gsap.fromTo(
        edges,
        { strokeDashoffset: 1, opacity: 0 },
        {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 1.15,
          stagger: 0.02,
          ease: 'power2.out',
          delay: 0.12,
        },
      )
      gsap.fromTo(
        labels,
        { autoAlpha: 0, y: 7 },
        {
          autoAlpha: 0.5,
          y: 0,
          duration: 0.6,
          stagger: 0.035,
          ease: 'power2.out',
          delay: 0.3,
        },
      )
    }, box)

    return () => context.revert()
  }, [ready, reduced])

  useEffect(() => {
    if (!ready) return

    if (reduced) {
      reveal(0)
      return
    }

    let cursor = 1
    const kickoff = window.setTimeout(() => {
      if (!interactedRef.current) reveal(SEQUENCE[0], true)
    }, 1800)

    const interval = window.setInterval(() => {
      if (!inViewRef.current || document.visibilityState === 'hidden') return
      if (hoveredRef.current || focusedRef.current) return
      if (Date.now() < holdUntilRef.current) return
      reveal(SEQUENCE[cursor % SEQUENCE.length])
      cursor += 1
    }, 2800)

    return () => {
      window.clearTimeout(kickoff)
      window.clearInterval(interval)
    }
  }, [ready, reduced, reveal])

  useEffect(() => {
    const box = boxRef.current
    if (!box || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting
      },
      { threshold: 0.25 },
    )
    observer.observe(box)
    return () => observer.disconnect()
  }, [])

  const activate = (index: number) => {
    interactedRef.current = true
    holdUntilRef.current = Date.now() + 6000
    reveal(index)
  }

  const activeWord = WORDS[active]

  return (
    <div
      ref={boxRef}
      role="group"
      aria-label="Skill constellation"
      className={`pointer-events-auto relative hidden h-[clamp(210px,30svh,300px)] select-none overflow-hidden rounded-2xl border border-line/10 bg-surface/50 shadow-[0_36px_90px_-52px_rgba(0,0,0,0.95)] backdrop-blur-md xl:block ${className}`}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') hoveredRef.current = true
      }}
      onPointerLeave={() => {
        hoveredRef.current = false
      }}
      onFocusCapture={() => {
        focusedRef.current = true
      }}
      onBlurCapture={() => {
        focusedRef.current = false
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(139,92,246,0.12),transparent_48%),radial-gradient(circle_at_82%_86%,rgba(255,59,78,0.14),transparent_56%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(244,244,245,0.032) 1px, transparent 1px), linear-gradient(90deg, rgba(244,244,245,0.032) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent" />

      <div className="relative z-20 flex h-full flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-line/10 px-4 py-2">
          <span className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
            <span className="relative flex h-1.5 w-1.5">
              <span className="pulse-ember absolute inset-0 rounded-full bg-ember/60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-ember" />
            </span>
            Skill constellation
          </span>
          <span
            key={activeWord.id}
            className="role-enter max-w-[52%] truncate font-mono text-[7.5px] uppercase tracking-[0.16em] text-ember"
          >
            {activeWord.category}
          </span>
        </div>

        <div className="relative mx-2 mb-2 mt-1 flex-1">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {EDGES.map(([from, to]) => {
              const isLive = active === from || active === to
              return (
                <line
                  key={`${from}-${to}`}
                  x1={WORDS[from].x}
                  y1={WORDS[from].y}
                  x2={WORDS[to].x}
                  y2={WORDS[to].y}
                  pathLength={1}
                  strokeDasharray="1"
                  vectorEffect="non-scaling-stroke"
                  stroke={isLive ? 'rgba(255,59,78,0.82)' : 'rgba(255,59,78,0.28)'}
                  strokeWidth={isLive ? 1.1 : 0.6}
                  className="constellation-edge transition-[stroke,stroke-width] duration-500"
                />
              )
            })}
          </svg>

          {WORDS.map((word, index) => {
            const isActive = active === index

            return (
              <button
                key={word.id}
                type="button"
                aria-label={`Highlight ${word.label}`}
                onClick={() => activate(index)}
                onFocus={() => activate(index)}
                onPointerEnter={(event) => {
                  if (event.pointerType === 'mouse') activate(index)
                }}
                className="group absolute z-10 flex -translate-x-1/2 -translate-y-[6px] flex-col items-center rounded-sm outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ember/60"
                style={{ left: `${word.x}%`, top: `${word.y}%`, zIndex: isActive ? 30 : 10 }}
              >
                <span className="relative grid h-3 w-3 place-items-center">
                  <span
                    className={`absolute inset-0 rounded-full bg-ember/20 transition-all duration-500 ${
                      isActive ? 'scale-150 opacity-100' : 'scale-75 opacity-0'
                    }`}
                  />
                  <span
                    className={`relative rounded-full transition-all duration-500 ${
                      word.hub ? 'h-[6px] w-[6px]' : 'h-1 w-1'
                    } ${
                      isActive
                        ? 'bg-[#FFB27A] shadow-[0_0_16px_4px_rgba(255,59,78,0.7)]'
                        : 'bg-ember/90 shadow-[0_0_8px_1.5px_rgba(255,59,78,0.45)]'
                    }`}
                  />
                </span>
                <span
                  ref={(element) => {
                    labelRefs.current[index] = element
                  }}
                  className={`relative mt-1 whitespace-nowrap font-mono text-[8.5px] uppercase leading-none tracking-[0.12em] transition-colors duration-300 2xl:text-[9px] ${
                    isActive ? 'text-paper' : 'text-paper/90'
                  }`}
                  style={isActive ? { textShadow: '0 0 16px rgba(255,59,78,0.55)' } : undefined}
                >
                  {word.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-ember/70 transition-transform duration-500 ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
