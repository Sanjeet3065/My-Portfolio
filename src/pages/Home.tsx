import { memo } from 'react'
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

const MemoHero = memo(Hero)
const MemoSkillsMarquee = memo(SkillsMarquee)
const MemoAbout = memo(About)
const MemoSkills = memo(Skills)
const MemoProjects = memo(Projects)
const MemoJourney = memo(Journey)
const MemoAchievements = memo(Achievements)
const MemoWinningMoments = memo(WinningMoments)
const MemoPlayground = memo(Playground)
const MemoContact = memo(Contact)

function Home() {
  return (
    <>
      <MemoHero />
      <MemoSkillsMarquee />
      <MemoAbout />
      <MemoSkills />
      <MemoProjects />
      <MemoJourney />
      <MemoAchievements />
      <MemoWinningMoments />
      <MemoPlayground />
      <MemoContact />
    </>
  )
}

export default memo(Home)
