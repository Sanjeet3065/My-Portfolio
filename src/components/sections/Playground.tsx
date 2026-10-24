import { useEffect, useRef } from 'react'
import { Spline } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { SectionHeading } from '../ui/SectionHeading'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
}

interface Pulse {
  x: number
  y: number
  born: number
}

const PARTICLE_COLORS = ['#8B5CF6', '#38BDF8', 'rgba(244,244,245,0.75)', '#FF3B4E']
const MAX_PULSES = 6
const TAP_COOLDOWN = 80
const MAX_IMPULSE_SPEED = 2.2

export function Playground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !container || !context) return

    let width = container.clientWidth
    let height = container.clientHeight
    let frame = 0
    let running = false
    let lastTime = performance.now()
    let lastTap = Number.NEGATIVE_INFINITY

    const particles: Particle[] = []
    const pulses: Pulse[] = []
    const pointer = { x: width / 2, y: height / 2, active: false }

    const buildParticles = () => {
      particles.length = 0
      const count = Math.min(78, Math.max(34, Math.floor(width / 17)))
      for (let index = 0; index < count; index += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.38,
          vy: (Math.random() - 0.5) * 0.38,
          radius: 0.8 + Math.random() * 1.7,
          color: PARTICLE_COLORS[index % PARTICLE_COLORS.length],
        })
      }
    }

    const resize = () => {
      const rect = container.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildParticles()
      if (reduced) draw(performance.now(), false)
    }

    const draw = (time: number, advance: boolean) => {
      context.clearRect(0, 0, width, height)

      const elapsed = Math.min(Math.max(time - lastTime, 0), 40)
      if (advance) lastTime = time

      if (advance) {
        particles.forEach((particle) => {
          particle.x += particle.vx * (elapsed / 16.667)
          particle.y += particle.vy * (elapsed / 16.667)

          if (particle.x < 0 || particle.x > width) particle.vx *= -1
          if (particle.y < 0 || particle.y > height) particle.vy *= -1
          particle.x = Math.max(0, Math.min(width, particle.x))
          particle.y = Math.max(0, Math.min(height, particle.y))

          if (pointer.active) {
            const dx = particle.x - pointer.x
            const dy = particle.y - pointer.y
            const distance = Math.hypot(dx, dy)
            if (distance < 140 && distance > 0.1) {
              const force = ((140 - distance) / 140) * 0.5
              particle.vx += (dx / distance) * force
              particle.vy += (dy / distance) * force
            }
          }

          const speed = Math.hypot(particle.vx, particle.vy)
          if (speed > 1.4) {
            particle.vx = (particle.vx / speed) * 1.4
            particle.vy = (particle.vy / speed) * 1.4
          }
        })
      }

      context.lineWidth = 1
      for (let first = 0; first < particles.length; first += 1) {
        for (let second = first + 1; second < particles.length; second += 1) {
          const a = particles[first]
          const b = particles[second]
          const distance = Math.hypot(a.x - b.x, a.y - b.y)
          if (distance < 118) {
            context.strokeStyle = `rgba(167,139,250,${(1 - distance / 118) * 0.12})`
            context.beginPath()
            context.moveTo(a.x, a.y)
            context.lineTo(b.x, b.y)
            context.stroke()
          }
        }

        if (pointer.active) {
          const particle = particles[first]
          const distance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y)
          if (distance < 150) {
            context.strokeStyle = `rgba(255,59,78,${(1 - distance / 150) * 0.28})`
            context.beginPath()
            context.moveTo(particle.x, particle.y)
            context.lineTo(pointer.x, pointer.y)
            context.stroke()
          }
        }
      }

      particles.forEach((particle) => {
        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fillStyle = particle.color
        context.fill()
      })

      if (advance) {
        if (pointer.active) {
          context.beginPath()
          context.arc(pointer.x, pointer.y, 3, 0, Math.PI * 2)
          context.fillStyle = '#FF3B4E'
          context.fill()
        }

        for (let index = pulses.length - 1; index >= 0; index -= 1) {
          const pulse = pulses[index]
          const age = Math.max(0, time - pulse.born)
          if (age > 1200) {
            pulses.splice(index, 1)
            continue
          }
          const radius = (age / 1200) * 130
          context.strokeStyle = `rgba(255,59,78,${(1 - age / 1200) * 0.55})`
          context.beginPath()
          context.arc(pulse.x, pulse.y, radius, 0, Math.PI * 2)
          context.stroke()
        }
      }
    }

    const loop = (time: number) => {
      if (!running) return
      frame = requestAnimationFrame(loop)
      draw(time, true)
    }

    const start = () => {
      if (running || reduced) return
      running = true
      lastTime = performance.now()
      frame = requestAnimationFrame(loop)
    }

    const stop = () => {
      running = false
      window.cancelAnimationFrame(frame)
    }

    let canvasRect = canvas.getBoundingClientRect()
    const updateCanvasRect = () => {
      canvasRect = canvas.getBoundingClientRect()
    }

    const getPosition = (event: PointerEvent) => {
      return { x: event.clientX - canvasRect.left, y: event.clientY - canvasRect.top }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!event.isPrimary) return
      const position = getPosition(event)
      pointer.x = position.x
      pointer.y = position.y
      pointer.active = true
    }

    const onPointerLeave = () => {
      pointer.active = false
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!event.isPrimary) return
      updateCanvasRect()
      const position = getPosition(event)
      pointer.x = position.x
      pointer.y = position.y
      pointer.active = true

      const now = performance.now()
      if (now - lastTap >= TAP_COOLDOWN) {
        lastTap = now
        pulses.push({ x: position.x, y: position.y, born: now })
        if (pulses.length > MAX_PULSES) pulses.splice(0, pulses.length - MAX_PULSES)
      }

      particles.forEach((particle) => {
        const dx = particle.x - position.x
        const dy = particle.y - position.y
        const distance = Math.hypot(dx, dy)
        if (distance < 180 && distance > 0.1) {
          const force = (1 - distance / 180) * 1.25
          particle.vx += (dx / distance) * force
          particle.vy += (dy / distance) * force
        }
        const speed = Math.hypot(particle.vx, particle.vy)
        if (speed > MAX_IMPULSE_SPEED) {
          particle.vx = (particle.vx / speed) * MAX_IMPULSE_SPEED
          particle.vy = (particle.vy / speed) * MAX_IMPULSE_SPEED
        }
      })

      if (reduced) {
        draw(performance.now(), false)
      }
    }

    const onPointerRelease = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') pointer.active = false
    }

    resize()
    updateCanvasRect()
    const resizeObserver = new ResizeObserver(() => {
      resize()
      updateCanvasRect()
    })
    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          updateCanvasRect()
          start()
        } else {
          stop()
        }
      },
      { threshold: 0.05 },
    )
    intersectionObserver.observe(container)

    canvas.addEventListener('pointerenter', updateCanvasRect)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointerup', onPointerRelease)
    canvas.addEventListener('pointercancel', onPointerRelease)

    if (reduced) draw(performance.now(), false)

    return () => {
      stop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      canvas.removeEventListener('pointerenter', updateCanvasRect)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointerup', onPointerRelease)
      canvas.removeEventListener('pointercancel', onPointerRelease)
    }
  }, [reduced])

  return (
    <section id="playground" className="section-pad relative border-t border-line/10">
      <div className="shell">
        <SectionHeading
          index="07"
          label="Playground"
          title={
            <>
              Disturb
              <br />
              <span className="text-muted">the field.</span>
            </>
          }
          description="A small canvas experiment — because sometimes the best way to understand an interaction is to touch it."
        />

        <div
          ref={containerRef}
          className="relative mt-10 h-[58vh] min-h-[360px] max-h-[620px] overflow-hidden border border-line/10 bg-surface/25 sm:mt-12 lg:mt-16"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(255,59,78,0.08),transparent_55%),radial-gradient(ellipse_at_20%_80%,rgba(139,92,246,0.09),transparent_60%)]" />
          <canvas
            ref={canvasRef}
            className="playground-canvas relative z-10 h-full w-full"
            role="img"
            aria-label="Interactive particle field. Drag or move across it to disturb the particles, and tap or click to send a pulse."
            data-cursor-label="Move"
          >
            An interactive particle field that responds to pointer movement and touch.
          </canvas>

          <div className="pointer-events-none absolute inset-x-4 top-4 z-20 flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.14em] text-muted sm:inset-x-7 sm:top-7 sm:text-[9px] sm:tracking-[0.18em]">
            <span className="flex items-center gap-2">
              <Spline className="h-3.5 w-3.5 text-ember" />
              Experiment / 001
            </span>
            <span className="flex items-center gap-2 text-right">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="pulse-ember absolute inset-0 rounded-full" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-ember" />
              </span>
              Pointer field active
            </span>
          </div>

          <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 flex items-end justify-between gap-4 sm:inset-x-7 sm:bottom-7">
            <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-muted sm:tracking-[0.18em]">
              <span className="sm:hidden">Drag · Tap · Observe</span>
              <span className="hidden sm:inline">Move · Click · Observe</span>
            </p>
            <p className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-muted sm:block">
              Canvas / real-time
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
