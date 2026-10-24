export type ProjectStatus = 'Completed' | 'In Development' | 'Concept'

export type ArtworkVariant = 'network' | 'waves' | 'capsules' | 'grid' | 'weather'

export interface ProjectProcessStep {
  title: string
  body: string
}

export interface Project {
  slug: string
  number: string
  title: string
  category: string
  year: string
  status: ProjectStatus
  tagline: string
  summary: string
  overview: string
  problem: string
  solution: string
  features: string[]
  tech: string[]
  process: ProjectProcessStep[]
  challenges: string[]
  accent: 'violet' | 'cyan' | 'ember'
  artwork: ArtworkVariant
  image?: string
  imageAlt?: string
  github?: string
  live?: string
  gallery?: { src: string; alt: string }[]
}

export interface Moment {
  id: string
  title: string
  event: string
  rank: string
  description: string
  date?: string
  location?: string
  image?: string
  alt: string
  certificate?: string
  featured?: boolean
}

export type AchievementCategory = 'Award' | 'Certification' | 'Participation'

export interface Achievement {
  id: string
  title: string
  issuer?: string
  date?: string
  description: string
  category: AchievementCategory
  certificateImage?: string
  verifyUrl?: string
}

export interface Milestone {
  phase: string
  title: string
  description: string
  tags: string[]
}

export interface SkillCategory {
  id: string
  label: string
  blurb?: string
  skills: string[]
  isPrimary?: boolean
  proficiency?: string
  icon?: string
}
