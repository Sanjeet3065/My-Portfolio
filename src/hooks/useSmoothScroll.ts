import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setLenis } from '../lib/scroll'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll(disabled: boolean) {
  useEffect(() => {
    if (disabled) return

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.25,
    })

    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)

    const update = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(500, 33)

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400)

    return () => {
      window.clearTimeout(refresh)
      gsap.ticker.remove(update)
      lenis.destroy()
      setLenis(null)
    }
  }, [disabled])
}
