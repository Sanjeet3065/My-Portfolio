import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react'
import { moments } from '../../data/moments'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { MomentArt } from '../moments/MomentArt'
import { Modal } from '../ui/Modal'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

gsap.registerPlugin(ScrollTrigger)

export function WinningMoments() {
  const sectionRef = useRef<HTMLElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)

  const activeMoment = activeIndex !== null ? moments[activeIndex] : null

  useEffect(() => {
    if (reduced) return

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 55%',
        end: 'bottom 35%',
        onToggle: (self) => glowRef.current?.classList.toggle('is-live', self.isActive),
      })

      gsap.fromTo(
        '[data-moment-card]',
        { y: 56, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: railRef.current, start: 'top 88%' },
        },
      )

      const featured = sectionRef.current?.querySelector('[data-featured-art]')
      if (featured) {
        gsap.fromTo(
          featured,
          { clipPath: 'inset(7% 7% 7% 7%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'top 10%',
              scrub: true,
            },
          },
        )
      }
    }, sectionRef)

    return () => {
      glowRef.current?.classList.remove('is-live')
      context.revert()
    }
  }, [reduced])

  useEffect(() => {
    if (activeIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setActiveIndex((current) => (current === null ? current : (current + 1) % moments.length))
      }
      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) => (current === null ? current : (current - 1 + moments.length) % moments.length))
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activeIndex])

  const updateProgress = () => {
    const rail = railRef.current
    if (!rail) return
    const max = rail.scrollWidth - rail.clientWidth
    setProgress(max > 0 ? (rail.scrollLeft / max) * 100 : 0)
  }

  const scrollRail = (direction: 1 | -1) => {
    const rail = railRef.current
    if (!rail) return
    rail.scrollBy({ left: direction * rail.clientWidth * 0.72, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <section ref={sectionRef} id="moments" className="section-pad relative overflow-hidden border-t border-line/10">
      <div ref={glowRef} className="moments-glow pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,rgba(255,59,78,0.16),transparent_55%)]" />
        <div className="absolute -left-32 bottom-0 h-[480px] w-[480px] rounded-full bg-accent/[0.07] blur-[140px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent" />
      </div>

      <div className="shell relative">
        <SectionHeading
          index="06"
          label="Winning Moments"
          title={
            <>
              Behind every achievement,
              <br />
              <span className="text-muted">there is a story.</span>
            </>
          }
          description="Competition floors, late-night problem solving and the moments that made the effort worth it. A growing collection of memories from coding competitions and technical events."
        />

        <Reveal>
          <div className="mt-12 flex flex-col gap-5 border-t border-line/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:text-[9px] sm:tracking-[0.18em]">
              <MoveHorizontal className="h-3.5 w-3.5 text-ember" />
              {String(moments.length).padStart(2, '0')} moments · drag or scroll
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollRail(-1)}
                aria-label="Scroll moments left"
                className="grid h-10 w-10 place-items-center rounded-full border border-line/15 text-muted transition-colors hover:border-ember/40 hover:text-ember"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollRail(1)}
                aria-label="Scroll moments right"
                className="grid h-10 w-10 place-items-center rounded-full border border-line/15 text-muted transition-colors hover:border-ember/40 hover:text-ember"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Reveal>

        <div
          ref={railRef}
          onScroll={updateProgress}
          className="no-scrollbar -mr-5 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pr-5 sm:-mr-8 sm:pr-8 lg:-mr-12 lg:pr-12"
          role="list"
          aria-label="Winning moments gallery"
        >
          {moments.map((moment, index) => (
            <div
              key={moment.id}
              role="listitem"
              data-moment-card
              className={`shrink-0 snap-start ${moment.featured ? 'w-[86vw] sm:w-[540px] lg:w-[620px]' : 'w-[78vw] sm:w-[380px] lg:w-[430px]'}`}
            >
              <button
                onClick={() => setActiveIndex(index)}
                data-cursor-label="Open"
                className="group block w-full text-left"
                aria-label={`Open ${moment.title} — ${moment.rank}`}
              >
                <div
                  className="relative overflow-hidden border border-line/10 bg-surface transition-all duration-500 group-hover:border-ember/30 group-hover:shadow-[0_0_90px_-40px_rgba(255,59,78,0.55)]"
                  data-featured-art={moment.featured ? '' : undefined}
                >
                  <div className="aspect-[4/5] sm:aspect-[4/4.6]">
                    <MomentArt moment={moment} index={index} />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute bottom-5 right-5 grid h-11 w-11 translate-y-3 place-items-center rounded-full border border-ember/40 bg-ink/60 text-ember opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>

                <div className="mt-5 flex items-start justify-between gap-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:text-[9px] sm:tracking-[0.18em]">
                      {moment.event}
                    </p>
                    <h3 className="mt-2 font-display text-2xl tracking-tight transition-colors duration-300 group-hover:text-ember">
                      {moment.title}
                    </h3>
                  </div>
                  <span className="mt-1 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-ember sm:text-[9px] sm:tracking-[0.16em]">
                    {moment.rank}
                  </span>
                </div>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">{moment.description}</p>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="h-px flex-1 bg-line/10">
            <div
              className="h-px bg-ember shadow-[0_0_12px_rgba(255,59,78,0.8)] transition-[width] duration-200"
              style={{ width: `${Math.max(progress, 6)}%` }}
            />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:text-[9px] sm:tracking-[0.16em]">Gallery</span>
        </div>

        <Reveal>
          <p className="mt-8 max-w-xl font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-muted">
            Photographs are added as the archive grows. Each moment is kept with its event, result
            and story.
          </p>
        </Reveal>
      </div>

      <Modal
        open={activeMoment !== null}
        onClose={() => setActiveIndex(null)}
        label={activeMoment ? `${activeMoment.title}, ${activeMoment.rank}` : 'Winning moment'}
        panelClassName="max-w-6xl"
      >
        {activeMoment && activeIndex !== null ? (
          <div className="grid overflow-hidden border border-line/10 bg-surface lg:grid-cols-[1.02fr_0.98fr]">
            <div className="relative aspect-[4/5] sm:aspect-[4/3.6] lg:aspect-auto lg:min-h-[560px]">
              <MomentArt moment={activeMoment} index={activeIndex} expanded />
            </div>

            <div className="flex flex-col justify-between gap-10 p-6 sm:p-10 lg:p-12">
              <div>
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                  <span>Moment {String(activeIndex + 1).padStart(2, '0')} / {String(moments.length).padStart(2, '0')}</span>
                  <span className="flex items-center gap-2 text-ember">
                    <span className="h-1 w-1 rounded-full bg-ember shadow-[0_0_8px_rgba(255,59,78,0.9)]" />
                    {activeMoment.rank}
                  </span>
                </div>

                <h3 className="display mt-8 text-4xl sm:text-5xl">{activeMoment.title}</h3>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ember">
                  {activeMoment.event}
                </p>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                  {activeMoment.description}
                </p>

                {(activeMoment.date || activeMoment.location) && (
                  <div className="mt-8 grid grid-cols-2 gap-5 border-t border-line/10 pt-6">
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted">Date</p>
                      <p className="mt-1.5 text-sm text-paper/80">{activeMoment.date ?? 'To be added'}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted">Venue</p>
                      <p className="mt-1.5 text-sm text-paper/80">{activeMoment.location ?? 'To be added'}</p>
                    </div>
                  </div>
                )}

                {activeMoment.certificate ? (
                  <a
                    href={activeMoment.certificate}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-6 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ember hover:text-paper"
                  >
                    View certificate
                    <ArrowRight className="h-3 w-3" />
                  </a>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-line/10 pt-6">
                <button
                  onClick={() => setActiveIndex((activeIndex - 1 + moments.length) % moments.length)}
                  className="group inline-flex min-h-[44px] items-center gap-2 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-paper sm:text-[9px] sm:tracking-[0.16em]"
                >
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                  Previous
                </button>
                <button
                  onClick={() => setActiveIndex((activeIndex + 1) % moments.length)}
                  className="group inline-flex min-h-[44px] items-center gap-2 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-paper sm:text-[9px] sm:tracking-[0.16em]"
                >
                  Next
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  )
}
