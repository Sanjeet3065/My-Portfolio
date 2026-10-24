import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowDown, ArrowUpRight, Download, FileText, Github, Linkedin, Mail, Share2 } from 'lucide-react'
import { siteConfig, socialLinks } from '../../config/site'
import { useAppReady } from '../../context/AppReadyContext'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useSectionNavigation } from '../../hooks/useSectionNavigation'
import { sharePortfolio } from '../../lib/share'
import { Magnetic } from '../ui/Magnetic'
import { SkillConstellation } from '../hero/SkillConstellation'

function LeetCodeIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.216 5.216 0 0 0-3.85-1.467c-1.472 0-2.856.577-3.896 1.625l-4.343 4.388c-1.04 1.048-1.613 2.448-1.613 3.943s.573 2.895 1.613 3.943l4.343 4.373c1.04 1.048 2.424 1.625 3.896 1.625 1.472 0 2.856-.577 3.896-1.625l2.609-2.636c.514-.514.496-1.365-.039-1.901-.535-.535-1.386-.553-1.9-.038zm3.844-4.887H8.22c-.744 0-1.348-.604-1.348-1.348s.604-1.348 1.348-1.348h11.726c.744 0 1.348.604 1.348 1.348s-.604 1.348-1.348 1.348z" />
    </svg>
  )
}

const SOCIAL_ICONS = {
  github: Github,
  linkedin: Linkedin,
  leetcode: LeetCodeIcon,
  twitter: Mail,
  whatsapp: Mail,
}

