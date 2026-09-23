// Build step: render <App /> to static HTML and inject it into dist/index.html,
// so the page paints (and is crawlable) before any JavaScript runs.
// The client bundle then hydrates the markup (see src/main.tsx).
import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const indexPath = `${root}dist/index.html`
const serverDir = `${root}dist-ssr`

const { render } = await import(pathToFileURL(`${serverDir}/entry-server.js`).href)
const template = await readFile(indexPath, 'utf8')

if (!template.includes('<!--app-html-->')) {
  throw new Error('prerender: <!--app-html--> placeholder not found in dist/index.html')
}

await writeFile(indexPath, template.replace('<!--app-html-->', render()))
await rm(serverDir, { recursive: true, force: true })
console.log('prerender: wrote dist/index.html')
