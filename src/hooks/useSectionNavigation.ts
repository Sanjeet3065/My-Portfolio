import { useLocation, useNavigate } from 'react-router-dom'
import { scrollToSection, scrollToTop } from '../lib/scroll'

export function useSectionNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  const goToSection = (id: string) => {
    if (location.pathname === '/') {
      scrollToSection(id)
    } else {
      navigate(`/#${id}`)
    }
  }

  const goHome = () => {
    if (location.pathname === '/') {
      scrollToTop()
    } else {
      navigate('/')
    }
  }

  return { goToSection, goHome }
}
