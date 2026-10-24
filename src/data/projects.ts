import type { Project } from '../types'

export const projects: Project[] = [
  {
    slug: 'collab',
    number: '01',
    title: 'Collab',
    category: 'SaaS Platform',
    year: '2025',
    status: 'In Development',
    tagline: 'Collaboration infrastructure for teams that build.',
    summary:
      'An AI-assisted developer collaboration and project management platform, designed around less coordination overhead and more shipped work.',
    overview:
      'Collab is a SaaS concept for developer teams: one workspace for projects, tasks, decisions and the context that usually gets lost between them. The goal is software that understands the work — not another place to store it.',
    problem:
      'Developer teams move between issue trackers, documents, chat and code review. The real cost is not only the context switching — it is the reasoning behind decisions quietly disappearing.',
    solution:
      'Collab brings planning and execution together, with AI-assisted summaries and connections between tasks, discussions and code. The client is being built in React and TypeScript, backed by a Node.js and Express API.',
    features: [
      'Project and task workflows',
      'AI-assisted issue summaries in progress',
      'Team activity timeline',
      'Role-based access model',
      'REST API design',
    ],
    tech: ['React', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
    process: [
      {
        title: 'Product framing',
        body: 'Mapped the everyday coordination loops of a small engineering team and chose the few worth owning in one product.',
      },
      {
        title: 'Domain modelling',
        body: 'Designed the relationships between projects, tasks, comments and activity before writing interface code.',
      },
      {
        title: 'Interface system',
        body: 'Built a dense but calm workspace language, favouring clarity over dashboard decoration.',
      },
      {
        title: 'Iterative build',
        body: 'Shipping core flows first, then layering assistance and insights only where they reduce real friction.',
      },
    ],
    challenges: [
      'Modelling project context without turning the interface into noise.',
      'Designing permission boundaries that stay understandable as a team grows.',
      'Keeping AI assistance transparent and useful rather than decorative.',
    ],
    accent: 'violet',
    artwork: 'network',
  },
  {
    slug: 'connectly',
    number: '02',
    title: 'Connectly',
    category: 'Real-Time Collaboration',
    year: '2025',
    status: 'In Development',
    tagline: 'A meeting room that feels as immediate as a conversation.',
    summary:
      'A real-time video meeting and collaboration platform with messaging, screen sharing and the small interaction details that make remote work feel less remote.',
    overview:
      'Connectly is built around a simple idea: the best remote collaboration feels unremarkable. Rooms should open quickly, media should stay stable and the conversation should not wait for the interface.',
    problem:
      'Video tools often separate the meeting from the work around it. Chat lives elsewhere, notes vanish, and connection states are hidden until something breaks.',
    solution:
      'A focused meeting experience with real-time messaging, screen sharing and clear participant controls — designed around WebRTC signalling and a resilient room lifecycle.',
    features: [
      'Room creation and joining',
      'Real-time in-room messaging',
      'Screen sharing',
      'Participant and media controls',
      'Graceful reconnect states',
    ],
    tech: ['React', 'Node.js', 'Express.js', 'WebRTC', 'Socket.IO', 'MongoDB'],
    process: [
      {
        title: 'Room lifecycle',
        body: 'Defined what happens from invite to empty room, including reconnects and cleanup.',
      },
      {
        title: 'Signalling layer',
        body: 'Built the event flow that lets peers discover each other without exposing unnecessary state.',
      },
      {
        title: 'Media controls',
        body: 'Kept device and permission states legible, even when the browser disagrees.',
      },
      {
        title: 'Interface polish',
        body: 'Reduced the room chrome so the people and the work stay in focus.',
      },
    ],
    challenges: [
      'Handling media permission and device states across browsers.',
      'Keeping signalling predictable when participants leave or reconnect mid-session.',
      'Designing feedback for network conditions without creating anxiety.',
    ],
    accent: 'cyan',
    artwork: 'waves',
  },
  {
    slug: 'medicare',
    number: '03',
    title: 'MediCare',
    category: 'Full Stack Commerce',
    year: '2025',
    status: 'Completed',
    tagline: 'An online pharmacy with a clear path from search to checkout.',
    summary:
      'A full-stack online pharmacy platform with authentication, product management, shopping cart, checkout and an administration experience.',
    overview:
      'MediCare turns a complicated purchase journey into a direct one: find a product, understand it, add it to a cart and check out. Behind that flow sits a structured admin experience for managing the catalogue.',
    problem:
      'Online pharmacy interfaces carry an unusual amount of trust. Product clarity, account security and a reliable checkout matter more than experimental layouts.',
    solution:
      'A MERN stack application with authentication, a managed product catalogue, cart and checkout flow, plus an admin area for product operations.',
    features: [
      'User authentication',
      'Product catalogue and management',
      'Shopping cart and checkout flow',
      'Admin product operations',
      'Responsive storefront',
    ],
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
    process: [
      {
        title: 'Flow mapping',
        body: 'Started with the purchase and admin journeys, then derived data needs from those paths.',
      },
      {
        title: 'API and auth',
        body: 'Built the server routes and authentication boundary before connecting the storefront.',
      },
      {
        title: 'Commerce interface',
        body: 'Designed product, cart and checkout views with a focus on confidence and clarity.',
      },
      {
        title: 'Admin build',
        body: 'Added catalogue controls so content could change without touching code.',
      },
    ],
    challenges: [
      'Keeping cart state consistent across views.',
      'Protecting admin operations with a clear authorization boundary.',
      'Designing mobile checkout that does not hide important product context.',
    ],
    accent: 'ember',
    artwork: 'capsules',
  },
  {
    slug: 'polaris',
    number: '04',
    title: 'POLARIS',
    category: 'Data Visualization',
    year: '2025',
    status: 'Concept',
    tagline: 'A digital twin for seeing the whole operation at once.',
    summary:
      'An interactive digital twin and operational visualization concept: a spatial layer over complex systems, built for clarity instead of spectacle.',
    overview:
      'POLARIS explores how an operational system can be understood spatially. The concept pairs a real-time data layer with an interactive 3D scene, so status, movement and anomalies can be read in context.',
    problem:
      'Operational dashboards can report everything and explain nothing. When data is detached from the place and process it describes, people spend time reconstructing context.',
    solution:
      'A staged concept: a navigable digital twin, connected telemetry and a restrained visual language that distinguishes signal from ambience.',
    features: [
      'Spatial system overview',
      'Live telemetry visualisation',
      'Status and anomaly layers',
      'Camera-led exploration',
      'Responsive WebGL scene',
    ],
    tech: ['React', 'TypeScript', 'Three.js', 'WebGL', 'WebSockets'],
    process: [
      {
        title: 'Concept study',
        body: 'Sketched the question first: what does an operator need to notice in the first five seconds?',
      },
      {
        title: 'Visual hierarchy',
        body: 'Assigned colour and motion to state, not decoration, so anomalies remain unmistakable.',
      },
      {
        title: 'Scene prototyping',
        body: 'Tested camera, scale and label density in Three.js before committing to a UI.',
      },
      {
        title: 'Performance guardrails',
        body: 'Kept geometry and draw calls modest so the scene stays usable on real hardware.',
      },
    ],
    challenges: [
      'Balancing spatial richness with readable data labels.',
      'Keeping the WebGL scene performant while data updates live.',
      'Making depth useful rather than merely atmospheric.',
    ],
    accent: 'ember',
    artwork: 'grid',
  },
  {
    slug: 'weather-forecast',
    number: '05',
    title: 'Weather Forecast',
    category: 'Web Application',
    year: '2025',
    status: 'Completed',
    tagline: 'The weather, without the noise.',
    summary:
      'A responsive weather application with location-based conditions, city search, forecasts and clear handling for invalid or unavailable locations.',
    overview:
      'A focused utility built to answer one question quickly. Search a city or use your current location, then read the current conditions and forecast without fighting the interface.',
    problem:
      'Weather apps often bury the answer under dense layouts. Location errors and failed searches escalate into dead ends instead of helpful feedback.',
    solution:
      'A lightweight application built with HTML, CSS and JavaScript on top of a weather API and the Geolocation API. Loading, invalid city and geolocation error states are handled explicitly.',
    features: [
      'City search',
      'Current conditions and forecast',
      'Location-aware results',
      'Invalid city error handling',
      'Geolocation error handling',
    ],
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Weather API', 'Geolocation API'],
    process: [
      {
        title: 'Interaction first',
        body: 'Defined the shortest path from opening the app to reading the answer.',
      },
      {
        title: 'API contract',
        body: 'Mapped weather responses into a small, predictable internal shape.',
      },
      {
        title: 'Error states',
        body: 'Treated invalid searches and denied location access as designed states, not exceptions.',
      },
      {
        title: 'Responsive pass',
        body: 'Recomposed the data hierarchy for small screens and slower connections.',
      },
    ],
    challenges: [
      'Keeping the interface legible across very different weather datasets.',
      'Handling asynchronous geolocation without leaving the user in an ambiguous state.',
      'Designing errors that help users recover instead of just reporting failure.',
    ],
    accent: 'cyan',
    artwork: 'weather',
  },
]

export const getProjectBySlug = (slug: string) => projects.find((project) => project.slug === slug)

export const getAdjacentProject = (slug: string) => {
  const index = projects.findIndex((project) => project.slug === slug)
  if (index === -1) return null
  return projects[(index + 1) % projects.length]
}
