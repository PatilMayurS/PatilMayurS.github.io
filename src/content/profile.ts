/**
 * All portfolio copy lives here. Every fact is taken from the résumé
 * (main2.tex); wording is lightly edited for the web but not embellished.
 * Edit this file to update the site — components only render what's here.
 */
export { site } from './site.ts'

export type Stat = { value: string; label: string }

export type Role = {
  id: string
  kind: 'Research' | 'Industry'
  role: string
  org: string
  institution?: string
  location?: string
  start: string
  end: string
  summary: string
  highlights?: Stat[]
  points: string[]
  tags: string[]
}

export type TeachingRole = {
  institution: string
  department: string
  start: string
  end: string
  courses: string[]
  points: string[]
}

export type ProjectArt = 'twin' | 'colregs' | 'stpa' | 'dubins' | 'signal' | 'wave'

export type Project = {
  id: string
  featured?: boolean
  kicker: string
  title: string
  summary: string
  useCase: string
  contribution: string
  outcomes: string[]
  metric?: Stat
  tags: string[]
  art: ProjectArt
  source: string
}

export type SkillGroup = { name: string; blurb: string; items: string[] }

export type Degree = {
  institution: string
  location: string
  degree: string
  short: string
  field: string
  date: string
  year: string
  expected?: boolean
  score: { label: string; value: string }
  thesis?: string
}

export type Publication = {
  title: string
  authors: string
  venue: string
  year: number
  status?: string
}

export type Talk = { title: string; event: string; year: number; location: string }
export type Honor = { title: string; detail: string; date: string }

export const hero = {
  eyebrow: ['Ph.D. Candidate', 'Mechanical Engineering', 'Texas A&M University'],
  taglineAccent: 'Engineering safe navigation',
  taglineRest: 'for autonomous systems — at sea, in the air, and on the ground.',
  intro:
    'I’m a Ph.D. candidate at Texas A&M University. I build high-fidelity digital twins to verify and validate autonomous marine navigation, and design curvature-constrained motion planning for marine and aerial vehicles.',
}

export const about = {
  statement:
    'I study how autonomous systems perceive, plan, and decide — and how to verify that they do it safely.',
  paragraphs: [
    'At Texas A&M’s Autonomous Systems Laboratory, I research autonomous marine, aerial, and ground systems, with a focus on perception, sensor fusion, localization, planning, and decision-making.',
    'Much of my work focuses on maritime autonomy. I build large-scale, high-fidelity digital twins to verify and validate autonomous navigation, apply System-Theoretic Process Analysis to transitions between manual and autonomous operation, and design curvature-constrained planners for marine and aerial vehicles.',
    'Before my doctorate, I spent 2020–2023 as a Controls Engineer on life-safety system automation for Intel semiconductor fabrication facilities in New Mexico and Arizona. Earlier, at Iowa State University, I combined machine learning with model predictive control for nano-precision motion.',
  ],
  focus: [
    'Autonomous systems',
    'Motion planning',
    'Digital twins',
    'Verification & validation',
    'Control systems',
    'Optimization',
  ],
  current: {
    role: 'Research Assistant',
    org: 'Autonomous Systems Laboratory, Texas A&M University',
    note: 'Ph.D. expected May 2027',
  },
}

