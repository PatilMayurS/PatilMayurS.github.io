import type { ReactNode } from 'react'
import type { ProjectArt as ArtKind } from '../content/profile'
import { contours, openSpline, turningPath, type Vec } from '../lib/geometry'

/*
 * Illustrative line art for each project — deliberately abstract placeholders
 * rather than screenshots. Decorative (aria-hidden); the card text carries
 * the meaning.
 */
const W = 640
const H = 400
const AQUA = 'var(--color-aqua)'
const IRIS = 'var(--color-iris)'

function Frame({ id, children }: { id: string; children: ReactNode }) {
  return (
    <svg className="art" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-bg`} cx="0.7" cy="0.2" r="0.9">
          <stop offset="0" stopColor="#1b2a33" />
          <stop offset="0.55" stopColor="#0f1114" />
          <stop offset="1" stopColor="#0a0a0c" />
        </radialGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor={AQUA} stopOpacity="0.5" />
          <stop offset="1" stopColor={AQUA} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-bg)`} />
      {children}
    </svg>
  )
}

const hull = (x: number, y: number, deg: number, s = 1) =>
  `translate(${x} ${y}) rotate(${deg}) scale(${s})`
const HULL = 'M0 -24 C10 -14 12 4 10 22 L-10 22 C-12 4 -10 -14 0 -24 Z'

/* ---------- Digital twin: a simulated sea surface, sensors, weather, traffic ---------- */
function Twin() {
  const vp = { x: 330, y: 132 }
  const rays = Array.from({ length: 29 }, (_, i) => -1120 + i * 80)
  const rows = Array.from({ length: 9 }, (_, i) => vp.y + 8 + Math.pow(i + 1, 2) * 3.4)
  const route = openSpline([
    { x: 300, y: 300 },
    { x: 318, y: 250 },
    { x: 372, y: 205 },
    { x: 404, y: 168 },
    { x: 410, y: 146 },
  ])
  return (
    <Frame id="twin">
      <defs>
        <linearGradient id="twin-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="twin-mask">
          <rect x="0" y={vp.y} width={W} height={H - vp.y} fill="url(#twin-fade)" />
        </mask>
      </defs>
      <g mask="url(#twin-mask)" stroke="#fff" strokeOpacity="0.22" strokeWidth="1">
        {rays.map((x) => (
          <line key={x} x1={vp.x} y1={vp.y} x2={vp.x + (x - vp.x) * 1.6} y2={H + 40} />
        ))}
        {rows.map((y) => (
          <line key={y} x1="0" y1={y} x2={W} y2={y} />
        ))}
      </g>
      <line x1="0" y1={vp.y} x2={W} y2={vp.y} stroke="#fff" strokeOpacity="0.16" />
      {/* weather */}
      <g stroke="#fff" strokeOpacity="0.14" strokeLinecap="round">
        {Array.from({ length: 26 }, (_, i) => {
          const x = 380 + ((i * 53) % 270)
          const y = 18 + ((i * 37) % 96)
          return <line key={i} x1={x} y1={y} x2={x - 7} y2={y + 16} />
        })}
      </g>
      {/* sensor fan */}
      <path d="M300 292 L218 150 A170 170 0 0 1 412 146 Z" fill={AQUA} fillOpacity="0.07" />
      <path d="M300 292 L218 150 M300 292 L412 146" stroke={AQUA} strokeOpacity="0.35" strokeDasharray="3 5" />
      <path d={route} fill="none" stroke={AQUA} strokeWidth="2" strokeDasharray="8 10" className="art-flow" />
      {/* other traffic with safety domain */}
      <g transform={hull(452, 150, -100, 0.42)}>
        <path d={HULL} fill="#fff" fillOpacity="0.7" />
      </g>
      <ellipse cx="452" cy="150" rx="30" ry="11" fill="none" stroke={IRIS} strokeOpacity="0.7" strokeDasharray="3 4" />
      {/* own ship */}
      <circle cx="300" cy="300" r="60" fill="url(#twin-glow)" />
      <g transform={hull(300, 300, 8, 1.05)}>
        <path d={HULL} fill="#fff" />
        <path d="M0 -12 V14" stroke="#0b0b0c" strokeOpacity="0.5" />
      </g>
      {/* HUD corners */}
      <g stroke="#fff" strokeOpacity="0.4" fill="none" strokeWidth="1.4">
        <path d="M24 44 V24 H44 M596 24 H616 V44 M616 356 V376 H596 M44 376 H24 V356" />
      </g>
    </Frame>
  )
}

