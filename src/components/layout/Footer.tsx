import { ArrowUp, ArrowUpRight, Download } from 'lucide-react'
import { siteConfig, socialLinks } from '../../config/site'
import { scrollToTop } from '../../lib/scroll'
import { useSectionNavigation } from '../../hooks/useSectionNavigation'

export function Footer() {
  const { goToSection, goHome } = useSectionNavigation()
  const year = new Date().getFullYear()

  return (
    <footer id="site-footer" className="relative overflow-hidden border-t border-line/10 bg-ink">
      <div className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-[80vw] -translate-x-1/2 rounded-full bg-ember/[0.07] blur-[120px]" />

      <div className="shell relative py-14 sm:py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <button onClick={goHome} className="flex items-center gap-3" aria-label={`${siteConfig.name} — home`}>
              <span className="relative grid h-10 w-10 place-items-center rounded-lg border border-line/15 bg-surface/60 font-display text-sm font-semibold">
                {siteConfig.monogram}
                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_10px_rgba(255,59,78,0.95)]" />
              </span>
              <span className="font-display text-lg tracking-tight">{siteConfig.name}</span>
            </button>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Full stack developer building considered products at the intersection of engineering and interface.
            </p>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:text-[9px] sm:tracking-[0.18em]">
              {siteConfig.degree}
              <br />
              {siteConfig.university}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-1 sm:gap-x-12 sm:gap-y-3">
            {siteConfig.navigation.map((item, index) => (
              <button
                key={item.id}
                onClick={() => goToSection(item.id)}
                className="group flex min-h-[40px] items-center gap-3 text-left font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-paper sm:text-[10px] sm:tracking-[0.16em]"
              >
                <span className="text-[9px] text-muted/60 sm:text-[8px]">{String(index + 1).padStart(2, '0')}</span>
                {item.label}
                <ArrowUpRight className="hidden h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 sm:block" />
              </button>
            ))}
          </div>
          

          <div className="flex flex-col items-start gap-6 lg:items-end">
            {siteConfig.availability.available ? (
              <span className="inline-flex items-center gap-2.5 rounded-full border border-ember/25 bg-ember/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ember sm:text-[9px] sm:tracking-[0.14em]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="pulse-ember absolute inset-0 rounded-full" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-ember" />
                </span>
                Available for opportunities
              </span>
            ) : null}

            {siteConfig.email ? (
              <a
                href={`mailto:${siteConfig.email}`}
                className="group flex items-center gap-2 text-sm text-muted transition-colors hover:text-paper"
              >
                {siteConfig.email}
                <ArrowUpRight className="h-3.5 w-3.5 text-ember" />
              </a>
            ) : null}

            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-x-5 gap-y-1">
                {socialLinks.map((link) => (
                  <a
                    key={link.key}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex min-h-[40px] items-center font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ember sm:text-[9px] sm:tracking-[0.18em]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}

            {siteConfig.resume ? (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:text-[9px] sm:tracking-[0.18em]">
                <a
                  href={siteConfig.resume}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="View résumé (PDF opens in new tab)"
                  className="inline-flex min-h-[40px] items-center text-muted transition-colors hover:text-paper"
                >
                  View résumé
                </a>
                <span className="text-line/20">/</span>
                <a
                  href={siteConfig.resume}
                  download="Sanjeet_Chauhan_Resume.pdf"
                  aria-label="Download résumé (PDF)"
                  className="inline-flex min-h-[40px] items-center gap-1.5 text-muted transition-colors hover:text-ember"
                >
                  <Download className="h-3 w-3 text-ember" />
                  <span>Download résumé</span>
                </a>
              </div>
            ) : null}

            <button
              onClick={() => scrollToTop()}
              className="group mt-2 flex min-h-[44px] items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/80 transition-colors hover:text-ember sm:text-[9px] sm:tracking-[0.18em]"
            >
              Back to top
              <span className="grid h-10 w-10 place-items-center rounded-full border border-line/15 transition-colors group-hover:border-ember/50">
                <ArrowUp className="h-3.5 w-3.5" />
              </span>
            </button>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line/10 pt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:mt-16 sm:flex-row sm:items-center sm:justify-between sm:text-[9px] sm:tracking-[0.16em]">
          <span>
            © {year} {siteConfig.name}. All rights reserved.
          </span>
          <span className="hidden sm:block">Designed &amp; engineered with intent</span>
          <span>React · Three.js · GSAP</span>
        </div>
      </div>
    </footer>
  )
}
