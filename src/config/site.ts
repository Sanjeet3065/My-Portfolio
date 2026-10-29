export const siteConfig = {
  name: 'Sanjeet Chauhan',
  firstName: 'Sanjeet',
  lastName: 'Chauhan',
  monogram: 'SC',
  role: 'Full Stack Developer',
  roles: ['Full Stack Developer', 'MERN Stack Developer', 'Java', 'Software Engineer','Data Structures & Algorithms','Cloud-Computing'],
  intro:
    'Computer Science student specializing in Java, Data Structures & Algorithms, and modern full-stack development with React, Node.js, and MongoDB.',
  degree: 'B.Tech in Computer Science & Engineering',
  academicYear: 'Third Year',
  university: 'Shri Ramswaroop Memorial University',
  batch: '2024 – 2028',
  cgpa: '8.40',
  location: 'Maharajganj, Uttar Pradesh, India',
  leetcodeCount: '35+',
  specializations: ['Full Stack Web Developer','Java', 'Data Structures & Algorithms', 'Real-Time Applications','Cloud-Computing'],
  careerGoal: 'Software Development & Full Stack Engineering',

  availability: {
    available: true,
    label: 'Open to software engineering opportunities',
  },

  // Fill these in with your real details. Empty values are hidden in the UI.
  email: 'chauhansanjeet887@gmail.com',
  phone: '+91 9118123480',
  github: 'https://github.com/Sanjeet3065',
  linkedin: 'https://www.linkedin.com/in/sanjeetchauhan01/?isSelfProfile=true',
  leetcode: 'https://leetcode.com/u/Sanjeet_1080/',
  twitter: '',
  whatsapp: 'https://wa.me/919118123480?text=Hi%20Sanjeet%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20connect.',

  // Resume path inside public folder
  resume: '/resume/Sanjeet_Chauhan_Resume.pdf',
  // Example: '/images/profile.jpg'
  profileImage: '/images/profile-cutout.png',

  navigation: [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'journey', label: 'Journey' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'moments', label: 'Winning Moments' },
    { id: 'contact', label: 'Contact' },
  ],
} as const

export type SocialKey = 'github' | 'linkedin' | 'leetcode' | 'twitter' | 'whatsapp'

export const socialLinks = [
  { key: 'linkedin' as const, label: 'LinkedIn', href: siteConfig.linkedin },
  { key: 'leetcode' as const, label: 'LeetCode', href: siteConfig.leetcode },
  { key: 'github' as const, label: 'GitHub', href: siteConfig.github },
  { key: 'twitter' as const, label: 'X', href: siteConfig.twitter },
].filter((link) => link.href.length > 0)
