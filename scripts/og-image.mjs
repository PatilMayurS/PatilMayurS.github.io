// Renders the social-preview image and PNG icons with headless Chrome, using the
// same geometry as the hero illustration. Run with `npm run og` after changing
// src/content/site.ts. Requires Node 22.18+ (TypeScript imports) and Chrome.
//   CHROME_PATH=/path/to/chrome npm run og
import { execFileSync } from 'node:child_process'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { site } from '../src/content/site.ts'
import { contours, isobath, turningPath } from '../src/lib/geometry.ts'

const chrome = process.env.CHROME_PATH || 'google-chrome'
const pub = fileURLToPath(new URL('../public/', import.meta.url))
// Working files live in the (git-ignored) node_modules cache rather than the OS temp dir.
const work = fileURLToPath(new URL('../node_modules/.cache/portfolio-og/', import.meta.url))
const font = new URL('../public/fonts/inter-latin-opsz-normal.woff2', import.meta.url).href

const MARK = `<svg viewBox="0 0 32 32" width="100%" height="100%"><path d="M7.5 24.5A8.5 8.5 0 0 1 16 16a8.5 8.5 0 0 0 8.5-8.5" fill="none" stroke="#f5f5f7" stroke-width="2.6" stroke-linecap="round"/><circle cx="24.5" cy="7.5" r="3" fill="#5fd4dc"/><circle cx="7.5" cy="24.5" r="2" fill="#f5f5f7"/></svg>`

function chart() {
  const turns = [
    { c: { x: 660, y: 250 }, r: 92, dir: -1 },
    { c: { x: 930, y: 170 }, r: 84, dir: 1 },
    { c: { x: 1080, y: 420 }, r: 88, dir: -1 },
  ]
  const route = turningPath({ x: 380, y: 360 }, turns, { x: 1260, y: 300 })
  const islands = turns.flatMap((t, i) => contours(t.c, t.r * 0.6, 5, 7 + i * 12).map((d, l) => ({ d, o: 0.1 + l * 0.05 })))
  const lines = [isobath(560, -40, 1240, 5, 18), isobath(600, -40, 1240, 9, 14)]
  const grid = []
  for (let x = 100; x < 1200; x += 150) for (let y = 90; y < 630; y += 150) grid.push(`M${x - 4} ${y}h8M${x} ${y - 4}v8`)
  return `<svg viewBox="0 0 1200 630" width="1200" height="630" style="position:absolute;inset:0">
    <defs><linearGradient id="g" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#5fd4dc"/><stop offset="1" stop-color="#8ea6ff"/></linearGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="#5fd4dc" stop-opacity=".45"/><stop offset="1" stop-color="#5fd4dc" stop-opacity="0"/></radialGradient></defs>
    <path d="${grid.join('')}" stroke="#fff" stroke-opacity=".16"/>
    ${lines.map((d) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".07"/>`).join('')}
    ${islands.map((s) => `<path d="${s.d}" fill="none" stroke="#fff" stroke-opacity="${s.o}"/>`).join('')}
    ${turns.map((t) => `<circle cx="${t.c.x}" cy="${t.c.y}" r="${t.r}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-dasharray="3 8"/>`).join('')}
    <path d="${route.d}" fill="none" stroke="url(#g)" stroke-width="3" stroke-linecap="round"/>
    ${route.joints.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#000" stroke="#fff" stroke-opacity=".6" stroke-width="1.5"/>`).join('')}
    <g transform="translate(1004 468) rotate(58)"><circle r="60" fill="url(#glow)"/><ellipse cx="8" rx="40" ry="22" fill="none" stroke="#5fd4dc" stroke-opacity=".6" stroke-dasharray="4 6"/><path d="M12 0 L-9 -8 L-4 0 L-9 8 Z" fill="#fff"/></g>
  </svg>`
}

const page = (w, h, body) => `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face{font-family:Inter;src:url(${font}) format('woff2-variations');font-weight:100 900}
  html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:#000;color:#f5f5f7;font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}
</style></head><body>${body}</body></html>`

const og = page(
  1200,
  630,
  `<div style="position:absolute;inset:0;background:radial-gradient(50% 60% at 78% 32%,rgba(95,212,220,.14),transparent 70%)"></div>
  ${chart()}
  <div style="position:absolute;inset:0;background:linear-gradient(90deg,#000 22%,rgba(0,0,0,.72) 46%,rgba(0,0,0,0) 70%)"></div>
  <div style="position:absolute;left:72px;top:64px;display:flex;align-items:center;gap:14px;font-size:24px;font-weight:600;letter-spacing:-.02em">
    <span style="width:34px;height:34px;display:inline-block">${MARK}</span>${site.shortName}
  </div>
  <div style="position:absolute;left:72px;bottom:72px;width:760px">
    <div style="font-size:24px;font-weight:600;color:#a1a1a6;letter-spacing:-.01em">Ph.D. Candidate · Mechanical Engineering · Texas A&amp;M University</div>
    <div style="margin-top:14px;font-size:124px;line-height:.92;font-weight:650;letter-spacing:-.05em">${site.shortName}</div>
    <div style="margin-top:26px;font-size:40px;line-height:1.12;font-weight:600;letter-spacing:-.03em;max-width:700px">
      <span style="background:linear-gradient(100deg,#5fd4dc,#8ea6ff);-webkit-background-clip:text;color:transparent">Engineering safe navigation</span> for autonomous systems.
    </div>
  </div>`,
)

const icon = (size) =>
  page(size, size, `<div style="position:absolute;inset:0;display:grid;place-items:center"><div style="width:${size * 0.62}px;height:${size * 0.62}px">${MARK}</div></div>`)

async function shot(html, w, h, out) {
  const dir = join(work, String(w))
  await mkdir(dir, { recursive: true })
  const file = join(dir, 'page.html')
  await writeFile(file, html)
  try {
    execFileSync(chrome, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      `--user-data-dir=${join(dir, 'profile')}`,
      `--window-size=${w},${h}`,
      '--force-device-scale-factor=1',
      '--virtual-time-budget=3000',
      `--screenshot=${out}`,
      `file://${file}`,
    ], { stdio: 'pipe' })
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
  console.log(`og: wrote ${out.replace(pub, 'public/')}`)
}

await shot(og, 1200, 630, join(pub, 'og-image.png'))
await shot(icon(180), 180, 180, join(pub, 'apple-touch-icon.png'))
await shot(icon(32), 32, 32, join(pub, 'favicon-32.png'))
