import { useEffect, useRef, useState } from 'react'
import { contact, site } from '../content/profile'
import { contours, isobath } from '../lib/geometry'
import { ArrowUpRight, Check, Copy, LinkedIn, Pin } from './icons'
import { Container, Reveal, Section } from './ui'

// A quiet echo of the hero chart: the voyage ends at a waypoint.
const RINGS = contours({ x: 800, y: 520 }, 420, 7, 5, { x: 1.35, y: 0.8 })
const LINES = [isobath(120, -60, 1660, 13, 26), isobath(900, -60, 1660, 17, 30)]

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${site.email}`
    }
  }

  return (
    <>
      <button type="button" onClick={copy} className="icon-btn" aria-label={copied ? 'Email address copied' : 'Copy email address'}>
        {copied ? <Check size={18} /> : <Copy size={18} />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Email address copied to clipboard' : ''}
      </span>
    </>
  )
}

export default function Contact() {
  return (
    <Section id="contact" theme="dark" className="overflow-hidden py-section">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <g fill="none" stroke="#fff">
          {RINGS.map((d, i) => (
            <path key={i} d={d} strokeOpacity={0.03 + i * 0.012} />
          ))}
          {LINES.map((d, i) => (
            <path key={i} d={d} strokeOpacity="0.05" />
          ))}
        </g>
        <circle cx="800" cy="520" r="160" fill="url(#contact-glow)" />
        <defs>
          <radialGradient id="contact-glow">
            <stop offset="0" stopColor="var(--color-aqua)" stopOpacity="0.14" />
            <stop offset="1" stopColor="var(--color-aqua)" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <Container className="relative text-center">
        <h2 id="contact-title">
          <Reveal as="span" className="eyebrow block">
            Contact
          </Reveal>{' '}
          <Reveal as="span" delay={80} className="text-headline-xl mx-auto mt-4 block max-w-[14ch] text-balance">
            {contact.headline}
          </Reveal>
        </h2>
        <Reveal as="p" delay={160} className="text-lead mx-auto mt-7 max-w-[40ch] text-fog text-pretty">
          {contact.lead}
        </Reveal>

        <Reveal delay={240} className="mt-10 flex flex-wrap justify-center gap-3">
          <a href={`mailto:${site.email}`} className="btn btn-light">
            Email me
            <ArrowUpRight size={18} className="btn-arrow-diag" />
          </a>
          <a href={site.linkedin.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark">
            <LinkedIn size={17} />
            LinkedIn
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Reveal>

        <Reveal delay={320} className="mt-16 flex flex-col items-center gap-4">
          <p className="flex items-center gap-3">
            <a href={`mailto:${site.email}`} className="link-underline text-[clamp(1.25rem,1rem+1.4vw,2rem)] font-semibold tracking-[-0.02em]">
              {site.email}
            </a>
            <CopyEmail />
          </p>
          <p className="inline-flex items-center gap-2 text-[0.9375rem] text-fog">
            <Pin size={16} />
            {site.affiliation} · {site.location}
          </p>
        </Reveal>
      </Container>
    </Section>
  )
}
