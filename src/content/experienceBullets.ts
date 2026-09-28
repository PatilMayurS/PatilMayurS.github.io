/**
 * Experience bullets in two versions, keyed by role id (see `experience` and
 * `teaching` in profile.ts).
 *
 *   detailed — the full résumé wording
 *   concise  — the same facts, compressed to one clear line each
 *
 * Which one the public site shows is set by `experienceBullets` in site.ts.
 * The production build includes ONLY that version; the other is dropped from
 * the published files. In local dev (`./dev.sh`) a switch lets you compare both.
 */
export type BulletSet = Record<string, string[]>

export const detailedBullets: BulletSet = {
  'tamu-research': [
    'Developing large-scale, high-fidelity digital twin and simulation frameworks for verification, validation, and performance assessment of autonomous marine systems in complex operational environments.',
    'Established a System-Theoretic Process Analysis (STPA)-based framework to identify, quantify, and prioritize safety-critical factors in transitions between manual and autonomous vessel operations.',
    'Formulating mathematical models and quantitative risk assessment methodologies to evaluate hazards, safety risks, and human-autonomy transitions in maritime systems.',
    'Designing curvature-constrained path planning, routing, and moving-target tracking algorithms for autonomous marine and aerial vehicles in dynamic, obstacle-rich, and constrained environments.',
    'Extended the YOLO object detection framework to develop traffic-signal state recognition for autonomous ground vehicles, achieving over 95% detection accuracy across standard, flashing, and directional signal configurations.',
  ],
  'shermco': [
    'Developed dynamic models and control strategies for thermal systems, including liquid heating and cooling plants, and implemented the associated control logic.',
    'Designed and commissioned control systems for air handling, gas waste, and exhaust infrastructure to maintain semiconductor cleanroom environmental requirements.',
    'Developed standardized control logic libraries and operator GUI applications for gas monitoring systems deployed across Intel manufacturing facilities.',
    'Established installation, decommissioning, and troubleshooting procedures that enabled safe tool integration and removal without disrupting critical manufacturing operations.',
    'Automated engineering workflows through Python and SQL-based tools, reducing control-logic development and code-generation effort by over 90%.',
    'Mentored and trained four engineers on controls engineering practices, safety protocols, and quality standards, improving team productivity and technical readiness.',
  ],
  'isu-research': [
    'Developed an augmented model predictive control (MPC) framework for high-speed, high-precision trajectory tracking of piezoelectric nanopositioning actuators.',
    'Designed machine learning-based nonlinear system identification methods and investigated clustering techniques (K-means, GMM) for optimal excitation signal generation and improved model accuracy.',
    'Evaluated the integration of machine learning models within advanced control architectures and implemented iterative learning control strategies to enhance tracking performance.',
  ],
  'tamu-teaching': [
    'Conducted laboratory sessions, guiding students in experimental design, control systems concepts, and hands-on implementation.',
    'Provided technical support for programming and laboratory activities, evaluated student performance, and delivered feedback.',
  ],
  'isu-teaching': [
    'Delivered laboratory instruction for ME 436 to classes of 60 students, guiding experimental procedures, data acquisition, analysis, and interpretation.',
    'Supported ME 421 through discussions and individualized assistance; collaborated with faculty to develop laboratory exercises, instructional materials, and assessment methods.',
    'Supervised labs, ran report-writing and feedback sessions, and evaluated students’ lab performance.',
  ],
}

export const conciseBullets: BulletSet = {
  'tamu-research': [
    'Building high-fidelity digital twins to verify and validate autonomous marine navigation in complex environments.',
    'Established an STPA-based framework and quantitative risk models for handoffs between manual and autonomous vessel control.',
    'Designing curvature-constrained path planning, routing, and target tracking for marine and aerial vehicles.',
    'Extended YOLO for traffic-signal state recognition in autonomous ground vehicles, reaching over 95% detection accuracy.',
  ],
  'shermco': [
    'Modeled and controlled thermal plants, air-handling, gas-waste, and exhaust systems for semiconductor cleanrooms.',
    'Built standardized control-logic libraries and operator GUIs for gas monitoring across Intel fabs.',
    'Defined procedures for safe tool installation and removal without disrupting critical production.',
    'Cut control-logic development and code-generation effort by over 90% with Python and SQL automation.',
    'Mentored and trained four engineers on controls practices, safety, and quality standards.',
  ],
  'isu-research': [
    'Developed an augmented MPC framework for high-speed, high-precision piezoelectric nanopositioning.',
    'Designed ML-based nonlinear system identification, using K-means and GMM to improve excitation signals.',
    'Integrated learned models into control architectures and applied iterative learning control to sharpen tracking.',
  ],
  'tamu-teaching': [
    'Led labs on experimental design and hands-on control systems implementation.',
    'Supported programming work, evaluated students, and gave feedback.',
  ],
  'isu-teaching': [
    'Taught ME 436 labs for classes of 60, from experiments to data analysis.',
    'Supported ME 421 and co-developed lab exercises and assessments with faculty.',
  ],
}
