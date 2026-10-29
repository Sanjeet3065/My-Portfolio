import type { Project } from '../types'

export const projects: Project[] = [
  {
    slug: 'polaris',
    number: '01',
    title: 'POLARIS',
    category: 'Digital Twin & Smart Automation',
    year: '2025',
    status: 'Completed',
    tagline: 'Remote management and 3D digital twin for Antarctic research stations.',
    summary:
      'A full-stack digital twin and operational intelligence platform for India’s Antarctic research stations (Bharati & Maitri), combining 3D WebGL visualization, real-time telemetry streaming, and AI predictive maintenance.',
    overview:
      'Developed for the National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences (MoES) for Smart India Hackathon 2026 (Problem Statement ID: SIH26060). POLARIS centralizes monitoring and automated intelligence for India’s two permanent Antarctic research bases: Bharati Station in Larsemann Hills (East Antarctica, 69°24′S, 76°11′E) and Maitri Station in Schirmacher Oasis (Queen Maud Land, 70°45′S, 11°44′E). The platform bridges extreme physical isolation with high-fidelity digital operations, turning volatile environmental telemetry and power grids into actionable operational intelligence.',
    problem:
      'Operating Antarctic stations is among the harshest logistical undertakings on Earth. Bases face temperatures plunging to -60°C, Katabatic winds exceeding 150 km/h, and months of continuous polar night. Physical isolation means any mechanical failure—whether a diesel generator breakdown, water purification fault, or fuel leak—becomes life-threatening. Crucially, communication with mainland command centers relies on narrow, high-latency satellite windows with frequent dropouts. Traditional SCADA and siloed dashboards fail to provide spatial context or early predictive warnings before critical equipment suffers irreversible damage.',
    solution:
      'POLARIS introduces a resilient, multi-layer digital twin ecosystem designed specifically for intermittent satellite uplinks. The architecture couples an edge telemetry simulator with a high-throughput Node.js/Express API gateway and PostgreSQL storage. A real-time Socket.IO event hub streams live sensor updates across dedicated station channels with automatic reconnection backoff. Operators navigate an interactive 3D WebGL digital twin built with Three.js and React Three Fiber, where physical machinery meshes link directly to 2D telemetry drawers. In parallel, a dedicated Python FastAPI microservice executes predictive maintenance algorithms, forecasting generator Remaining Useful Life (RUL) and identifying vibration anomalies before catastrophic failure.',
    features: [
      'Interactive 3D Digital Twin: Navigable WebGL model of Bharati and Maitri bases built with Three.js/R3F, featuring clickable equipment meshes linked to live telemetry drawers.',
      'Real-Time WebSocket Telemetry: Sub-second sensor streaming via Socket.IO with channel scoping (station:bharati, station:maitri) and resilient reconnection backoff.',
      'Environmental & Katabatic Analytics: Live meteorological tracking of Antarctic winds, atmospheric pressure, and extreme temperature gradients.',
      'Energy Grid & Microgrid Monitoring: Comprehensive power balance tracking across diesel generators, solar arrays, battery reserves, and electrical buses.',
      'Fuel & Life-Support Autonomy Predictor: Real-time burn-rate calculations and operational day-burn projections for fuel, potable water, and oxygen stores.',
      'AI Predictive Maintenance & RUL: Python FastAPI microservice delivering Remaining Useful Life (RUL) estimation and vibration anomaly detection on station turbines.',
      'Emergency Drill Simulator: Built-in scenario engine simulating severe blizzards, generator trips, and fuel leaks to test automated response procedures.',
      'Role-Based Operational Access: Station-scoped authorization model with JWT rotation protecting command operations and administrative overrides.',
    ],
    tech: [
      'React 18',
      'TypeScript',
      'Three.js',
      'React Three Fiber',
      'Node.js',
      'Express',
      'PostgreSQL 16',
      'Prisma ORM',
      'Socket.IO',
      'Python 3.11',
      'FastAPI',
      'Docker',
    ],
    process: [
      {
        title: 'Problem Research & Polar Domain Modeling',
        body: 'Analyzed NCPOR operating guidelines, geographic conditions of Bharati (Larsemann Hills) and Maitri (Schirmacher Oasis), and operational limits of polar diesel generators and water treatment facilities.',
      },
      {
        title: 'Microservice Architecture & Monorepo Setup',
        body: 'Established an npm workspaces monorepo separating React frontend, Express API gateway, Python FastAPI intelligence service, and edge simulator with shared TypeScript contracts.',
      },
      {
        title: '3D WebGL Scene & Reactive Telemetry Binding',
        body: 'Constructed the 3D station models using Three.js and React Three Fiber, decoupling canvas rendering from high-frequency WebSocket state to sustain 60fps performance.',
      },
      {
        title: 'Satellite Resilience & Real-Time Ingestion',
        body: 'Configured Socket.IO room-based event dispatching with exponential reconnection backoff and PostgreSQL B-Tree indexing to reliably ingest up to 15,000 telemetry points per second.',
      },
      {
        title: 'AI Microservice Integration & Validation',
        body: 'Connected FastAPI endpoints for Remaining Useful Life (RUL) predictive modeling and generator vibration anomaly detection, validated against simulated extreme Antarctic stress scenarios.',
      },
    ],
    challenges: [
      'Maintaining 60fps WebGL rendering in React Three Fiber while streaming high-frequency multi-sensor telemetry without CPU bottlenecks.',
      'Engineering reliable WebSocket reconnection strategies that gracefully buffer state across high-latency, intermittent Antarctic satellite links.',
      'Designing a unified PostgreSQL time-series schema that eliminates specialized InfluxDB overhead while supporting 15,000 writes/sec with full ACID transactional integrity.',
      'Bridging Python AI microservices with Node.js backend through asynchronous REST contracts without introducing request blocking.',
    ],
    architectureOverview:
      'POLARIS operates as a modular, decoupled microservices platform designed to withstand intermittent satellite links while providing high-fidelity digital twin monitoring.',
    architectureLayers: [
      {
        layer: 'Station Edge / Simulator',
        technologies: 'Node.js, Synthetic Telemetry Generator',
        description:
          'Simulates physical IoT sensors, weather stations, and electrical grid telemetry at Bharati and Maitri stations, aggregating telemetry packets for transmission.',
      },
      {
        layer: 'Core Backend Gateway',
        technologies: 'Node.js, Express, TypeScript, Zod, Helmet',
        description:
          'Central REST API gateway validating incoming telemetry with Zod schemas, enforcing rate-limiting, and managing station-scoped permissions.',
      },
      {
        layer: 'Real-Time Event Hub',
        technologies: 'Socket.IO, WebSockets, Channel Rooms',
        description:
          'Handles bi-directional real-time telemetry broadcasting with automatic reconnection backoff and HTTP long-polling fallback for satellite link drops.',
      },
      {
        layer: 'Relational & Time-Series Data',
        technologies: 'PostgreSQL 16, Prisma ORM, B-Tree & BRIN Indexes',
        description:
          'High-performance storage partitioned by month with composite indexes on (sensor_id, timestamp DESC) sustaining up to 15,000 writes/sec.',
      },
      {
        layer: 'AI / Predictive Intelligence',
        technologies: 'Python 3.11, FastAPI, Scikit-Learn, Pandas, NumPy',
        description:
          'Isolated microservice running predictive maintenance models, Remaining Useful Life (RUL) estimation, and vibration anomaly detection.',
      },
      {
        layer: 'Presentation & 3D Digital Twin',
        technologies: 'React 18, Vite, Three.js, R3F, Tailwind CSS, Recharts',
        description:
          'Dual-surface operations interface combining a 60fps WebGL 3D spatial twin with responsive 2D charts and telemetry side drawers.',
      },
    ],
    engineeringWork: [
      {
        title: 'Monorepo Architecture & Unified Contracts',
        description:
          'Architected an npm workspaces monorepo unifying /frontend, /backend, /ai-service, and /simulator with synchronized TypeScript domain definitions, preventing cross-service schema drift.',
      },
      {
        title: 'Decoupled 3D WebGL Canvas Architecture',
        description:
          'Isolated the Three.js / React Three Fiber render loop from the high-frequency 2D dashboard state, preserving a locked 60fps framerate even during heavy telemetry ingestion.',
      },
      {
        title: 'Resilient Satellite Telemetry Protocol',
        description:
          'Engineered Socket.IO channel management with exponential reconnection backoff to guarantee zero client memory leaks during satellite link dropouts.',
      },
      {
        title: 'PostgreSQL Time-Series Optimization',
        description:
          'Designed composite B-Tree indexes on (sensor_id, timestamp DESC) and monthly range partitioning, bypassing premature InfluxDB complexity while supporting 15k writes/sec.',
      },
      {
        title: 'Strict Runtime Validation Boundary',
        description:
          'Implemented comprehensive Zod schema validation across all API endpoints, ensuring edge sensor anomalies never corrupt downstream relational models.',
      },
    ],
    decisions: [
      {
        id: 'ADR-001',
        title: 'Monorepo vs. Multi-Repo Architecture',
        context:
          'SIH 2026 required rapid prototyping, unified versioning, and synchronized changes between Frontend (Dashboard + 3D Twin), Backend (API + WebSockets), and AI Service.',
        decision:
          'Adopted a lightweight npm workspaces monorepo with distinct /frontend, /backend, /ai-service, and /simulator folders.',
        consequence:
          'Single source of truth, simplified Docker Compose orchestration, and shared TypeScript domain interfaces without package registry publishing overhead.',
      },
      {
        id: 'ADR-002',
        title: 'PostgreSQL as Primary Store (Avoiding Early InfluxDB Complexity)',
        context:
          'Sensor telemetry for two stations (Maitri and Bharati) generates ~500 to 1,000 data points per second. Adding specialized time-series databases introduces deployment friction and increased container resource overhead.',
        decision:
          'Utilized standard PostgreSQL 16 with composite B-Tree indexes on (sensor_id, timestamp DESC) and declarative monthly range partitioning.',
        consequence:
          'PostgreSQL easily handles up to 15,000 writes/second on modern hardware. This avoids premature optimization while preserving full SQL ACID joins across stations, equipment, and incidents.',
      },
      {
        id: 'ADR-003',
        title: 'Dedicated Python FastAPI Service for AI / Machine Learning',
        context:
          'Machine learning libraries for predictive maintenance and time-series forecasting (Scikit-Learn, Pandas, NumPy) have mature ecosystems in Python. Running ML inside Node.js is inefficient.',
        decision:
          'Implemented a separate microservice (ai-service/) using FastAPI communicating with the Node.js backend over an internal REST API network.',
        consequence:
          'Clean separation of operational concerns. Data scientists can iterate on models without touching the core web API or frontend logic.',
      },
      {
        id: 'ADR-004',
        title: 'Three.js + React Three Fiber (R3F) for the 3D Digital Twin',
        context:
          'The problem statement requires an intuitive 3D representation of station layouts, equipment placement, and thermal conditions.',
        decision:
          'Utilized Three.js declarative bindings via @react-three/fiber and @react-three/drei directly embedded in the React component tree.',
        consequence:
          'Enables seamless reactive state binding (e.g. clicking a 3D generator selects its telemetry stream in the 2D side drawer). 3D canvas lifecycle is isolated from 2D charts to ensure 60fps rendering performance.',
      },
      {
        id: 'ADR-005',
        title: 'Socket.IO for Live Telemetry Over Plain WebSockets',
        context:
          'Antarctic communication links experience satellite dropouts, high latency, and intermittent disconnects.',
        decision:
          'Used Socket.IO rather than bare WebSockets.',
        consequence:
          'Provides battle-tested automatic reconnection backoff, room-based subscription channels (station:bharati), and graceful HTTP long-polling fallback.',
      },
      {
        id: 'ADR-006',
        title: 'Zod for Request Validation',
        context:
          'Ingesting simulated and user-submitted inputs requires strict runtime type validation to protect database integrity.',
        decision:
          'Used Zod across the backend to validate all request bodies, query parameters, and environment variables.',
        consequence:
          'Eliminates boilerplate validation code, provides typed DTOs derived directly from schemas, and produces standard user-friendly error messages.',
      },
    ],
    learnings: [
      'High-throughput real-time telemetry requires strict state boundary isolation in React 18 to prevent re-render cascades across sibling chart components.',
      'WebGL canvas contexts inside single-page applications require careful memory cleanup and geometry disposal on unmount to prevent GPU resource leaks.',
      'Designing for extreme environments requires prioritizing graceful degradation and offline buffering over continuous assumptions of zero packet loss.',
      'Standard relational databases (PostgreSQL) with thoughtful composite indexing and partitioning frequently outperform specialized NoSQL/time-series databases for mid-scale telemetry without operational overhead.',
    ],
    accent: 'ember',
    artwork: 'grid',
    image: '/images/projects/polaris-hero.jpg',
    imageAlt:
      'POLARIS Antarctic Research Station Digital Twin operations command center interface displaying real-time telemetry, 3D station wireframe, and polar logistics map',
    github: 'https://github.com/Sanjeet3065/Polaris',
    live: 'https://frontend-silk-iota-blp7wlwptm.vercel.app',
    gallery: [
      {
        src: '/images/projects/polaris-hero.jpg',
        alt: 'POLARIS Antarctic Digital Twin Command Center Visual',
        caption:
          'POLARIS command center operations interface: 3D station model wireframe, real-time telemetry overlay, and Antarctic cartographic monitoring.',
      },
    ],
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
    slug: 'collab',
    number: '04',
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
