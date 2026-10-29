import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  Github,
  Globe,
  Sparkles,
  Filter,
} from 'lucide-react'
import { projects } from '../data/projects'
import { siteConfig } from '../config/site'
import { scrollToTop } from '../lib/scroll'
import { ProjectArtwork } from '../components/projects/ProjectArtwork'
import { Reveal } from '../components/ui/Reveal'

export default function AllProjects() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  useEffect(() => {
    const previousTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta?.getAttribute('content') ?? ''

    document.title = `All Projects — ${siteConfig.name}`
    meta?.setAttribute(
      'content',
      'Explore the complete engineering archive of full-stack platforms, real-time architectures, digital twin platforms, and microservices built by Sanjeet Chauhan.',
    )

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    scrollToTop(true)

    return () => {
      document.title = previousTitle
      meta?.setAttribute('content', previousDescription)
    }
  }, [])

  // Extract unique categories dynamically from projects data
  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category))
    return ['All', ...Array.from(set)]
  }, [])

  // Filter projects dynamically
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects
    return projects.filter((p) => p.category === selectedCategory)
  }, [selectedCategory])

  return (
    <section className="relative min-h-[100svh] pt-[76px]">
      {/* Subtle atmospheric ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,59,78,0.08),transparent_70%)]" />

      <div className="shell relative max-w-7xl py-10 sm:py-14 lg:py-18">
        {/* Navigation back to home */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/10 pb-4">
          <Link
            to="/"
            onClick={() => {
              window.scrollTo(0, 0)
              scrollToTop(true)
            }}
            className="group inline-flex min-h-[40px] items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-paper sm:text-[9px] sm:tracking-[0.18em]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>

          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted sm:text-[8.5px]">
            <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_8px_rgba(255,59,78,0.9)]" />
            <span>Complete Technical Archive ({projects.length})</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="mt-8 max-w-3xl lg:mt-10">
          <p className="eyebrow">
            <span className="h-px w-6 bg-ember/70" />
            Selected Work &amp; Case Studies
          </p>

          <h1 className="display mt-4 text-3xl font-bold tracking-tight text-paper sm:text-4xl lg:text-5xl">
            All Projects
          </h1>

          <p className="mt-3 font-display text-base leading-snug tracking-tight text-paper/90 sm:text-lg">
            A comprehensive catalog of full-stack platforms, real-time collaboration engines, digital twins, and autonomous AI systems.
          </p>

          <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
            Every project represents verified implementation, production-grade architecture, and real-world domain problem solving. Filter by domain or explore the technical case studies below.
          </p>
        </div>

        {/* Dynamic Category Filter Bar */}
        {categories.length > 2 && (
          <div className="mt-8 flex flex-wrap items-center gap-2 border-y border-line/10 py-3 sm:gap-2.5">
            <div className="mr-1.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted sm:text-[8.5px]">
              <Filter className="h-3 w-3 text-ember" />
              <span>Filter:</span>
            </div>
            {categories.map((category) => {
              const active = selectedCategory === category
              const count =
                category === 'All'
                  ? projects.length
                  : projects.filter((p) => p.category === category).length

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.12em] transition-all duration-300 sm:text-[8px] ${
                    active
                      ? 'border-ember bg-ember text-ink shadow-[0_0_16px_rgba(255,59,78,0.4)] font-medium'
                      : 'border-line/15 bg-surface/40 text-muted hover:border-ember/40 hover:text-paper'
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 font-mono text-[7.5px] ${
                      active ? 'bg-ink/30 text-paper' : 'bg-line/20 text-muted'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Responsive Projects Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop/laptop */}
        {filteredProjects.length === 0 ? (
          <div className="my-16 rounded-2xl border border-line/15 bg-surface/30 p-10 text-center sm:p-14">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-line/15 bg-surface/60">
              <Sparkles className="h-5 w-5 text-ember" />
            </div>
            <h3 className="display mt-5 text-xl text-paper">
              No projects found in this category
            </h3>
            <p className="mx-auto mt-2 max-w-md text-xs text-muted sm:text-sm">
              Try switching back to &ldquo;All&rdquo; or explore other domain categories to view the engineering archive.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ember hover:text-paper"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-6 xl:gap-7">
            {filteredProjects.map((project, index) => (
              <Reveal key={project.slug} delay={index * 35}>
                <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line/10 bg-surface/40 p-4 transition-all duration-500 hover:border-ember/40 hover:bg-surface/70 hover:shadow-[0_0_50px_-20px_rgba(255,59,78,0.3)] sm:p-5">
                  <div>
                    {/* Media Visual Link with 16:9 Aspect Ratio */}
                    <Link
                      to={`/projects/${project.slug}`}
                      onClick={() => {
                        window.scrollTo(0, 0)
                        scrollToTop(true)
                      }}
                      data-cursor-label="View"
                      aria-label={`${project.title} — view case study`}
                      className="relative block aspect-[16/9] w-full overflow-hidden rounded-xl border border-line/10 bg-surface transition-all duration-500 group-hover:border-ember/30"
                    >
                      <div className="h-full w-full">
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
                              loading={index < 6 ? 'eager' : 'lazy'}
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

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-60" />

                      {/* Top Floating Badges */}
                      <div className="absolute inset-x-3 top-3 flex items-center justify-between sm:inset-x-3.5 sm:top-3.5">
                        <span className="rounded-full border border-white/10 bg-ink/75 px-2.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-paper/90 backdrop-blur-md">
                          {project.number}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] backdrop-blur-md ${
                            project.status === 'Completed'
                              ? 'border-line/20 bg-ink/75 text-paper/85'
                              : project.status === 'In Development'
                                ? 'border-accent/35 bg-ink/75 text-accent'
                                : 'border-line/15 bg-ink/75 text-muted'
                          }`}
                        >
                          <span
                            className={`h-1 w-1 rounded-full ${
                              project.status === 'Completed'
                                ? 'bg-paper/70'
                                : project.status === 'In Development'
                                  ? 'bg-accent'
                                  : 'bg-muted'
                            }`}
                          />
                          {project.status}
                        </span>
                      </div>
                    </Link>

                    {/* Card Content */}
                    <div className="mt-4 flex flex-col">
                      <div className="flex items-center justify-between gap-2 font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted">
                        <span className="truncate">{project.category}</span>
                        <span className="text-line/30">·</span>
                        <span className="shrink-0">{project.year}</span>
                      </div>

                      <h2 className="display mt-1.5 text-xl font-bold text-paper transition-colors duration-300 group-hover:text-ember sm:text-2xl">
                        <Link
                          to={`/projects/${project.slug}`}
                          onClick={() => {
                            window.scrollTo(0, 0)
                            scrollToTop(true)
                          }}
                          className="inline-flex items-center gap-1.5"
                        >
                          {project.title}
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-ember" />
                        </Link>
                      </h2>

                      <p className="mt-1 font-display text-xs leading-snug tracking-tight text-paper/90 line-clamp-1 sm:text-sm">
                        {project.tagline}
                      </p>

                      <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-2">
                        {project.summary}
                      </p>

                      {/* Tech Badges */}
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {project.tech.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-line/10 bg-surface/60 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-muted transition-colors group-hover:border-line/20 group-hover:text-paper/80"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech.length > 4 && (
                          <span className="rounded-full border border-line/10 px-1.5 py-0.5 font-mono text-[7.5px] text-muted/60">
                            +{project.tech.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line/10 pt-3.5">
                    <Link
                      to={`/projects/${project.slug}`}
                      onClick={() => {
                        window.scrollTo(0, 0)
                        scrollToTop(true)
                      }}
                      className="group/btn inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-paper transition-colors hover:text-ember"
                    >
                      <span className="relative">
                        Case study
                        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-300 group-hover/btn:scale-x-100" />
                      </span>
                      <ArrowUpRight className="h-3 w-3 text-muted transition-colors group-hover/btn:text-ember" />
                    </Link>

                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${project.title} live demo`}
                        className="inline-flex min-h-[28px] items-center gap-1 rounded-full border border-ember/30 bg-ember/10 px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-paper transition-colors hover:border-ember hover:bg-ember/20 hover:text-ember"
                      >
                        <Globe className="h-2.5 w-2.5 text-ember" />
                        Live Demo
                      </a>
                    )}

                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${project.title} GitHub repository`}
                        className="inline-flex min-h-[28px] items-center gap-1 rounded-full border border-line/15 px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-ember/40 hover:text-paper"
                      >
                        <Github className="h-2.5 w-2.5" />
                        Code
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}

        {/* Bottom Back Button & Status strip */}
        <div className="mt-14 flex flex-col gap-4 border-t border-line/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            onClick={() => {
              window.scrollTo(0, 0)
              scrollToTop(true)
            }}
            className="group inline-flex min-h-[42px] items-center gap-2 rounded-full border border-line/20 bg-surface/50 px-5 py-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted transition-all duration-300 hover:border-ember/40 hover:bg-surface hover:text-paper sm:text-[9px]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to homepage
          </Link>

          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted sm:text-[8.5px]">
            {projects.length} Total Projects · Continuously Updated
          </p>
        </div>
      </div>
    </section>
  )
}
