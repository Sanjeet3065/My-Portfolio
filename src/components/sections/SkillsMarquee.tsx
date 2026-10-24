import { useEffect, useRef, useState } from 'react'
import { skillCategories } from '../../data/skills'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const SKILLS = skillCategories.flatMap((category) => category.skills)
const COPIES = 4
const SPEED = 52

function TickerItems() {
  return (
    <>
      {SKILLS.map((skill) => (
        <span key={skill} className="flex shrink-0 items-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/65 transition-colors duration-300 group-hover:text-paper sm:text-[11px]">
            {skill}
          </span>
          <span
            aria-hidden="true"
            className="mx-5 h-1.5 w-1.5 shrink-0 rotate-45 bg-ember/80 shadow-[0_0_12px_rgba(255,59,78,0.75)] sm:mx-7"
          />
        </span>
      ))}
    </>
  )
}

export function SkillsMarquee() {
  const reduced = useReducedMotion()
  const trackRef = useRef<HTMLSpanElement>(null)
  const groupRef = useRef<HTMLSpanElement>(null)
  const offsetRef = useRef(0)
  const velocityRef = useRef(-SPEED)
  const loopWidthRef = useRef(0)
  const directionRef = useRef<-1 | 1>(-1)
  const [direction, setDirection] = useState<-1 | 1>(-1)

  useEffect(() => {
    if (reduced) return
    const track = trackRef.current
    const group = groupRef.current
    if (!track || !group) return

    const measure = () => {
      loopWidthRef.current = group.getBoundingClientRect().width
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(group)

    let frame = 0
    let previous = performance.now()

    const tick = (now: number) => {
      const delta = Math.min((now - previous) / 1000, 0.05)
      previous = now
      const width = loopWidthRef.current

      if (width > 1) {
        const ease = Math.min(1, delta * 4.2)
        velocityRef.current += (directionRef.current * SPEED - velocityRef.current) * ease
        offsetRef.current += velocityRef.current * delta
        offsetRef.current = ((offsetRef.current % width) + width) % width - width
        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [reduced])

  const reverse = () => {
    const next = direction === -1 ? 1 : -1
    directionRef.current = next
    setDirection(next)
  }

  return (
    <div id="skills-marquee" className="relative bg-ink pb-4 pt-10 sm:pb-5 sm:pt-14 lg:pt-16">
      <div className="shell">
        <div className="relative overflow-hidden border-y border-line/10">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,59,78,0.05),transparent_30%,transparent_70%,rgba(139,92,246,0.05))]"
          />

          {reduced ? (
            <div
              className="relative z-[1] flex flex-wrap items-center gap-y-3 px-1 py-5 sm:px-2"
              aria-label="Technical skills"
            >
              <TickerItems />
            </div>
          ) : (
            <button
              type="button"
              onClick={reverse}
              aria-label={`Technical skills ticker moving ${
                direction === -1 ? 'right to left' : 'left to right'
              }. Click to reverse the direction.`}
              className="group relative block w-full select-none overflow-hidden py-5 text-left focus-visible:[outline-offset:-3px] sm:py-6"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-6 bg-gradient-to-r from-ink via-ink/70 to-transparent sm:w-16 md:w-24"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-6 bg-gradient-to-l from-ink via-ink/70 to-transparent sm:w-16 md:w-24"
              />

              <span ref={trackRef} className="flex w-max will-change-transform">
                {Array.from({ length: COPIES }, (_, copy) => (
                  <span
                    key={copy}
                    ref={copy === 0 ? groupRef : undefined}
                    aria-hidden="true"
                    className="flex shrink-0 items-center"
                  >
                    <TickerItems />
                  </span>
                ))}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
