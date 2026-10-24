import { Hero } from '../components/sections/Hero'
import { SkillsMarquee } from '../components/sections/SkillsMarquee'
import { About } from '../components/sections/About'
import { Skills } from '../components/sections/Skills'
import { Projects } from '../components/sections/Projects'
import { Journey } from '../components/sections/Journey'
import { Achievements } from '../components/sections/Achievements'
import { WinningMoments } from '../components/sections/WinningMoments'
import { Playground } from '../components/sections/Playground'
import { Contact } from '../components/sections/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <SkillsMarquee />
      <About />
      <Skills />
      <Projects />
      <Journey />
      <Achievements />
      <WinningMoments />
      <Playground />
      <Contact />
    </>
  )
}
