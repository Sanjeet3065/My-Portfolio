# Sanjeet Chauhan — Developer Portfolio

A cinematic, editorial developer portfolio built with React, TypeScript and GSAP. Dark editorial layout, a typographic hero with animated character reveals, a reversing skills ticker, scroll-driven storytelling, a photographic Winning Moments gallery, and an ember-red glow accent layered over the violet/cyan palette.

No personal links, photographs, event dates or locations are invented. Anything unverified is either left empty (and hidden from the UI) or shown as clearly labelled artwork.

---

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS (RGB variable design tokens)
- React Router (home + project case-study routes)
- GSAP + ScrollTrigger, Lenis smooth scroll
- Lucide icons

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + production build into dist/
npm run preview   # preview the production build
```

To regenerate the social preview image after changing branding:

```bash
node scripts/generate-og.mjs   # writes public/og.png
```

---

## Project structure

```
src/
  config/site.ts          identity, availability, contact links, navigation
  data/
    projects.ts           5 case studies + all copy
    moments.ts            Winning Moments gallery entries
    achievements.ts       awards, certifications, participations
    skills.ts             tech categories
    timeline.ts           Journey milestones
  components/
    layout/               Preloader, Navbar, Footer, CustomCursor
    three/HeroScene.tsx   Archived 3D ember core source (retained, not mounted)
    sections/             Hero, SkillsMarquee, About, Skills, Projects,
                          Journey, Achievements, WinningMoments, Playground, Contact
    projects/             ProjectArtwork (SVG fallbacks)
    moments/              MomentArt (photo / artwork fallback)
    ui/                   Reveal, Magnetic, Modal, SectionHeading
  pages/                  Home, ProjectDetail, NotFound
  hooks/                  scroll, active section, reduced motion
  index.css               design tokens + global styles
public/
  images/                 your photos and screenshots
  og.png                  generated social preview
  _redirects              SPA rewrite for Netlify-style hosts
