import type { CSSProperties } from 'react'
import { education, educationGap, type Degree } from '../content/profile'
import { cx } from '../lib/cx'
import { Container, Reveal, Section, SectionHeader } from './ui'

function Journey() {
  const chronological = [...education].reverse()
  const first = Number(chronological[0].year)
  const span = Number(chronological[chronological.length - 1].year) - first
  const pct = (year: number) => ((year - first) / span) * 100
  // Study segments either side of the industry years; the gap itself is dashed and labelled.
  const segments = [
    { from: first, to: educationGap.from, kind: 'study' },
    { from: educationGap.from, to: educationGap.to, kind: 'work' },
    { from: educationGap.to, to: first + span, kind: 'study' },
  ]
  return (
    <Reveal className="journey mt-16 sm:mt-20" aria-hidden="true">
      <div className="journey-line">
        {segments.map((seg) => (
          <span
            key={seg.from}
            className={cx('journey-seg', seg.kind === 'work' ? 'is-work' : 'is-study')}
            style={{ left: `${pct(seg.from)}%`, width: `${pct(seg.to) - pct(seg.from)}%`, '--d': `${pct(seg.from) * 14}ms` } as CSSProperties}
          />
        ))}
        <span
          className="journey-gap-label"
          style={{ left: `${(pct(educationGap.from) + pct(educationGap.to)) / 2}%` }}
        >
          <span className="hidden sm:inline">{educationGap.label}</span>
          <span className="sm:hidden">{educationGap.short}</span>
        </span>
      </div>
      <ol className="relative h-14">
        {chronological.map((d, i) => {
          const last = i === chronological.length - 1
          return (
            <li
              key={d.year}
              className={cx('journey-stop', last && 'is-last')}
              style={{ '--x': `${pct(Number(d.year))}%`, '--i': i } as CSSProperties}
            >
              <span className="journey-year">{d.year}</span>
              <span className="journey-label">{d.expected ? `${d.short} (expected)` : d.short}</span>
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
