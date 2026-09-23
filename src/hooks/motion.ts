import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react'

const REDUCED = '(prefers-reduced-motion: reduce)'

function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

/** The user's reduced-motion preference. The server snapshot (false) keeps hydration in agreement. */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  )
}

/* ---------- Scroll-triggered reveal (one shared IntersectionObserver) ---------- */

const listeners = new Map<Element, () => void>()
let observer: IntersectionObserver | null = null

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        listeners.get(entry.target)?.()
        observer?.unobserve(entry.target)
        listeners.delete(entry.target)
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0 },
  )
  return observer
}

/** Returns a ref and whether the element has entered the viewport (fires once). */
export function useInView<T extends Element>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    listeners.set(el, () => setInView(true))
    const io = getObserver()
    io.observe(el)
    return () => {
      io.unobserve(el)
      listeners.delete(el)
    }
  }, [])
  return [ref, inView]
}

/* ---------- Scroll progress → CSS custom property ---------- */

type Mapper = (rect: DOMRect, vh: number) => number

/** 0 while the element is at rest at the top of the page, 1 once it has scrolled fully out. */
export const exitProgress: Mapper = (rect) => -rect.top / Math.max(1, rect.height)

/** 0 when the element's top reaches `from` of the viewport height, 1 when it reaches `to`. */
export const passProgress =
  (from: number, to: number): Mapper =>
  (rect, vh) =>
    (vh * from - rect.top) / (vh * (from - to))

/**
 * Writes a clamped 0–1 scroll progress to `--p` on the element every animation
 * frame while scrolling. No React re-renders; honours reduced motion by pinning
 * the value to `reducedValue`.
 */
export function useScrollProgress<T extends HTMLElement>(map: Mapper, reducedValue = 1) {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      el.style.setProperty('--p', String(reducedValue))
      return
    }
    let frame = 0
    const update = () => {
      frame = 0
      const p = map(el.getBoundingClientRect(), window.innerHeight)
      el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(4))
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
  }, [map, reduced, reducedValue])
  return ref
}
