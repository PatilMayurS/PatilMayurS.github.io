/**
 * Identity + SEO metadata. Imported by both the app and vite.config.ts,
 * so keep this file free of imports and browser-only APIs.
 *
 * Source of truth: main2.tex (résumé). Street address and phone number are
 * intentionally omitted from the public site.
 */
export const site = {
  name: 'Mayur Shivaji Patil',
  shortName: 'Mayur Patil',
  firstName: 'Mayur',
  lastName: 'Patil',
  role: 'Ph.D. Candidate, Mechanical Engineering',
  affiliation: 'Texas A&M University',
  location: 'College Station, Texas',
  email: 'mayur@tamu.edu',
  linkedin: {
    url: 'https://www.linkedin.com/in/mayur-s-patil/',
    handle: 'mayur-s-patil',
  },
  seo: {
    title: 'Mayur Shivaji Patil — Autonomous Systems Research, Texas A&M University',
    description:
      'Mayur Shivaji Patil is a Ph.D. candidate in Mechanical Engineering at Texas A&M University researching digital twins, verification and validation, and curvature-constrained motion planning for the safe navigation of autonomous marine and aerial systems.',
    ogImageAlt:
      'Mayur Patil — Ph.D. Candidate, Mechanical Engineering, Texas A&M University. Safe navigation for autonomous systems.',
    keywords: [
      'Autonomous Systems',
      'Motion Planning',
      'Curvature-Constrained Navigation',
      'Digital Twins',
      'Verification and Validation',
      'Control Systems',
      'Robotics',
      'Optimization',
    ],
    alumniOf: [
      'Iowa State University',
      'Rajarambapu Institute of Technology',
      'Government Polytechnic Kolhapur',
    ],
  },
} as const
