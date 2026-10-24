import { useState } from 'react'
import {
  ArrowUpRight,
  Award,
  Braces,
  Code2,
  CodeXml,
  Cpu,
  GraduationCap,
  Layers,
  MapPin,
  Plus,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { siteConfig } from '../../config/site'
import { useSectionNavigation } from '../../hooks/useSectionNavigation'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function About() {
  const { goToSection } = useSectionNavigation()
  const [activeTab, setActiveTab] = useState<'bio' | 'tech' | 'education'>('bio')

  return (
    <section
      id="about"
      className="relative overflow-hidden pb-16 pt-10 sm:pb-24 sm:pt-16 lg:pb-32 lg:pt-20"
    >
      <div className="pointer-events-none absolute left-0 top-1/3 h-[420px] w-[420px] rounded-full bg-accent/[0.05] blur-[140px]" />
      <div className="pointer-events-none absolute right-0 bottom-1/4 h-[350px] w-[350px] rounded-full bg-ember/[0.04] blur-[140px]" />

      <div className="shell relative">
        <SectionHeading
          index="01"
          label="About"
          title={
            <>
              Curiosity,
              <br />
              <span className="text-muted">compiled into craft.</span>
            </>
          }
          description="An engineering student's perspective on building software that is useful, legible and quietly considered."
        />

        <div className="mt-12 grid gap-10 sm:mt-16 sm:gap-12 lg:mt-24 lg:grid-cols-[minmax(0,410px)_minmax(0,1fr)] lg:items-stretch lg:gap-14">
          {/* Left Column: Portrait Card */}
          <Reveal clip className="h-full">
            <div className="group relative mx-auto flex h-full w-full max-w-md flex-col justify-between lg:mx-0 lg:max-w-none">
              <div className="pointer-events-none absolute -inset-6 rounded-full bg-ember/[0.06] blur-3xl" />
              <div className="portrait-halo pointer-events-none absolute -inset-12" aria-hidden="true" />
              <div className="portrait-rim pointer-events-none absolute inset-x-0 top-0 aspect-[4/5]" aria-hidden="true">
                <div className="portrait-rim-clip">
                  <div className="portrait-rim-beam" />
                </div>
              </div>
              <div className="portrait-frame relative aspect-[4/5] overflow-hidden border border-ember/15 bg-surface">
                {siteConfig.profileImage ? (
                  <>
                    <div className="portrait-media absolute inset-0">
                      <div className="absolute inset-0 bg-[#0b0b0e]" />
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.075)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.075)_1px,transparent_1px)] bg-[length:60px_60px] [mask-image:radial-gradient(ellipse_at_50%_44%,#000_52%,rgba(0,0,0,0.35)_100%)]" />

                      <div className="absolute left-1/2 top-[44%] aspect-square w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,59,78,0.22),rgba(139,92,246,0.2)_58%,transparent_76%)] blur-3xl" />
                      <div className="absolute left-1/2 top-[44%] aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_26%,#ff6b78_0%,#f2394f_38%,#a63a86_72%,#6d28d9_100%)] shadow-[0_46px_110px_-34px_rgba(255,59,78,0.55),0_18px_92px_-30px_rgba(139,92,246,0.6)]" />
                      <div className="absolute left-1/2 top-[44%] aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_112%,rgba(40,10,64,0.5),transparent_52%)]" />

                      <div className="pointer-events-none absolute left-1/2 top-[44%] aspect-square w-[73%] -translate-x-1/2 -translate-y-1/2">
                        <div className="portrait-arc-b absolute inset-0">
                          <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden="true">
                            <defs>
                              <linearGradient id="portraitArcEmber" x1="1" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(255,59,78,0)" />
                                <stop offset="100%" stopColor="rgba(196,132,252,0.95)" />
                              </linearGradient>
                            </defs>
                            <g transform="rotate(146 50 50)">
                              <circle cx="50" cy="50" r="47" fill="none" stroke="url(#portraitArcEmber)" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="52 243" />
                              <circle cx="97" cy="50" r="1.1" fill="#c484fc" />
                            </g>
                          </svg>
                        </div>
                      </div>

                      <span className="absolute right-[16%] top-[24%] h-1 w-1 rounded-full bg-ember/80" />
                      <span className="absolute left-[13%] top-[63%] h-1 w-1 rounded-full bg-signal/70" />
                      <span className="absolute left-1/2 top-[6.5%] -translate-x-1/2 font-mono text-[10px] leading-none text-white/35">+</span>

                      <div className="absolute left-1/2 top-[68%] h-[30%] w-[76%] -translate-x-1/2 rounded-[50%] bg-[linear-gradient(100deg,rgba(255,59,78,0.26),rgba(139,92,246,0.26))] blur-3xl" />

                      <img
                        src={siteConfig.profileImage}
                        alt={`Portrait of ${siteConfig.name}`}
                        className="absolute bottom-0 left-1/2 h-[87%] w-auto max-w-none -translate-x-1/2 object-contain drop-shadow-[0_18px_44px_rgba(0,0,0,0.6)]"
                      />

                      <div className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-[#08090d] via-[#08090d]/40 to-transparent" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,transparent_58%,rgba(8,9,13,0.5)_100%)]" />

                      <div className="pointer-events-none absolute left-1/2 top-[44%] aspect-square w-[98%] -translate-x-1/2 -translate-y-1/2">
                        <div className="portrait-arc-a absolute inset-0">
                          <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden="true">
                            <defs>
                              <linearGradient id="portraitArcCyan" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="rgba(56,189,248,0)" />
                                <stop offset="55%" stopColor="rgba(56,189,248,0.7)" />
                                <stop offset="100%" stopColor="rgba(147,217,255,1)" />
                              </linearGradient>
                            </defs>
                            <g transform="rotate(-42 50 50)">
                              <circle cx="50" cy="50" r="47" fill="none" stroke="url(#portraitArcCyan)" strokeWidth="0.7" strokeLinecap="round" strokeDasharray="74 221" />
                              <circle cx="97" cy="50" r="1.3" fill="#93d9ff" />
                              <circle cx="41.2" cy="95.7" r="1.3" fill="#38BDF8" />
                            </g>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="portrait-pill pointer-events-none absolute left-3 top-[26%] z-10 rounded-full bg-[linear-gradient(115deg,rgba(255,59,78,0.9),rgba(56,189,248,0.8))] p-px shadow-[0_14px_34px_-14px_rgba(0,0,0,0.95)]">
                      <div className="flex items-center gap-1.5 rounded-full bg-[#0b0b0e]/95 py-1 pl-1 pr-2.5 backdrop-blur-md sm:gap-2 sm:py-1.5 sm:pl-1.5 sm:pr-3.5">
                        <span className="grid h-5 w-5 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-ember sm:h-6 sm:w-6">
                          <Braces className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        </span>
                        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-paper sm:text-[9px] sm:tracking-[0.14em]">
                          Java <span className="text-white/35">·</span> DSA
                        </span>
                      </div>
                    </div>

                    <div className="portrait-pill portrait-pill-b pointer-events-none absolute right-3 top-[62%] z-10 rounded-full bg-[linear-gradient(115deg,rgba(56,189,248,0.8),rgba(255,59,78,0.9))] p-px shadow-[0_14px_34px_-14px_rgba(0,0,0,0.95)]">
                      <div className="flex items-center gap-1.5 rounded-full bg-[#0b0b0e]/95 py-1 pl-1 pr-2.5 backdrop-blur-md sm:gap-2 sm:py-1.5 sm:pl-1.5 sm:pr-3.5">
                        <span className="grid h-5 w-5 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-signal sm:h-6 sm:w-6">
                          <CodeXml className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        </span>
                        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-paper sm:text-[9px] sm:tracking-[0.14em]">{siteConfig.role}</span>
                      </div>
                    </div>

                    <div className="pointer-events-none absolute inset-x-5 top-5 z-10 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.15em] text-white/45 sm:inset-x-6 sm:top-6 sm:tracking-[0.17em]">
                      <span>Portrait / 01</span>
                      <span className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-ember shadow-[0_0_8px_rgba(255,59,78,0.9)]" />
                        {siteConfig.academicYear}
                      </span>
                    </div>

                    <div className="pointer-events-none absolute inset-x-5 bottom-5 z-10 flex items-end justify-between gap-4 sm:inset-x-6 sm:bottom-6">
                      <div>
                        <p className="font-display text-lg tracking-tight text-paper">{siteConfig.name}</p>
                        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/50">{siteConfig.specializations[0]}</p>
                      </div>
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 bg-ink/40 text-white/70 backdrop-blur-md">
                        <Plus className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="portrait-media absolute inset-0">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_22%,rgba(139,92,246,0.2),transparent_55%),radial-gradient(circle_at_72%_78%,rgba(255,59,78,0.18),transparent_52%)]" />
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:56px_56px]" />
                      <div className="absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2">
                        <div className="absolute inset-0 animate-[spin_45s_linear_infinite] rounded-full border border-dashed border-line/15" />
                        <div className="absolute inset-[12%] rounded-full border border-line/10" />
                        <div className="absolute inset-[26%] rounded-full border border-ember/20 shadow-[inset_0_0_40px_rgba(255,59,78,0.08)]" />
                        <div className="absolute inset-[38%] grid place-items-center rounded-full border border-line/15 bg-ink/60 backdrop-blur-sm">
                          <span className="display text-4xl font-semibold">{siteConfig.monogram}</span>
                        </div>
                        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember shadow-[0_0_16px_rgba(255,59,78,1)]" />
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-x-6 top-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:text-[9px] sm:tracking-[0.18em]">
                      <span>Portrait / 01</span>
                      <span className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-ember" />
                        {siteConfig.academicYear}
                      </span>
                    </div>
                    <div className="pointer-events-none absolute inset-x-6 bottom-6 flex items-end justify-between">
                      <div>
                        <p className="font-display text-lg tracking-tight">{siteConfig.name}</p>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:text-[9px] sm:tracking-[0.18em]">{siteConfig.role}</p>
                      </div>
                      <Plus className="h-4 w-4 text-muted" />
                    </div>
                  </>
                )}
                <div className="pointer-events-none absolute inset-0 border border-white/[0.03]" />
                <div className="portrait-ring pointer-events-none absolute inset-0" aria-hidden="true">
                  <div className="portrait-ring-beam" />
                </div>
              </div>
              <div className="relative mt-3.5 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-[9px] sm:tracking-[0.16em]">
                <span className="truncate">{siteConfig.university}</span>
                <span className="sm:text-right">{siteConfig.degree}</span>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Clean Box-Free View Integrated Directly Into the Dark Canvas */}
          <Reveal delay={80} className="h-full [&>div]:h-full min-w-0 w-full">
            <div className="flex h-full flex-col justify-between min-w-0 w-full">
              {/* Minimal Clean Tab Navigation - Directly on Canvas with Underline Indicator */}
              <div
                role="tablist"
                aria-label="About section categories"
                className="flex items-center gap-4 sm:gap-7 border-b border-line/10 pb-3 font-mono text-xs shrink-0 overflow-x-auto no-scrollbar scroll-smooth"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'bio'}
                  onClick={() => setActiveTab('bio')}
                  className={`relative pb-2.5 transition-colors duration-200 ${
                    activeTab === 'bio'
                      ? 'text-ember font-medium'
                      : 'text-muted hover:text-paper'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-ember/70">&gt;_</span>
                    <span>Bio &amp; Skills</span>
                  </span>
                  {activeTab === 'bio' && (
                    <span className="absolute inset-x-0 -bottom-3 h-0.5 bg-ember shadow-[0_0_10px_rgba(255,59,78,0.8)]" />
                  )}
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'tech'}
                  onClick={() => setActiveTab('tech')}
                  className={`relative pb-2.5 transition-colors duration-200 ${
                    activeTab === 'tech'
                      ? 'text-ember font-medium'
                      : 'text-muted hover:text-paper'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-ember/70">&lt;/&gt;</span>
                    <span>Java &amp; DSA</span>
                  </span>
                  {activeTab === 'tech' && (
                    <span className="absolute inset-x-0 -bottom-3 h-0.5 bg-ember shadow-[0_0_10px_rgba(255,59,78,0.8)]" />
                  )}
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'education'}
                  onClick={() => setActiveTab('education')}
                  className={`relative pb-2.5 transition-colors duration-200 ${
                    activeTab === 'education'
                      ? 'text-ember font-medium'
                      : 'text-muted hover:text-paper'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>🎓</span>
                    <span>Education</span>
                  </span>
                  {activeTab === 'education' && (
                    <span className="absolute inset-x-0 -bottom-3 h-0.5 bg-ember shadow-[0_0_10px_rgba(255,59,78,0.8)]" />
                  )}
                </button>
              </div>

              {/* Tab Content Body - Directly on Background Canvas */}
              <div className="flex flex-1 flex-col pt-5 sm:pt-6 min-w-0 w-full">
                {activeTab === 'bio' && (
                  <div key="bio" className="flex flex-1 flex-col space-y-4.5 sm:space-y-5">
                    <div>
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ember">
                        <span className="h-1.5 w-1.5 rounded-full bg-ember animate-pulse" />
                        <span>About Me</span>
                      </div>

                      <h3 className="mt-2.5 font-display text-xl font-bold leading-snug tracking-tight text-paper sm:text-2xl lg:text-[1.75rem]">
                        A developer who learns by building, solving, and iterating.
                      </h3>

                      <div className="mt-3.5 space-y-2 text-xs sm:text-sm text-muted leading-relaxed">
                        <p>
                          Computer Science student at{' '}
                          <span className="font-medium text-paper">{siteConfig.university}</span> (SRMU),
                          building resilient software from first principles. I bridge algorithmic problem solving in{' '}
                          <span className="font-medium text-ember">Java &amp; DSA</span> with full-stack web development across{' '}
                          <span className="font-medium text-paper">React, Node.js, Express, and MongoDB</span>.
                        </p>
                        <p>
                          Focused on clean code architecture, time-space efficiency, and crafting scalable RESTful APIs.
                        </p>
                      </div>
                    </div>

                    {/* 4 Core Competency Highlights Grid */}
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 border-t border-line/10 pt-4">
                      <div className="flex items-start gap-2 text-xs text-muted">
                        <span className="h-1.5 w-1.5 rounded-full bg-ember shrink-0 mt-1.5" />
                        <div>
                          <strong className="text-paper font-medium block">Algorithmic Rigor:</strong>
                          <span>Daily practice in Java 17 focusing on core Data Structures (Trees, Graphs, DP) and Big-O efficiency.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs text-muted">
                        <span className="h-1.5 w-1.5 rounded-full bg-signal shrink-0 mt-1.5" />
                        <div>
                          <strong className="text-paper font-medium block">Full-Stack MERN:</strong>
                          <span>Building responsive SPAs and RESTful backends with React, Node.js, Express, and MongoDB.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs text-muted">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                        <div>
                          <strong className="text-paper font-medium block">Systems &amp; Database:</strong>
                          <span>Solid grounding in DBMS schemas, SQL querying, Operating Systems, and AWS deployment.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs text-muted">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                        <div>
                          <strong className="text-paper font-medium block">Continuous Growth:</strong>
                          <span>Winner at Algo Arena (1st Place) &amp; CodeX (2nd Place), actively building practical projects.</span>
                        </div>
                      </div>
                    </div>

                    {/* Primary Tech Stack Chips Stream */}
                    <div className="border-t border-line/10 pt-4">
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                        Core Tech Stack &amp; Tools:
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5 font-mono text-[10px] sm:text-[10.5px]">
                        {[
                          'Java 17',
                          'Data Structures',
                          'Algorithms',
                          'React.js',
                          'Node.js',
                          'Express.js',
                          'MongoDB',
                          'TypeScript',
                          'Tailwind CSS',
                          'DBMS / SQL',
                          'Cloud AWS',
                          'Git & GitHub',
                        ].map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center gap-1 rounded bg-white/[0.04] px-2 py-0.5 text-paper/85 border border-white/[0.06] hover:border-ember/30 hover:text-ember transition-colors"
                          >
                            <span className="h-1 w-1 rounded-full bg-ember/60" />
                            <span>{tech}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Box-free Stats Row with Clean Hairlines */}
                    <div className="grid grid-cols-3 divide-x divide-line/10 border-y border-line/10 py-3.5">
                      <a
                        href={siteConfig.leetcode}
                        target="_blank"
                        rel="noreferrer"
                        className="group px-1.5 sm:px-3 text-center transition-colors"
                      >
                        <span className="font-mono text-[8.5px] uppercase tracking-wider text-muted group-hover:text-ember transition-colors sm:text-[9px]">
                          LeetCode
                        </span>
                        <span className="mt-0.5 block font-display text-xl font-bold text-paper sm:text-3xl group-hover:text-ember group-hover:scale-105 transition-all">
                          {siteConfig.leetcodeCount}
                        </span>
                        <span className="font-mono text-[7.5px] uppercase tracking-wider text-muted/70 sm:text-[8.5px]">
                          Problems Solved
                        </span>
                      </a>

                      <div className="px-1.5 sm:px-3 text-center">
                        <span className="font-mono text-[8.5px] uppercase tracking-wider text-muted sm:text-[9px]">
                          CGPA
                        </span>
                        <span className="mt-0.5 block font-display text-xl font-bold text-ember sm:text-3xl">
                          {siteConfig.cgpa}
                        </span>
                        <span className="font-mono text-[7.5px] uppercase tracking-wider text-muted/70 sm:text-[8.5px]">
                          SRMU Academic
                        </span>
                      </div>

                      <div className="px-1.5 sm:px-3 text-center">
                        <span className="font-mono text-[8.5px] uppercase tracking-wider text-muted sm:text-[9px]">
                          Batch
                        </span>
                        <span className="mt-0.5 block font-display text-xl font-bold text-paper sm:text-3xl">
                          {siteConfig.batch}
                        </span>
                        <span className="font-mono text-[7.5px] uppercase tracking-wider text-muted/70 sm:text-[8.5px]">
                          B.Tech CSE
                        </span>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/10 pt-4 text-xs font-mono">
                      <div className="flex items-center gap-2 text-muted">
                        <MapPin className="h-3.5 w-3.5 text-ember shrink-0" />
                        <span>{siteConfig.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[11px] uppercase tracking-wider">Open to SDE Opportunities</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tech' && (
                  <div key="tech" className="flex flex-1 flex-col space-y-4.5 sm:space-y-5 min-w-0 w-full">
                    <div>
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ember">
                        <Code2 className="h-3.5 w-3.5 text-ember shrink-0" />
                        <span>Tech Focus &amp; Competencies</span>
                      </div>

                      <h3 className="mt-2.5 font-display text-xl font-bold leading-snug tracking-tight text-paper sm:text-2xl lg:text-[1.75rem] break-words">
                        Engineering solutions through code, logic &amp; architecture.
                      </h3>

                      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted break-words">
                        Problem-solving with Java &amp; Data Structures, paired with engineering production-ready, full-stack web applications.
                      </p>
                    </div>

                    {/* 3 Comprehensive Focus Rows with rich technical details */}
                    <div className="space-y-3.5 border-t border-line/10 pt-4">
                      <div className="flex items-start gap-3.5 sm:gap-4 py-1 group">
                        <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ember/10 text-ember border border-ember/20 transition-transform duration-300 group-hover:scale-110">
                          <Trophy className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                            <h4 className="font-display text-sm font-semibold tracking-tight text-paper sm:text-base break-words">
                              Java &amp; Algorithmic DSA
                            </h4>
                            <span className="font-mono text-[9px] uppercase tracking-wider text-ember shrink-0 self-start sm:self-auto">
                              35+ Solved · Java 17
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-muted leading-relaxed sm:text-sm break-words">
                            Daily problem solving across Arrays, Two Pointers, Linked Lists, Trees, and DP with Big-O complexity analysis.
                          </p>
                          <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1.5 font-mono text-[10px] text-ember/85">
                            <span className="whitespace-nowrap"># Java 17</span>
                            <span className="whitespace-nowrap"># DataStructures</span>
                            <span className="whitespace-nowrap"># Algorithms</span>
                            <span className="whitespace-nowrap"># TimeSpaceComplexity</span>
                            <span className="whitespace-nowrap"># LeetCodeDaily</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5 sm:gap-4 py-1 group">
                        <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-signal/10 text-signal border border-signal/20 transition-transform duration-300 group-hover:scale-110">
                          <Layers className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                            <h4 className="font-display text-sm font-semibold tracking-tight text-paper sm:text-base break-words">
                              Full-Stack Web Engineering (MERN)
                            </h4>
                            <span className="font-mono text-[9px] uppercase tracking-wider text-signal shrink-0 self-start sm:self-auto">
                              React 18 · Node.js
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-muted leading-relaxed sm:text-sm break-words">
                            Building modern SPAs with React and Tailwind CSS, backed by Node.js/Express REST APIs, JWT auth, and MongoDB.
                          </p>
                          <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1.5 font-mono text-[10px] text-signal/85">
                            <span className="whitespace-nowrap"># React.js</span>
                            <span className="whitespace-nowrap"># Node.js</span>
                            <span className="whitespace-nowrap"># Express</span>
                            <span className="whitespace-nowrap"># MongoDB</span>
                            <span className="whitespace-nowrap"># RESTfulAPIs</span>
                            <span className="whitespace-nowrap"># JWTAuth</span>
                            <span className="whitespace-nowrap"># TailwindCSS</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5 sm:gap-4 py-1 group">
                        <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent border border-accent/20 transition-transform duration-300 group-hover:scale-110">
                          <Cpu className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                            <h4 className="font-display text-sm font-semibold tracking-tight text-paper sm:text-base break-words">
                              Core Computer Science &amp; Cloud Systems
                            </h4>
                            <span className="font-mono text-[9px] uppercase tracking-wider text-accent shrink-0 self-start sm:self-auto">
                              DBMS · OS · AWS
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-muted leading-relaxed sm:text-sm break-words">
                            Core foundation in DBMS (normalization, SQL, ACID), Operating Systems, Computer Networks, and Cloud AWS.
                          </p>
                          <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1.5 font-mono text-[10px] text-accent/85">
                            <span className="whitespace-nowrap"># DBMS &amp; SQL</span>
                            <span className="whitespace-nowrap"># OperatingSystems</span>
                            <span className="whitespace-nowrap"># ComputerNetworks</span>
                            <span className="whitespace-nowrap"># CloudAWS</span>
                            <span className="whitespace-nowrap"># GitVersionControl</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* In-Progress Exploration Strip */}
                    <div className="rounded border border-line/10 bg-white/[0.02] p-3 text-xs font-mono">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-2 text-paper">
                        <div className="flex items-center gap-1.5 shrink-0 text-ember font-medium">
                          <Sparkles className="h-3.5 w-3.5 text-ember shrink-0" />
                          <span className="whitespace-nowrap">Currently Exploring:</span>
                        </div>
                        <span className="text-muted leading-relaxed break-words flex-1">
                          Graph Algorithms (BFS/DFS, Dijkstra), TypeScript Generics, and Docker containerization.
                        </span>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-line/10 pt-4 text-xs font-mono">
                      <span className="text-muted text-[11px] sm:text-xs">
                        Inspect live deployments &amp; project architectures
                      </span>
                      <button
                        type="button"
                        onClick={() => goToSection('projects')}
                        className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-paper transition-colors hover:text-ember self-start sm:self-auto"
                      >
                        <span>Explore Projects</span>
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'education' && (
                  <div key="education" className="flex flex-1 flex-col space-y-4.5 sm:space-y-5">
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ember">
                          <GraduationCap className="h-4 w-4 text-ember" />
                          <span>College &amp; Academic Profile</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-ember">
                          CGPA {siteConfig.cgpa} / 10.0
                        </span>
                      </div>

                      <h3 className="mt-2.5 font-display text-xl font-bold tracking-tight text-paper sm:text-2xl">
                        B.Tech, Computer Science Engineering
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs sm:text-sm">
                        <span className="font-medium text-ember/90">{siteConfig.university} (SRMU)</span>
                        <span className="text-line/20">•</span>
                        <span className="font-mono text-muted">{siteConfig.academicYear} · Batch {siteConfig.batch}</span>
                      </div>
                      <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                        Pursuing B.Tech in CSE with consistent academic standing across algorithmic theory, systems, and practical lab coursework.
                      </p>
                    </div>

                    {/* Competitive Coding Victories & Academic Honors */}
                    <div className="space-y-2.5 border-t border-line/10 pt-4">
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                        Honors &amp; Competitive Coding Victories:
                      </p>

                      <div className="flex items-start gap-2.5 text-xs text-paper/90 sm:text-sm">
                        <Trophy className="h-3.5 w-3.5 shrink-0 text-ember mt-0.5" />
                        <div>
                          <strong className="text-paper font-semibold">1st Place — Algo Arena:</strong>
                          <span className="text-muted ml-1">Champion in university-wide algorithmic coding and problem-solving competition under strict time limits.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 text-xs text-paper/90 sm:text-sm">
                        <Award className="h-3.5 w-3.5 shrink-0 text-ember mt-0.5" />
                        <div>
                          <strong className="text-paper font-semibold">2nd Place — CodeX Problem Solving:</strong>
                          <span className="text-muted ml-1">Ranked 2nd in technical coding, tested across data structures and edge-case handling.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 text-xs text-paper/90 sm:text-sm">
                        <Sparkles className="h-3.5 w-3.5 shrink-0 text-ember mt-0.5" />
                        <div>
                          <strong className="text-paper font-semibold">3rd Place — VIVEKA 5.0 (Find the Language):</strong>
                          <span className="text-muted ml-1">Secured 3rd place among 150+ participants in technical programming and debugging challenges.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 text-xs text-paper/90 sm:text-sm">
                        <span className="h-3.5 w-3.5 shrink-0 grid place-items-center text-xs text-ember font-mono mt-0.5 font-bold">★</span>
                        <div>
                          <strong className="text-ember font-semibold">Academic Distinction (CGPA {siteConfig.cgpa}):</strong>
                          <span className="text-muted ml-1">Maintaining consistent academic distinction across semesters in Computer Science Engineering.</span>
                        </div>
                      </div>
                    </div>

                    {/* Core Subjects & Coursework */}
                    <div className="border-t border-line/10 pt-4">
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                        Core Subjects &amp; Practical Labs:
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-3.5 gap-y-1.5 font-mono text-[10px] sm:text-[10.5px] text-paper/85">
                        {[
                          'Data Structures & Algorithms',
                          'Design & Analysis of Algorithms',
                          'OOP with Java',
                          'DBMS & SQL',
                          'Operating Systems',
                          'Software Engineering',
                          'Cloud Computing (AWS)',
                          'Web Technologies',
                          'Discrete Mathematics',
                          'Computer Networks',
                        ].map((subj) => (
                          <span key={subj} className="flex items-center gap-1.5 transition-colors hover:text-ember">
                            <span className="h-1 w-1 rounded-full bg-ember/70" />
                            <span>{subj}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/10 pt-4 text-xs font-mono">
                      <span className="text-muted">
                        Campus photos, event milestones &amp; verified awards
                      </span>
                      <button
                        type="button"
                        onClick={() => goToSection('moments')}
                        className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-paper transition-colors hover:text-ember"
                      >
                        <span>Academic Gallery</span>
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
