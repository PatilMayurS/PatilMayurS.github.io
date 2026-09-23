import { skills } from '../content/profile'
import { Container, Reveal, Section, SectionHeader } from './ui'

export default function Skills() {
  const { lead, groups } = skills

  return (
    <Section id="skills" theme="light" className="py-section">
      <Container>
        <SectionHeader id="skills" eyebrow="Skills" title="The toolkit." lead="Methods, languages, and software behind the work." />

        <Reveal className="mt-16 border-t border-line pt-8 sm:mt-20">
          <h3 className="text-label text-muted">
            {lead.name} <span className="sr-only">languages</span>
          </h3>
          <ul className="lang-list mt-4">
            {lead.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-14 sm:mt-16">
          {groups.map((g, i) => (
            <Reveal key={g.name} delay={i * 40} className="grid gap-4 border-t border-line py-8 sm:py-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <h3 className="text-[1.25rem] font-semibold tracking-[-0.02em]">{g.name}</h3>
                <p className="mt-1.5 text-[0.9375rem] text-muted">{g.blurb}</p>
              </div>
              <ul className="spec-list lg:col-span-8">
                {g.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
