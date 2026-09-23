import type { ReactNode } from 'react'
import { honors, publications, talks } from '../content/profile'
import { Container, Reveal, Section, SectionHeader } from './ui'

function Group({ title, blurb, children }: { title: string; blurb: string; children: ReactNode }) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <Reveal className="lg:col-span-4">
        <h3 className="text-title-sm">{title}</h3>
        <p className="mt-3 max-w-[30ch] text-[1.0625rem] leading-relaxed text-muted">{blurb}</p>
      </Reveal>
      <div className="lg:col-span-8">{children}</div>
    </div>
  )
}

export default function Recognition() {
  return (
    <Section id="recognition" theme="light" className="py-section">
      <Container>
        <SectionHeader id="recognition" eyebrow="Recognition" title="Publications, talks & honors." />

        <ul className="mt-16 grid gap-x-8 gap-y-12 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4" aria-label="Honors, awards, and professional service">
          {honors.map((h, i) => (
            <Reveal as="li" key={h.title} delay={i * 80} className="border-t-2 border-ink pt-5">
              <p className="text-label text-muted tabular-nums">{h.date}</p>
              <p className="mt-3 text-[1.25rem] leading-snug font-semibold tracking-[-0.02em] text-balance">{h.title}</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted text-pretty">{h.detail}</p>
            </Reveal>
          ))}
        </ul>

        <div className="mt-24 space-y-24 sm:mt-32 sm:space-y-28">
          <Group title="Publications" blurb="First-authored journal, conference, and magazine work.">
            <ol>
              {publications.map((p) => (
                <Reveal as="li" key={p.title} className="pub border-t border-line py-6 first:border-t-0 first:pt-0 lg:first:pt-1">
                  <span className="pub-year text-[0.9375rem] font-semibold tabular-nums text-muted">{p.year}</span>
                  <div>
                    <p className="text-[1.0625rem] leading-snug font-semibold tracking-[-0.01em] text-pretty">{p.title}</p>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">
                      {p.authors} · <span className="italic">{p.venue}</span>
                    </p>
                  </div>
                  {p.status && <span className="pub-status">{p.status}</span>}
                </Reveal>
              ))}
            </ol>
          </Group>

          <Group title="Talks" blurb="Conference presentations and invited talks.">
            <ol>
              {talks.map((t) => (
                <Reveal as="li" key={t.title} className="pub border-t border-line py-6 first:border-t-0 first:pt-0 lg:first:pt-1">
                  <span className="pub-year text-[0.9375rem] font-semibold tabular-nums text-muted">{t.year}</span>
                  <div>
                    <p className="text-[1.0625rem] leading-snug font-semibold tracking-[-0.01em] text-pretty">{t.title}</p>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">
                      {t.event} · {t.location}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </Group>
        </div>
      </Container>
    </Section>
  )
}
