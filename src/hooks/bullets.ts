import { useSyncExternalStore } from 'react'
import { conciseBullets, detailedBullets } from '../content/experienceBullets'

export type BulletStyle = 'detailed' | 'concise'

/*
 * Dev-only preview switch for the experience bullets.
 *
 * In production `import.meta.env.DEV` is false, so `bulletsFor` reduces to a
 * constant lookup into the published set and the other set is tree-shaken out
 * of the bundle — public visitors never receive it.
 */
const KEY = 'portfolio:experience-bullets'
const listeners = new Set<() => void>()

function read(): BulletStyle {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'detailed' || v === 'concise') return v
  } catch {
    /* storage unavailable — fall back to the published style */
  }
  return __EXPERIENCE_BULLETS__
}

export function setBulletStyle(style: BulletStyle) {
  try {
    localStorage.setItem(KEY, style)
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

/** The style being previewed (dev) or the published style (production). */
export function useBulletStyle(): BulletStyle {
  return useSyncExternalStore(
    subscribe,
    () => (import.meta.env.DEV ? read() : __EXPERIENCE_BULLETS__),
    () => __EXPERIENCE_BULLETS__,
  )
}

export function bulletsFor(id: string, style: BulletStyle): string[] {
  if (import.meta.env.DEV) return (style === 'concise' ? conciseBullets : detailedBullets)[id] ?? []
  return (__EXPERIENCE_BULLETS__ === 'concise' ? conciseBullets : detailedBullets)[id] ?? []
}
