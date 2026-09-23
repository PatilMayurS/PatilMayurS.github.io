/**
 * Small, deterministic geometry helpers for the site's line-art illustrations.
 * Everything here is pure so the prerendered HTML and the hydrated client
 * produce identical SVG.
 */
export type Vec = { x: number; y: number }

/** A minimum-radius turn. dir = 1 turns clockwise on screen (right), -1 counter-clockwise (left). */
export type Turn = { c: Vec; r: number; dir: 1 | -1 }

const TAU = Math.PI * 2
const f = (n: number) => (Math.round(n * 10) / 10).toString()
/** Integer precision for large organic shapes — keeps the prerendered HTML small. */
const i0 = (n: number) => Math.round(n).toString()

/**
 * Tangent segment leaving circle 1 and arriving on circle 2 (signed radii;
 * a radius of 0 is a point). Returns the two tangent points.
 */
function tangent(c1: Vec, rho1: number, c2: Vec, rho2: number): [Vec, Vec] {
  const dx = c2.x - c1.x
  const dy = c2.y - c1.y
  const len = Math.hypot(dx, dy)
  const theta = Math.atan2(dy, dx) - Math.asin(Math.max(-1, Math.min(1, (rho2 - rho1) / len)))
  const nx = -Math.sin(theta)
  const ny = Math.cos(theta)
  return [
    { x: c1.x - rho1 * nx, y: c1.y - rho1 * ny },
    { x: c2.x - rho2 * nx, y: c2.y - rho2 * ny },
  ]
}

function sweepAngle(c: Vec, a: Vec, b: Vec, dir: 1 | -1) {
  const ta = Math.atan2(a.y - c.y, a.x - c.x)
  const tb = Math.atan2(b.y - c.y, b.x - c.x)
  const d = dir === 1 ? tb - ta : ta - tb
  return ((d % TAU) + TAU) % TAU
}

/**
 * Curvature-constrained path: start point → tangent → arc → tangent … → end point.
 * The same construction Dubins-style planners use (arcs of minimum turning
 * radius joined by straight segments).
 */
export function turningPath(start: Vec, turns: Turn[], end: Vec) {
  const nodes = [{ c: start, rho: 0 }, ...turns.map((t) => ({ c: t.c, rho: t.dir * t.r })), { c: end, rho: 0 }]
  const legs: [Vec, Vec][] = []
  for (let i = 0; i < nodes.length - 1; i++) {
    legs.push(tangent(nodes[i].c, nodes[i].rho, nodes[i + 1].c, nodes[i + 1].rho))
  }
  let d = `M${f(start.x)} ${f(start.y)}`
  const joints: Vec[] = []
  turns.forEach((t, k) => {
    const entry = legs[k][1]
    const exit = legs[k + 1][0]
    const large = sweepAngle(t.c, entry, exit, t.dir) > Math.PI ? 1 : 0
    const sweep = t.dir === 1 ? 1 : 0
    d += ` L${f(entry.x)} ${f(entry.y)} A${t.r} ${t.r} 0 ${large} ${sweep} ${f(exit.x)} ${f(exit.y)}`
    joints.push(entry, exit)
  })
  d += ` L${f(end.x)} ${f(end.y)}`
  return { d, joints }
}

/** Seeded PRNG (mulberry32) so generated shapes are stable between renders. */
export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Closed Catmull-Rom spline through points, emitted as cubic Béziers. */
function closedSpline(pts: Vec[], fmt = i0) {
  const f = fmt
  const n = pts.length
  let d = `M${f(pts[0].x)} ${f(pts[0].y)}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    d += ` C${f(p1.x + (p2.x - p0.x) / 6)} ${f(p1.y + (p2.y - p0.y) / 6)} ${f(p2.x - (p3.x - p1.x) / 6)} ${f(
      p2.y - (p3.y - p1.y) / 6,
    )} ${f(p2.x)} ${f(p2.y)}`
  }
  return d + 'Z'
}

/** Open Catmull-Rom spline. */
export function openSpline(pts: Vec[], fmt = i0) {
  const f = fmt
  let d = `M${f(pts[0].x)} ${f(pts[0].y)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    d += ` C${f(p1.x + (p2.x - p0.x) / 6)} ${f(p1.y + (p2.y - p0.y) / 6)} ${f(p2.x - (p3.x - p1.x) / 6)} ${f(
      p2.y - (p3.y - p1.y) / 6,
    )} ${f(p2.x)} ${f(p2.y)}`
  }
  return d
}

/**
 * Nested, organic closed contours around a centre — reads like the depth
 * contours of an island on a nautical chart.
 */
export function contours(c: Vec, radius: number, levels: number, seed: number, stretch = { x: 1, y: 1 }) {
  const rand = rng(seed)
  const harmonics = [2, 3, 4, 5, 7].map((k) => ({ k, a: (rand() * 0.16) / Math.sqrt(k), p: rand() * TAU }))
  const out: string[] = []
  for (let l = 0; l < levels; l++) {
    const scale = 1 - l / (levels + 0.6)
    const pts: Vec[] = []
    const steps = 30
    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * TAU
      let r = 1
      for (const h of harmonics) r += h.a * (1 + l * 0.25) * Math.sin(h.k * t + h.p + l * 0.35)
      const rr = radius * scale * r
      pts.push({ x: c.x + Math.cos(t) * rr * stretch.x, y: c.y + Math.sin(t) * rr * stretch.y })
    }
    out.push(closedSpline(pts))
  }
  return out
}

/** Gently meandering open line across a width — an isobath. */
export function isobath(y0: number, x0: number, x1: number, seed: number, amp = 26) {
  const rand = rng(seed)
  const waves = [1, 2, 3].map((k) => ({ k, a: (amp * rand()) / k, p: rand() * TAU }))
  const pts: Vec[] = []
  const span = x1 - x0
  for (let i = 0; i <= 16; i++) {
    const x = x0 + (span * i) / 16
    let y = y0
    for (const w of waves) y += w.a * Math.sin((w.k * TAU * (x - x0)) / span + w.p)
    pts.push({ x, y })
  }
  return openSpline(pts)
}
