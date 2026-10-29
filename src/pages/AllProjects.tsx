import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  Github,
  Globe,
  Sparkles,
  Filter,
  Disc,
  LayoutGrid,
} from 'lucide-react'
import { projects } from '../data/projects'
import { siteConfig } from '../config/site'
import { scrollToTop } from '../lib/scroll'
import { ProjectArtwork } from '../components/projects/ProjectArtwork'
import { Reveal } from '../components/ui/Reveal'
import { WorksWheel, type WorksWheelItem } from '../components/ui/WorksWheel'

export default function AllProjects() {
  const [viewMode, setViewMode] = useState<'wheel' | 'grid'>('wheel')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [activeWheelIndex, setActiveWheelIndex] = useState<number>(0)

  useEffect(() => {
    const previousTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta?.getAttribute('content') ?? ''

    document.title = `All Projects — ${siteConfig.name}`
    meta?.setAttribute(
      'content',
      'Explore the interactive 3D engineering archive of full-stack platforms, real-time architectures, digital twin platforms, and microservices built by Sanjeet Chauhan.',
    )

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    scrollToTop(true)

    return () => {
      document.title = previousTitle
      meta?.setAttribute('content', previousDescription)
    }
  }, [])

  // Map projects to WorksWheelItem shape
  const wheelItems = useMemo<WorksWheelItem[]>(() => {
    return projects.map((p) => ({
      id: p.slug,
      slug: p.slug,
      title: p.title,
      category: p.category,
      number: p.number,
      year: p.year,
      status: p.status,
      tagline: p.tagline,
      summary: p.summary,
      href: `/projects/${p.slug}`,
      image: p.image,
      imageAlt: p.imageAlt,
      artwork: p.artwork,
      accent: p.accent,
    }))
  }, [])

  // Extract unique categories dynamically from projects data for grid view
  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category))
    return ['All', ...Array.from(set)]
  }, [])

  // Filter projects dynamically for grid view
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects
    return projects.filter((p) => p.category === selectedCategory)
  }, [selectedCategory])

  const currentSpotlightProject = projects[activeWheelIndex] || projects[0]

  return (
    <section className="relative min-h-[100svh] pt-[76px]">
      {/* Subtle atmospheric ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,59,78,0.08),transparent_70%)]" />

      <div className="shell relative py-12 sm:py-16 lg:py-24">
        {/* Navigation back to home */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            onClick={() => {
              window.scrollTo(0, 0)
              scrollToTop(true)
            }}
            className="group inline-flex min-h-[44px] items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-paper sm:text-[9px] sm:tracking-[0.18em]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>

          <div className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted sm:text-[8.5px]">
            <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_8px_rgba(255,59,78,0.9)]" />
            <span>Complete Technical Archive ({projects.length})</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="mt-10 flex flex-col justify-between gap-8 lg:mt-14 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow">
              <span className="h-px w-6 bg-ember/70" />
              Interactive Works Wheel &amp; Case Studies
            </p>

            <h1 className="display mt-6 text-[clamp(2.5rem,8vw,6.5rem)] leading-[0.95] text-paper">
              All Projects
            </h1>

            <p className="mt-5 max-w-2xl font-display text-xl leading-snug tracking-tight text-paper/90 sm:text-2xl">
              A comprehensive catalog of full-stack platforms, real-time collaboration engines, digital twins, and autonomous AI systems.
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              Explore projects using the 3D interactive wheel below or switch to the classic grid archive. Click any project card to open its detailed technical case study.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-line/20 bg-surface/60 p-1.5 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setViewMode('wheel')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-all duration-300 ${
                viewMode === 'wheel'
                  ? 'border border-ember/50 bg-ember text-ink font-semibold shadow-[0_0_20px_rgba(255,59,78,0.4)]'
                  : 'text-muted hover:text-paper hover:bg-surface/50'
              }`}
            >
              <Disc className="h-3.5 w-3.5" />
              <span>3D Wheel View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'border border-ember/50 bg-ember text-ink font-semibold shadow-[0_0_20px_rgba(255,59,78,0.4)]'
                  : 'text-muted hover:text-paper hover:bg-surface/50'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid Archive</span>
            </button>
          </div>
        </div>

        {/* ---------------- 3D WHEEL VIEW ---------------- */}
        {viewMode === 'wheel' && (
          <div className="mt-10 sm:mt-12 lg:mt-14">
            <Reveal>
              <WorksWheel
                items={wheelItems}
                label="ALL PROJECTS"
                action="View Case Study"
                onActiveChange={setActiveWheelIndex}
              />
            </Reveal>

            {/* Spotlight Banner for Active Wheel Project */}
            {currentSpotlightProject && (
              <Reveal delay={100}>
                <div className="mt-8 rounded-2xl border border-line/15 bg-surface/40 p-6 backdrop-blur-md transition-all duration-300 hover:border-ember/30 sm:p-8 lg:mt-10">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap items-center gap-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted sm:text-[8.5px]">
                        <span className="rounded-full border border-line/20 bg-ink/70 px-2.5 py-0.5 text-paper/80">
                          Active Project #{currentSpotlightProject.number}
                        </span>
                        <span>{currentSpotlightProject.category}</span>
                        <span className="text-line/40">·</span>
                        <span>{currentSpotlightProject.year}</span>
                      </div>

                      <h3 className="display mt-3 text-2xl font-bold text-paper sm:text-3xl">
                        {currentSpotlightProject.title}
                      </h3>

                      <p className="mt-2 font-display text-sm leading-snug text-paper/90 sm:text-base">
                        {currentSpotlightProject.tagline}
                      </p>

                      <p className="mt-3 text-xs leading-relaxed text-muted line-clamp-2 sm:text-sm">
                        {currentSpotlightProject.summary}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                        {currentSpotlightProject.tech.slice(0, 6).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-line/10 bg-surface/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted sm:text-[8px]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end">
                      <Link
                        to={`/projects/${currentSpotlightProject.slug}`}
                        onClick={() => {
                          window.scrollTo(0, 0)
                          scrollToTop(true)
                        }}
                        className="group/btn inline-flex min-h-[46px] items-center gap-2.5 rounded-full border border-ember/50 bg-ember px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink font-semibold shadow-[0_0_30px_-5px_rgba(255,59,78,0.6)] transition-all duration-300 hover:bg-paper hover:border-paper hover:shadow-[0_0_35px_rgba(255,255,255,0.4)]"
                      >
                        <span>Read Case Study</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </Link>

                      <div className="flex items-center gap-2">
                        {currentSpotlightProject.live && (
                          <a
                            href={currentSpotlightProject.live}
                            target="_blank"
                            rel="noreferrer noopener"
                            aria-label={`${currentSpotlightProject.title} live demo`}
                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-line/15 bg-surface/50 px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-paper transition-colors hover:border-ember/40 hover:text-ember"
                          >
                            <Globe className="h-3 w-3 text-ember" />
                            Live Demo
                          </a>
                        )}

                        {currentSpotlightProject.github && (
                          <a
                            href={currentSpotlightProject.github}
                            target="_blank"
                            rel="noreferrer noopener"
                            aria-label={`${currentSpotlightProject.title} GitHub repository`}
                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-line/15 bg-surface/50 px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-ember/40 hover:text-paper"
                          >
                            <Github className="h-3 w-3" />
                            Code
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        )}

        {/* ---------------- GRID ARCHIVE VIEW ---------------- */}
        {viewMode === 'grid' && (
          <div className="mt-10 sm:mt-12 lg:mt-14">
            {/* Dynamic Category Filter Bar */}
            {categories.length > 2 && (
              <div className="flex flex-wrap items-center gap-2 border-y border-line/10 py-4 sm:gap-3">
                <div className="mr-2 flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted sm:text-[8.5px]">
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
                      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] transition-all duration-300 sm:text-[8.5px] ${
                        active
                          ? 'border-ember bg-ember text-ink shadow-[0_0_16px_rgba(255,59,78,0.4)] font-medium'
                          : 'border-line/15 bg-surface/40 text-muted hover:border-ember/40 hover:text-paper'
                      }`}
                    >
                      <span>{category}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.2 font-mono text-[8px] ${
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

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className="my-20 rounded-2xl border border-line/15 bg-surface/30 p-12 text-center sm:p-16">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-line/15 bg-surface/60">
                  <Sparkles className="h-6 w-6 text-ember" />
                </div>
                <h3 className="display mt-6 text-2xl text-paper">
                  No projects found in this category
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                  Try switching back to &ldquo;All&rdquo; or explore other domain categories to view the engineering archive.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ember hover:text-paper"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="mt-12 grid gap-8 sm:gap-10 md:grid-cols-2 xl:gap-12">
                {filteredProjects.map((project, index) => (
                  <Reveal key={project.slug} delay={index * 40}>
                    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line/10 bg-surface/40 p-5 transition-all duration-500 hover:border-ember/40 hover:bg-surface/70 hover:shadow-[0_0_60px_-25px_rgba(255,59,78,0.35)] sm:p-7">
                      {/* Media Visual Link */}
                      <Link
                        to={`/projects/${project.slug}`}
                        onClick={() => {
                          window.scrollTo(0, 0)
                          scrollToTop(true)
                        }}
                        data-cursor-label="View"
                        aria-label={`${project.title} — view case study`}
                        className="relative block aspect-[16/10] w-full overflow-hidden rounded-xl border border-line/10 bg-surface transition-all duration-500 group-hover:border-ember/30"
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
                                loading={index < 4 ? 'eager' : 'lazy'}
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

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-60" />

                        {/* Top Floating Badges */}
                        <div className="absolute inset-x-4 top-4 flex items-center justify-between sm:inset-x-5 sm:top-5">
                          <span className="rounded-full border border-white/10 bg-ink/60 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/80 backdrop-blur-md">
                            Project / {project.number}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.12em] backdrop-blur-md ${
                              project.status === 'Completed'
                                ? 'border-line/20 bg-ink/60 text-paper/80'
                                : project.status === 'In Development'
                                  ? 'border-accent/30 bg-ink/60 text-accent'
                                  : 'border-line/15 bg-ink/60 text-muted'
                            }`}
                          >
                            <span
                              className={`h-1 w-1 rounded-full ${
                                project.status === 'Completed'
                                  ? 'bg-paper/60'
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
                      <div className="mt-6 flex flex-1 flex-col">
                        <div className="flex items-center justify-between gap-3 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted sm:text-[8.5px]">
                          <span>{project.category}</span>
                          <span className="text-line/40">·</span>
                          <span>{project.year}</span>
                        </div>

                        <h2 className="display mt-3 text-2xl text-paper transition-colors duration-300 group-hover:text-ember sm:text-3xl">
                          <Link
                            to={`/projects/${project.slug}`}
                            onClick={() => {
                              window.scrollTo(0, 0)
                              scrollToTop(true)
                            }}
                            className="inline-flex items-center gap-2"
                          >
                            {project.title}
                            <ArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-ember" />
                          </Link>
                        </h2>

                        <p className="mt-2 font-display text-sm leading-snug tracking-tight text-paper/90 sm:text-base">
                          {project.tagline}
                        </p>

                        <p className="mt-3 text-xs leading-relaxed text-muted line-clamp-3 sm:text-sm">
                          {project.summary}
                        </p>

                        {/* Tech Badges */}
                        <div className="mt-5 flex flex-wrap gap-1.5 sm:gap-2">
                          {project.tech.slice(0, 5).map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-line/10 bg-surface/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted transition-colors group-hover:border-line/20 group-hover:text-paper/80 sm:text-[8px]"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.tech.length > 5 && (
                            <span className="rounded-full border border-line/10 px-2 py-1 font-mono text-[8px] text-muted/60">
                              +{project.tech.length - 5}
                            </span>
                          )}
                        </div>

                        {/* Bottom Action Buttons */}
                        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line/10 pt-5">
                          <Link
                            to={`/projects/${project.slug}`}
                            onClick={() => {
                              window.scrollTo(0, 0)
                              scrollToTop(true)
                            }}
                            className="group/btn inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-paper transition-colors hover:text-ember sm:text-[9px]"
                          >
                            <span className="relative">
                              Case study
                              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-300 group-hover/btn:scale-x-100" />
                            </span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-muted transition-colors group-hover/btn:text-ember" />
                          </Link>

                          {project.live && (
                            <a
                              href={project.live}
                              target="_blank"
                              rel="noreferrer noopener"
                              aria-label={`${project.title} live demo`}
                              className="inline-flex min-h-[32px] items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-paper transition-colors hover:border-ember hover:bg-ember/20 hover:text-ember"
                            >
                              <Globe className="h-3 w-3 text-ember" />
                              Live Demo
                            </a>
                          )}

                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noreferrer noopener"
                              aria-label={`${project.title} GitHub repository`}
                              className="inline-flex min-h-[32px] items-center gap-1.5 rounded-full border border-line/15 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-ember/40 hover:text-paper"
                            >
                              <Github className="h-3 w-3" />
                              Code
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Back Button & Status strip */}
        <div className="mt-16 flex flex-col gap-4 border-t border-line/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            onClick={() => {
              window.scrollTo(0, 0)
              scrollToTop(true)
            }}
            className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-line/20 bg-surface/50 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-all duration-300 hover:border-ember/40 hover:bg-surface hover:text-paper sm:text-[9px]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to homepage
          </Link>

          <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted sm:text-[8.5px]">
            {projects.length} Total Projects · Continuously Updated
          </p>
        </div>
      </div>
    </section>
  )
}
