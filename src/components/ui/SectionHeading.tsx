import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  index: string
  label: string
  title: ReactNode
  description?: ReactNode
  className?: string
  align?: 'left' | 'between'
}

export function SectionHeading({
  index,
  label,
  title,
  description,
  className = '',
  align = 'between',
}: SectionHeadingProps) {
  return (
    <header className={`relative ${className}`}>
      <div
        className={
          align === 'between'
            ? 'flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between'
            : ''
        }
      >
        <div className="max-w-4xl">
          <Reveal>
            <p className="eyebrow">
              <span className="h-px w-8 bg-ember/80 shadow-[0_0_12px_rgba(255,59,78,0.9)]" />
              {index} / {label}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display mt-5 sm:mt-6 text-[clamp(2.2rem,7vw,6.4rem)]">{title}</h2>
          </Reveal>
        </div>
        {description ? (
          <Reveal delay={160} className="max-w-md lg:pb-2">
            <p className="text-sm leading-relaxed text-muted sm:text-base">{description}</p>
          </Reveal>
        ) : null}
      </div>
    </header>
  )
}