export const experience: Role[] = [
  {
    id: 'tamu-research',
    kind: 'Research',
    role: 'Research Assistant',
    org: 'Autonomous Systems Laboratory',
    institution: 'Texas A&M University',
    location: 'College Station, TX',
    start: 'Aug 2023',
    end: 'Present',
    summary:
      'Research in autonomous marine, aerial, and ground systems, with a focus on perception, sensor fusion, localization, planning, and decision-making.',
    highlights: [{ value: '>95%', label: 'Detection accuracy across standard, flashing, and directional traffic signals' }],
    points: [
      'Developing large-scale, high-fidelity digital twin and simulation frameworks for verification, validation, and performance assessment of autonomous marine systems in complex operational environments.',
      'Established a System-Theoretic Process Analysis (STPA)-based framework to identify, quantify, and prioritize safety-critical factors in transitions between manual and autonomous vessel operations.',
      'Formulating mathematical models and quantitative risk assessment methodologies to evaluate hazards, safety risks, and human-autonomy transitions in maritime systems.',
      'Designing curvature-constrained path planning, routing, and moving-target tracking algorithms for autonomous marine and aerial vehicles in dynamic, obstacle-rich, and constrained environments.',
      'Extended the YOLO object detection framework to develop traffic-signal state recognition for autonomous ground vehicles, achieving over 95% detection accuracy across standard, flashing, and directional signal configurations.',
    ],
    tags: ['Digital twins', 'Verification & validation', 'STPA', 'Risk assessment', 'Motion planning', 'YOLO'],
  },
  {
    id: 'shermco',
    kind: 'Industry',
    role: 'Controls Engineer',
    org: 'Intel Co. with Shermco System Integration, LLC',
    location: 'Sites in New Mexico & Arizona',
    start: 'Jul 2020',
    end: 'Jun 2023',
    summary:
      'Lead Controls Engineer for life-safety system (LSS) automation projects supporting Intel semiconductor fabrication facilities in New Mexico and Arizona.',
    highlights: [
      { value: '>90%', label: 'Less control-logic development and code-generation effort' },
      { value: '4', label: 'Engineers mentored and trained' },
    ],
    points: [
      'Developed dynamic models and control strategies for thermal systems, including liquid heating and cooling plants, and implemented the associated control logic.',
      'Designed and commissioned control systems for air handling, gas waste, and exhaust infrastructure to maintain semiconductor cleanroom environmental requirements.',
      'Developed standardized control logic libraries and operator GUI applications for gas monitoring systems deployed across Intel manufacturing facilities.',
      'Established installation, decommissioning, and troubleshooting procedures that enabled safe tool integration and removal without disrupting critical manufacturing operations.',
      'Automated engineering workflows through Python and SQL-based tools, reducing control-logic development and code-generation effort by over 90%.',
      'Mentored and trained four engineers on controls engineering practices, safety protocols, and quality standards, improving team productivity and technical readiness.',
    ],
    tags: ['Python', 'SQL', 'Control logic', 'Thermal systems', 'Operator GUIs', 'Life-safety systems'],
  },
  {
    id: 'isu-research',
    kind: 'Research',
    role: 'Research Assistant',
    org: 'Dynamics and Control Laboratory',
    institution: 'Iowa State University',
    location: 'Ames, IA',
    start: 'Jan 2019',
    end: 'Jul 2020',
    summary:
      'Research in robust and optimal control, system identification, and machine learning for nano-precision motion control systems, under the supervision of Dr. Juan Ren.',
    points: [
      'Developed an augmented model predictive control (MPC) framework for high-speed, high-precision trajectory tracking of piezoelectric nanopositioning actuators.',
      'Designed machine learning-based nonlinear system identification methods and investigated clustering techniques (K-means, GMM) for optimal excitation signal generation and improved model accuracy.',
      'Evaluated the integration of machine learning models within advanced control architectures and implemented iterative learning control strategies to enhance tracking performance.',
    ],
    tags: ['Model predictive control', 'System identification', 'Machine learning', 'K-means', 'GMM', 'Iterative learning control'],
  },
]

export const teaching: TeachingRole[] = [
  {
    institution: 'Texas A&M University',
    department: 'Dept. of Mechanical Engineering',
    start: 'Aug 2023',
    end: 'Dec 2023',
    courses: ['MEEN 364 — Dynamic Systems and Control'],
    points: [
      'Conducted laboratory sessions, guiding students in experimental design, control systems concepts, and hands-on implementation.',
      'Provided technical support for programming and laboratory activities, evaluated student performance, and delivered feedback.',
    ],
  },
  {
    institution: 'Iowa State University',
    department: 'Dept. of Mechanical Engineering',
    start: 'Aug 2018',
    end: 'May 2020',
    courses: ['ME 436 — Heat and Mass Transfer', 'ME 421 — Dynamics and Control'],
    points: [
      'Delivered laboratory instruction for ME 436 to classes of 60 students, guiding experimental procedures, data acquisition, analysis, and interpretation.',
      'Supported ME 421 through discussions and individualized assistance; collaborated with faculty to develop laboratory exercises, instructional materials, and assessment methods.',
      'Supervised labs, ran report-writing and feedback sessions, and evaluated students’ lab performance.',
    ],
  },
]