/* ---------- COLREGs crossing: give-way to starboard, clear of the shallows ---------- */
function Colregs() {
  const shore = contours({ x: -60, y: 240 }, 250, 5, 91, { x: 0.8, y: 1.15 })
  // Give-way vessel: target crossing from starboard, so alter to starboard and pass astern.
  const own = turningPath(
    { x: 320, y: 470 },
    [
      { c: { x: 400, y: 330 }, r: 80, dir: 1 },
      { c: { x: 600, y: 170 }, r: 80, dir: -1 },
    ],
    { x: 680, y: -40 },
  )
  return (
    <Frame id="colregs">
      <defs>
        <pattern id="colregs-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#fff" strokeOpacity="0.14" />
        </pattern>
      </defs>
      <g fill="none" stroke="#fff">
        {shore.map((d, i) => (
          <path key={i} d={d} strokeOpacity={0.08 + i * 0.05} fill={i === shore.length - 1 ? 'url(#colregs-hatch)' : 'none'} />
        ))}
      </g>
      {/* target vessel crossing from starboard */}
      <path d="M660 214 L150 214" stroke="#fff" strokeOpacity="0.35" strokeDasharray="2 8" strokeLinecap="round" />
      <ellipse cx="470" cy="214" rx="64" ry="30" fill={IRIS} fillOpacity="0.06" stroke={IRIS} strokeOpacity="0.8" strokeDasharray="4 5" />
      <g transform={hull(470, 214, -90, 0.7)}>
        <path d={HULL} fill="#fff" fillOpacity="0.85" />
      </g>
      {/* own ship route */}
      <path d={own.d} fill="none" stroke={AQUA} strokeWidth="2.2" strokeLinecap="round" className="art-flow" strokeDasharray="12 6" />
      <circle cx="320" cy="352" r="52" fill="url(#colregs-glow)" />
      <ellipse cx="320" cy="344" rx="30" ry="56" fill="none" stroke={AQUA} strokeOpacity="0.6" strokeDasharray="4 5" />
      <g transform={hull(320, 352, 0, 0.85)}>
        <path d={HULL} fill="#fff" />
      </g>
    </Frame>
  )
}

/* ---------- STPA: a control structure with a manual ⇄ autonomous handoff ---------- */
function Stpa() {
  const box = (x: number, y: number, w: number, label: string, accent = false) => (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height="64"
        rx="14"
        fill={accent ? 'rgb(95 212 220 / 0.08)' : 'rgb(255 255 255 / 0.03)'}
        stroke={accent ? AQUA : '#fff'}
        strokeOpacity={accent ? 0.7 : 0.3}
      />
      <text x={x + w / 2} y={y + 38} textAnchor="middle" fill="#fff" fillOpacity="0.85" fontSize="17" fontWeight="500" letterSpacing="-0.2">
        {label}
      </text>
    </g>
  )
  const arrow = (x1: number, y1: number, x2: number, y2: number, dashed = false) => {
    const a = Math.atan2(y2 - y1, x2 - x1)
    const head = (da: number) => `${(x2 - 9 * Math.cos(a + da)).toFixed(1)} ${(y2 - 9 * Math.sin(a + da)).toFixed(1)}`
    return (
      <g stroke="#fff" strokeOpacity="0.45" fill="none" strokeWidth="1.5">
        <path d={`M${x1} ${y1} L${x2} ${y2}`} strokeDasharray={dashed ? '4 5' : undefined} />
        <path d={`M${head(0.45)} L${x2} ${y2} L${head(-0.45)}`} />
      </g>
    )
  }
  return (
    <Frame id="stpa">
      <g stroke="#fff" strokeOpacity="0.05">
        {Array.from({ length: 16 }, (_, i) => (
          <line key={i} x1={i * 40 + 20} y1="0" x2={i * 40 + 20} y2={H} />
        ))}
      </g>
      {box(70, 70, 190, 'Human operator')}
      {box(380, 70, 190, 'Autonomy', true)}
      {box(150, 276, 340, 'Vessel')}
      {/* handoff */}
      <circle cx="320" cy="102" r="46" fill="url(#stpa-glow)" />
      <path d="M270 94 H370 M362 88 L370 94 L362 100" stroke={AQUA} strokeWidth="1.8" fill="none" />
      <path d="M370 112 H270 M278 106 L270 112 L278 118" stroke={AQUA} strokeWidth="1.8" fill="none" strokeOpacity="0.6" />
      <text x="320" y="152" textAnchor="middle" fill={AQUA} fontSize="12.5" letterSpacing="1.4" fontWeight="600">
        HANDOFF
      </text>
      {/* control actions (down, inner) and feedback (up, outer) */}
      {arrow(215, 134, 250, 272)}
      {arrow(170, 272, 110, 134, true)}
      {arrow(425, 134, 390, 272)}
      {arrow(470, 272, 530, 134, true)}
      <g fontSize="11.5" fill="#fff" fillOpacity="0.5" letterSpacing="0.6">
        <text x="126" y="212" textAnchor="end">feedback</text>
        <text x="246" y="212">control</text>
        <text x="394" y="212" textAnchor="end">control</text>
        <text x="514" y="212">feedback</text>
      </g>
    </Frame>
  )
}

