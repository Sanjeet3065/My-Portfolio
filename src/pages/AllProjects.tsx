import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Sparkles,
  Filter,
} from 'lucide-react'
import { projects } from '../data/projects'
import { siteConfig } from '../config/site'
import { scrollToTop } from '../lib/scroll'
import { SkiperPerspectiveCarousel } from '../components/projects/SkiperPerspectiveCarousel'

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

        {/* Interactive Skiper49 Inverted Perspective Carousel */}
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
          <div className="mt-8">
            <SkiperPerspectiveCarousel projects={filteredProjects} />
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