export const projects: Project[] = [
  {
    id: 'digital-twin',
    featured: true,
    kicker: 'Verification & validation',
    title: 'Digital twins for marine autonomy',
    summary:
      'Large-scale, high-fidelity digital twin and simulation frameworks for the verification, validation, and performance assessment of autonomous marine navigation.',
    useCase:
      'Evaluating autonomous navigation in complex operational environments — including adverse weather, constrained and confined waters, and multi-vessel interactions.',
    contribution:
      'Developing the frameworks at Texas A&M’s Autonomous Systems Laboratory; first author on the resulting papers.',
    outcomes: [
      'SNAME Maritime Convention 2025 — paper and presentation',
      'SMRC-MTEC-ICMASS 2026, Singapore — paper accepted; presentation',
      'SNAME Offshore Symposium 2026 — presentation',
      'SNAME Maritime Technology Magazine, 2026 — article',
    ],
    tags: ['Digital twins', 'Modeling & simulation', 'Verification & validation'],
    art: 'twin',
    source: 'Ph.D. research · Texas A&M',
  },
  {
    id: 'colregs',
    featured: true,
    kicker: 'Decision-making',
    title: 'Risk-aware, COLREGs-compliant navigation',
    summary:
      'A dynamic risk-aware framework for autonomous marine navigation that balances safety with COLREGs compliance, alongside collision avoidance and grounding prevention.',
    useCase:
      'Navigating around other vessels and hazardous shallows while complying with COLREGs, the International Regulations for Preventing Collisions at Sea.',
    contribution: 'First author on the framework papers, with a presentation at IEEE ITSC 2025.',
    outcomes: [
      'IFAC World Congress 2026 — paper accepted',
      'GNAOE 2026 — paper under review',
      'IEEE Intelligent Transportation Systems Conference 2025 — presentation',
    ],
    tags: ['Risk assessment', 'Collision avoidance', 'COLREGs'],
    art: 'colregs',
    source: 'Ph.D. research · Texas A&M',
  },
  {
    id: 'stpa',
    featured: true,
    kicker: 'Safety analysis',
    title: 'Safe handoffs between human and autonomy',
    summary:
      'An STPA-based framework that identifies, quantifies, and prioritizes the safety-critical factors in transitions between manual and autonomous vessel operation.',
    useCase:
      'Understanding which factors matter most when marine vessels transition between manual and autonomous navigation functions.',
    contribution:
      'Established the STPA-based framework and am formulating quantitative risk assessment methodologies for human-autonomy transitions; first author.',
    outcomes: ['Journal of Marine Science and Engineering, 2026 — journal article'],
    tags: ['STPA', 'Quantitative risk assessment', 'Human-autonomy transition'],
    art: 'stpa',
    source: 'Ph.D. research · Texas A&M',
  },
  {
    id: 'planning',
    kicker: 'Planning',
    title: 'Curvature-constrained motion planning',
    summary:
      'Path planning, routing, and moving-target tracking algorithms for autonomous marine and aerial vehicles.',
    useCase: 'Vehicles operating in dynamic, obstacle-rich, and constrained environments.',
    contribution: 'Designing the algorithms as part of my Ph.D. thesis research.',
    outcomes: ['Ph.D. thesis research, expected May 2027'],
    tags: ['Path planning', 'Routing', 'Target tracking'],
    art: 'dubins',
    source: 'Ph.D. research · Texas A&M',
  },
  {
    id: 'signals',
    kicker: 'Perception',
    title: 'Traffic-signal state recognition',
    summary: 'Extended the YOLO object detection framework to recognize traffic-signal states for autonomous ground vehicles.',
    useCase: 'Recognizing standard, flashing, and directional signal configurations.',
    contribution: 'Developed the recognition algorithms on top of YOLO.',
    outcomes: [],
    metric: { value: '>95%', label: 'Detection accuracy' },
    tags: ['YOLO', 'Object detection'],
    art: 'signal',
    source: 'Research · Texas A&M',
  },
  {
    id: 'nanopositioning',
    kicker: 'Control',
    title: 'Learning-based control for nanopositioning',
    summary:
      'LSTM neural network-based system identification and augmented model predictive control of piezoelectric actuators for precise trajectory tracking.',
    useCase: 'High-speed, high-precision trajectory tracking for piezoelectric nanopositioning actuators.',
    contribution: 'Developed the augmented MPC framework and ML-based system identification methods; M.S. thesis topic.',
    outcomes: ['MECC 2021 — paper with J. Ren'],
    tags: ['LSTM', 'MPC', 'System identification'],
    art: 'wave',
    source: 'M.S. research · Iowa State',
  },
]

