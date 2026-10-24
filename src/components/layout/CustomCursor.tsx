import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const ACTIVE_CLASSES = [
  'h-16',
  'w-16',
  'border-ember/70',
  'bg-ember/10',
  'shadow-[0_0_36px_-6px_rgba(255,59,78,0.65)]',
]
const INACTIVE_CLASSES = ['h-8', 'w-8', 'border-paper/30']

export function CustomCursor() {
  const reduced = useReducedMotion()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const ringInnerRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reduced) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    const ringInner = ringInnerRef.current
    const label = labelRef.current
    if (!dot || !ring || !ringInner || !label) return

    const position = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const follower = { ...position }
    let frame = 0
    let isLooping = false
    let isVisible = false
    let isActive = false

    const setVisibleDOM = (visible: boolean) => {
      isVisible = visible
      if (visible) {
        dot.style.opacity = isActive ? '0' : '1'
        ring.style.opacity = '1'
        document.documentElement.classList.add('has-custom-cursor')
      } else {
        dot.style.opacity = '0'
        ring.style.opacity = '0'
        document.documentElement.classList.remove('has-custom-cursor')
      }
    }

    const setActiveDOM = (active: boolean, nextLabel = '') => {
      isActive = active
      if (active) {
        ringInner.classList.remove(...INACTIVE_CLASSES)
        ringInner.classList.add(...ACTIVE_CLASSES)
        label.classList.remove('opacity-0')
        label.classList.add('opacity-100')
        label.textContent = nextLabel
        if (isVisible) dot.style.opacity = '0'
      } else {
        ringInner.classList.remove(...ACTIVE_CLASSES)
        ringInner.classList.add(...INACTIVE_CLASSES)
        label.classList.remove('opacity-100')
        label.classList.add('opacity-0')
        label.textContent = ''
        if (isVisible) dot.style.opacity = '1'
      }
    }

    const loop = () => {
      const dx = position.x - follower.x
      const dy = position.y - follower.y
      follower.x += dx * 0.16
      follower.y += dy * 0.16

      dot.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${follower.x}px, ${follower.y}px, 0) translate(-50%, -50%)`

      // If follower is still catching up, keep looping; otherwise sleep until next movement
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        frame = window.requestAnimationFrame(loop)
      } else {
        follower.x = position.x
        follower.y = position.y
        ring.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`
        isLooping = false
      }
    }

    const wakeLoop = () => {
      if (!isLooping) {
        isLooping = true
        frame = window.requestAnimationFrame(loop)
      }
    }

    const show = (clientX?: number, clientY?: number) => {
      if (typeof clientX === 'number' && typeof clientY === 'number') {
        position.x = clientX
        position.y = clientY
        if (!isVisible) {
          // Snap follower on initial reveal or re-entry so ring doesn't fly across screen
          follower.x = clientX
          follower.y = clientY
          dot.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`
          ring.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`
        }
      }
      if (!isVisible) {
        setVisibleDOM(true)
      }
      wakeLoop()
    }

    const hide = () => {
      setVisibleDOM(false)
      setActiveDOM(false)
    }

    const onMove = (event: PointerEvent) => {
      show(event.clientX, event.clientY)
    }

    const onEnter = (event: PointerEvent) => {
      show(event.clientX, event.clientY)
    }

    const onOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>(
        'a, button, [data-cursor-label], [role="button"]',
      )
      if (target) {
        const nextLabel = target.dataset.cursorLabel ?? ''
        setActiveDOM(true, nextLabel)
      }
    }

    const onOut = (event: PointerEvent) => {
      const related = (event.relatedTarget as Element | null)?.closest<HTMLElement>(
        'a, button, [data-cursor-label], [role="button"]',
      )
      if (!related) {
        setActiveDOM(false)
      }
    }

    const onBlur = () => {
      hide()
    }

    const onFocus = () => {
      setActiveDOM(false)
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setActiveDOM(false)
      } else {
        hide()
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerenter', onEnter, { passive: true })
    document.documentElement.addEventListener('pointerleave', hide)
    document.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerout', onOut, { passive: true })
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerenter', onEnter)
      document.documentElement.removeEventListener('pointerleave', hide)
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
        className="custom-cursor pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_12px_rgba(255,59,78,0.95)] opacity-0 transition-opacity duration-200 will-change-transform"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="custom-cursor pointer-events-none fixed left-0 top-0 z-[9998] opacity-0 transition-opacity duration-200 will-change-transform"
      >
        <div
          ref={ringInnerRef}
          className="flex items-center justify-center rounded-full border border-paper/30 h-8 w-8 transition-all duration-300 ease-editorial"
        >
          <span
            ref={labelRef}
            className="font-mono text-[8px] uppercase tracking-[0.18em] text-paper opacity-0 transition-opacity duration-200"
          />
        </div>
      </div>
    </>
  )
}
