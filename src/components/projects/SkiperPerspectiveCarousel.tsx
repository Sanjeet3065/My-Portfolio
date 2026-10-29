import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Github,
  ArrowUpRight,
  Eye,
} from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Navigation, Pagination, Keyboard, A11y } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

// Swiper core & module styles
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import type { Project } from '../../types'
import { ProjectArtwork } from './ProjectArtwork'
import { scrollToTop } from '../../lib/scroll'

interface SkiperPerspectiveCarouselProps {
  projects: Project[]
}

export function SkiperPerspectiveCarousel({ projects }: SkiperPerspectiveCarouselProps) {
  const navigate = useNavigate()
  const swiperRef = useRef<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Ensure activeIndex is valid if project list changes (e.g. on filter change)
  useEffect(() => {
    if (activeIndex >= projects.length) {
      setActiveIndex(0)
    }
    if (swiperRef.current) {
      if (swiperRef.current.params.loop && projects.length > 2) {
        swiperRef.current.slideToLoop(0, 0)
      } else {
        swiperRef.current.slideTo(0, 0)
      }
    }
  }, [projects])

  const activeProject = projects[activeIndex] || projects[0]

  const handleSlideClick = useCallback(
    (index: number, slug: string) => {
      const swiper = swiperRef.current
      if (!swiper) return

      const currentRealIndex = swiper.realIndex
      if (currentRealIndex !== index) {
        // If clicking a neighboring side slide, bring it to center
        if (swiper.params.loop && projects.length > 2) {
          swiper.slideToLoop(index)
        } else {
          swiper.slideTo(index)
        }
      } else {
        // If clicking the active center slide, navigate to case study
        window.scrollTo(0, 0)
        scrollToTop(true)
        navigate(`/projects/${slug}`)
      }
    },
    [navigate, projects.length],
  )

  if (!projects || projects.length === 0) {
    return null
  }

  // Gracefully adapt Swiper loop depending on number of projects
  const isLoopable = projects.length > 2

  return (
    <div className="relative w-full">
      {/* 3D Coverflow Container */}
      <div className="relative mx-auto w-full max-w-6xl px-2 sm:px-6">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex)
          }}
          modules={[EffectCoverflow, Navigation, Pagination, Keyboard, A11y]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          slideToClickedSlide={true}
          loop={isLoopable}
          speed={550}
          keyboard={{ enabled: true }}
          coverflowEffect={{
            rotate: 35, // Inverted-perspective side slide angle
            stretch: 0,
            depth: 130, // 3D depth translation
            modifier: 1,
            scale: 0.88, // Side slides scale down
            slideShadows: true, // Swiper 3D side shadows
          }}
          navigation={{
            prevEl: '.skiper-prev-btn',
            nextEl: '.skiper-next-btn',
          }}
          pagination={{
            el: '.skiper-pagination-container',
            clickable: true,
            bulletClass: 'skiper-bullet',
            bulletActiveClass: 'skiper-bullet-active',
          }}
          className="skiper-coverflow !overflow-visible !py-6"
        >
          {projects.map((project, index) => {
            const isActive = index === activeIndex

            return (
              <SwiperSlide
                key={project.slug}
                className="!h-auto !w-[290px] cursor-pointer select-none transition-all duration-500 sm:!w-[420px] md:!w-[470px] lg:!w-[520px]"
                onClick={() => handleSlideClick(index, project.slug)}
              >
                <div
                  className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${
                    isActive
                      ? 'border-ember/60 bg-surface/90 shadow-[0_12px_45px_-10px_rgba(255,59,78,0.4)] ring-1 ring-ember/30'
                      : 'border-line/15 bg-surface/50 opacity-70 hover:border-line/35 hover:opacity-90 hover:shadow-xl'
                  }`}
                >
                  {/* Media Visual with 16:9 Aspect Ratio */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-2xl bg-surface">
                    {project.image ? (
                      <picture>
                        <source
                          srcSet={project.image.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
                          type="image/webp"
                        />
                        <img
                          src={project.image}
                          alt={project.imageAlt ?? `${project.title} project preview`}
                          className="h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    ) : (
                      <ProjectArtwork
                        variant={project.artwork}
                        accent={project.accent}
                        label={`Abstract artwork for the ${project.title} project`}
                        className="transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                      />
                    )}

                    {/* Gradient Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-60" />

                    {/* Top Floating Badges */}
                    <div className="absolute inset-x-3.5 top-3.5 flex items-center justify-between">
                      <span className="rounded-full border border-white/10 bg-ink/75 px-2.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-paper/90 backdrop-blur-md">
                        {project.number}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] backdrop-blur-md ${
                          project.status === 'Completed'
                            ? 'border-line/20 bg-ink/75 text-paper/85'
                            : project.status === 'In Development'
                              ? 'border-accent/35 bg-ink/75 text-accent'
                              : 'border-line/15 bg-ink/75 text-muted'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            project.status === 'Completed'
                              ? 'bg-paper/70'
                              : project.status === 'In Development'
                                ? 'bg-accent shadow-[0_0_8px_rgba(56,189,248,0.8)]'
                                : 'bg-muted'
                          }`}
                        />
                        {project.status}
                      </span>
                    </div>

                    {/* Active Overlay CTA on Hover */}
                    {isActive && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-ember/60 bg-ink/80 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-paper shadow-lg">
                          <Eye className="h-3.5 w-3.5 text-ember" />
                          Click to View Case Study
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Compact Slide Footer */}
                  <div className="border-t border-line/10 bg-surface/40 p-3 sm:p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted">
                        {project.category}
                      </span>
                      <span className="shrink-0 font-mono text-[8.5px] text-muted/70">
                        {project.year}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <h3
                        className={`display text-lg font-bold tracking-tight transition-colors sm:text-xl ${
                          isActive ? 'text-ember' : 'text-paper group-hover:text-ember/80'
                        }`}
                      >
                        {project.title}
                      </h3>
                      {isActive && (
                        <span className="inline-flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.12em] text-ember">
                          Active Slide
                          <ArrowUpRight className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>

        {/* Centered Carousel Navigation Island */}
        <div className="mt-5 flex items-center justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-line/20 bg-surface/70 px-4 py-2 shadow-lg backdrop-blur-md transition-all duration-300 sm:gap-4">
            {/* Previous Button */}
            <button
              type="button"
              className="skiper-prev-btn group flex h-8 w-8 items-center justify-center rounded-full border border-line/20 bg-surface/80 text-paper transition-all hover:border-ember hover:bg-surface hover:text-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember sm:h-9 sm:w-9"
              aria-label="Previous project slide"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </button>

            {/* Pagination Bullets */}
            <div className="skiper-pagination-container flex items-center gap-1.5" />

            {/* Project Index Counter */}
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted sm:text-[9.5px]">
              <span className="font-semibold text-paper">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="mx-1 text-line/40">/</span>
              <span>{String(projects.length).padStart(2, '0')}</span>
            </div>

            {/* Next Button */}
            <button
              type="button"
              className="skiper-next-btn group flex h-8 w-8 items-center justify-center rounded-full border border-line/20 bg-surface/80 text-paper transition-all hover:border-ember hover:bg-surface hover:text-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember sm:h-9 sm:w-9"
              aria-label="Next project slide"
            >
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Synchronized Active Project Information Panel */}
      {activeProject && (
        <div className="mx-auto mt-8 w-full max-w-4xl px-3 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl border border-line/15 bg-surface/60 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            {/* Ambient Background Accent Glow */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-15 blur-3xl transition-colors duration-700"
              style={{
                backgroundColor: activeProject.accent || '#ff3b4e',
              }}
            />

            {/* Top Metadata Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/10 pb-4">
              <div className="flex flex-wrap items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted sm:text-[9.5px]">
                <span className="rounded-full border border-ember/30 bg-ember/10 px-2 py-0.5 font-mono text-[8.5px] font-semibold text-ember">
                  {activeProject.number}
                </span>
                <span className="text-paper/90">{activeProject.category}</span>
                <span className="text-line/40">·</span>
                <span>{activeProject.year}</span>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] backdrop-blur-md ${
                  activeProject.status === 'Completed'
                    ? 'border-line/20 bg-surface/80 text-paper/85'
                    : activeProject.status === 'In Development'
                      ? 'border-accent/35 bg-accent/10 text-accent'
                      : 'border-line/15 bg-surface/80 text-muted'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    activeProject.status === 'Completed'
                      ? 'bg-paper/70'
                      : activeProject.status === 'In Development'
                        ? 'bg-accent shadow-[0_0_8px_rgba(56,189,248,0.8)]'
                        : 'bg-muted'
                  }`}
                />
                {activeProject.status}
              </span>
            </div>

            {/* Main Title and Descriptions */}
            <div className="mt-4">
              <h2 className="display text-2xl font-bold tracking-tight text-paper transition-colors sm:text-3xl lg:text-4xl">
                <Link
                  to={`/projects/${activeProject.slug}`}
                  onClick={() => {
                    window.scrollTo(0, 0)
                    scrollToTop(true)
                  }}
                  className="group/title inline-flex items-center gap-2 hover:text-ember"
                >
                  {activeProject.title}
                  <ArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 group-hover/title:opacity-100 text-ember" />
                </Link>
              </h2>

              <p className="mt-1.5 font-display text-sm leading-snug tracking-tight text-paper/95 sm:text-base">
                {activeProject.tagline}
              </p>

              <p className="mt-2.5 text-xs leading-relaxed text-muted sm:text-sm">
                {activeProject.summary}
              </p>
            </div>

            {/* Tech Stack Pills */}
            <div className="mt-5">
              <p className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-muted">
                Core Technologies
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                {activeProject.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-line/15 bg-surface/70 px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-muted transition-colors hover:border-ember/40 hover:text-paper sm:text-[8.5px]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Navigation Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line/10 pt-5">
              <Link
                to={`/projects/${activeProject.slug}`}
                onClick={() => {
                  window.scrollTo(0, 0)
                  scrollToTop(true)
                }}
                className="group inline-flex min-h-[42px] items-center gap-2 rounded-full bg-paper px-5 py-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink transition-all duration-300 hover:bg-ember hover:text-paper sm:text-[10px]"
              >
                <span>View Case Study</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              {activeProject.live && (
                <a
                  href={activeProject.live}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${activeProject.title} live demo`}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-paper transition-all hover:border-ember hover:bg-ember/20 hover:text-ember sm:text-[9.5px]"
                >
                  <Globe className="h-3 w-3 text-ember" />
                  Live Demo
                </a>
              )}

              {activeProject.github && (
                <a
                  href={activeProject.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${activeProject.title} GitHub repository`}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-line/20 bg-surface/60 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted transition-all hover:border-ember/40 hover:text-paper sm:text-[9.5px]"
                >
                  <Github className="h-3 w-3" />
                  GitHub Code
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles for Swiper Pagination & 3D Shadows */}
      <style>{`
        .skiper-bullet {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background-color: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .skiper-bullet:hover {
          background-color: rgba(255, 255, 255, 0.45);
        }
        .skiper-bullet-active {
          width: 24px;
          background-color: #ff3b4e !important;
          box-shadow: 0 0 10px rgba(255, 59, 78, 0.75);
        }
        .swiper-slide-shadow-left,
        .swiper-slide-shadow-right {
          background: rgba(10, 10, 15, 0.75) !important;
          border-radius: 1rem;
        }
      `}</style>
    </div>
  )
}