export const skills: { lead: SkillGroup; groups: SkillGroup[] } = {
  lead: {
    name: 'Programming',
    blurb: 'Languages',
    items: ['Python', 'C++', 'C#', 'Julia', 'SQL', 'R'],
  },
  groups: [
    {
      name: 'Autonomy & planning',
      blurb: 'Getting from here to there, within real turning limits.',
      items: [
        'Autonomous systems',
        'Motion planning',
        'Curvature-constrained navigation',
        'A* / Hybrid A*',
        'Dubins path planning',
        'Sampling-based planning (RRT*, BIT*)',
        'Robotics',
      ],
    },
    {
      name: 'Simulation & safety',
      blurb: 'Testing autonomy before it meets the real world.',
      items: [
        'Digital twins',
        'Verification & validation',
        'Modeling & simulation',
        'System-Theoretic Process Analysis (STPA)',
        'Quantitative risk assessment',
      ],
    },
    {
      name: 'Control, estimation & optimization',
      blurb: 'The mathematics underneath.',
      items: [
        'Control systems',
        'Optimal control',
        'Model predictive control',
        'Iterative learning control',
        'System identification',
        'State estimation',
        'Kalman filtering',
        'Convex optimization',
      ],
    },
    {
      name: 'Machine learning & perception',
      blurb: 'Seeing and modeling the world.',
      items: ['YOLO object detection', 'LSTM neural networks', 'K-means', 'Gaussian mixture models', 'Perception', 'Sensor fusion', 'Localization'],
    },
    {
      name: 'Software & tools',
      blurb: 'Where the work gets built.',
      items: ['MATLAB', 'Simulink', 'ROS2', 'Unity', 'Gurobi', 'ANSYS', 'Automation Studio', 'LaTeX', 'MS Office'],
    },
  ],
}

export const education: Degree[] = [
  {
    institution: 'Texas A&M University',
    location: 'College Station, TX',
    degree: 'Doctor of Philosophy',
    short: 'Ph.D.',
    field: 'Mechanical Engineering',
    date: 'May 2027',
    year: '2027',
    expected: true,
    score: { label: 'GPA', value: '4.00' },
    thesis:
      'Simulation-based verification, validation, and curvature-constrained motion planning for safe navigation of autonomous marine and aerial systems using high-fidelity digital twin frameworks.',
  },
  {
    institution: 'Iowa State University',
    location: 'Ames, IA',
    degree: 'Master of Science',
    short: 'M.S.',
    field: 'Mechanical Engineering',
    date: 'May 2020',
    year: '2020',
    score: { label: 'GPA', value: '3.86' },
    thesis: 'Machine learning-based system identification and augmented predictive controls of nanopositioners.',
  },
  {
    institution: 'Rajarambapu Institute of Technology',
    location: 'Sangli, India',
    degree: 'Bachelor of Technology',
    short: 'B.Tech.',
    field: 'Mechanical Engineering',
    date: 'Jun 2017',
    year: '2017',
    score: { label: 'GPA', value: '3.96' },
  },
  {
    institution: 'Government Polytechnic Kolhapur',
    location: 'Kolhapur, India',
    degree: 'Diploma',
    short: 'Diploma',
    field: 'Mechanical Engineering',
    date: 'Jun 2014',
    year: '2014',
    score: { label: 'Aggregate', value: '87.19%' },
  },
]

