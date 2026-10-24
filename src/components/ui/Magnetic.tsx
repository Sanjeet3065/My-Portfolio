import { useRef, type PointerEvent, type ReactNode } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface MagneticProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function Magnetic({ children, className = '', strength = 0.22 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const rectRef = useRef<DOMRect | null>(null)

  const onEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== 'mouse') return
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect()
    }
  }

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== 'mouse') return
    const element = ref.current
    if (!element) return
    const rect = rectRef.current || element.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    gsap.to(element, {
      x: x * strength,
      y: y * strength,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  const onLeave = () => {
    rectRef.current = null
    if (reduced) return
    const element = ref.current
    if (!element) return
    gsap.to(element, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' })
  }

  return (
    <div
      ref={ref}
      className={`inline-block ${className}`}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </div>
  )
}
