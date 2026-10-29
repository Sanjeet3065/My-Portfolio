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
    live: 'https://polaris-twin.vercel.app/',
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
    slug: 'krishi-suraksha',
    number: '02',
    title: 'Krishi Suraksha',
    category: 'AgriTech & AI Surveillance',
    year: '2026',
    status: 'Completed',
    tagline: 'AI-driven crop pathology, microclimate risk modeling, and pest surveillance.',
    summary:
      'An enterprise-grade, mobile-first agricultural decision support system developed for Smart India Hackathon 2026 (Problem Statement ID: 26131, Government of Maharashtra • MSInS). Combines multimodal vision AI crop pathology, Open-Meteo microclimate synchronization, ICAR-aligned expert validation, and GIS surveillance heatmaps across 13 Indian languages.',
    overview:
      'Developed for Smart India Hackathon 2026 under Problem Statement ID 26131 (Government of Maharashtra • Maharashtra State Innovation Society - MSInS), Krishi Suraksha (KisanSarthi AI) is a mobile-first agricultural surveillance and diagnostic platform built to empower smallholder and commercial farmers. By bridging on-field mobile imaging with cloud-scale multimodal vision AI, live microclimate telemetry, and certified Krishi Vigyan Kendra (KVK) agricultural expert oversight, the system transforms reactive pest control into proactive, scientific crop protection.',
    problem:
      'Indian farmers face up to 30–35% annual crop yield losses due to untimely pest outbreaks, fungal blights, and delayed extension advisories. Traditional agricultural support mechanisms rely on infrequent in-person visits from district officers, leaving farmers vulnerable to misdiagnosis and excessive, uncalibrated chemical pesticide usage. Furthermore, smallholders lack access to localized microclimate data (like Growing Degree Days and relative humidity thresholds that trigger fungal sporulation) and linguistic accessibility across diverse regional vernaculars.',
    solution:
      'Krishi Suraksha delivers an integrated full-stack architecture that unifies instantaneous on-device leaf diagnostics with authoritative human-in-the-loop validation. Farmers capture symptomatic crop images that are analyzed via Google Gemini multimodal vision AI cross-referenced against ICAR Integrated Pest Management (IPM) guidelines. Concurrently, the platform pulls real-time hourly meteorological data from Open-Meteo to calculate microclimate risk scores, streams regional pest cluster heatmaps using Leaflet GIS, and routes ambiguous diagnoses to certified KVK scientists for audited treatment prescriptions across 13 Indian languages.',
    features: [
      'Multimodal AI Crop Diagnosis: Instant on-device camera leaf scanning and cloud upload to Supabase Storage, running Gemini Vision AI with confidence-bounded screening across Cotton, Rice, Tomato, Soybean, Wheat, Grapes, and Sugarcane.',
      'Live Microclimate & GDD Risk Engine: Real-time hourly Open-Meteo telemetry synchronization (temperature, humidity, precipitation, wind speed) calculating Growing Degree Days (GDD) and fungal risk coefficients with automated push warnings.',
      'Certified KVK Scientist Audit Trail: Multi-tier role-based access control (Farmer, Expert, District Officer, Admin) allowing certified agricultural scientists to review, annotate, and prescribe ICAR-aligned chemical and non-chemical treatments.',
      'Interactive Geospatial Surveillance Map: Leaflet + OpenStreetMap engine rendering GPS-geotagged crop health observations and district/taluka disease density heatmaps across 28+ Indian states and 750+ districts.',
      '13 Indian Languages (100% Multilingual i18n): Comprehensive vernacular localization supporting Hindi, Marathi, Bengali, Tamil, Telugu, Gujarati, Punjabi, Kannada, Malayalam, Odia, Assamese, Urdu, and English without language leaks.',
      'Multi-Option Auth & Master Recovery: 10-digit mobile number authentication, Google OAuth sign-in, and self-service password recovery with automatic PostgreSQL profile creation triggers.',
      'Emergency Outbreak Alerts & Advisory Hub: Automated early warning notifications triggered by sudden humidity or pest risk spikes, paired with localized agricultural advisories.',
      'Offline Resilient Architecture: Local state persistence via indexed storage ensuring field data and observation drafts remain accessible even with low network connectivity.',
    ],
    tech: [
      'React 18',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Supabase',
      'PostgreSQL',
      'Google Gemini Vision AI',
      'Open-Meteo API',
      'Leaflet GIS',
      'Lucide Icons',
      'Row Level Security (RLS)',
    ],
    process: [
      {
        title: 'Domain Research & ICAR Knowledge Modeling',
        body: 'Analyzed ICAR Integrated Pest Management (IPM) guidelines, high-impact regional crop diseases in Maharashtra (Pink Bollworm in Cotton, Early/Late Blight in Tomato, Sheath Blight in Rice), and microclimate disease outbreak triggers.',
      },
      {
        title: 'Architecture & Supabase PostgreSQL Setup',
        body: 'Designed relational schemas with Row Level Security (RLS) across farms, observations, diagnoses, expert evaluations, and risk alerts with automatic database triggers and real-time event streaming.',
      },
      {
        title: 'Multimodal Vision AI & Microclimate Integration',
        body: 'Connected Google Gemini Vision API for leaf pathology screening and configured zero-dependency hourly weather telemetry synchronization from Open-Meteo.',
      },
      {
        title: 'Geospatial Heatmap & Multi-Tier Role System',
        body: 'Implemented Leaflet mapping for GPS field coordinates and built separate validation workflows for farmers, agricultural extension officers, and certified KVK scientists.',
      },
      {
        title: '13-Language Internationalization & Field Hardening',
        body: 'Engineered a unified i18n localization dictionary covering 13 Indian languages with offline observation caching for remote rural connectivity.',
      },
    ],
    challenges: [
      'Ensuring accurate multimodal AI crop diagnosis on variable field photographs taken under uneven natural sunlight, blur, and soil background clutter.',
      'Synchronizing real-time Open-Meteo weather telemetry without introducing API rate-limit bottlenecks or external key dependencies.',
      'Designing strict PostgreSQL Row-Level Security (RLS) policies that separate private farmer records while allowing aggregate district-level surveillance for agricultural officers.',
      'Maintaining 100% linguistic purity and semantic accuracy across 13 regional Indian languages without layout breaking or mixed-script fallback glitches.',
    ],
    architectureOverview:
      'Krishi Suraksha is structured as a reactive, mobile-first cloud architecture coupling client-side field telemetry with Supabase PostgreSQL, edge compute, and external multimodal vision models.',
    architectureLayers: [
      {
        layer: 'Client Presentation Layer',
        technologies: 'React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons',
        description:
          'Mobile-responsive interface with one-tap camera capture, voice accessibility, multi-language switching, and offline storage.',
      },
      {
        layer: 'Multimodal AI & Pathology Engine',
        technologies: 'Google Gemini Vision AI, ICAR IPM Protocols',
        description:
          'Analyzes leaf photographs against calibrated visual symptom datasets to identify pathogens, disease severity, and recommended countermeasures.',
      },
      {
        layer: 'Microclimate & GDD Risk Engine',
        technologies: 'Open-Meteo Open API, Telemetry Ingestion',
        description:
          'Fetches hourly ambient temperature, humidity, rainfall, and wind speeds to calculate Growing Degree Days (GDD) and fungal spore risk.',
      },
      {
        layer: 'Geospatial Surveillance Engine',
        technologies: 'Leaflet, OpenStreetMap, HTML5 Geolocation',
        description:
          'Renders cluster heatmaps, taluka/district disease density zones, and geotagged farmer observation markers with GPS coordinate binding.',
      },
      {
        layer: 'Backend & Data Persistence',
        technologies: 'Supabase PostgreSQL, Row Level Security, Edge Functions',
        description:
          'Relational database managing user profiles, farm records, observation logs, and expert evaluations with strict RLS data isolation.',
      },
    ],
    engineeringWork: [
      {
        title: 'Human-in-the-Loop Expert Validation Workflow',
        description:
          'Engineered a dual-action verification queue where AI diagnoses with confidence flags are routed to verified KVK scientists for second-tier prescription overrides.',
      },
      {
        title: 'Deterministic Weather Telemetry & Risk Scoring',
        description:
          'Developed an algorithmic risk scoring model that calculates fungal and pest sporulation probabilities directly from live hourly temperature and relative humidity telemetry.',
      },
      {
        title: 'Pan-India 13-Language i18n Architecture',
        description:
          'Structured comprehensive language dictionaries across 13 Indian scripts, ensuring complete vernacular parity across diagnosis reports and prescriptions.',
      },
      {
        title: 'Role-Based Row-Level Security (RLS)',
        description:
          'Implemented declarative PostgreSQL RLS policies enforcing tenant data privacy for farmers while exposing anonymized regional disease aggregation to government officers.',
      },
      {
        title: 'Leaflet Geospatial Hotspot Mapping',
        description:
          'Built interactive geospatial surveillance maps rendering disease cluster polygons and district-wise outbreak densities without third-party mapping fees.',
      },
    ],
    decisions: [
      {
        id: 'ADR-001',
        title: 'Supabase PostgreSQL with RLS vs. Custom Node.js Express Backend',
        context:
          'SIH 2026 required rapid delivery of real-time sync, secure authentication, file storage for leaf images, and fine-grained multi-role access control.',
        decision:
          'Leveraged Supabase as the unified backend (PostgreSQL 15, Auth, Storage, and Realtime).',
        consequence:
          'Reduced backend boilerplate by 60%, enabled instant mobile camera uploads, and provided declarative security via PostgreSQL RLS policies.',
      },
      {
        id: 'ADR-002',
        title: 'Open-Meteo API for Weather Telemetry over Keyed Commercial Weather APIs',
        context:
          'The solution had to be deployed reliably without billing caps, per-request licensing costs, or API key exhaustion during jury demos.',
        decision:
          'Integrated the Open-Meteo Open API, which provides free, high-resolution global weather telemetry without API keys.',
        consequence:
          'Zero configuration hurdles, instant hourly synchronization of humidity and GDD metrics, and high uptime.',
      },
      {
        id: 'ADR-003',
        title: 'Human-in-the-Loop Scientist Validation over Autonomous AI-Only Prescriptions',
        context:
          'Recommending chemical and biological treatments for crops carries legal and livelihood consequences; AI hallucinations can ruin yields.',
        decision:
          'Created a dual-tier validation flow: AI provides instant preliminary diagnosis, but certified KVK experts review and approve chemical prescriptions.',
        consequence:
          'Ensures ICAR compliance, builds farmer trust, and provides an immutable audit trail for government extension programs.',
      },
      {
        id: 'ADR-004',
        title: 'Leaflet & OpenStreetMap over Google Maps Platform',
        context:
          'Surveillance heatmaps and farm boundary tagging needed to operate without expensive map tile licensing or credit card requirements.',
        decision:
          'Used open-source Leaflet with OpenStreetMap tiles and custom SVG coordinate overlays.',
        consequence:
          'Fully customizable dark/light theme tiles, offline tile caching capabilities, and zero licensing overhead.',
      },
      {
        id: 'ADR-005',
        title: 'Dictionary-Based 13-Language i18n over Automated Dynamic Translation',
        context:
          'Automated machine translation frequently distorts specialized agricultural terms (like "Stem Borer" or "Integrated Pest Management") into nonsense in regional scripts.',
        decision:
          'Built curated static JSON localization dictionaries for 13 Indian languages with vetted agricultural terminology.',
        consequence:
          '100% linguistic fidelity, zero latency on language switching, and no external translation API latency.',
      },
    ],
    learnings: [
      'Agricultural technology in emerging markets requires an offline-first mindset: rural connectivity fluctuates frequently, so client-side draft buffering is essential.',
      'AI models must never operate in a vacuum in agronomy: pairing vision AI with microclimate telemetry and certified human expert verification dramatically increases farmer trust and adoption.',
      'Row Level Security (RLS) in PostgreSQL provides enterprise-grade data isolation without needing bulky middle-tier authentication gateways.',
      'Localization in multi-lingual countries demands specialized agricultural terminology dictionaries rather than naive generalized machine translation.',
    ],
    accent: 'cyan',
    artwork: 'network',
    image: '/images/projects/krishi-suraksha-hero.jpg',
    imageAlt:
      'Krishi Suraksha agricultural intelligence dashboard and field crop health monitoring platform in Maharashtra farmland',
    github: 'https://github.com/gopal-maddheshiya/krishi-suraksha-sih2026',
    gallery: [
      {
        src: '/images/projects/krishi-suraksha-hero.jpg',
        alt: 'Krishi Suraksha Agricultural AI & Crop Health Surveillance Platform',
        caption:
          'Krishi Suraksha field intelligence: AI crop pathology analysis, live microclimate telemetry, and farmer decision support in Maharashtra.',
      },
      {
        src: '/images/projects/krishi-suraksha-satellite.jpg',
        alt: 'Geospatial Satellite Crop Surveillance Map',
        caption:
          'Interactive satellite GIS monitoring: Real-time geospatial tracking of crop health indices and regional pest incidence zones.',
      },
      {
        src: '/images/projects/krishi-suraksha-trap.jpg',
        alt: 'Smart IoT Pest Trap Sensor Integration',
        caption:
          'Automated pest density surveillance: Optical trap monitoring tracking real-time insect counts and early infestation triggers.',
      },
      {
        src: '/images/projects/krishi-suraksha-cotton.jpg',
        alt: 'Multimodal AI Crop Leaf Pathology Sample',
        caption:
          'Computer vision leaf diagnostic sample: Automated pathogen detection, disease severity classification, and ICAR treatment matching.',
      },
    ],
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
