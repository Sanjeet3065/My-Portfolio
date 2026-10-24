import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { timeline } from '../../data/timeline'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { SectionHeading } from '../ui/SectionHeading'

gsap.registerPlugin(ScrollTrigger)

export function Journey() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const context = gsap.context(() => {
      if (lineRef.current && listRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: listRef.current,
              start: 'top 72%',
              end: 'bottom 78%',
              scrub: 0.8,
            },
          },
        )
      }

      gsap.utils.toArray<HTMLElement>('[data-milestone]').forEach((item) => {
        gsap.fromTo(
          item,
          { y: 38, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 88%' },
          },
        )
      })
    }, sectionRef)

    return () => context.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} id="journey" className="section-pad relative border-t border-line/10">
      <div className="pointer-events-none absolute right-0 top-24 h-[380px] w-[380px] rounded-full bg-signal/[0.05] blur-[130px]" />

      <div className="shell relative">
        <SectionHeading
          index="04"
          label="The Journey"
          title={
            <>
              Still being
              <br />
              <span className="text-muted">written.</span>
            </>
          }
          description="A path from first principles to full-stack products — built in phases, tested by projects, and far from finished."
        />

        <div ref={listRef} className="relative mt-12 sm:mt-16 lg:mt-24">
          <div className="absolute bottom-0 left-[3px] top-0 w-px bg-line/10 sm:left-[5px]" />
          <div ref={lineRef} className="timeline-progress absolute bottom-0 left-[3px] top-0 w-px sm:left-[5px]" />

          {timeline.map((milestone, index) => (
            <div
              key={milestone.phase}
              data-milestone
              className="relative grid gap-5 pb-12 pl-9 sm:grid-cols-[0.75fr_1.25fr] sm:gap-10 sm:pl-16 lg:pb-16"
            >
              <div className="absolute left-0 top-2 flex h-4 w-4 items-center justify-center sm:h-5 sm:w-5">
                <span className="absolute h-4 w-4 rounded-full bg-ember/10 blur-[6px]" />
                <span className="relative h-2 w-2 rounded-full border border-ember/60 bg-ink">
                  <span className="absolute inset-[2px] rounded-full bg-ember shadow-[0_0_8px_rgba(255,59,78,0.9)]" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ember sm:text-[9px] sm:tracking-[0.2em]">{milestone.phase}</span>
                  <span className="h-px flex-1 bg-line/10 sm:hidden" />
                </div>
                <h3 className="mt-3 font-display text-2xl leading-tight tracking-tight sm:text-3xl">
                  {milestone.title}
                </h3>
                <span className="mt-4 hidden font-mono text-[9px] uppercase tracking-[0.18em] text-muted sm:inline-block">
                  {String(index + 1).padStart(2, '0')} / 06
                </span>
              </div>

              <div className="max-w-xl">
                <p className="text-sm leading-relaxed text-muted sm:text-base">{milestone.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {milestone.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line/10 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted sm:text-[8.5px] sm:tracking-[0.14em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pl-9 font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:pl-16 sm:text-[9px] sm:tracking-[0.18em]">
          <span className="h-1 w-1 rounded-full bg-ember shadow-[0_0_8px_rgba(255,59,78,0.9)]" />
          Next phase loading
        </div>
      </div>
    </section>
  )
}
