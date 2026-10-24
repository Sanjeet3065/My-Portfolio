import { useState } from 'react'
import {
  ArrowUpRight,
  Binary,
  Code2,
  CodeXml,
  Coffee,
  Cpu,
  Database,
  ExternalLink,
  FileCode2,
  FolderGit2,
  GitBranch,
  Globe,
  Layers,
  Layout,
  Server,
  Share2,
  ShieldCheck,
  Sparkles,
  Terminal,
  Wrench,
  Zap,
} from 'lucide-react'
import { skillCategories } from '../../data/skills'
import { siteConfig } from '../../config/site'
import { useSectionNavigation } from '../../hooks/useSectionNavigation'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

const filterTabs = [
  { id: 'all', label: 'All Stack', count: 6 },
  { id: 'pillars', label: 'Core Pillars', count: 3 },
  { id: 'dsa', label: 'Java & DSA' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend & APIs' },
  { id: 'databases', label: 'Databases & Cloud' },
  { id: 'tools', label: 'Tools & CS' },
]

function getSkillIcon(skillName: string) {
  const iconBase = 'h-3.5 w-3.5 shrink-0 transition-all duration-200 group-hover/skill:text-ember group-hover/skill:drop-shadow-[0_0_8px_rgba(255,59,78,0.5)]'
  switch (skillName) {
    case 'Java':
      return <Coffee className={`${iconBase} text-ember`} />
    case 'Data Structures':
      return <Binary className={`${iconBase} text-signal`} />
    case 'Algorithms':
      return <GitBranch className={`${iconBase} text-accent`} />
    case 'OOP Concepts':
      return <Cpu className={`${iconBase} text-paper/80`} />
    case 'Time & Space Complexity':
      return <Sparkles className={`${iconBase} text-ember`} />
    case 'React.js':
      return <Layers className={`${iconBase} text-signal`} />
    case 'TypeScript':
      return <FileCode2 className={`${iconBase} text-signal`} />
    case 'JavaScript (ES6+)':
      return <Code2 className={`${iconBase} text-amber-400`} />
    case 'Tailwind CSS':
      return <Layout className={`${iconBase} text-signal`} />
    case 'HTML5 & CSS3':
      return <Layout className={`${iconBase} text-ember`} />
    case 'Node.js':
      return <Server className={`${iconBase} text-emerald-400`} />
    case 'Express.js':
      return <Zap className={`${iconBase} text-paper/80`} />
    case 'RESTful APIs':
      return <ArrowUpRight className={`${iconBase} text-signal`} />
    case 'JWT Authentication':
      return <ShieldCheck className={`${iconBase} text-ember`} />
    case 'Postman API Testing':
      return <Globe className={`${iconBase} text-amber-500`} />
    case 'MongoDB Atlas':
      return <Database className={`${iconBase} text-emerald-400`} />
    case 'Mongoose ODM':
      return <Database className={`${iconBase} text-ember`} />
    case 'Supabase':
      return <Zap className={`${iconBase} text-emerald-400`} />
    case 'PostgreSQL':
      return <Database className={`${iconBase} text-signal`} />
    case 'MySQL':
      return <Database className={`${iconBase} text-signal`} />
    case 'Git':
      return <GitBranch className={`${iconBase} text-ember`} />
    case 'GitHub':
      return <FolderGit2 className={`${iconBase} text-paper/80`} />
    case 'VS Code':
      return <Code2 className={`${iconBase} text-signal`} />
    case 'IntelliJ IDEA':
      return <Terminal className={`${iconBase} text-accent`} />
    case 'Vercel':
      return <ExternalLink className={`${iconBase} text-paper`} />
    case 'Render':
      return <Globe className={`${iconBase} text-signal`} />
    case 'LeetCode':
      return <Code2 className={`${iconBase} text-amber-500`} />
    case 'Object-Oriented Design (OOP)':
      return <Cpu className={`${iconBase} text-accent`} />
    case 'Database Management (DBMS)':
      return <Database className={`${iconBase} text-signal`} />
    case 'Operating Systems':
      return <Cpu className={`${iconBase} text-signal`} />
    case 'Computer Networks':
      return <Share2 className={`${iconBase} text-accent`} />
    default:
      return <Code2 className={`${iconBase} text-muted`} />
  }
}

function getCategoryIcon(id: string) {
  switch (id) {
    case 'dsa':
      return <Code2 className="h-5 w-5 text-ember" />
    case 'frontend':
      return <Layout className="h-5 w-5 text-signal" />
    case 'backend':
      return <Server className="h-5 w-5 text-ember" />
    case 'databases':
      return <Database className="h-5 w-5 text-signal" />
    case 'tools':
      return <Wrench className="h-5 w-5 text-amber-400" />
    case 'core':
      return <Cpu className="h-5 w-5 text-accent" />
    default:
      return <Code2 className="h-5 w-5 text-muted" />
  }
}

export function Skills() {
  const [activeFilter, setActiveFilter] = useState('all')
  const { goToSection } = useSectionNavigation()

  const displayedCategories = skillCategories.filter((category) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'pillars') return category.isPrimary
    if (activeFilter === 'dsa') return category.id === 'dsa'
    if (activeFilter === 'frontend') return category.id === 'frontend'
    if (activeFilter === 'backend') return category.id === 'backend'
    if (activeFilter === 'databases') return category.id === 'databases'
    if (activeFilter === 'tools') return category.id === 'tools' || category.id === 'core'
    return true
  })

  return (
    <section id="skills" className="section-pad relative border-t border-line/10">
      <div className="shell">
        <SectionHeading
          index="02"
          label="Technical Stack"
          title={
            <>
              A stack,
              <br />
              <span className="text-muted">not a sticker sheet.</span>
            </>
          }
          description="Tools I reach for to take an idea from an empty file to a working product. No arbitrary percentages — just work I can stand behind."
        />

        {/* Box-Free 4 Top Statistics Strip directly on dark background */}
        <Reveal delay={60}>
          <div className="mt-10 grid grid-cols-2 gap-y-6 border-y border-line/10 py-5 sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-line/10">
            <div className="group flex flex-col justify-between px-2 sm:px-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Technologies</span>
                <CodeXml className="h-3.5 w-3.5 text-signal/80 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="font-display text-xl font-bold tracking-tight text-paper sm:text-2xl">31+</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-ember">Stack Tools</span>
              </div>
            </div>

            <div className="group flex flex-col justify-between px-2 sm:px-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Core Pillars</span>
                <Sparkles className="h-3.5 w-3.5 text-ember/80 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="font-display text-xl font-bold tracking-tight text-paper sm:text-2xl">3</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-ember">Primary Focus</span>
              </div>
            </div>

            <div className="group flex flex-col justify-between px-2 sm:px-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Algorithmic Core</span>
                <Zap className="h-3.5 w-3.5 text-amber-400 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="font-display text-lg font-bold tracking-tight text-paper sm:text-xl">Java &amp; DSA</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted">LeetCode</span>
              </div>
            </div>

            <div className="group flex flex-col justify-between px-2 sm:px-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Architecture</span>
                <Layers className="h-3.5 w-3.5 text-signal/80 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="font-display text-lg font-bold tracking-tight text-paper sm:text-xl">MERN Stack</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted">Full-Stack</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Filter Tabs Pill Bar */}
        <Reveal delay={100}>
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth sm:flex-wrap">
            {filterTabs.map((tab) => {
              const active = activeFilter === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-xs transition-all duration-200 ${
                    active
                      ? 'border border-ember/40 bg-ember/15 text-ember shadow-[0_0_15px_rgba(255,59,78,0.25)] font-medium'
                      : 'border border-line/10 bg-surface/40 text-muted hover:border-line/25 hover:text-paper hover:bg-surface/70'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`grid h-4 min-w-[16px] place-items-center rounded-full px-1 text-[9px] font-bold ${
                        active ? 'bg-ember text-white' : 'bg-line/10 text-muted'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Box-Free Categorized Skills Grid with Equal Column Widths & Perfect Row Alignment */}
        <div
          className={`mt-10 grid gap-x-8 gap-y-10 sm:gap-y-12 ${
            displayedCategories.length === 1
              ? 'grid-cols-1 max-w-xl'
              : displayedCategories.length === 2
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {displayedCategories.map((category, index) => (
            <Reveal key={category.id} delay={index * 50} className="h-full [&>div]:h-full">
              <div className="group flex h-full flex-col justify-between py-1 transition-all duration-300">
                <div>
                  {/* Category Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line/15 bg-surface/80 transition-all duration-300 group-hover:border-ember/30 group-hover:scale-105">
                        {getCategoryIcon(category.id)}
                      </div>
                      <div>
                        <h3 className="font-display text-base font-semibold tracking-tight text-paper sm:text-lg">
                          {category.label}
                        </h3>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                          {category.skills.length} competencies
                        </p>
                      </div>
                    </div>

                    {category.isPrimary && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-ember/30 bg-ember/10 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-ember shadow-[0_0_10px_rgba(255,59,78,0.2)]">
                        <Sparkles className="h-2.5 w-2.5 text-ember" />
                        PRIMARY
                      </span>
                    )}
                  </div>

                  {/* Skills Stream - Pure Box-Free with Subtle Inline Separators */}
                  <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-3.5 sm:gap-x-3.5 sm:gap-y-4">
                    {category.skills.map((skill, skillIdx) => (
                      <div key={skill} className="inline-flex items-center gap-3 sm:gap-3.5">
                        <span
                          className="group/skill inline-flex items-center gap-2 font-mono text-xs text-paper/85 transition-all duration-200 hover:-translate-y-[1px] cursor-default sm:text-[13px]"
                        >
                          <span className="shrink-0 transition-transform duration-200 group-hover/skill:scale-105">
                            {getSkillIcon(skill)}
                          </span>
                          <span className="tracking-tight transition-all duration-200 group-hover/skill:text-ember group-hover/skill:drop-shadow-[0_0_8px_rgba(255,59,78,0.4)]">
                            {skill}
                          </span>
                        </span>

                        {skillIdx < category.skills.length - 1 && (
                          <span
                            aria-hidden="true"
                            className="h-2.5 w-px bg-line/25 shrink-0 select-none"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Status - Aligns horizontally across row */}
                <div className="mt-6 flex items-center gap-2 border-t border-line/10 pt-3.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      category.isPrimary
                        ? 'bg-ember shadow-[0_0_8px_rgba(255,59,78,0.9)] animate-pulse'
                        : 'bg-signal/70'
                    }`}
                  />
                  <span>{category.proficiency ?? 'Practical Proficiency'}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom CTA Action Strip - Box-Free directly on dark background */}
        <Reveal delay={120}>
          <div className="mt-14 border-t border-line/10 pt-8 sm:mt-16 sm:pt-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h4 className="font-display text-base font-semibold tracking-tight text-paper sm:text-lg">
                  Want to see these technologies implemented in real applications?
                </h4>
                <p className="mt-1.5 text-xs text-muted sm:text-sm">
                  Inspect live deployed projects, GitHub source code, and algorithmic LeetCode solutions.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => goToSection('projects')}
                  className="group inline-flex items-center gap-2 rounded-full border border-ember/40 bg-ember px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-white shadow-[0_0_20px_rgba(255,59,78,0.35)] transition-all duration-300 hover:bg-ember/90 hover:shadow-[0_0_30px_rgba(255,59,78,0.6)]"
                >
                  <span>Explore Projects</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>

                <a
                  href={siteConfig.leetcode}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-line/15 bg-surface/70 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-paper transition-all duration-300 hover:border-line/30 hover:bg-surface/90 hover:text-white"
                >
                  <span>LeetCode Stats</span>
                  <span className="text-ember font-mono font-bold">&lt;/&gt;</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
