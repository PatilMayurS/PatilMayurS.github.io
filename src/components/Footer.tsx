import { useSyncExternalStore } from 'react'
import { site } from '../content/profile'
import { ArrowUp } from './icons'
import { Container } from './ui'

const noop = () => () => {}
const currentYear = () => new Date().getFullYear()
const buildYear = () => __BUILD_YEAR__

export default function Footer() {
  // Prerendered with the build year; React swaps in the visitor's current year after hydration.
  const year = useSyncExternalStore(noop, currentYear, buildYear)

  return (
    <footer id="footer" className="border-t border-white/10 bg-night text-fog" data-theme="dark">
      <Container className="flex flex-col gap-6 py-8 text-[0.875rem] sm:flex-row sm:items-center sm:justify-between sm:py-10">
        <p>
          © {year} {site.name}
        </p>
        <ul className="flex items-center gap-6" aria-label="Elsewhere">
          <li>
            <a href={`mailto:${site.email}`} className="footer-link">
              Email
            </a>
          </li>
          <li>
            <a href={site.linkedin.url} target="_blank" rel="noopener noreferrer" className="footer-link">
              LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        </ul>
        <a href="#top" className="back-to-top self-start sm:self-auto">
          Back to top
          <span className="back-to-top-icon">
            <ArrowUp size={16} />
          </span>
        </a>
      </Container>
    </footer>
  )
}
