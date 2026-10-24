import { memo, useId } from 'react'
import type { ArtworkVariant } from '../../types'

interface ProjectArtworkProps {
  variant: ArtworkVariant
  accent: 'violet' | 'cyan' | 'ember'
  label: string
  className?: string
}

const PALETTES = {
  violet: { primary: '#8B5CF6', secondary: '#38BDF8', ember: '#FF3B4E' },
  cyan: { primary: '#38BDF8', secondary: '#8B5CF6', ember: '#FF3B4E' },
  ember: { primary: '#FF3B4E', secondary: '#8B5CF6', ember: '#38BDF8' },
}

export const ProjectArtwork = memo(function ProjectArtwork({ variant, accent, label, className = '' }: ProjectArtworkProps) {
  const rawId = useId()
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '')
  const palette = PALETTES[accent]

  return (
    <svg
      viewBox="0 0 800 500"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid slice"
      className={`h-full w-full ${className}`}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0C0D13" />
          <stop offset="55%" stopColor="#0A0B10" />
          <stop offset="100%" stopColor="#07080C" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.primary} stopOpacity="0.38" />
          <stop offset="55%" stopColor={palette.primary} stopOpacity="0.08" />
          <stop offset="100%" stopColor={palette.primary} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`glow-ember-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.ember} stopOpacity="0.6" />
          <stop offset="45%" stopColor={palette.ember} stopOpacity="0.16" />
          <stop offset="100%" stopColor={palette.ember} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.015" />
        </linearGradient>
        <linearGradient id={`cap-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={palette.primary} stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id={`beam-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.ember} stopOpacity="0" />
          <stop offset="50%" stopColor={palette.ember} stopOpacity="0.35" />
          <stop offset="100%" stopColor={palette.ember} stopOpacity="0" />
        </linearGradient>
        <pattern id={`grid-${uid}`} width="64" height="64" patternUnits="userSpaceOnUse">
          <path d="M64 0H0V64" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
        </pattern>
        <filter id={`blur-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <filter id={`soft-${uid}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <rect width="800" height="500" fill={`url(#bg-${uid})`} />
      <rect width="800" height="500" fill={`url(#grid-${uid})`} opacity="0.55" />
      <ellipse cx="560" cy="190" rx="280" ry="240" fill={`url(#glow-${uid})`} />
      <ellipse cx="640" cy="360" rx="180" ry="150" fill={`url(#glow-ember-${uid})`} opacity="0.85" />

      {variant === 'network' ? <NetworkArt uid={uid} palette={palette} /> : null}
      {variant === 'waves' ? <WavesArt uid={uid} palette={palette} /> : null}
      {variant === 'capsules' ? <CapsulesArt uid={uid} palette={palette} /> : null}
      {variant === 'grid' ? <GridArt uid={uid} palette={palette} /> : null}
      {variant === 'weather' ? <WeatherArt uid={uid} palette={palette} /> : null}

      <rect x="0.5" y="0.5" width="799" height="499" fill="none" stroke="rgba(255,255,255,0.08)" />
    </svg>
  )
})

type Palette = (typeof PALETTES)['violet']
type ArtProps = { uid: string; palette: Palette }

function NetworkArt({ uid, palette }: ArtProps) {
  const nodes = [
    { x: 238, y: 210, r: 4 },
    { x: 330, y: 142, r: 3 },
    { x: 412, y: 250, r: 5 },
    { x: 300, y: 338, r: 3.5 },
    { x: 512, y: 190, r: 4 },
    { x: 548, y: 314, r: 3 },
    { x: 452, y: 378, r: 3 },
    { x: 632, y: 238, r: 4 },
  ]

  return (
    <g>
      <g stroke={palette.primary} strokeOpacity="0.24" strokeWidth="1">
        <path d="M238 210 L330 142 L412 250 L300 338 Z" fill="none" />
        <path d="M412 250 L512 190 L632 238 L548 314 L452 378 L300 338" fill="none" />
        <path d="M330 142 L512 190 M300 338 L548 314 M238 210 L512 190" fill="none" strokeOpacity="0.12" />
      </g>

      <g transform="rotate(-6 320 240)">
        <rect
          x="196"
          y="166"
          width="240"
          height="148"
          rx="10"
          fill={`url(#glass-${uid})`}
          stroke="rgba(255,255,255,0.14)"
        />
        <rect x="216" y="190" width="74" height="6" rx="3" fill={palette.primary} opacity="0.7" />
        <rect x="216" y="208" width="146" height="4" rx="2" fill="rgba(255,255,255,0.18)" />
        <rect x="216" y="222" width="112" height="4" rx="2" fill="rgba(255,255,255,0.12)" />
        <rect x="216" y="252" width="86" height="34" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
        <rect x="312" y="252" width="86" height="34" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
      </g>

      <g transform="rotate(7 570 250)">
        <rect
          x="500"
          y="196"
          width="168"
          height="118"
          rx="10"
          fill={`url(#glass-${uid})`}
          stroke="rgba(255,255,255,0.12)"
        />
        <circle cx="526" cy="224" r="5" fill={palette.ember} opacity="0.9" />
        <rect x="542" y="220" width="70" height="5" rx="2.5" fill="rgba(255,255,255,0.22)" />
        <rect x="522" y="248" width="116" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
        <rect x="522" y="262" width="92" height="4" rx="2" fill="rgba(255,255,255,0.08)" />
        <rect x="522" y="282" width="58" height="14" rx="7" fill={palette.primary} opacity="0.28" />
      </g>

      {nodes.map((node, index) => (
        <g key={index}>
          <circle cx={node.x} cy={node.y} r={node.r + 8} fill={palette.primary} opacity="0.07" />
          <circle cx={node.x} cy={node.y} r={node.r} fill={index % 4 === 0 ? palette.ember : palette.primary} opacity="0.9" />
        </g>
      ))}

      <circle cx="632" cy="238" r="34" fill="none" stroke={palette.ember} strokeOpacity="0.35" />
      <circle cx="632" cy="238" r="14" fill={palette.ember} opacity="0.18" filter={`url(#soft-${uid})`} />
      <path d="M612 258 L652 218" stroke={palette.ember} strokeOpacity="0.25" />

      <path d="M70 410 C 180 370, 240 430, 360 394 S 560 340, 720 402" fill="none" stroke="rgba(255,255,255,0.1)" strokeDasharray="2 8" />
    </g>
  )
}

function WavesArt({ uid, palette }: ArtProps) {
  return (
    <g fill="none">
      {[0, 1, 2, 3, 4].map((index) => (
        <path
          key={index}
          d={`M-40 ${238 + index * 34} C 90 ${148 + index * 30}, 198 ${338 + index * 26}, 340 ${250 + index * 28} S 600 ${160 + index * 34}, 850 ${250 + index * 26}`}
          stroke={index % 2 === 0 ? palette.primary : palette.secondary}
          strokeOpacity={0.5 - index * 0.075}
          strokeWidth={index === 0 ? 1.4 : 1}
        />
      ))}

      <g transform="translate(392 252)">
        <circle r="96" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 8" />
        <circle r="72" stroke={palette.primary} strokeOpacity="0.28" />
        <circle r="38" fill={palette.primary} fillOpacity="0.06" stroke={palette.secondary} strokeOpacity="0.4" />
        <circle r="11" fill={palette.primary} opacity="0.28" filter={`url(#soft-${uid})`} />
        <circle r="5" fill={palette.primary} />
        <path d="M-132 0 H-96 M96 0 H132 M0 -132 V-96 M0 96 V132" stroke="rgba(255,255,255,0.2)" />
      </g>

      <g transform="rotate(-3 604 352)">
        <rect
          x="504"
          y="296"
          width="200"
          height="124"
          rx="12"
          fill={`url(#glass-${uid})`}
          stroke="rgba(255,255,255,0.14)"
        />
        <circle cx="604" cy="344" r="18" fill="none" stroke="rgba(255,255,255,0.22)" />
        <circle cx="604" cy="344" r="5" fill={palette.ember} />
        <rect x="566" y="380" width="76" height="4" rx="2" fill="rgba(255,255,255,0.14)" />
        <circle cx="524" cy="316" r="3" fill={palette.ember} opacity="0.9" />
        <rect x="536" y="313" width="46" height="5" rx="2.5" fill="rgba(255,255,255,0.18)" />
      </g>

      <circle cx="648" cy="176" r="52" stroke={palette.ember} strokeOpacity="0.25" />
      <circle cx="648" cy="176" r="24" stroke={palette.ember} strokeOpacity="0.5" strokeDasharray="3 5" />
      <circle cx="648" cy="176" r="6" fill={palette.ember} />
      <circle cx="648" cy="176" r="20" fill={palette.ember} opacity="0.14" filter={`url(#soft-${uid})`} />

      <path d="M88 420 C 200 392, 288 428, 392 410 S 588 372, 720 416" stroke="rgba(255,255,255,0.1)" strokeDasharray="2 8" />
    </g>
  )
}

function CapsulesArt({ uid, palette }: ArtProps) {
  return (
    <g>
      <circle cx="420" cy="250" r="170" fill="none" stroke="rgba(255,255,255,0.05)" />
      <circle cx="420" cy="250" r="210" fill="none" stroke="rgba(255,255,255,0.035)" />

      <g transform="rotate(-28 388 262)">
        <rect
          x="262"
          y="212"
          width="252"
          height="100"
          rx="50"
          fill={`url(#cap-${uid})`}
          stroke="rgba(255,255,255,0.16)"
        />
        <path d="M388 212 V312" stroke="rgba(255,255,255,0.2)" />
        <path d="M300 232 C 330 220, 352 220, 382 230" fill="none" stroke="rgba(255,255,255,0.25)" />
      </g>

      <g transform="rotate(22 500 330)">
        <rect
          x="430"
          y="298"
          width="164"
          height="64"
          rx="32"
          fill="rgba(255,59,78,0.16)"
          stroke="rgba(255,59,78,0.5)"
        />
        <path d="M512 298 V362" stroke="rgba(255,59,78,0.45)" />
        <ellipse cx="512" cy="330" rx="90" ry="48" fill={palette.ember} opacity="0.16" filter={`url(#soft-${uid})`} />
      </g>

      <g transform="rotate(-16 264 356)">
        <rect
          x="210"
          y="334"
          width="118"
          height="44"
          rx="22"
          fill={`url(#glass-${uid})`}
          stroke="rgba(255,255,255,0.12)"
        />
        <path d="M269 334 V378" stroke="rgba(255,255,255,0.12)" />
      </g>

      <circle cx="618" cy="168" r="64" fill={palette.primary} opacity="0.12" filter={`url(#blur-${uid})`} />
      <circle cx="618" cy="168" r="6" fill={palette.primary} />
      <circle cx="618" cy="168" r="26" fill="none" stroke={palette.primary} strokeOpacity="0.28" />
      <circle cx="618" cy="168" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 7" />

      <path d="M92 190 L132 150 M112 210 L162 160" stroke="rgba(255,255,255,0.08)" />
      <path d="M72 420 C 216 392, 300 430, 424 408 S 612 372, 748 414" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 8" />
    </g>
  )
}

function GridArt({ uid, palette }: ArtProps) {
  return (
    <g>
      <path d="M400 140 L120 470 M400 140 L260 470 M400 140 L540 470 M400 140 L680 470" stroke={palette.primary} strokeOpacity="0.14" />
      {[320, 356, 396, 440, 486].map((y, index) => (
        <path key={y} d={`M${80 - index * 20} ${y} H${720 + index * 20}`} stroke={palette.primary} strokeOpacity="0.1" />
      ))}

      <g stroke={palette.primary} strokeOpacity="0.45" fill="rgba(139,92,246,0.05)">
        <path d="M200 330 L260 300 L320 330 L320 410 L260 440 L200 410 Z" />
        <path d="M330 356 L376 334 L422 356 L422 420 L376 442 L330 420 Z" opacity="0.75" />
        <path d="M488 320 L546 290 L604 320 L604 408 L546 438 L488 408 Z" opacity="0.55" />
        <path d="M262 300 V440 M260 300 L260 440 M200 330 L260 360 L320 330 M260 360 V440" opacity="0.45" />
        <path d="M546 290 V438 M488 320 L546 350 L604 320 M546 350 V438" opacity="0.35" />
      </g>

      <g>
        <circle cx="400" cy="236" r="90" fill={`url(#glow-ember-${uid})`} />
        <circle cx="400" cy="236" r="58" fill={palette.ember} opacity="0.08" filter={`url(#soft-${uid})`} />
        <circle cx="400" cy="236" r="24" fill={palette.ember} opacity="0.7" />
        <circle cx="400" cy="236" r="7" fill="#FFF" opacity="0.9" />
        <circle cx="400" cy="236" r="58" fill="none" stroke={palette.ember} strokeOpacity="0.4" strokeDasharray="3 8" />
        <path d="M400 178 V120 M400 294 V360" stroke={palette.ember} strokeOpacity="0.22" />
      </g>

      <path d="M400 120 L628 236 L400 352 L172 236 Z" fill="none" stroke="rgba(255,255,255,0.07)" />
      <path d="M400 76 L700 236 L400 396 L100 236 Z" fill="none" stroke="rgba(255,255,255,0.04)" />

      <g stroke="rgba(255,255,255,0.14)" fill="none">
        <path d="M88 88 h20 M98 78 v20" />
        <path d="M692 412 h20 M702 402 v20" />
      </g>
    </g>
  )
}

function WeatherArt({ uid, palette }: ArtProps) {
  return (
    <g>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <ellipse
          key={index}
          cx="340"
          cy="264"
          rx={136 + index * 34}
          ry={84 + index * 22}
          fill="none"
          stroke={palette.primary}
          strokeOpacity={0.2 - index * 0.025}
        />
      ))}
      <ellipse cx="340" cy="264" rx="236" ry="152" fill={palette.primary} opacity="0.04" filter={`url(#blur-${uid})`} />

      <g fill={`url(#glass-${uid})`} stroke="rgba(255,255,255,0.12)">
        <path d="M160 300 C 160 268, 190 248, 220 256 C 228 224, 264 210, 288 228 C 300 204, 340 202, 352 230 C 382 224, 406 248, 398 276 C 426 280, 436 308, 414 322 L 186 322 C 162 320, 148 310, 160 300 Z" />
      </g>
      <path d="M210 342 L196 384 M250 342 L236 384 M290 342 L276 384 M330 342 L316 384 M370 342 L356 384" stroke={palette.secondary} strokeOpacity="0.45" strokeLinecap="round" />

      <circle cx="588" cy="180" r="82" fill={palette.ember} opacity="0.1" filter={`url(#blur-${uid})`} />
      <circle cx="588" cy="180" r="42" fill="none" stroke={palette.ember} strokeOpacity="0.5" />
      <circle cx="588" cy="180" r="12" fill={palette.ember} />
      <circle cx="588" cy="180" r="26" fill="none" stroke={palette.ember} strokeOpacity="0.25" strokeDasharray="2 6" />
      <path d="M588 110 V96 M588 264 V250 M518 180 H504 M672 180 H658 M539 131 L529 121 M637 229 L647 239 M637 131 L647 121 M539 229 L529 239" stroke={palette.ember} strokeOpacity="0.35" />

      <g transform="rotate(-4 630 360)">
        <rect x="520" y="320" width="196" height="76" rx="10" fill={`url(#glass-${uid})`} stroke="rgba(255,255,255,0.12)" />
        <text x="540" y="352" fill="rgba(244,244,245,0.75)" fontFamily="'JetBrains Mono', monospace" fontSize="22" letterSpacing="2">24°</text>
        <rect x="540" y="366" width="72" height="4" rx="2" fill="rgba(255,255,255,0.15)" />
        <rect x="648" y="334" width="48" height="44" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
        <path d="M656 356 h32 M672 344 v24" stroke={palette.primary} strokeOpacity="0.6" />
      </g>

      <path d="M86 428 C 200 402, 300 436, 424 416 S 620 380, 736 424" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 8" />
    </g>
  )
}