export function Hero() {
  const reduced = useReducedMotion()
  const ready = useAppReady()
  const { goToSection } = useSectionNavigation()
  const heroRef = useRef<HTMLElement>(null)
  const [roleIndex, setRoleIndex] = useState(0)

  const lines = useMemo(
    () => [siteConfig.firstName.toUpperCase(), siteConfig.lastName.toUpperCase()],
    [],
  )

  useEffect(() => {
    if (reduced) return
    const interval = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % siteConfig.roles.length)
    }, 2800)
    return () => window.clearInterval(interval)
  }, [reduced])

  useEffect(() => {
    if (!ready) return
    const context = gsap.context(() => {
      const characters = heroRef.current?.querySelectorAll<HTMLElement>('.hero-char')
      if (characters && characters.length > 0) {
        if (reduced) {
          gsap.set(characters, { yPercent: 0, opacity: 1 })
        } else {
          gsap.fromTo(
            characters,
            { yPercent: 120, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 1.15,
              ease: 'power4.out',
              stagger: 0.035,
              delay: 0.08,
            },
          )
        }
      }

      if (reduced) {
        gsap.set('[data-hero-fade]', { autoAlpha: 1, y: 0 })
      } else {
        gsap.fromTo(
          '[data-hero-fade]',
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.09,
            delay: 0.5,
          },
        )
      }
    }, heroRef)

    return () => context.revert()
  }, [ready, reduced])

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-[100dvh] overflow-hidden pt-[76px]"
      aria-label="Introduction"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_65%_35%,rgba(139,92,246,0.10),transparent_55%)]" />
      <div className="red-wash pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -right-24 top-1/4 h-[420px] w-[420px] rounded-full bg-ember/[0.12] blur-[130px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[360px] w-[360px] rounded-full bg-accent/[0.08] blur-[120px]" />

      <div className="shell pointer-events-none relative z-10 flex min-h-[calc(100dvh-76px)] flex-col justify-between gap-10 pb-8 pt-6 sm:pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="opacity-0" data-hero-fade>
            {siteConfig.availability.available ? (
              <span className="inline-flex items-center gap-2.5 rounded-full border border-ember/25 bg-ember/[0.06] px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ember shadow-[0_0_32px_-12px_rgba(255,59,78,0.8)] sm:text-[9px] sm:tracking-[0.16em]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="pulse-ember absolute inset-0 rounded-full" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-ember" />
                </span>
                {siteConfig.availability.label}
              </span>
            ) : null}
          </div>
          <div className="hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted opacity-0 sm:flex" data-hero-fade>
            <span className="h-px w-10 bg-line/20" />
            Full Stack Developer
          </div>
        </div>

        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <h1
              className="display text-[clamp(2.5rem,11.5vw,11.8rem)] uppercase"
              aria-label={`${siteConfig.firstName} ${siteConfig.lastName}`}
            >
              {lines.map((line) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]" aria-hidden="true">
                  {line.split('').map((character, index) => (
                    <span key={`${line}-${index}`} className="hero-char" data-char>
                      {character}
                    </span>
                  ))}
                </span>
              ))}
            </h1>

            <div className="relative mt-5 sm:mt-7 flex flex-wrap items-center gap-x-4 gap-y-3 opacity-0" data-hero-fade>
              <span className="relative inline-flex h-6 min-w-0 sm:min-w-[14rem] items-center overflow-hidden font-mono text-[11px] uppercase tracking-[0.18em] text-paper [text-shadow:0_1px_14px_rgba(8,9,13,0.9)] sm:tracking-[0.2em] sm:text-xs">
                <span key={roleIndex} className="role-enter text-ember">
                  {siteConfig.roles[roleIndex]}
                </span>
              </span>
              <span className="relative hidden h-4 w-px bg-line/20 sm:block" />
              <div className="pointer-events-auto relative flex flex-wrap items-center gap-2">
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="LinkedIn Profile"
                  title="LinkedIn"
                  className="group relative grid h-8 w-8 place-items-center rounded-lg border border-line/15 bg-surface/70 text-muted transition-all duration-300 hover:border-ember/60 hover:bg-ember/[0.08] hover:text-ember hover:shadow-[0_0_16px_rgba(255,59,78,0.35)]"
                >
                  <Linkedin className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
                </a>

                <a
                  href={siteConfig.leetcode}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="LeetCode Profile"
                  title="LeetCode"
                  className="group relative grid h-8 w-8 place-items-center rounded-lg border border-line/15 bg-surface/70 text-muted transition-all duration-300 hover:border-ember/60 hover:bg-ember/[0.08] hover:text-ember hover:shadow-[0_0_16px_rgba(255,59,78,0.35)]"
                >
                  <LeetCodeIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
                </a>

                <a
                  href={siteConfig.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="GitHub Profile"
                  title="GitHub"
                  className="group relative grid h-8 w-8 place-items-center rounded-lg border border-line/15 bg-surface/70 text-muted transition-all duration-300 hover:border-ember/60 hover:bg-ember/[0.08] hover:text-ember hover:shadow-[0_0_16px_rgba(255,59,78,0.35)]"
                >
                  <Github className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
                </a>

                <a
                  href={siteConfig.resume}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="View Resume (PDF opens in new tab)"
                  title="View Resume (PDF)"
                  className="group relative inline-flex h-8 items-center gap-2 rounded-lg border border-line/15 bg-surface/70 pl-3.5 pr-3 text-xs font-medium text-paper transition-all duration-300 hover:border-ember/60 hover:bg-ember/[0.08] hover:text-ember hover:shadow-[0_0_16px_rgba(255,59,78,0.35)] sm:ml-2 sm:pl-4 sm:pr-4"
                >
                  <FileText className="h-3.5 w-3.5 text-muted transition-colors duration-300 group-hover:text-ember" />
                  <span>View Resume</span>
                </a>

                <a
                  href={siteConfig.resume}
                  download="Sanjeet_Chauhan_Resume.pdf"
                  aria-label="Download Resume (PDF)"
                  title="Download Resume (PDF)"
                  className="group relative inline-flex h-8 items-center gap-1.5 rounded-lg border border-line/15 bg-surface/70 px-3 text-xs font-medium text-paper transition-all duration-300 hover:border-ember/60 hover:bg-ember/[0.08] hover:text-ember hover:shadow-[0_0_16px_rgba(255,59,78,0.35)]"
                >
                  <Download className="h-3.5 w-3.5 text-muted transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-ember" />
                  <span className="hidden sm:inline">Download</span>
                </a>

                <button
                  type="button"
                  onClick={() => sharePortfolio()}
                  aria-label="Share Portfolio"
                  title="Share Portfolio"
                  className="group relative grid h-8 w-8 place-items-center rounded-lg border border-line/15 bg-surface/70 text-muted transition-all duration-300 hover:border-ember/60 hover:bg-ember/[0.08] hover:text-ember hover:shadow-[0_0_16px_rgba(255,59,78,0.35)]"
                >
                  <Share2 className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
                </button>
              </div>
            </div>
          </div>

          <div className="relative max-w-md lg:pb-3">
            <SkillConstellation className="mb-5 xl:mb-7" />
            <div className="relative">
              <p className="text-sm leading-relaxed text-muted opacity-0 sm:text-[15px]" data-hero-fade>
                Computer Science student specializing in{' '}
                <span className="font-medium text-paper underline decoration-ember/80 decoration-[1.5px] underline-offset-[5px]">
                  Java
                </span>
                ,{' '}
                <span className="font-medium text-paper underline decoration-ember/80 decoration-[1.5px] underline-offset-[5px]">
                  Data Structures &amp; Algorithms
                </span>{' '}
                and modern full-stack web development with{' '}
                <span className="font-medium text-paper underline decoration-ember/80 decoration-[1.5px] underline-offset-[5px]">
                  React
                </span>
                ,{' '}
                <span className="font-medium text-paper underline decoration-ember/80 decoration-[1.5px] underline-offset-[5px]">
                  Node.js
                </span>{' '}
                and{' '}
                <span className="font-medium text-paper underline decoration-ember/80 decoration-[1.5px] underline-offset-[5px]">
                  MongoDB
                </span>
                .
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3 opacity-0" data-hero-fade>
                <Magnetic>
                  <button
                    onClick={() => goToSection('projects')}
                    data-cursor-label="View"
                    className="group pointer-events-auto relative inline-flex min-h-[44px] items-center gap-3 overflow-hidden rounded-full bg-paper px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink transition-all duration-300 hover:shadow-[0_0_44px_-10px_rgba(255,59,78,0.85)] sm:text-[10px] sm:tracking-[0.16em]"
                  >
                    <span className="absolute inset-0 translate-y-full bg-ember transition-transform duration-500 ease-editorial group-hover:translate-y-0" />
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-paper">View selected work</span>
                    <ArrowUpRight className="relative z-10 h-3.5 w-3.5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper" />
                  </button>
                </Magnetic>

                <Magnetic strength={0.16}>
                  <button
                    onClick={() => goToSection('about')}
                    className="group pointer-events-auto inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line/20 px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors duration-300 hover:border-ember/50 hover:text-ember sm:text-[10px] sm:tracking-[0.16em]"
                  >
                    About me
                    <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
                  </button>
                </Magnetic>
              </div>


            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line/10 pt-5 opacity-0" data-hero-fade>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[9px] uppercase tracking-[0.14em] sm:text-[9.5px] sm:tracking-[0.16em]">
            <span className="flex items-center gap-2 text-paper">
              <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_8px_rgba(255,59,78,0.8)]" />
              <span>Turning Logic Into Resilient Software</span>
            </span>
            <span className="hidden text-line/25 sm:inline">/</span>
            <span className="hidden items-center gap-2 text-paper/90 sm:inline-flex">
              <span className="text-ember font-bold">&lt;/&gt;</span>
              <span>Algorithmic Rigor &amp; Time-Space Efficiency</span>
            </span>
            <span className="hidden text-line/25 md:inline">/</span>
            <span className="hidden items-center gap-2 text-muted md:inline-flex">
              <span className="text-signal font-bold">⚡</span>
              <span className="text-paper/85">Engineered From First Principles</span>
            </span>
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted">Scroll to explore</span>
            <span className="scroll-cue relative h-10 w-px bg-line/15" />
          </div>
        </div>
      </div>
    </section>
  )
}
