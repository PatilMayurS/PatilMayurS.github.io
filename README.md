# Mayur Shivaji Patil — Portfolio

A fast, static personal website built from my résumé. React + TypeScript + Vite + Tailwind CSS, prerendered at build time and deployed to GitHub Pages with GitHub Actions.

- **One page, eight sections** — Hero, About, Experience, Projects, Skills, Education, Recognition (publications, talks, honors), Contact.
- **Static**: no backend, no API calls, no client-side router. Works at `https://<username>.github.io` or at a project path such as `https://<username>.github.io/<repo>/`.
- **Prerendered HTML**: the full page is rendered to static markup during the build, then hydrated. The content shows up before any JavaScript runs, and search engines and link previews can read it.
- **Accessible**: semantic landmarks and headings, a skip link, visible focus rings, a keyboard-operable mobile menu (focus containment, Escape to close), and `prefers-reduced-motion` support everywhere.

---

## Quick start

Requires **Node.js 20.19+** (22 or 24 recommended; `.nvmrc` pins 24).

**No Node on this machine?** A Linux x64 copy of Node 24 lives in `.node/`. It's git-ignored because the binary is too large for GitHub. `./dev.sh` uses it automatically: `./dev.sh install`, `./dev.sh` (dev server), `./dev.sh build`, `./dev.sh preview`.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command             | What it does                                                              |
| ------------------- | ------------------------------------------------------------------------- |
| `npm run dev`       | Dev server with hot reload                                                |
| `npm run build`     | Type-check, build the client, prerender the HTML → `dist/`                |
| `npm run preview`   | Serve `dist/` locally, the way GitHub Pages will serve it (port 4173)     |
| `npm run typecheck` | TypeScript only                                                           |
| `npm run lint`      | oxlint                                                                    |
| `npm run og`        | Regenerate `public/og-image.png` and the PNG icons (needs Chrome, below)  |

---

## Editing content

All copy lives in two files. The components only render what's in them.

| File                       | Contains                                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| `src/content/site.ts`      | Name, role, email, LinkedIn, SEO title/description, keywords (also used for meta tags)   |
| `src/content/profile.ts`   | Hero, About, Experience, Teaching, Projects, Skills, Education, Publications, Talks, Honors |

The content comes from the résumé (`main2.tex`). Some things are left out on purpose: the street address, the phone number, and anything commented out in the LaTeX source.

**Adding links** (GitHub, Google Scholar, a paper DOI, etc.): put the URL in `site.ts`, then render it in `Contact.tsx` / `Footer.tsx`. Add it to `sameAs` in `vite.config.ts` too, so it lands in the structured data.

**Adding a résumé PDF**: drop a copy into `public/` and link to it. Remove the home address and phone number first. The current `.tex` source includes both.

---

## Deploying to `https://<username>.github.io`

1. **Create the repository** on GitHub, named exactly `<username>.github.io` (public).

2. **Push this folder** as the repository root:

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<username>/<username>.github.io.git
   git push -u origin main
   ```

3. **Turn on Pages via Actions**: repository **Settings → Pages → Build and deployment → Source: _GitHub Actions_**.

4. The **Deploy to GitHub Pages** workflow (`.github/workflows/deploy.yml`) runs on every push to `main`. You can also run it by hand from the **Actions** tab. When it finishes, the site is live at `https://<username>.github.io`.

### How the base path and URLs are resolved

The workflow calls `actions/configure-pages` and passes two values to the build:

| Variable    | User site (`<username>.github.io`) | Project site (`<repo>`)                 |
| ----------- | ---------------------------------- | --------------------------------------- |
| `BASE_PATH` | `/`                                | `/<repo>/`                              |
| `SITE_URL`  | `https://<username>.github.io`     | `https://<username>.github.io/<repo>`   |

`BASE_PATH` becomes Vite's `base`, so every script, stylesheet, font, and icon URL resolves correctly. `SITE_URL` fills in the canonical URL, the `og:url` / `og:image` / `twitter:image` tags, and `sitemap.xml`. Custom domains work too: set one under **Settings → Pages** and the next deploy picks it up.

To build a project-site variant locally:

```bash
BASE_PATH=/portfolio/ SITE_URL=https://<username>.github.io/portfolio npm run build
npm run preview
```

### Routing

It's a single page with in-page anchors (`#about`, `#experience`, …), so there are no client routes for GitHub Pages to break. Any unknown URL gets the styled `404.html`, which links back home.

---

## How the build works

```
tsc -b                                     # type-check
vite build                                 # client bundle + index.html + 404.html
vite build --ssr src/entry-server.tsx      # tiny server bundle used only at build time
node scripts/prerender.mjs                 # renderToString(<App/>) → dist/index.html
```

- The SEO plugin in `vite.config.ts` builds the `<title>`, description, Open Graph, Twitter card, and JSON-LD `Person` metadata from `src/content/site.ts`. It also writes `robots.txt` (and `sitemap.xml` when `SITE_URL` is set).
- `src/main.tsx` hydrates the prerendered markup. In `npm run dev` it renders on the client instead.
- Scroll reveals only hide content once JavaScript has added `html.js`, so the page is never blank without JS.

### Social image and icons

`npm run og` renders `public/og-image.png` (1200×630), `apple-touch-icon.png`, and `favicon-32.png` with headless Chrome. It uses the same geometry code as the hero illustration. Re-run it after you change your name or title. If Chrome isn't on your `PATH` as `google-chrome`, set `CHROME_PATH=/path/to/chrome`.

---

## Project structure

```
.github/workflows/deploy.yml   GitHub Pages CI/CD
index.html                     HTML shell (SEO tags injected at build)
404.html                       Not-found page
public/                        favicon, OG image, self-hosted Inter font (+ OFL license)
scripts/prerender.mjs          Build-time static rendering
scripts/og-image.mjs           Social image + icon generator
src/content/                   ← all site copy (edit here)
src/components/                Sections, illustrations, UI primitives
src/hooks/motion.ts            Scroll reveal, scroll progress, reduced motion
src/lib/geometry.ts            Curvature-constrained paths & chart contours for the art
src/index.css                  Tailwind v4 theme tokens, type scale, component styles
```

## Design notes

- **Palette**: near-black and white with warm and cool grays, plus one accent family (teal on light, aqua→iris on dark). Text contrast meets WCAG AA throughout.
- **Type**: Inter Variable with optical sizing, self-hosted and preloaded. The fallback font is metric-matched to cut layout shift.
- **Motion**: CSS transitions and a small amount of `requestAnimationFrame` work that writes CSS variables. No animation library. The hero vessel animation pauses when off-screen, and everything decorative turns off under `prefers-reduced-motion`.
- **Illustrations**: the hero shows a stylised nautical chart. The vessel follows a curvature-constrained route (minimum-radius arcs joined by tangents) around islands drawn as depth contours. The project art is abstract line work. Placeholders stand in for real screenshots, which the résumé doesn't include; swap in images in `ProjectArt.tsx` if you have them.

## Licenses

Code: yours. Inter is © The Inter Project Authors under the SIL Open Font License 1.1 (`public/fonts/Inter-OFL.txt`).