/* ---------- Curvature-constrained planning: turn–straight–turn around an obstacle ---------- */
function Dubins() {
  // Turn–straight–turn: left out of the start pose, a tangent over the obstacle, right into the goal pose.
  const start: Vec = { x: 50, y: 322 }
  const goal: Vec = { x: 610, y: 70 }
  const c1 = { c: { x: 140, y: 240 }, r: 80, dir: -1 } as const
  const c2 = { c: { x: 480, y: 150 }, r: 80, dir: 1 } as const
  const best = turningPath(start, [c1, c2], goal)
  const alt = turningPath(start, [{ c: { x: 150, y: 402 }, r: 80, dir: 1 }, { c: { x: 540, y: 330 }, r: 80, dir: -1 }], {
    x: 700,
    y: 250,
  })
  const obstacle = contours({ x: 320, y: 292 }, 52, 4, 12)
  return (
    <Frame id="dubins">
      <g fill="none" stroke="#fff">
        {obstacle.map((d, i) => (
          <path key={i} d={d} strokeOpacity={0.1 + i * 0.08} fill={i === obstacle.length - 1 ? 'rgb(255 255 255 / 0.06)' : 'none'} />
        ))}
      </g>
      <g fill="none" stroke="#fff" strokeOpacity="0.16" strokeDasharray="3 6">
        <circle cx={c1.c.x} cy={c1.c.y} r={c1.r} />
        <circle cx={c2.c.x} cy={c2.c.y} r={c2.r} />
      </g>
      <path d={alt.d} fill="none" stroke="#fff" strokeOpacity="0.14" strokeWidth="1.4" strokeDasharray="2 6" />
      <path d={best.d} fill="none" stroke={AQUA} strokeWidth="2.4" strokeLinecap="round" className="art-flow" strokeDasharray="12 6" />
      {best.joints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.6" fill="#0b0b0c" stroke={AQUA} strokeWidth="1.4" />
      ))}
      <g transform={`translate(${start.x} ${start.y})`} fill="#fff">
        <circle r="5" />
        <path d="M12 -5 L20 0 L12 5 Z" fillOpacity="0.6" />
      </g>
      <circle cx={goal.x} cy={goal.y} r="44" fill="url(#dubins-glow)" />
      <circle cx={goal.x} cy={goal.y} r="7" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx={goal.x} cy={goal.y} r="2.5" fill="#fff" />
      <path d={`M${goal.x + 14} ${goal.y - 5} L${goal.x + 22} ${goal.y} L${goal.x + 14} ${goal.y + 5} Z`} fill="#fff" fillOpacity="0.6" />
    </Frame>
  )
}

