import { experience, teaching, type Role } from '../content/profile'
import { useScrollProgress } from '../hooks/motion'
import { Chips, Container, Reveal, Section, SectionHeader } from './ui'

// The rail fills as the list passes a line 55% down the viewport.
const railProgress = (rect: DOMRect, vh: number) => (vh * 0.55 - rect.top) / rect.height

function RoleItem({ role }: { role: Role }) {
  const where = [role.org, role.institution].filter(Boolean).join(', ')
  return (
    <li className="role relative pb-20 pl-8 last:pb-2 sm:pb-24 sm:pl-12">
      <span className="timeline-dot" aria-hidden="true" />

      <Reveal as="h3" className="role-title text-title text-balance">
        {role.role}
        <span className="sr-only">, {where}</span>
      </Reveal>

      <div className="role-meta lg:sticky lg:top-24 lg:self-start">
        <Reveal>
          <p className="text-label text-teal">{role.kind}</p>
          <p className="mt-2 text-[1.0625rem] font-semibold tabular-nums">
            {role.start} – {role.end}
          </p>
          <p className="mt-3 text-[1.0625rem] font-medium leading-snug" aria-hidden="true">
            {role.org}
          </p>
          {role.institution && (
            <p className="text-[1.0625rem] leading-snug text-muted" aria-hidden="true">
              {role.institution}
            </p>
          )}
          {role.location && <p className="mt-1 text-[0.9375rem] text-muted">{role.location}</p>}
        </Reveal>
      </div>

      <div className="role-body">
        <Reveal as="p" delay={60} className="text-body-lg mt-4 max-w-[60ch] text-pretty text-muted lg:mt-5">
          {role.summary}
        </Reveal>

        {role.highlights && (
          <Reveal delay={120} className="mt-9 flex flex-wrap gap-x-12 gap-y-6">
            {role.highlights.map((h) => (
              <div key={h.value} className="max-w-[16rem]">
                <p className="text-stat-sm text-gradient-deep">{h.value}</p>
                <p className="mt-1.5 text-[0.9375rem] leading-snug text-muted">{h.label}</p>
              </div>
            ))}
          </Reveal>
        )}

        <Reveal as="ul" delay={160} className="mt-9 max-w-[64ch] space-y-3 border-t border-line pt-8" aria-label="Key contributions">
          {role.points.map((p) => (
            <li key={p} className="bullet text-[1rem] leading-relaxed text-muted text-pretty">
              {p}
            </li>
          ))}
        </Reveal>

        <Reveal delay={200}>
          <Chips items={role.tags} className="mt-8" />
        </Reveal>
      </div>
    </li>
  )
}

export default function Experience() {
  const railRef = useScrollProgress<HTMLDivElement>(railProgress, 1)

  return (
    <Section id="experience" theme="light" tone="mist" className="py-section">
      <Container>
        <SectionHeader
          id="experience"
          eyebrow="Experience"
          title="From nanometers to nautical miles."
          lead="Research and industry roles spanning nano-precision control, semiconductor fab automation, and autonomous marine systems."
        />

        <div ref={railRef} className="timeline relative mt-20 sm:mt-24">
          <span className="timeline-rail" aria-hidden="true">
            <span className="timeline-fill" />
          </span>
          <ol aria-label="Roles, most recent first">
            {experience.map((role) => (
              <RoleItem key={role.id} role={role} />
            ))}
          </ol>
        </div>

        <div className="mt-20 grid gap-10 border-t border-line pt-12 sm:mt-24 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-4">
            <h3 className="text-title-sm">Teaching</h3>
            <p className="mt-3 max-w-[32ch] text-[1.0625rem] leading-relaxed text-muted">
              Laboratory instruction and mentoring in dynamics, controls, and heat transfer.
            </p>
          </Reveal>
          <div className="grid gap-12 md:grid-cols-2 lg:col-span-8 lg:gap-10">
            {teaching.map((t, i) => (
              <Reveal as="article" key={t.institution} delay={i * 90}>
                <p className="text-label text-teal tabular-nums">
                  {t.start} – {t.end}
                </p>
                <h4 className="mt-2 text-[1.1875rem] font-semibold tracking-tight">Teaching Assistant</h4>
                <p className="text-[1.0625rem] text-muted">
                  {t.department}, {t.institution}
                </p>
                <ul className="mt-4 space-y-1.5" aria-label="Courses">
                  {t.courses.map((c) => (
                    <li key={c} className="text-[0.9375rem] font-medium">
                      {c}
                    </li>
                  ))}
                </ul>
                <ul className="mt-4 space-y-2.5">
                  {t.points.map((p) => (
                    <li key={p} className="bullet text-[0.9375rem] leading-relaxed text-muted text-pretty">
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