```

---

## Personal configuration

Everything personal lives in `src/config/site.ts`.

| Field | Notes |
| --- | --- |
| `name`, `firstName`, `lastName`, `monogram` | Used in nav, hero, footer. |
| `role`, `roles` | Hero rotator takes the full `roles` array. |
| `intro` | Hero paragraph. |
| `degree`, `academicYear`, `university`, `specializations`, `careerGoal` | About section. |
| `availability` | Set `available: false` to hide the status pill. |
| `email`, `phone` | Email CTA only renders when set. |
| `github`, `linkedin`, `twitter`, `whatsapp` | Social buttons are filtered; blank entries are hidden. Use full URLs. |
| `resume` | e.g. `/resume.pdf` after placing the file in `public/`. |
| `profileImage` | e.g. `/images/profile.jpg`. |
| `navigation` | Section order and labels. |

**Contact links are intentionally empty** until real URLs are provided. The contact section shows an honest “details being finalised” card instead of dead links, and no fake form is included. Once you set `email` and social URLs, the mailto/copy-email CTA and social buttons appear automatically.

---

## The ember-red accent

The red is a signature glow, not a third dominant brand colour.

- Token: `--ember: 255 59 78` in `src/index.css` (`:root`), exposed as `ember` in `tailwind.config.ts`.
- Utilities: `.ember-glow` (text glow), `.red-wash` (section background wash), `.pulse-ember` (availability pulse).
- Used in: availability indicator, custom cursor hover, key CTAs and arrows, project/moment hover states, journey progress line, the skills ticker markers, and focus/active navigation underlines.

To tune it, change the `--ember` triple (space-separated RGB channels). To make it warmer or softer, adjust `.ember-glow` / `.red-wash` opacity in `index.css`.

---

## Editing content

### Projects

Edit `src/data/projects.ts`. Each entry supports:

- `slug` (URL), `number`, `title`, `category`, `year`, `status` (`Completed | In Development | Concept`)
- `tagline`, `summary`, `overview`, `problem`, `solution`
- `features`, `tech`, `process[]`, `challenges[]`
- `accent` (`violet | cyan | ember`) and `artwork` (`network | waves | capsules | grid | weather`)
- optional `image`, `imageAlt`, `gallery[]`, `github`, `live`

Case-study pages at `/projects/:slug` and next-project navigation are generated from this array. If `image` is omitted, a custom generative SVG artwork is rendered instead — do not add screenshots you do not have. Only list a feature as complete when it is actually complete.

### Winning Moments

1. Add an image to `public/images/moments/` (e.g. `algo-arena.jpg`).
2. Register it in `src/data/moments.ts`:

```ts
{
  id: 'algo-arena',
  title: 'Algo Arena',
  event: 'Coding & Problem Solving Competition',
  rank: '1st Place',
  description: 'First place in a coding and problem-solving competition.',
  date: '',                    // optional — add only if verified
  location: '',                // optional
  image: '/images/moments/algo-arena.jpg',
  alt: 'Sanjeet receiving the first-place award at Algo Arena',
  certificate: '',             // optional certificate URL
  featured: true,              // first featured image gets the large treatment
}
```

Entries without `image` remain in the gallery with custom rank-coloured artwork, so the section is never empty. The lightbox supports arrow keys, Home/End, Escape, and focus restoration. Use landscape images at least 1600px wide for the featured slot and compress them before committing.

### Achievements & certificates

Edit `src/data/achievements.ts`. Each entry supports `title`, `issuer`, `date`, `description`, `category` (`Award | Certification | Participation`), `certificateImage`, and `verifyUrl`. Certificates render as an elegant record card with a stylized certificate preview; no certificate image or verification URL is fabricated.

### Journey & skills

- `src/data/timeline.ts`: six phases, no invented dates.
- `src/data/skills.ts`: category tabs and the ticker between the hero and About. Percentages are deliberately not used.

### Profile photo & resume

Place files in `public/images/profile.jpg` and `public/resume/Sanjeet_Chauhan_Resume.pdf`, then set `profileImage` / `resume` in `site.ts`. Until then the About section uses a designed monogram panel.

---

## Motion, performance & accessibility

- The preloader runs for at least 5 seconds, counts up to 100%, and only exits once fonts and the window have finished loading. Under `prefers-reduced-motion` it is skipped entirely.
- All GSAP animations are scoped with `gsap.context` and cleaned up on unmount; ScrollTriggers are refreshed after routes render.
- The hero is a typographic composition with GSAP character and fade reveals. The archived 3D core source in `src/components/three/` is not mounted, so no WebGL is required and no Three.js code ships in the build.
- The hero's skill constellation (`src/components/hero/SkillConstellation.tsx`) is an SVG word graph sourced from the portfolio's own skills and bio. Edges draw on entry, then a word lights up every 2.8s with a directional label reveal; hovering, clicking or focusing a word activates it directly and pauses the cycle. It is decorative and hidden below `xl` to protect the mobile hero; reduced motion shows a static graph with no auto-cycle.
- A full reload always starts at the top of the home page: native scroll restoration is disabled, section hashes are cleared on load, and the preloader reveals the hero at scroll position zero. In-app section links still use hashes and scroll normally.
- The skills ticker below the hero is generated from `src/data/skills.ts`. It loops right-to-left by default; click or tap it to smoothly reverse direction, or use Enter/Space when focused. Under `prefers-reduced-motion` it renders as a static wrapped list.
- Reduced motion also disables Lenis, cursor effects and decorative animation loops.
- The custom cursor only appears on fine-pointer devices.
- Mobile gets a full-screen menu, not a compressed desktop nav.
- Modals (gallery, certificates) trap focus, close on Escape, lock scroll and restore focus.
- Skip link, semantic landmarks, labelled controls, visible focus rings and descriptive alt text are included.

---

## SEO and deployment

`index.html` includes title, description, Open Graph/Twitter tags, canonical placeholder, theme colour and Person JSON-LD. Update the canonical/OG URLs and `public/robots.txt` after choosing a domain.

Build and deploy the `dist/` folder to any static host. Client-side routes need an SPA fallback:

- Netlify: `public/_redirects` is included (`/* /index.html 200`).
- Vercel: rewrite all paths to `/index.html`.
- GitHub Pages: use a 404 fallback or hash routing; `/projects/:slug` needs server rewrites on other hosts.

Before publishing, set your real email, GitHub, LinkedIn and other links in `src/config/site.ts`.
