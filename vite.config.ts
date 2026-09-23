import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { site } from './src/content/site.ts'

/**
 * GitHub Pages configuration.
 *
 * BASE_PATH — URL path the site is served from. "/" for a user site
 *             (<username>.github.io); "/<repo>/" for a project site.
 * SITE_URL  — absolute site URL (e.g. https://<username>.github.io). Used for
 *             canonical, Open Graph and sitemap URLs. When unset (local builds)
 *             those absolute-URL tags are simply omitted.
 *
 * The GitHub Actions workflow fills both from actions/configure-pages.
 */
const base = `/${(process.env.BASE_PATH ?? '/').replace(/^\/+|\/+$/g, '')}/`.replace(/\/+/g, '/')
const siteUrl = process.env.SITE_URL?.trim().replace(/\/+$/, '') || undefined

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function seo(): Plugin {
  let ssr = false
  return {
    name: 'portfolio-seo',
    configResolved(config) {
      ssr = Boolean(config.build.ssr)
    },
    transformIndexHtml(html) {
      if (!html.includes('<!--seo-->')) return html
      const { seo: s } = site
      const pageUrl = siteUrl ? `${siteUrl}/` : undefined
      const image = siteUrl ? `${siteUrl}/og-image.png` : undefined
      const person = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: site.name,
        givenName: site.firstName,
        familyName: site.lastName,
        jobTitle: site.role,
        affiliation: { '@type': 'CollegeOrUniversity', name: site.affiliation },
        alumniOf: s.alumniOf.map((name) => ({ '@type': 'EducationalOrganization', name })),
        email: `mailto:${site.email}`,
        knowsAbout: s.keywords,
        sameAs: [site.linkedin.url],
        ...(pageUrl ? { url: pageUrl, image } : {}),
      }
      const tags = [
        `<title>${esc(s.title)}</title>`,
        `<meta name="description" content="${esc(s.description)}" />`,
        `<meta name="author" content="${esc(site.name)}" />`,
        pageUrl && `<link rel="canonical" href="${pageUrl}" />`,
        `<meta property="og:type" content="profile" />`,
        `<meta property="profile:first_name" content="${esc(site.firstName)}" />`,
        `<meta property="profile:last_name" content="${esc(site.lastName)}" />`,
        `<meta property="og:site_name" content="${esc(site.name)}" />`,
        `<meta property="og:locale" content="en_US" />`,
        `<meta property="og:title" content="${esc(s.title)}" />`,
        `<meta property="og:description" content="${esc(s.description)}" />`,
        pageUrl && `<meta property="og:url" content="${pageUrl}" />`,
        image && `<meta property="og:image" content="${image}" />`,
        image && `<meta property="og:image:width" content="1200" />`,
        image && `<meta property="og:image:height" content="630" />`,
        image && `<meta property="og:image:alt" content="${esc(s.ogImageAlt)}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${esc(s.title)}" />`,
        `<meta name="twitter:description" content="${esc(s.description)}" />`,
        image && `<meta name="twitter:image" content="${image}" />`,
        image && `<meta name="twitter:image:alt" content="${esc(s.ogImageAlt)}" />`,
        `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>`,
      ]
      return html.replace('<!--seo-->', tags.filter(Boolean).join('\n    '))
    },
    generateBundle() {
      if (ssr) return
      const robots = ['User-agent: *', 'Allow: /', siteUrl && `Sitemap: ${siteUrl}/sitemap.xml`].filter(Boolean).join('\n')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots}\n` })
      if (siteUrl) {
        const today = new Date().toISOString().slice(0, 10)
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`,
        })
      }
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), seo()],
  define: {
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
  build: {
    rollupOptions: {
      input: { main: 'index.html', notFound: '404.html' },
    },
  },
})
