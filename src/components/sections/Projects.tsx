import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Github, Globe } from 'lucide-react'
import { projects } from '../../data/projects'
import type { ProjectStatus } from '../../types'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { ProjectArtwork } from '../projects/ProjectArtwork'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { scrollToTop } from '../../lib/scroll'

gsap.registerPlugin(ScrollTrigger)

const STATUS_STYLES: Record<ProjectStatus, string> = {
  Completed: 'border-paper/20 bg-paper/[0.06] text-paper',
  'In Development': 'border-accent/35 bg-accent/[0.09] text-accent',
  Concept: 'border-line/20 bg-surface/60 text-muted',
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const context = gsap.context(() => {
      const isMobile = window.innerWidth < 768
      const startScale = isMobile ? 1.05 : 1.12
      const media = gsap.utils.toArray<HTMLElement>('[data-project-media]')
      media.forEach((element) => {
        gsap.fromTo(
          element,
          { scale: startScale },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
    }, sectionRef)

    return () => context.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} id="projects" className="section-pad relative border-t border-line/10">
      <div className="shell">
        <SectionHeading
          index="03"
          label="Selected Work"
          title={
            <>
              Built to be used,
              <br />
              <span className="text-muted">not just shown.</span>
            </>
          }
          description="Five projects across full stack development, real-time systems and interface engineering. Each one pushed a different part of the stack — and a different part of my judgement."
        />

        <div className="mt-12 border-t border-line/10 sm:mt-16 lg:mt-24">
          {projects.map((project, index) => (
            <article key={project.slug} className="border-b border-line/10 py-10 sm:py-14 lg:py-20">
              <Reveal>
                <div
                  className="group grid gap-7 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-14 xl:gap-16"
                >
                  <Link
                    to={`/projects/${project.slug}`}
                    onClick={() => {
                      window.scrollTo(0, 0)
                      scrollToTop(true)
                    }}
                    data-cursor-label="View"
                    aria-label={`${project.title} — view case study`}
                    className={`relative block overflow-hidden rounded-xl sm:rounded-2xl border border-line/10 bg-surface transition-all duration-500 group-hover:border-ember/30 group-hover:shadow-[0_0_90px_-40px_rgba(255,59,78,0.55)] w-full max-w-[560px] mx-auto lg:max-w-none ${
                      index % 2 === 1 ? 'lg:order-2' : ''
                    } ${project.slug === 'krishi-suraksha' ? 'lg:max-w-[90%] lg:mx-auto' : ''}`}
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <div data-project-media className="h-full w-full will-change-transform">
                        {project.image ? (
                          <picture>
                            <source
                              srcSet={project.image.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
                              type="image/webp"
                            />
                            <img
                              src={project.image}
                              alt={project.imageAlt ?? `${project.title} project preview`}
                              className="h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.035]"
                              loading={index === 0 ? 'eager' : 'lazy'}
                              decoding="async"
                            />
                          </picture>
                        ) : (
                          <ProjectArtwork
                            variant={project.artwork}
                            accent={project.accent}
                            label={`Abstract artwork for the ${project.title} project`}
                            className="transition-transform duration-700 ease-editorial group-hover:scale-[1.035]"
                          />
                        )}
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-60" />
                    <div className="absolute inset-x-5 top-5 flex items-center justify-between">
                      <span className="rounded-full border border-white/10 bg-ink/50 px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-paper/70 backdrop-blur-md sm:text-[8.5px] sm:tracking-[0.16em]">
                        Project / {project.number}
                      </span>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] backdrop-blur-md sm:text-[8.5px] sm:tracking-[0.14em] ${
                          project.status === 'Completed'
                            ? 'border-line/20 bg-ink/50 text-paper/70'
                            : project.status === 'In Development'
                              ? 'border-accent/30 bg-ink/50 text-accent'
                              : 'border-line/15 bg-ink/50 text-muted'
                        }`}
                      >
                        <span className={`h-1 w-1 rounded-full ${project.status === 'Completed' ? 'bg-paper/60' : project.status === 'In Development' ? 'bg-accent' : 'bg-muted'}`} />
                        {project.status}
                      </span>
                    </div>
                  </Link>

                  <div className={index % 2 === 1 ? 'lg:order-1 lg:pr-4' : 'lg:pl-4'}>
                    <div className="flex items-center gap-4">
                      <span className="display text-4xl font-medium text-muted/30 transition-colors duration-500 group-hover:text-ember/60 sm:text-5xl">
                        {project.number}
                      </span>
                      <span className="h-px flex-1 bg-line/10" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:text-[9px] sm:tracking-[0.16em]">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="display mt-5 sm:mt-6 text-[clamp(2.1rem,5.5vw,4.6rem)]">
                      <Link
                        to={`/projects/${project.slug}`}
                        onClick={() => {
                          window.scrollTo(0, 0)
                          scrollToTop(true)
                        }}
                        className="inline-flex items-center gap-3 transition-colors hover:text-paper"
                      >
                        {project.title}
                        <span className="h-1.5 w-1.5 rounded-full bg-ember opacity-0 shadow-[0_0_14px_rgba(255,59,78,0.9)] transition-opacity duration-300 group-hover:opacity-100" />
                      </Link>
                    </h3>

                    <p className="mt-3 font-display text-lg leading-snug tracking-tight text-paper/90 sm:text-xl">
                      {project.tagline}
                    </p>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">{project.summary}</p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tech.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-line/10 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted transition-colors duration-300 group-hover:border-line/20 group-hover:text-paper/80 sm:text-[8.5px] sm:tracking-[0.14em]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <Link
                        to={`/projects/${project.slug}`}
                        onClick={() => {
                          window.scrollTo(0, 0)
                          scrollToTop(true)
                        }}
                        className="group/btn inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-paper sm:text-[10px] sm:tracking-[0.16em]"
                      >
                        <span className="relative">
                          View case study
                          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-500 ease-editorial group-hover/btn:scale-x-100" />
                        </span>
                        <span className="grid h-9 w-9 place-items-center rounded-full border border-line/15 transition-all duration-300 group-hover/btn:border-ember/50 group-hover/btn:bg-ember/10 sm:h-8 sm:w-8">
                          <ArrowUpRight className="h-3.5 w-3.5 text-muted transition-colors group-hover/btn:text-ember" />
                        </span>
                      </Link>

                      {project.live ? (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={`${project.title} live preview`}
                          className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-ember/35 bg-ember/[0.08] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper transition-colors hover:border-ember hover:bg-ember/20 hover:text-ember sm:text-[9px] sm:tracking-[0.14em]"
                        >
                          <Globe className="h-3.5 w-3.5 text-ember" />
                          Live Demo
                        </a>
                      ) : null}

                      {project.github ? (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={`${project.title} GitHub repository`}
                          className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-line/15 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-ember/40 hover:text-paper sm:text-[9px] sm:tracking-[0.14em]"
                        >
                          <Github className="h-3.5 w-3.5" />
                          Repository
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Reveal>
            </article>
          ))}
        </div>

        <Reveal>
          <div className="mt-8 flex flex-col gap-3 border-t border-line/10 pt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:flex-row sm:items-center sm:justify-between sm:text-[9px] sm:tracking-[0.16em]">
            <span>05 projects · full stack &amp; interface engineering</span>
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-ember shadow-[0_0_8px_rgba(255,59,78,0.9)]" />
              More in progress
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
