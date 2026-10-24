import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Github, Globe } from 'lucide-react'
import { siteConfig } from '../config/site'
import { getAdjacentProject, getProjectBySlug } from '../data/projects'
import { ProjectArtwork } from '../components/projects/ProjectArtwork'
import { Reveal } from '../components/ui/Reveal'
import NotFound from './NotFound'

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'Problem & solution' },
  { id: 'features', label: 'Key features' },
  { id: 'process', label: 'Development process' },
  { id: 'challenges', label: 'Technical challenges' },
  { id: 'stack', label: 'Technology' },
]

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProjectBySlug(slug) : undefined

  useEffect(() => {
    if (!project) return
    const previousTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta?.getAttribute('content') ?? ''
    document.title = `${project.title} — ${siteConfig.name}`
    meta?.setAttribute('content', project.summary)

    return () => {
      document.title = previousTitle
      meta?.setAttribute('content', previousDescription)
    }
  }, [project])

  if (!project) return <NotFound />

  const nextProject = getAdjacentProject(project.slug)

  return (
    <section className="relative pt-[76px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,59,78,0.07),transparent_65%)]" />

      <div className="shell relative pt-8 sm:pt-12">
        <Link
          to="/#projects"
          className="group inline-flex min-h-[40px] items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-paper sm:text-[9px] sm:tracking-[0.18em]"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          All projects
        </Link>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:text-[9px] sm:tracking-[0.18em]">
              <span className="rounded-full border border-ember/25 bg-ember/[0.06] px-3 py-1.5 text-ember">
                Project {project.number}
              </span>
              <span>{project.category}</span>
              <span className="hidden h-1 w-1 rounded-full bg-line/30 sm:block" />
              <span>{project.year}</span>
              <span className="hidden h-1 w-1 rounded-full bg-line/30 sm:block" />
              <span className="text-paper/70">{project.status}</span>
            </div>
            <h1 className="display mt-6 sm:mt-7 text-[clamp(2.3rem,9vw,7.5rem)]">{project.title}</h1>
            <p className="mt-5 max-w-2xl font-display text-xl leading-snug tracking-tight text-paper/90 sm:text-2xl">
              {project.tagline}
            </p>
          </div>

          <div className="lg:pb-3">
            <p className="text-sm leading-relaxed text-muted sm:text-base">{project.summary}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {project.github ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper transition-colors hover:border-ember/40 hover:text-ember sm:text-[9px] sm:tracking-[0.14em]"
                >
                  <Github className="h-3.5 w-3.5" />
                  Repository
                </a>
              ) : null}
              {project.live ? (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-paper px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ember hover:text-paper sm:text-[9px] sm:tracking-[0.14em]"
                >
                  <Globe className="h-3.5 w-3.5" />
                  Live project
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <Reveal clip className="mt-12 lg:mt-16">
          <div className="relative overflow-hidden border border-line/10 bg-surface">
            <div className="aspect-[16/9] sm:aspect-[16/8]">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.imageAlt ?? `${project.title} project visual`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ProjectArtwork
                  variant={project.artwork}
                  accent={project.accent}
                  label={`Abstract artwork for the ${project.title} project`}
                />
              )}
            </div>
            <div className="absolute inset-x-5 top-5 flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.14em] text-paper/60 sm:text-[8.5px] sm:tracking-[0.16em]">
              <span>Case study / {project.number}</span>
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-ember shadow-[0_0_8px_rgba(255,59,78,0.9)]" />
                {project.status}
              </span>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-12 border-t border-line/10 py-12 sm:mt-16 sm:gap-14 sm:py-16 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20 lg:py-24">
          <aside className="h-fit lg:sticky lg:top-28">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:text-[9px] sm:tracking-[0.18em]">In this case study</p>
            <nav className="mt-5 flex flex-col border-t border-line/10" aria-label="Case study sections">
              {SECTIONS.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="group flex items-center justify-between border-b border-line/10 py-3.5 text-sm text-muted transition-colors hover:text-paper"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-[9px] text-muted/50 sm:text-[8px]">{String(index + 1).padStart(2, '0')}</span>
                    {section.label}
                  </span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              ))}
            </nav>

            <div className="mt-8 border border-line/10 bg-surface/30 p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted sm:text-[8px] sm:tracking-[0.18em]">Status</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-paper/80">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    project.status === 'Completed' ? 'bg-paper/60' : project.status === 'In Development' ? 'bg-ember' : 'bg-muted'
                  }`}
                />
                {project.status}
              </p>
              <p className="mt-4 font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.14em] text-muted sm:text-[8px] sm:tracking-[0.16em]">
                Details reflect the current state of the project and evolve as it is built.
              </p>
            </div>
          </aside>

          <div className="space-y-16 lg:space-y-20">
            <div id="overview" className="scroll-mt-28">
              <p className="eyebrow"><span className="h-px w-6 bg-ember/70" />Overview</p>
              <p className="mt-6 font-display text-2xl leading-snug tracking-tight text-paper sm:text-3xl">
                {project.overview}
              </p>
            </div>

            <div id="problem" className="grid scroll-mt-28 gap-10 border-t border-line/10 pt-10 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ember">The problem</p>
                <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{project.problem}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-signal">The approach</p>
                <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{project.solution}</p>
              </div>
            </div>

            <div id="features" className="scroll-mt-28 border-t border-line/10 pt-10">
              <p className="eyebrow"><span className="h-px w-6 bg-ember/70" />Key features</p>
              <ul className="mt-6 grid gap-x-10 gap-y-0 sm:grid-cols-2">
                {project.features.map((feature, index) => (
                  <li key={feature} className="flex items-start gap-4 border-b border-line/10 py-4">
                    <span className="mt-1 font-mono text-[8.5px] tracking-[0.16em] text-muted/60">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm text-paper/85">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div id="process" className="scroll-mt-28 border-t border-line/10 pt-10">
              <p className="eyebrow"><span className="h-px w-6 bg-ember/70" />Development process</p>
              <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {project.process.map((step, index) => (
                  <div key={step.title} className="relative pl-8">
                    <span className="absolute left-0 top-1 font-mono text-[9px] text-ember">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="absolute left-[3px] top-6 h-[calc(100%-1.5rem)] w-px bg-line/10 last:hidden" />
                    <h3 className="font-display text-lg tracking-tight">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div id="challenges" className="scroll-mt-28 border-t border-line/10 pt-10">
              <p className="eyebrow"><span className="h-px w-6 bg-ember/70" />Technical challenges</p>
              <ul className="mt-6 divide-y divide-line/10">
                {project.challenges.map((challenge) => (
                  <li key={challenge} className="flex items-start gap-4 py-4">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ember shadow-[0_0_8px_rgba(255,59,78,0.9)]" />
                    <span className="text-sm leading-relaxed text-muted">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div id="stack" className="scroll-mt-28 border-t border-line/10 pt-10">
              <p className="eyebrow"><span className="h-px w-6 bg-ember/70" />Technology</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-line/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-ember/30 hover:text-paper sm:text-[9px] sm:tracking-[0.14em]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {project.gallery && project.gallery.length > 0 ? (
              <div className="border-t border-line/10 pt-10">
                <p className="eyebrow"><span className="h-px w-6 bg-ember/70" />Gallery</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {project.gallery.map((image) => (
                    <img
                      key={image.src}
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      className="w-full border border-line/10 object-cover"
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {nextProject ? (
          <Link
            to={`/projects/${nextProject.slug}`}
            data-cursor-label="Next"
            className="group flex flex-col gap-6 border-t border-line/10 py-12 sm:flex-row sm:items-center sm:justify-between sm:py-16"
          >
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">Next project</p>
              <h2 className="display mt-3 flex items-center gap-3 text-[clamp(2.4rem,6vw,5rem)] transition-colors duration-300 group-hover:text-ember">
                {nextProject.title}
              </h2>
            </div>
            <div className="flex items-center gap-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:text-[9px] sm:tracking-[0.16em]">{nextProject.category}</span>
              <span className="grid h-14 w-14 place-items-center rounded-full border border-line/15 transition-all duration-300 group-hover:border-ember/50 group-hover:bg-ember/10">
                <ArrowUpRight className="h-5 w-5 text-muted transition-colors group-hover:text-ember" />
              </span>
            </div>
          </Link>
        ) : null}

        <div className="border-t border-line/10 py-10">
          <Link
            to="/"
            className="group inline-flex min-h-[40px] items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-paper sm:text-[9px] sm:tracking-[0.18em]"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to portfolio
          </Link>
        </div>
      </div>
    </section>
  )
}
