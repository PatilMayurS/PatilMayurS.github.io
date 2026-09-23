import type { CSSProperties } from 'react'
import { about } from '../content/profile'
import { passProgress, useScrollProgress } from '../hooks/motion'
import { Container, Reveal, Section } from './ui'

// Fill the statement word by word as it travels from 88% to 38% of the viewport.
const fillProgress = passProgress(0.88, 0.38)

export default function About() {
  const fillRef = useScrollProgress<HTMLParagraphElement>(fillProgress, 1)
  const words = about.statement.split(' ')

  return (
    <Section id="about" theme="light" className="py-section">
      <Container>
        <h2 id="about-title" className="eyebrow">
          <Reveal as="span" className="block">
            About
          </Reveal>
        </h2>

        <p
          ref={fillRef}
          className="fill-text text-statement mt-5 max-w-[20ch] text-balance sm:mt-6"
          style={{ '--n': words.length } as CSSProperties}
        >
          {words.map((w, i) => (
            <span key={i} style={{ '--i': i } as CSSProperties}>
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>

        <div className="mt-20 grid gap-14 sm:mt-24 lg:mt-32 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-6 lg:col-span-7">
            {about.paragraphs.map((p, i) => (
              <Reveal as="p" key={i} delay={i * 80} className="text-body-lg text-pretty text-muted first:text-ink">
                {p}
              </Reveal>
            ))}
          </div>

          <aside className="lg:col-span-4 lg:col-start-9" aria-label="At a glance">
            <Reveal className="border-t border-line pt-5">
              <p className="text-label text-muted">Currently</p>
              <p className="mt-2 text-[1.0625rem] font-semibold leading-snug">{about.current.role}</p>
              <p className="text-[1.0625rem] leading-snug text-muted">{about.current.org}</p>
              <p className="mt-1 text-[1.0625rem] leading-snug text-muted">{about.current.note}</p>
            </Reveal>
            <Reveal delay={80} className="mt-10 border-t border-line pt-5">
              <p className="text-label text-muted">Focus areas</p>
              <ul className="mt-3 space-y-2">
                {about.focus.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[1.0625rem] font-medium">
                    <span className="size-1.5 rounded-full bg-teal" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </aside>
        </div>
      </Container>
    </Section>
  )
}
