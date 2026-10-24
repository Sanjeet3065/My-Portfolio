import { useState } from 'react'
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  FileText,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Share2,
} from 'lucide-react'
import { siteConfig, socialLinks } from '../../config/site'
import { scrollToTop } from '../../lib/scroll'
import { useSectionNavigation } from '../../hooks/useSectionNavigation'
import { copyShareText, getWhatsAppShareUrl, sharePortfolio } from '../../lib/share'
import { Magnetic } from '../ui/Magnetic'
import { Reveal } from '../ui/Reveal'
import { ContactForm } from '../contact/ContactForm'

function LeetCodeIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.216 5.216 0 0 0-3.85-1.467c-1.472 0-2.856.577-3.896 1.625l-4.343 4.388c-1.04 1.048-1.613 2.448-1.613 3.943s.573 2.895 1.613 3.943l4.343 4.373c1.04 1.048 2.424 1.625 3.896 1.625 1.472 0 2.856-.577 3.896-1.625l2.609-2.636c.514-.514.496-1.365-.039-1.901-.535-.535-1.386-.553-1.9-.038zm3.844-4.887H8.22c-.744 0-1.348-.604-1.348-1.348s.604-1.348 1.348-1.348h11.726c.744 0 1.348.604 1.348 1.348s-.604 1.348-1.348 1.348z" />
    </svg>
  )
}

function TwitterXIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  leetcode: LeetCodeIcon,
  twitter: TwitterXIcon,
  whatsapp: MessageCircle,
}

