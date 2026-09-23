import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInView } from '../hooks/motion'
import { cx } from '../lib/cx'

type RevealProps = {
  as?: ElementType
  delay?: number
  className?: string
  children?: ReactNode
} & Record<string, unknown>

/** Fades + lifts its content in the first time it scrolls into view. */
export function Reveal({ as: Tag = 'div', delay = 0, className, children, ...rest }: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>()
  return (
    <Tag
      ref={ref}
      className={cx('reveal', inView && 'is-in', className)}
      style={{ '--d': `${delay}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-12', className)}>{children}</div>
}

type SectionProps = {
  id: string
  theme: 'light' | 'dark'
  tone?: 'paper' | 'mist'
  className?: string
  children: ReactNode
}

/**
 * A top-level page section, labelled by its `${id}-title` heading.
 * `data-theme` drives the nav's colour scheme and focus-ring colours.
 */
export function Section({ id, theme, tone = 'paper', className, children }: SectionProps) {
  const bg = theme === 'dark' ? 'bg-night text-snow' : tone === 'mist' ? 'bg-mist text-ink' : 'bg-paper text-ink'
  return (
    <section id={id} data-section data-theme={theme} aria-labelledby={`${id}-title`} className={cx(bg, 'relative', className)}>
      {children}
    </section>
  )
}

type HeaderProps = {
  id: string
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  className?: string
  align?: 'left' | 'center'
}

/** Eyebrow + display headline (one h2, so heading navigation reads both) + optional lead. */
export function SectionHeader({ id, eyebrow, title, lead, className, align = 'left' }: HeaderProps) {
  const center = align === 'center'
  return (
    <header className={cx(center && 'text-center', className)}>
      <h2 id={`${id}-title`}>
        <Reveal as="span" className="eyebrow block">
          {eyebrow}
        </Reveal>{' '}
        <Reveal as="span" delay={70} className={cx('text-headline mt-3 block text-balance', center && 'mx-auto')}>
          {title}
        </Reveal>
      </h2>
      {lead && (
        <Reveal as="p" delay={140} className={cx('text-lead mt-6 max-w-[42ch] text-pretty text-muted', center && 'mx-auto')}>
          {lead}
        </Reveal>
      )}
    </header>
  )
}

export function Chips({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cx('flex flex-wrap gap-2', className)} aria-label="Topics">
      {items.map((t) => (
        <li key={t} className="chip">
          {t}
        </li>
      ))}
    </ul>
  )
}
