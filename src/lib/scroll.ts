import type Lenis from 'lenis'

let lenisInstance: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance
}

export function scrollToSection(id: string, offset = -84) {
  const element = document.getElementById(id)
  if (!element) return
  if (lenisInstance) {
    lenisInstance.scrollTo(element, { offset, duration: 1.3 })
  } else {
    const top = element.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

export function scrollToTop(immediate = false) {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate, duration: 1.1 })
  } else {
    window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
  }
}

export function lockScroll() {
  lenisInstance?.stop()
  document.body.style.overflow = 'hidden'
}

export function unlockScroll() {
  lenisInstance?.start()
  document.body.style.overflow = ''
}

export function getLenis() {
  return lenisInstance
}