export const honors: Honor[] = [
  { title: '2nd Place, SAE AutoDrive Challenge II', detail: 'Representing Texas A&M University', date: 'Jun 2025' },
  { title: 'Invited Technical Reviewer', detail: 'IFAC World Congress 2025 and MECC 2021', date: 'May 2025' },
  { title: 'Best Project Award', detail: 'For developing a computer vision-based measurement system', date: 'Apr 2019' },
  { title: 'Silver Medal, Autonomous Robot Racing', detail: 'State-level competition', date: 'Oct 2016' },
]

const ME = 'Mayur S. Patil'

export const publications: Publication[] = [
  {
    title:
      'A Framework for Identification and Prioritization of Critical Factors in Transition Between Manual and Autonomous Navigation Functions in Marine Vessels',
    authors: `${ME} et al.`,
    venue: 'Journal of Marine Science and Engineering',
    year: 2026,
  },
  {
    title: 'Dynamic Risk-Aware Framework for Autonomous Marine Navigation: Balancing Safety and COLREGs Compliance',
    authors: `${ME} et al.`,
    venue: 'IFAC World Congress',
    year: 2026,
    status: 'Accepted',
  },
  {
    title:
      'A Robust Simulation Framework for Verification and Validation of Autonomous Maritime Navigation in Adverse Weather and Constrained Environments',
    authors: `${ME} et al.`,
    venue: 'SMRC-MTEC-ICMASS Conference, Singapore',
    year: 2026,
    status: 'Accepted',
  },
  {
    title: 'COLREGs Compliant Collision Avoidance and Grounding Prevention for Autonomous Marine Navigation',
    authors: `${ME} et al.`,
    venue: 'GNAOE',
    year: 2026,
    status: 'Under review',
  },
  {
    title: 'Validating Autonomy at Sea: Why Virtual Testing Will Define the Next Era of Maritime Safety',
    authors: `${ME} et al.`,
    venue: 'SNAME Maritime Technology Magazine',
    year: 2026,
    status: 'Article',
  },
  {
    title: 'Virtual Framework for Verification and Validation of Marine Autonomous Navigation',
    authors: `${ME} et al.`,
    venue: 'SNAME Maritime Convention',
    year: 2025,
  },
  {
    title:
      'LSTM neural network-based system identification and augmented predictive control of piezoelectric actuators for precise trajectory tracking',
    authors: `${ME} and J. Ren`,
    venue: 'Modeling, Estimation and Control Conference (MECC)',
    year: 2021,
  },
]

export const talks: Talk[] = [
  {
    title: 'A Robust Simulation Framework for Verification and Validation of Autonomous Maritime Navigation',
    event: 'SMRC-MTEC-ICMASS Conference',
    year: 2026,
    location: 'Singapore',
  },
  {
    title: 'High-Fidelity Simulation Framework for Evaluating Autonomous Navigation in Confined Waters and Multi-Vessel Interactions',
    event: 'SNAME Offshore Symposium',
    year: 2026,
    location: 'Houston, TX',
  },
  {
    title: 'Virtual Framework for Verification and Validation of Marine Autonomous Navigation',
    event: 'SNAME Maritime Convention',
    year: 2025,
    location: 'Norfolk, VA',
  },
  { title: 'Safety in Maritime Autonomous Navigation', event: 'XPONENTIAL Conference', year: 2025, location: 'Houston, TX' },
  {
    title: 'COLREGs Compliant Collision Avoidance and Grounding Prevention for MASS',
    event: 'IEEE Intelligent Transportation Systems Conference',
    year: 2025,
    location: 'Gold Coast, Australia',
  },
]

export const contact = {
  headline: 'Let’s navigate what’s next.',
  lead: 'For research collaborations or opportunities in autonomous systems, email is the best way to reach me.',
}

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
] as const
