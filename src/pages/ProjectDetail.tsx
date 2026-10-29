import { useEffect, useLayoutEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Github, Globe } from 'lucide-react'
import { siteConfig } from '../config/site'
import { getAdjacentProject, getProjectBySlug } from '../data/projects'
import { ProjectArtwork } from '../components/projects/ProjectArtwork'
import { Reveal } from '../components/ui/Reveal'
import { scrollToTop } from '../lib/scroll'
import NotFound from './NotFound'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProjectBySlug(slug) : undefined

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    scrollToTop(true)
  }, [slug])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    scrollToTop(true)
    const t1 = setTimeout(() => {
      window.scrollTo(0, 0)
      scrollToTop(true)
    }, 40)
    const t2 = setTimeout(() => {
      window.scrollTo(0, 0)
      scrollToTop(true)
    }, 150)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [slug])

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

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'problem', label: 'Problem & solution' },
    { id: 'features', label: 'Key features' },
    ...(project.architectureLayers?.length ? [{ id: 'architecture', label: 'System architecture' }] : []),
    ...(project.process?.length ? [{ id: 'process', label: 'Development process' }] : []),
    ...(project.engineeringWork?.length ? [{ id: 'engineering', label: 'Engineering contributions' }] : []),
    ...(project.challenges?.length ? [{ id: 'challenges', label: 'Technical challenges' }] : []),
    ...(project.decisions?.length ? [{ id: 'decisions', label: 'Architectural decisions (ADRs)' }] : []),
    { id: 'stack', label: 'Technology stack' },
    ...(project.learnings?.length ? [{ id: 'learnings', label: 'What I learned' }] : []),
    ...(project.gallery?.length ? [{ id: 'gallery', label: 'Visual showcase' }] : []),
  ]

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
                  GitHub Repository
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

        {/* Case Study Hero Visual - Centered and reduced by ~10-15% with max-w-5xl */}
        <Reveal clip className="mx-auto mt-10 w-full max-w-5xl lg:mt-12">
          <div className="relative overflow-hidden border border-line/10 bg-surface shadow-2xl">
            <div className="aspect-[16/9] sm:aspect-[16/8.2]">
              {project.image ? (
                <picture>
                  <source
                    srcSet={project.image.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
                    type="image/webp"
                  />
                  <img
                    src={project.image}
                    alt={project.imageAlt ?? `${project.title} project visual`}
                    className="h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </picture>
              ) : (
                <ProjectArtwork
                  variant={project.artwork}
                  accent={project.accent}
                  label={`Abstract artwork for the ${project.title} project`}
                />
              )}
            </div>
            <div className="absolute inset-x-5 top-5 flex items-center justify-between font-mono text-[9.5px] uppercase tracking-[0.14em] text-paper/70 backdrop-blur-md sm:text-[8.5px] sm:tracking-[0.16em]">
              <span className="rounded-full border border-white/10 bg-ink/60 px-3 py-1.5">
                Case study / {project.number}
              </span>
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-ink/60 px-3 py-1.5">
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
              {sections.map((section, index) => (
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
                Details reflect actual implementation architecture and verified repository state.
              </p>
            </div>
          </aside>

          <div className="space-y-16 lg:space-y-20">
            <div id="overview" className="scroll-mt-28">
              <p className="eyebrow"><span className="h-px w-6 bg-ember/70" />Project overview</p>
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
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-signal">The solution</p>
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
                    <span className="text-sm leading-relaxed text-paper/85">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {project.architectureLayers && project.architectureLayers.length > 0 ? (
              <div id="architecture" className="scroll-mt-28 border-t border-line/10 pt-10">
                <p className="eyebrow"><span className="h-px w-6 bg-ember/70" />System architecture</p>
                {project.architectureOverview ? (
                  <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                    {project.architectureOverview}
                  </p>
                ) : null}
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {project.architectureLayers.map((layer) => (
                    <div key={layer.layer} className="border border-line/10 bg-surface/40 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-display text-base text-paper">{layer.layer}</h4>
                        <span className="rounded-full border border-line/15 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-accent">
                          {layer.technologies}
                        </span>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-muted sm:text-sm">{layer.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

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

            {project.engineeringWork && project.engineeringWork.length > 0 ? (
              <div id="engineering" className="scroll-mt-28 border-t border-line/10 pt-10">
                <p className="eyebrow"><span className="h-px w-6 bg-ember/70" />My engineering work</p>
                <div className="mt-8 space-y-4">
                  {project.engineeringWork.map((work, index) => (
                    <div key={work.title} className="border border-line/10 bg-surface/30 p-5 sm:p-6">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[9px] text-ember sm:text-[8.5px]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h4 className="font-display text-base text-paper sm:text-lg">{work.title}</h4>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted">{work.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

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

            {project.decisions && project.decisions.length > 0 ? (
              <div id="decisions" className="scroll-mt-28 border-t border-line/10 pt-10">
                <p className="eyebrow"><span className="h-px w-6 bg-ember/70" />Architectural decisions (ADRs)</p>
                <div className="mt-8 space-y-5">
                  {project.decisions.map((adr) => (
                    <div key={adr.id} className="border border-line/10 bg-surface/35 p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="rounded-full border border-ember/30 bg-ember/10 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ember">
                          {adr.id}
                        </span>
                        <h4 className="font-display text-base text-paper">{adr.title}</h4>
                      </div>
                      <div className="mt-4 grid gap-3 text-xs sm:text-sm">
                        <div>
                          <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-muted">Context:</span>
                          <p className="mt-1 text-muted leading-relaxed">{adr.context}</p>
                        </div>
                        <div>
                          <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-signal">Decision:</span>
                          <p className="mt-1 text-paper/90 leading-relaxed">{adr.decision}</p>
                        </div>
                        <div>
                          <span className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-accent">Consequence:</span>
                          <p className="mt-1 text-muted leading-relaxed">{adr.consequence}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div id="stack" className="scroll-mt-28 border-t border-line/10 pt-10">
              <p className="eyebrow"><span className="h-px w-6 bg-ember/70" />Technology stack</p>
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

            {project.learnings && project.learnings.length > 0 ? (
              <div id="learnings" className="scroll-mt-28 border-t border-line/10 pt-10">
                <p className="eyebrow"><span className="h-px w-6 bg-ember/70" />What I learned</p>
                <ul className="mt-6 divide-y divide-line/10">
                  {project.learnings.map((learning) => (
                    <li key={learning} className="flex items-start gap-4 py-4">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent shadow-[0_0_8px_rgba(56,189,248,0.7)]" />
                      <span className="text-sm leading-relaxed text-muted">{learning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {project.gallery && project.gallery.length > 0 ? (
              <div id="gallery" className="scroll-mt-28 border-t border-line/10 pt-10">
                <p className="eyebrow"><span className="h-px w-6 bg-ember/70" />Visual showcase</p>
                <div className="mt-8 space-y-6">
                  {project.gallery.map((image) => (
                    <figure key={image.src} className="overflow-hidden border border-line/10 bg-surface/50">
                      <picture>
                        <source
                          srcSet={image.src.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
                          type="image/webp"
                        />
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading="lazy"
                          className="w-full object-cover"
                        />
                      </picture>
                      {image.caption ? (
                        <figcaption className="border-t border-line/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:text-[9px] sm:tracking-[0.16em]">
                          {image.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="border-t border-line/10 pt-10">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line/10 bg-surface/30 p-6">
                <div>
                  <h4 className="font-display text-lg text-paper">Explore the repository</h4>
                  <p className="mt-1 text-xs text-muted sm:text-sm">Inspect source code, microservices architecture, and technical documentation.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {project.github ? (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper transition-colors hover:border-ember/40 hover:text-ember sm:text-[9px] sm:tracking-[0.14em]"
                    >
                      <Github className="h-3.5 w-3.5" />
                      GitHub Repository
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
                      Live Project
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Project Summary Badge & Actions */}
        <div className="border-t border-line/10 py-10 sm:py-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted sm:text-[8.5px]">
                <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_10px_rgba(255,59,78,0.9)]" />
                <span>Currently Viewing: Project {project.number}</span>
                <span className="text-line/40">/</span>
                <span className="text-paper/80">{project.category}</span>
              </div>
              <h3 className="display mt-2 text-2xl sm:text-3xl text-paper">{project.title}</h3>
              <p className="mt-1 max-w-xl text-xs text-muted sm:text-sm">{project.tagline}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {project.github ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-line/15 px-4 py-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-paper transition-colors hover:border-ember/40 hover:text-ember sm:text-[8.5px]"
                >
                  <Github className="h-3.5 w-3.5" />
                  GitHub Repository
                </a>
              ) : null}
              {project.live ? (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-paper px-4 py-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ember hover:text-paper sm:text-[8.5px]"
                >
                  <Globe className="h-3.5 w-3.5" />
                  Live Project
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {nextProject ? (
          <div className="border-t border-line/10 pt-8 pb-10">
            <Link
              to={`/projects/${nextProject.slug}`}
              onClick={() => {
                window.scrollTo(0, 0)
                scrollToTop(true)
              }}
              data-cursor-label="Next"
              className="group block rounded-xl border border-line/10 bg-surface/30 p-6 sm:p-8 transition-all duration-300 hover:border-ember/30 hover:bg-surface/50"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                    <span>Up next in selected work</span>
                    <span className="text-line/40">·</span>
                    <span className="text-ember font-medium">Project {nextProject.number}</span>
                  </div>
                  <h4 className="display mt-2 text-2xl sm:text-4xl text-paper transition-colors duration-300 group-hover:text-ember">
                    {nextProject.title}
                  </h4>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:text-[9px]">
                    {nextProject.category}
                  </p>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-center">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors group-hover:text-paper sm:text-[9px]">
                    Read case study
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-line/15 transition-all duration-300 group-hover:border-ember/50 group-hover:bg-ember/10">
                    <ArrowUpRight className="h-4 w-4 text-muted transition-colors group-hover:text-ember" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
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
