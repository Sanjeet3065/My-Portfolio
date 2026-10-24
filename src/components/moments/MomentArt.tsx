import { useId } from 'react'
import { Trophy } from 'lucide-react'
import type { Moment } from '../../types'

const RANK_COLORS = ['#FF3B4E', '#8B5CF6', '#38BDF8']

interface MomentArtProps {
  moment: Moment
  index: number
  expanded?: boolean
}

export function MomentArt({ moment, index, expanded = false }: MomentArtProps) {
  const rawId = useId()
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '')
  const color = RANK_COLORS[index % RANK_COLORS.length]
  const rankNumber = moment.rank.match(/\d+/)?.[0] ?? String(index + 1)

  return (
    <div className="relative h-full w-full overflow-hidden">
      {moment.image ? (
        <img
          src={moment.image}
          alt={moment.alt}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-editorial group-hover:scale-[1.04]"
          loading="lazy"
        />
      ) : (
        <svg
          viewBox="0 0 640 800"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`m-bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0C0D13" />
              <stop offset="60%" stopColor="#0A0B10" />
              <stop offset="100%" stopColor="#06070A" />
            </linearGradient>
            <radialGradient id={`m-glow-${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.38" />
              <stop offset="55%" stopColor={color} stopOpacity="0.07" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
            <pattern id={`m-grid-${uid}`} width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M56 0H0V56" fill="none" stroke="rgba(255,255,255,0.04)" />
            </pattern>
          </defs>
          <rect width="640" height="800" fill={`url(#m-bg-${uid})`} />
          <rect width="640" height="800" fill={`url(#m-grid-${uid})`} />
          <circle cx="470" cy="230" r="260" fill={`url(#m-glow-${uid})`} />

          <g fill="none" stroke={color} strokeOpacity="0.22">
            <circle cx="320" cy="360" r="230" />
            <circle cx="320" cy="360" r="184" strokeDasharray="2 9" />
            <circle cx="320" cy="360" r="138" />
            <path d="M320 72 V648 M32 360 H608" strokeOpacity="0.08" />
          </g>

          <g stroke="rgba(255,255,255,0.1)" fill="none">
            <path d="M86 92 h22 M97 81 v22" />
            <path d="M532 692 h22 M543 681 v22" />
          </g>

          <path d="M0 620 C 160 588, 260 650, 400 618 S 560 586, 640 612" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 8" />

          <circle cx="320" cy="352" r="58" fill={color} opacity="0.07" />
          <circle cx="320" cy="352" r="31" fill="none" stroke={color} strokeOpacity="0.5" />
          <circle cx="320" cy="352" r="6" fill={color} />
        </svg>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-90" />

      <span
        className={`display pointer-events-none absolute right-2 top-4 font-semibold leading-none text-transparent ${expanded ? 'text-[15rem]' : 'text-[11rem]'}`}
        style={{ WebkitTextStroke: `1px ${color}55` }}
        aria-hidden="true"
      >
        {rankNumber.padStart(2, '0')}
      </span>

      <div className="absolute inset-x-5 top-5 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] backdrop-blur-md"
          style={{ borderColor: `${color}44`, color, backgroundColor: `${color}0f` }}
        >
          <Trophy className="h-3 w-3" />
          {moment.rank}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/60">
          Moment {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
