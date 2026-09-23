import { useEffect, useRef, type CSSProperties } from 'react'
import { contours, isobath, turningPath, type Turn } from '../lib/geometry'
import { useReducedMotion } from '../hooks/motion'

/*
 * The hero illustration: a stylised nautical chart. A vessel follows a
 * curvature-constrained route — minimum-radius turns joined by tangents —
 * around three islands, carrying an elliptical safety domain.
 * Geometry is computed once at module load (deterministic → SSR-safe).
 */
const W = 1600
const H = 1000

const TURNS: Turn[] = [
  { c: { x: 470, y: 190 }, r: 130, dir: -1 },
  { c: { x: 1010, y: 210 }, r: 120, dir: 1 },
  { c: { x: 1350, y: 470 }, r: 120, dir: -1 },
]
const ROUTE = turningPath({ x: -80, y: 330 }, TURNS, { x: 1720, y: 110 })

const ISLANDS = [
  { levels: contours(TURNS[0].c, 80, 6, 7, { x: 1.08, y: 0.92 }), strong: true },
  { levels: contours(TURNS[1].c, 74, 6, 19), strong: true },
  { levels: contours(TURNS[2].c, 72, 5, 31, { x: 0.94, y: 1.05 }), strong: true },
  { levels: contours({ x: 110, y: 90 }, 130, 5, 43, { x: 1.3, y: 0.8 }), strong: false },
  { levels: contours({ x: 1520, y: 900 }, 170, 6, 57, { x: 1.2, y: 0.85 }), strong: false },
]

const ISOBATHS = [
  isobath(90, -60, 1660, 3, 30),
  isobath(700, -60, 1660, 5, 34),
  isobath(790, -60, 1660, 8, 28),
]

const GRID: [number, number][] = []
for (let x = 100; x < W; x += 200) for (let y = 100; y < H; y += 200) GRID.push([x, y])

const LOOP_MS = 38000

export default function HeroChart() {
  const wakeRef = useRef<SVGPathElement>(null)
  const vesselRef = useRef<SVGGElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const wake = wakeRef.current
    const vessel = vesselRef.current
    const svg = svgRef.current
    if (!wake || !vessel || !svg) return
    const len = wake.getTotalLength()
    wake.style.strokeDasharray = `${len} ${len}`

    const place = (t: number) => {
      const s = Math.max(0.5, Math.min(len - 0.5, t * len))
      const a = wake.getPointAtLength(s)
      const b = wake.getPointAtLength(Math.min(len, s + 1))
      const deg = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
      vessel.setAttribute('transform', `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${deg.toFixed(1)})`)
      wake.style.strokeDashoffset = String(len - s)
      // Ease the vessel in and out at the ends of the loop.
      const fade = Math.min(1, t / 0.04, (1 - t) / 0.04)
      vessel.style.opacity = String(fade)
      wake.style.opacity = String(Math.min(1, (1 - t) / 0.06))
    }

    if (reduced) {
      place(0.58)
      vessel.style.opacity = '1'
      return
    }

    let raf = 0
    let visible = true
    let origin = performance.now() - LOOP_MS * 0.02
    let pausedAt = 0
    const tick = (now: number) => {
      place(((now - origin) % LOOP_MS) / LOOP_MS)
      raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visible) {
        origin += performance.now() - pausedAt
        raf = requestAnimationFrame(tick)
      } else if (!entry.isIntersecting && visible) {
        pausedAt = performance.now()
        cancelAnimationFrame(raf)
      }
      visible = entry.isIntersecting
    })
    io.observe(svg)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [reduced])

  return (
    <svg
      ref={svgRef}
      className="chart h-full w-full"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="hero-route" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-aqua)" />
          <stop offset="1" stopColor="var(--color-iris)" />
        </linearGradient>
        <radialGradient id="hero-glow">
          <stop offset="0" stopColor="var(--color-aqua)" stopOpacity="0.45" />
          <stop offset="1" stopColor="var(--color-aqua)" stopOpacity="0" />
        </radialGradient>
        <mask id="hero-draw" maskUnits="userSpaceOnUse" x="-200" y="-200" width={W + 400} height={H + 400}>
          <path d={ROUTE.d} pathLength={1} className="chart-draw" fill="none" stroke="#fff" strokeWidth="16" />
        </mask>
      </defs>

      <g className="chart-layer" style={{ '--i': 0 } as CSSProperties} stroke="#fff" strokeOpacity="0.18">
        {GRID.map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x - 5} ${y}h10M${x} ${y - 5}v10`} strokeWidth="1" />
        ))}
      </g>

      <g className="chart-layer" style={{ '--i': 1 } as CSSProperties} fill="none" stroke="#fff" strokeOpacity="0.07">
        {ISOBATHS.map((d, i) => (
          <path key={i} d={d} strokeWidth="1.2" />
        ))}
      </g>

      <g className="chart-layer" style={{ '--i': 2 } as CSSProperties} fill="none" stroke="#fff">
        {ISLANDS.map((island, i) =>
          island.levels.map((d, l) => (
            <path
              key={`${i}-${l}`}
              d={d}
              strokeWidth={l === island.levels.length - 1 ? 1.4 : 1}
              strokeOpacity={(island.strong ? 0.1 : 0.05) + (l / island.levels.length) * (island.strong ? 0.22 : 0.08)}
              fill={l === island.levels.length - 1 ? 'rgb(255 255 255 / 0.05)' : 'none'}
            />
          )),
        )}
      </g>

      <g className="chart-layer" style={{ '--i': 3 } as CSSProperties} fill="none" stroke="#fff" strokeOpacity="0.12">
        {TURNS.map((t, i) => (
          <g key={i}>
            <circle cx={t.c.x} cy={t.c.y} r={t.r} strokeDasharray="3 9" />
            <path d={`M${t.c.x - 4} ${t.c.y}h8M${t.c.x} ${t.c.y - 4}v8`} />
          </g>
        ))}
      </g>

      <g mask="url(#hero-draw)">
        <path d={ROUTE.d} fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.6" strokeDasharray="1 9" strokeLinecap="round" />
        {ROUTE.joints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.2" fill="#000" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.2" />
        ))}
      </g>

      <path
        ref={wakeRef}
        d={ROUTE.d}
        fill="none"
        stroke="url(#hero-route)"
        strokeWidth="2.4"
        strokeLinecap="round"
        className="chart-wake"
      />

      <g ref={vesselRef} className="chart-vessel">
        <circle r="70" fill="url(#hero-glow)" />
        <ellipse cx="10" rx="46" ry="26" fill="none" stroke="var(--color-aqua)" strokeOpacity="0.55" strokeDasharray="4 6" />
        <path d="M13 0 L-9 -8 L-4 0 L-9 8 Z" fill="#fff" />
      </g>
    </svg>
  )
}
