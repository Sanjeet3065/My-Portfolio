import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { siteConfig } from '../config/site'

export default function NotFound() {
  useEffect(() => {
    document.title = `Page not found — ${siteConfig.name}`
  }, [])

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-[76px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,59,78,0.08),transparent_55%)]" />
      <div className="shell relative py-20">
        <p className="font-mono text-[9px] uppercase tracking-ultra text-ember">Error / 404</p>
        <p className="display mt-6 text-[clamp(7rem,26vw,20rem)] text-stroke">404</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="font-display text-3xl tracking-tight sm:text-4xl">This page took a different route.</h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              The address may have changed, or the page was never built. The work is still one
              click away.
            </p>
          </div>
          <Link
            to="/"
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-paper px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition-all duration-300 hover:bg-ember hover:text-paper"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to portfolio
          </Link>
        </div>
      </div>
    </section>
  )
}
