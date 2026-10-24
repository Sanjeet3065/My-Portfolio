import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { siteConfig } from '../../config/site'

const MIN_LOADING_MS = 5000
const LOAD_SAFETY_MS = 8000

export function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [hidden, setHidden] = useState(false)
  const doneRef = useRef(false)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (reduced) {
      onDoneRef.current()
      setHidden(true)
      return
    }

    let cancelled = false
    let frame = 0
    let exitTimer = 0
    let unmountTimer = 0
    const startedAt = performance.now()

    const animate = () => {
      const elapsed = performance.now() - startedAt
      const t = Math.min(elapsed / (MIN_LOADING_MS - 420), 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(Math.min(99, Math.round(eased * 99)))
      if (t < 1 && !cancelled) frame = window.requestAnimationFrame(animate)
    }
    frame = window.requestAnimationFrame(animate)

    const finish = () => {
      if (cancelled || doneRef.current) return
      doneRef.current = true
      setProgress(100)
      exitTimer = window.setTimeout(() => {
        if (cancelled) return
        setLeaving(true)
        onDoneRef.current()
        unmountTimer = window.setTimeout(() => setHidden(true), 1000)
      }, 420)
    }

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve()
    const pageLoad =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }))

    Promise.all([
      fontsReady,
      pageLoad,
      new Promise<void>((resolve) => window.setTimeout(resolve, MIN_LOADING_MS)),
    ]).then(finish)

    const safety = window.setTimeout(finish, LOAD_SAFETY_MS)

    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
      window.clearTimeout(safety)
      window.clearTimeout(exitTimer)
      window.clearTimeout(unmountTimer)
    }
  }, [reduced])

  if (hidden) return null

  return (
    <div
      className={`preloader ${leaving ? 'is-leaving' : ''}`}
      role="progressbar"
      aria-label="Loading portfolio"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div className="shell flex h-full flex-col justify-between py-6 sm:py-10">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-ultra text-muted">
          <span>Portfolio</span>
          <span className="hidden sm:block">Assembling the experience</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_14px_rgba(255,59,78,0.9)]" />
            Live
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative flex h-40 w-40 items-center justify-center sm:h-52 sm:w-52">
            <div className="absolute inset-0 rounded-full bg-ember/10 blur-3xl" />
            <svg className="absolute inset-0 h-full w-full animate-[spin_18s_linear_infinite]" viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(244,244,245,0.08)" strokeWidth="1" />
              <circle
                cx="100"
                cy="100"
                r="82"
                fill="none"
                stroke="#FF3B4E"
                strokeWidth="1"
                strokeDasharray="24 490"
                strokeLinecap="round"
                opacity="0.85"
              />
              <circle
                cx="100"
                cy="100"
                r="62"
                fill="none"
                stroke="rgba(139,92,246,0.28)"
                strokeWidth="1"
                strokeDasharray="2 6"
              />
            </svg>
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-line/10 bg-surface/70 sm:h-24 sm:w-24">
              <span className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{siteConfig.monogram}</span>
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-ember shadow-[0_0_18px_rgba(255,59,78,1)]" />
            </div>
          </div>
          <p className="mt-8 font-display text-2xl tracking-tight sm:text-3xl">{siteConfig.name}</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-ultra text-muted">{siteConfig.role}</p>
        </div>

        <div>
          <div className="flex items-end justify-between gap-4">
            <span className="max-w-[14rem] font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-muted">
              Loading type, visuals &amp; motion
            </span>
            <span className="font-display text-6xl font-medium leading-none tracking-tighter sm:text-8xl">
              {String(progress).padStart(3, '0')}
              <span className="ml-1 text-sm text-muted">%</span>
            </span>
          </div>
          <div className="mt-5 h-px w-full bg-line/10">
            <div
              className="h-px bg-gradient-to-r from-accent via-ember to-ember shadow-[0_0_16px_rgba(255,59,78,0.8)] transition-[width] duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
