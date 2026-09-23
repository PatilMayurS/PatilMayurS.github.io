import type { CSSProperties } from 'react'
import { hero, site } from '../content/profile'
import { exitProgress, useScrollProgress } from '../hooks/motion'
import { ArrowRight } from './icons'
import HeroChart from './HeroChart'
import { Container } from './ui'

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export default function Hero() {
  const ref = useScrollProgress<HTMLElement>(exitProgress, 0)

  return (
    <section
      ref={ref}
      id="top"
      data-section
      data-theme="dark"
      aria-labelledby="top-title"
      className="hero relative isolate flex min-h-[100svh] overflow-hidden bg-night text-snow"
    >
      <div className="hero-art absolute inset-0 -z-10">
        <HeroChart />
      </div>
      <div className="hero-scrim pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />

      <Container className="hero-copy relative flex flex-col justify-end pt-28 pb-14 sm:pb-20 lg:pb-24">
        <p className="hero-in eyebrow text-fog" style={delay(80)}>
          {hero.eyebrow.map((part, i) => (
            <span key={part}>
              {part}
              {/* Non-breaking space keeps each separator on the line it follows. */}
              {i < hero.eyebrow.length - 1 && <span className="text-white/30">{'  · '}</span>}
            </span>
          ))}
        </p>

        <h1 id="top-title" className="hero-in text-display mt-4 sm:mt-5" style={delay(160)}>
          {site.shortName}
        </h1>

        <div className="mt-7 grid gap-8 sm:mt-9 lg:grid-cols-12 lg:items-end lg:gap-12">
          <p className="hero-in text-tagline text-balance lg:col-span-7" style={delay(300)}>
            <span className="text-gradient">{hero.taglineAccent}</span> {hero.taglineRest}
          </p>
          <div className="hero-in lg:col-span-5 lg:pb-1.5" style={delay(440)}>
            <p className="max-w-[46ch] text-[1.0625rem] leading-relaxed text-fog text-pretty">{hero.intro}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href="#projects" className="btn btn-light">
                View my work
                <ArrowRight size={18} className="btn-arrow" />
              </a>
              <a href="#contact" className="btn btn-ghost-dark">
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
