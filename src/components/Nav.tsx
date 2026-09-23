import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { flushSync } from 'react-dom'
import { nav, site } from '../content/profile'
import { Mark } from './icons'
import { cx } from '../lib/cx'

type Tone = 'dark' | 'light'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [tone, setTone] = useState<Tone>('dark')
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLElement>(null)
  const restoreFocus = useRef(true)
  const openedByKeyboard = useRef(false)

  // One rAF-throttled scroll pass: scrolled state, tone under the bar, scroll-spy.
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const sections = document.querySelectorAll<HTMLElement>('[data-section]')
      const barLine = 26
      const spyLine = window.innerHeight * 0.4
      let nextTone: Tone = 'dark'
      let nextActive = ''
      sections.forEach((s) => {
        const r = s.getBoundingClientRect()
        if (r.top <= barLine && r.bottom > barLine) nextTone = (s.dataset.theme as Tone) ?? 'dark'
        if (r.top <= spyLine && r.bottom > spyLine) nextActive = s.id
      })
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom) nextActive = nav[nav.length - 1].id
      setScrolled(window.scrollY > 8)
      setTone(nextTone)
      setActive(nextActive)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Mobile menu: lock scroll, make the page inert behind it, Escape to close, restore focus.
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const behind = [document.getElementById('main'), document.getElementById('footer')].filter(Boolean) as HTMLElement[]
    root.classList.add('menu-open')
    behind.forEach((el) => (el.inert = true))
    // Keyboard users land on the first link; pointer users get focus on the sheet itself (no stray ring).
    const target = openedByKeyboard.current ? menuRef.current?.querySelector<HTMLElement>('a') : menuRef.current
    target?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onResize = () => {
      if (window.matchMedia('(min-width: 768px)').matches) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    const toggle = toggleRef.current
    return () => {
      root.classList.remove('menu-open')
      behind.forEach((el) => (el.inert = false))
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      if (restoreFocus.current) toggle?.focus({ preventScroll: true })
      restoreFocus.current = true
    }
  }, [open])

  const barTone: Tone = open ? 'dark' : tone

  return (
    <header
      className="nav fixed inset-x-0 top-0 z-50"
      data-tone={barTone}
      data-scrolled={scrolled || open ? 'true' : 'false'}
      data-open={open ? 'true' : 'false'}
    >
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="nav-bar">
        <nav aria-label="Primary" className="mx-auto flex h-[52px] w-full max-w-[1200px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#top" className="nav-logo" aria-label={`${site.shortName} — back to top`}>
            <Mark size={20} />
            <span>{site.shortName}</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={cx('nav-link', item.id === 'contact' && 'nav-link-cta')}
                  aria-current={active === item.id ? 'true' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            ref={toggleRef}
            type="button"
            className="nav-toggle md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={(e) => {
              openedByKeyboard.current = e.detail === 0
              setOpen((o) => !o)
            }}
          >
            <span className="nav-toggle-line" />
            <span className="nav-toggle-line" />
          </button>
        </nav>
      </div>

      <nav id="mobile-menu" ref={menuRef} tabIndex={-1} aria-label="Menu" className="mobile-menu md:hidden" hidden={!open}>
        <ul className="px-5 pt-6 pb-10 sm:px-8">
          {nav.map((item, i) => (
            <li key={item.id} style={{ '--i': i } as CSSProperties} className="mobile-menu-item">
              <a
                href={`#${item.id}`}
                className="mobile-menu-link"
                aria-current={active === item.id ? 'true' : undefined}
                onClick={() => {
                  // Let the anchor jump land on the section instead of returning focus to the toggle.
                  restoreFocus.current = false
                  flushSync(() => setOpen(false))
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mobile-menu-item px-5 text-[15px] text-fog sm:px-8" style={{ '--i': nav.length } as CSSProperties}>
          <a href={`mailto:${site.email}`} className="link-underline">
            {site.email}
          </a>
        </p>
      </nav>
    </header>
  )
}
