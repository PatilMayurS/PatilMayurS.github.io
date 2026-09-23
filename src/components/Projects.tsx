import { projects, type Project } from '../content/profile'
import ProjectArt from './ProjectArt'
import { cx } from '../lib/cx'
import { Chips, Container, Reveal, Section, SectionHeader } from './ui'

function Kicker({ project }: { project: Project }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-label">
      <span className="text-aqua">{project.kicker}</span>
      <span className="text-white/25" aria-hidden="true">
        ·
      </span>
      <span className="text-fog">{project.source}</span>
    </p>
  )
}

function Featured({ project, wide = false, delay = 0 }: { project: Project; wide?: boolean; delay?: number }) {
  return (
    <Reveal
      as="article"
      delay={delay}
      className={cx('card group flex flex-col', wide && 'lg:col-span-2 lg:grid lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]')}
    >
      <div className={cx('card-art aspect-[16/10]', wide && 'lg:aspect-auto lg:min-h-[34rem]')}>
        <ProjectArt kind={project.art} />
      </div>
      <div className={cx('flex flex-1 flex-col p-7 sm:p-10', wide && 'lg:p-14')}>
        <Kicker project={project} />
        <h3 className="text-title mt-3 text-balance">{project.title}</h3>
        <p className="text-body-lg mt-4 text-fog text-pretty">{project.summary}</p>

        <dl className="mt-8 space-y-5 border-t border-white/10 pt-7 text-[0.9375rem] leading-relaxed">
          <div>
            <dt className="text-label text-fog">Use case</dt>
            <dd className="mt-1.5 text-snow/90 text-pretty">{project.useCase}</dd>
          </div>
          {/* "My contribution" hidden for now — to be written by Mayur. Uncomment to show it again.
          <div>
            <dt className="text-label text-fog">My contribution</dt>
            <dd className="mt-1.5 text-snow/90 text-pretty">{project.contribution}</dd>
          </div>
          */}
          <div>
            <dt className="text-label text-fog">Outcomes</dt>
            <dd className="mt-2">
              <ul className="space-y-1.5">
                {project.outcomes.map((o) => (
                  <li key={o} className="bullet bullet-aqua text-snow/90">
                    {o}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        <Chips items={project.tags} className="chips-dark mt-auto pt-8" />
      </div>
    </Reveal>
  )
}

function Compact({ project, delay = 0 }: { project: Project; delay?: number }) {
  return (
    <Reveal as="article" delay={delay} className="card group flex flex-col">
      <div className="card-art aspect-[16/10]">
        <ProjectArt kind={project.art} />
      </div>
      <div className="flex flex-1 flex-col p-7">
        <Kicker project={project} />
        <h4 className="mt-3 text-[1.375rem] leading-tight font-semibold tracking-[-0.02em] text-balance">{project.title}</h4>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-fog text-pretty">{project.summary}</p>

        {project.metric && (
          <p className="mt-6 flex items-baseline gap-3">
            <span className="text-stat-sm text-gradient">{project.metric.value}</span>
            <span className="text-[0.9375rem] text-fog">{project.metric.label}</span>
          </p>
        )}

        <dl className="mt-6 space-y-3 border-t border-white/10 pt-5 text-[0.875rem] leading-relaxed">
          <div>
            <dt className="text-label text-fog">Use case</dt>
            <dd className="mt-1 text-snow/85">{project.useCase}</dd>
          </div>
          {/* "My contribution" hidden for now — to be written by Mayur. Uncomment to show it again.
          <div>
            <dt className="text-label text-fog">My contribution</dt>
            <dd className="mt-1 text-snow/85">{project.contribution}</dd>
          </div>
          */}
          {project.outcomes.length > 0 && (
            <div>
              <dt className="text-label text-fog">Outcome</dt>
              <dd className="mt-1 text-snow/85">{project.outcomes.join(' · ')}</dd>
            </div>
          )}
        </dl>

        <Chips items={project.tags} className="chips-dark mt-auto pt-6" />
      </div>
    </Reveal>
  )
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured)
  const more = projects.filter((p) => !p.featured)

  return (
    <Section id="projects" theme="dark" className="py-section">
      <Container>
        <SectionHeader
          id="projects"
          eyebrow="Projects"
          title="Selected research."
          lead="Work from my doctoral and master’s research, with the papers and talks behind each one."
        />

        <div className="mt-16 grid gap-5 sm:mt-20 lg:grid-cols-2 lg:gap-6">
          {featured.map((p, i) => (
            <Featured key={p.id} project={p} wide={i === 0} delay={i === 2 ? 100 : 0} />
          ))}
        </div>

        <div className="mt-24 sm:mt-28">
          <Reveal as="h3" className="text-title-sm">
            More research
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {more.map((p, i) => (
              <Compact key={p.id} project={p} delay={i * 90} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