export function Contact() {
  const [copied, setCopied] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [shareFeedback, setShareFeedback] = useState<string | null>(null)
  const { goToSection } = useSectionNavigation()
  const email = siteConfig.email

  const copyEmail = async () => {
    if (!email) return
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  const handleSharePortfolio = async () => {
    const result = await sharePortfolio()
    if (result === 'shared') {
      setShareFeedback('Shared!')
      window.setTimeout(() => setShareFeedback(null), 2500)
    } else if (result === 'copied') {
      setCopiedLink(true)
      window.setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  const handleCopyLink = async () => {
    const success = await copyShareText()
    if (success) {
      setCopiedLink(true)
      window.setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line/10 pb-14 pt-20 sm:pb-20 sm:pt-28 lg:pt-36">
      <div className="red-wash pointer-events-none absolute inset-0 opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[520px] w-[90vw] -translate-x-1/2 rounded-full bg-ember/[0.08] blur-[150px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[340px] w-[340px] rounded-full bg-accent/[0.06] blur-[130px]" />

      <div className="shell relative">
        <Reveal>
          <p className="eyebrow">
            <span className="h-px w-8 bg-ember/80 shadow-[0_0_12px_rgba(255,59,78,0.9)]" />
            08 / Contact
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="display mt-6 sm:mt-7 text-[clamp(2.3rem,9vw,8.8rem)]">
            Let&apos;s build
            <br />
            <span className="text-muted">something remarkable.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 border-t border-line/10 pt-10 sm:mt-14 lg:mt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
          <Reveal>
            <div>
              <p className="max-w-xl font-display text-xl leading-snug tracking-tight text-paper/90 sm:text-2xl">
                Have a role, a project or an idea worth building? I&apos;d like to hear about it.
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
                I&apos;m currently looking for software engineering opportunities where I can
                contribute to meaningful products, keep learning from strong teams and do the best
                work of my career so far.
              </p>

              {siteConfig.availability.available ? (
                <span className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-ember/25 bg-ember/[0.06] px-3.5 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ember shadow-[0_0_32px_-12px_rgba(255,59,78,0.8)]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="pulse-ember absolute inset-0 rounded-full" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-ember" />
                  </span>
                  {siteConfig.availability.label}
                </span>
              ) : null}

              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-3.5">
                {socialLinks.map((link) => {
                  const Icon = SOCIAL_ICONS[link.key] || ArrowUpRight
                  return (
                    <a
                      key={link.key}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group relative inline-flex items-center gap-2.5 rounded-full border border-line/15 bg-surface/50 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-paper/85 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-ember/50 hover:bg-ember/[0.08] hover:text-ember hover:shadow-[0_0_20px_-4px_rgba(255,59,78,0.35)] sm:text-xs"
                    >
                      <Icon className="h-3.5 w-3.5 text-muted transition-all duration-300 group-hover:scale-110 group-hover:text-ember" />
                      <span className="font-medium transition-colors duration-300 group-hover:text-ember">
                        {link.label}
                      </span>
                      <ArrowUpRight className="h-3 w-3 text-muted/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember group-hover:opacity-100" />
                    </a>
                  )
                })}
                {siteConfig.resume ? (
                  <>
                    <a
                      href={siteConfig.resume}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="View Résumé (PDF opens in new tab)"
                      title="View Résumé (PDF)"
                      className="group relative inline-flex items-center gap-2.5 rounded-full border border-line/15 bg-surface/50 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-paper/85 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-ember/50 hover:bg-ember/[0.08] hover:text-ember hover:shadow-[0_0_20px_-4px_rgba(255,59,78,0.35)] sm:text-xs"
                    >
                      <FileText className="h-3.5 w-3.5 text-muted transition-all duration-300 group-hover:scale-110 group-hover:text-ember" />
                      <span className="font-medium transition-colors duration-300 group-hover:text-ember">
                        Résumé
                      </span>
                      <ArrowUpRight className="h-3 w-3 text-muted/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember group-hover:opacity-100" />
                    </a>

                    <a
                      href={siteConfig.resume}
                      download="Sanjeet_Chauhan_Resume.pdf"
                      aria-label="Download Resume (PDF)"
                      title="Download Resume (PDF)"
                      className="group relative inline-flex items-center gap-2 rounded-full border border-line/15 bg-surface/50 px-3.5 py-2 font-mono text-xs uppercase tracking-[0.14em] text-paper/85 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-ember/50 hover:bg-ember/[0.08] hover:text-ember hover:shadow-[0_0_20px_-4px_rgba(255,59,78,0.35)] sm:text-xs"
                    >
                      <Download className="h-3.5 w-3.5 text-muted transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-ember" />
                      <span className="font-medium transition-colors duration-300 group-hover:text-ember">
                        Download
                      </span>
                    </a>
                  </>
                ) : null}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            {email ? (
              <div className="border-t border-line/15 pt-7">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">Start a conversation</p>
                  <Mail className="h-4 w-4 text-ember" />
                </div>
                <a
                  href={`mailto:${email}`}
                  className="group mt-5 flex items-center justify-between gap-4"
                >
                  <span className="break-all font-display text-xl tracking-tight transition-colors duration-300 group-hover:text-ember sm:text-3xl">
                    {email}
                  </span>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line/20 transition-all duration-300 group-hover:border-ember/50 group-hover:bg-ember/10">
                    <ArrowUpRight className="h-4 w-4 text-muted transition-colors group-hover:text-ember" />
                  </span>
                </a>
                <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-line/15 bg-surface/40 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-ember/40 hover:text-ember sm:text-[9px] sm:tracking-[0.16em]"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-ember" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied email' : 'Copy email'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    aria-label="Copy full portfolio link and details"
                    title="Copy full portfolio link and description"
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-line/15 bg-surface/40 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-paper transition-all hover:border-ember/50 hover:bg-ember/[0.08] hover:text-ember sm:text-[9px] sm:tracking-[0.16em]"
                  >
                    {copiedLink ? <Check className="h-3.5 w-3.5 text-ember" /> : <Copy className="h-3.5 w-3.5 text-ember" />}
                    <span>{copiedLink ? 'Link & details copied!' : 'Copy Link'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSharePortfolio}
                    aria-label="Share portfolio via system share or WhatsApp"
                    title="Share portfolio"
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-ember/35 bg-ember/[0.08] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-paper transition-all hover:border-ember/70 hover:bg-ember/15 hover:text-white sm:text-[9px] sm:tracking-[0.16em]"
                  >
                    <Share2 className="h-3.5 w-3.5 text-ember" />
                    <span>{shareFeedback || 'Share Portfolio'}</span>
                  </button>

                  <a
                    href={getWhatsAppShareUrl()}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="Share directly on WhatsApp with full preview link"
                    title="Share directly on WhatsApp"
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-400 transition-all hover:border-emerald-500/60 hover:bg-emerald-500/20 hover:text-emerald-300 sm:text-[9px] sm:tracking-[0.16em]"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Direct-Delivery Contact Form */}
                <ContactForm recipientEmail={email} />
              </div>
            ) : (
              <div className="relative overflow-hidden border border-line/10 bg-surface/40 p-6 sm:p-8">
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-ember/[0.1] blur-3xl" />
                <div className="relative flex items-center justify-between gap-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">Direct contact</p>
                  <Mail className="h-4 w-4 text-ember" />
                </div>
                <p className="relative mt-5 font-display text-2xl leading-snug tracking-tight">
                  Open to software engineering opportunities.
                </p>
                <p className="relative mt-3 text-sm leading-relaxed text-muted">
                  Personal contact details are being finalised. For now, the work and the record are
                  the best introduction.
                </p>
                <div className="relative mt-7 flex flex-wrap items-center gap-x-5 gap-y-1">
                  <button
                    onClick={() => goToSection('projects')}
                    className="group inline-flex min-h-[44px] items-center gap-2 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-paper transition-colors hover:text-ember sm:text-[9px] sm:tracking-[0.16em]"
                  >
                    Explore the work
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </button>
                  <button
                    onClick={() => goToSection('journey')}
                    className="inline-flex min-h-[44px] items-center py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-paper sm:text-[9px] sm:tracking-[0.16em]"
                  >
                    See the journey
                  </button>
                </div>
              </div>
            )}

            <p className="mt-6 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-muted/70 sm:text-[8.5px] sm:tracking-[0.16em]">
              {siteConfig.careerGoal} · {siteConfig.degree}
            </p>
          </Reveal>
        </div>

        <div className="mt-20 flex flex-col gap-5 border-t border-line/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
            SC / Portfolio
          </span>
          <Magnetic strength={0.2}>
            <button
              onClick={() => scrollToTop()}
              className="group inline-flex min-h-[44px] items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/80 transition-colors hover:text-ember sm:text-[9px] sm:tracking-[0.18em]"
            >
              Back to top
              <span className="grid h-10 w-10 place-items-center rounded-full border border-line/15 transition-colors group-hover:border-ember/50">
                <ArrowUp className="h-3.5 w-3.5" />
              </span>
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
