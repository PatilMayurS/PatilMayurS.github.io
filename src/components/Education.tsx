import type { CSSProperties } from 'react'
import { education, type Degree } from '../content/profile'
import { cx } from '../lib/cx'
import { Container, Reveal, Section, SectionHeader } from './ui'

function Journey() {
  const chronological = [...education].reverse()
  const first = Number(chronological[0].year)
  const span = Number(chronological[chronological.length - 1].year) - first
  return (
    <Reveal className="journey mt-16 sm:mt-20" aria-hidden="true">
      <div className="journey-line">
        <span className="journey-fill" />
      </div>
      <ol className="relative h-14">
        {chronological.map((d, i) => {
          const last = i === chronological.length - 1
          return (
            <li
              key={d.year}
              className={cx('journey-stop', last && 'is-last')}
              style={{ '--x': `${((Number(d.year) - first) / span) * 100}%`, '--i': i } as CSSProperties}
            >
              <span className="journey-year">{d.year}</span>
              <span className="journey-label">{d.short}</span>
            </li>
          )
        })}
      </ol>
    </Reveal>
  )
}

function DegreeCard({ d, delay }: { d: Degree; delay: number }) {
  const major = Boolean(d.thesis)
  return (
    <Reveal as="article" delay={delay} className={cx('tile flex flex-col', major ? 'p-7 sm:p-10' : 'p-7 sm:p-8')}>
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-label text-teal">{d.expected ? `Expected ${d.date}` : d.date}</p>
          <h3 className={cx('mt-2 font-semibold tracking-[-0.025em] text-balance', major ? 'text-title-sm' : 'text-[1.375rem] leading-tight')}>
            {d.degree}
          </h3>
          <p className="mt-0.5 text-[1.0625rem] text-muted">{d.field}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className={major ? 'text-stat-sm' : 'text-[1.75rem] leading-none font-semibold tracking-[-0.03em]'}>{d.score.value}</p>
          <p className="mt-1.5 text-label text-muted">{d.score.label}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[1.0625rem] font-semibold">{d.institution}</p>
        <p className="text-[0.9375rem] text-muted">{d.location}</p>
      </div>

      {d.thesis && (
        <div className="mt-7 border-t border-line pt-6">
          <p className="text-label text-muted">Thesis</p>
          <p className="mt-2 text-[1.0625rem] leading-relaxed text-pretty">{d.thesis}</p>
        </div>
      )}
    </Reveal>
  )
}

export default function Education() {
  return (
    <Section id="education" theme="light" tone="mist" className="py-section">
      <Container>
        <SectionHeader
          id="education"
          eyebrow="Education"
          title="Rooted in mechanical engineering."
          lead="From a diploma in Kolhapur to a Ph.D. at Texas A&M — every degree in the same discipline."
        />
        <Journey />
        <div className="mt-12 grid gap-5 sm:mt-14 lg:grid-cols-2 lg:gap-6">
          {education.map((d, i) => (
            <DegreeCard key={d.institution} d={d} delay={(i % 2) * 90} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
