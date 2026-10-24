import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function CustomCursor() {
  const reduced = useReducedMotion()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (reduced) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    const position = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const follower = { ...position }
    let frame = 0
    let shown = false

    const show = (clientX?: number, clientY?: number) => {
      if (typeof clientX === 'number' && typeof clientY === 'number') {
        position.x = clientX
        position.y = clientY
        if (!shown) {
          // Snap follower on initial reveal or re-entry so ring doesn't fly across screen
          follower.x = clientX
          follower.y = clientY
        }
      }
      if (!shown) {
        shown = true
        setVisible(true)
        document.documentElement.classList.add('has-custom-cursor')
      }
    }

    const hide = () => {
      shown = false
      setVisible(false)
      setActive(false)
      if (label) label.textContent = ''
      document.documentElement.classList.remove('has-custom-cursor')
    }

    const onMove = (event: PointerEvent | MouseEvent) => {
      show(event.clientX, event.clientY)
    }

    const onEnter = (event: PointerEvent | MouseEvent) => {
      show(event.clientX, event.clientY)
    }

    const onOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>(
        'a, button, [data-cursor-label], [role="button"]',
      )
      if (target) {
        setActive(true)
        const nextLabel = target.dataset.cursorLabel ?? ''
        label.textContent = nextLabel
      }
    }

    const onOut = (event: PointerEvent) => {
      const related = (event.relatedTarget as Element | null)?.closest<HTMLElement>(
        'a, button, [data-cursor-label], [role="button"]',
      )
      if (!related) {
        setActive(false)
        label.textContent = ''
      }
    }

    const onBlur = () => {
      hide()
    }

    const onFocus = () => {
      // Clear any stuck hover states when returning to window
      setActive(false)
      if (label) label.textContent = ''
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setActive(false)
        if (label) label.textContent = ''
      } else {
        hide()
      }
    }

    const loop = () => {
      follower.x += (position.x - follower.x) * 0.16
      follower.y += (position.y - follower.y) * 0.16
      dot.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${follower.x}px, ${follower.y}px, 0) translate(-50%, -50%)`
      frame = window.requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerenter', onEnter, { passive: true })
    document.documentElement.addEventListener('mouseenter', onEnter, { passive: true })
    document.documentElement.addEventListener('pointerleave', hide)
    document.documentElement.addEventListener('mouseleave', hide)
    document.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerout', onOut, { passive: true })
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibilityChange)

    frame = window.requestAnimationFrame(loop)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('pointerenter', onEnter)
      document.documentElement.removeEventListener('mouseenter', onEnter)
      document.documentElement.removeEventListener('pointerleave', hide)
      document.documentElement.removeEventListener('mouseleave', hide)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [reduced])

  if (reduced) return null

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`custom-cursor pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_12px_rgba(255,59,78,0.95)] transition-opacity duration-200 ${
          visible && !active ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="custom-cursor pointer-events-none fixed left-0 top-0 z-[9998] transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div
          className={`flex items-center justify-center rounded-full border transition-all duration-300 ease-editorial ${
            active
              ? 'h-16 w-16 border-ember/70 bg-ember/10 shadow-[0_0_36px_-6px_rgba(255,59,78,0.65)]'
              : 'h-8 w-8 border-paper/30'
          }`}
        >
          <span
            ref={labelRef}
            className={`font-mono text-[8px] uppercase tracking-[0.18em] text-paper transition-opacity duration-200 ${
              active ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </div>
    </>
  )
}

