import { useState } from 'react'
import { ArrowUpRight, Award, BadgeCheck, FileText, Trophy } from 'lucide-react'
import { siteConfig } from '../../config/site'
import { achievements } from '../../data/achievements'
import type { Achievement, AchievementCategory } from '../../types'
import { Modal } from '../ui/Modal'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

const CATEGORY_STYLES: Record<AchievementCategory, string> = {
  Award: 'border-ember/30 bg-ember/[0.07] text-ember',
  Certification: 'border-accent/30 bg-accent/[0.08] text-accent',
  Participation: 'border-signal/30 bg-signal/[0.08] text-signal',
}

const CATEGORY_ICONS = {
  Award: Trophy,
  Certification: BadgeCheck,
  Participation: FileText,
}

export function Achievements() {
  const [selected, setSelected] = useState<Achievement | null>(null)
  const Icon = selected ? CATEGORY_ICONS[selected.category] : Award

  return (
    <section id="achievements" className="section-pad relative border-t border-line/10">
      <div className="shell">
        <SectionHeading
          index="05"
          label="Achievements"
          title={
            <>
              Proof, in
              <br />
              <span className="text-muted">moments and milestones.</span>
            </>
          }
          description="Competitions, certifications and participation — records of the work behind the results."
        />

        <div className="mt-14 border-t border-line/10 lg:mt-20">
          {achievements.map((achievement, index) => {
            const CategoryIcon = CATEGORY_ICONS[achievement.category]
            return (
              <Reveal key={achievement.id} delay={Math.min(index * 40, 200)}>
                <div className="group grid gap-5 border-b border-line/10 py-6 sm:grid-cols-[56px_1fr_auto] sm:items-center sm:gap-8 sm:py-7">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted/60">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] sm:text-[8px] sm:tracking-[0.14em] ${CATEGORY_STYLES[achievement.category]}`}>
                        <CategoryIcon className="h-2.5 w-2.5" />
                        {achievement.category}
                      </span>
                      {achievement.date ? (
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:text-[9px] sm:tracking-[0.16em]">{achievement.date}</span>
                      ) : null}
                    </div>
                    <h3 className="mt-2.5 font-display text-xl tracking-tight text-paper transition-colors duration-300 group-hover:text-ember sm:text-2xl">
                      {achievement.title}
                    </h3>
                    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">{achievement.description}</p>
                    {achievement.issuer ? (
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted/70 sm:text-[9px] sm:tracking-[0.16em]">
                        {achievement.issuer}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:justify-end">
                    {achievement.verifyUrl ? (
                      <a
                        href={achievement.verifyUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex min-h-[40px] items-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-paper sm:text-[9px] sm:tracking-[0.16em]"
                      >
                        Verify
                      </a>
                    ) : null}
                    <button
                      onClick={() => setSelected(achievement)}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/80 transition-all duration-300 hover:border-ember/40 hover:text-ember sm:px-3.5 sm:text-[9px] sm:tracking-[0.14em]"
                    >
                      View record
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal>
          <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
            Records are maintained as part of the portfolio archive.
          </p>
        </Reveal>
      </div>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        label={selected ? `${selected.title} certificate record` : 'Certificate record'}
        panelClassName="max-w-3xl"
      >
        {selected ? (
          <div>
            {selected.certificateImage ? (
              <img
                src={selected.certificateImage}
                alt={`Certificate for ${selected.title}`}
                className="w-full border border-line/15"
              />
            ) : (
              <div className="certificate-frame relative overflow-hidden p-1">
                <div className="relative border border-line/15 px-6 py-10 text-center sm:px-12 sm:py-14">
                  <span className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-ember/50" />
                  <span className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-ember/50" />
                  <span className="pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b border-l border-ember/50" />
                  <span className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b border-r border-ember/50" />

                  <p className="font-mono text-[9px] uppercase tracking-ultra text-muted">
                    Portfolio record / {selected.category}
                  </p>

                  <p className="mt-9 font-mono text-[8px] uppercase tracking-[0.24em] text-muted">
                    Presented to
                  </p>
                  <p className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">{siteConfig.name}</p>

                  <div className="mx-auto mt-6 h-px w-16 bg-ember shadow-[0_0_14px_rgba(255,59,78,0.7)]" />

                  <p className="mx-auto mt-6 max-w-lg font-display text-xl leading-snug tracking-tight text-paper sm:text-2xl">
                    {selected.title}
                  </p>
                  <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-muted sm:text-sm">
                    {selected.description}
                  </p>

                  <div className="mt-10 grid grid-cols-2 gap-5 border-t border-line/10 pt-6 text-left sm:grid-cols-4">
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted">Issuer</p>
                      <p className="mt-1.5 text-xs text-paper/80">{selected.issuer ?? '—'}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted">Date</p>
                      <p className="mt-1.5 text-xs text-paper/80">{selected.date ?? 'To be added'}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted">Category</p>
                      <p className="mt-1.5 text-xs text-paper/80">{selected.category}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted">Record ID</p>
                      <p className="mt-1.5 text-xs text-paper/80">{selected.id}</p>
                    </div>
                  </div>

                  <div className="mt-9 flex items-center justify-between border-t border-line/10 pt-6">
                    <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                      Sanjeet Chauhan · Portfolio
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-ember/30 bg-ember/[0.05]">
                      <Icon className="h-4 w-4 text-ember" />
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-muted">
                {selected.certificateImage ? 'Certificate on file' : 'Digital record · certificate scan to be attached'}
              </p>
              {selected.verifyUrl ? (
                <a
                  href={selected.verifyUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ember hover:text-paper"
                >
                  Verify credential
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  )
}