/* ---------- Traffic-signal state recognition: detections on signal heads ---------- */
function Signal() {
  const head = (x: number, y: number, lit: number, label: string, arrow = false, blink = false) => (
    <g>
      <rect x={x} y={y} width="62" height="164" rx="18" fill="#141518" stroke="#fff" strokeOpacity="0.2" />
      {[0, 1, 2].map((i) => {
        const cy = y + 32 + i * 50
        const on = i === lit
        return (
          <g key={i}>
            {on && <circle cx={x + 31} cy={cy} r="34" fill="url(#signal-glow)" />}
            <circle
              cx={x + 31}
              cy={cy}
              r="17"
              fill={on ? AQUA : '#fff'}
              fillOpacity={on ? 0.95 : 0.07}
              className={on && blink ? 'art-blink' : undefined}
            />
            {arrow && on && <path d={`M${x + 22} ${cy} H${x + 40} M${x + 34} ${cy - 6} L${x + 40} ${cy} L${x + 34} ${cy + 6}`} stroke="#0b0b0c" strokeWidth="3" fill="none" strokeLinecap="round" />}
          </g>
        )
      })}
      <g stroke={AQUA} strokeWidth="2" fill="none">
        <path d={`M${x - 14} ${y + 4} v-18 h18 M${x + 58} ${y - 14} h18 v18 M${x + 76} ${y + 160} v18 h-18 M${x + 4} ${y + 178} h-18 v-18`} />
      </g>
      {/* Label pill spans the detection box exactly and is centred on the signal head. */}
      <g transform={`translate(${x - 14} ${y - 50})`}>
        <rect width="90" height="24" rx="12" fill={AQUA} fillOpacity="0.14" stroke={AQUA} strokeOpacity="0.5" />
        <text x="45" y="16.5" textAnchor="middle" fill={AQUA} fontSize="12.5" fontWeight="600" letterSpacing="0.4">
          {label}
        </text>
      </g>
    </g>
  )
  return (
    <Frame id="signal">
      <line x1="0" y1="330" x2={W} y2="330" stroke="#fff" strokeOpacity="0.1" />
      {head(126, 128, 0, 'standard')}
      {head(290, 128, 1, 'flashing', false, true)}
      {head(454, 128, 2, 'directional', true)}
    </Frame>
  )
}

/* ---------- Learning-based MPC: reference vs. tracked trajectory ---------- */
function Wave() {
  const ref: Vec[] = []
  const out: Vec[] = []
  for (let i = 0; i <= 40; i++) {
    const x = 40 + i * 14
    const t = i / 40
    const y = 210 - 92 * Math.sin(t * Math.PI * 3.2) * (0.7 + 0.3 * Math.cos(t * Math.PI))
    ref.push({ x, y })
    out.push({ x, y: y + 7 * Math.sin(t * Math.PI * 9) * Math.exp(-t * 3.2) })
  }
  const refD = openSpline(ref)
  const outD = openSpline(out)
  return (
    <Frame id="wave">
      <g stroke="#fff" strokeOpacity="0.07">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1="40" y1={50 + i * 40} x2="600" y2={50 + i * 40} />
        ))}
      </g>
      <line x1="40" y1="40" x2="40" y2="370" stroke="#fff" strokeOpacity="0.3" />
      <line x1="40" y1="370" x2="600" y2="370" stroke="#fff" strokeOpacity="0.3" />
      <path d={refD} fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.6" strokeDasharray="5 6" />
      <path d={outD} fill="none" stroke={AQUA} strokeWidth="2.4" className="art-draw" pathLength={1} />
      {/* magnifier */}
      <circle cx="96" cy="200" r="44" fill="url(#wave-glow)" />
      <circle cx="96" cy="200" r="40" fill="none" stroke="#fff" strokeOpacity="0.4" />
      <line x1="124" y1="228" x2="146" y2="250" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
    </Frame>
  )
}

const ART: Record<ArtKind, () => ReactNode> = {
  twin: Twin,
  colregs: Colregs,
  stpa: Stpa,
  dubins: Dubins,
  signal: Signal,
  wave: Wave,
}

export default function ProjectArt({ kind }: { kind: ArtKind }) {
  const Art = ART[kind]
  return <Art />
}
