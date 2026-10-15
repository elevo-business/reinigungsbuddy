// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Domain wird später gesetzt (SITE_URL in .env bzw. beim Hoster).
const SITE = process.env.SITE_URL || 'https://reinigungs-buddy.de';

// Seiten, die nicht in die Sitemap gehören (noindex). Dazu alle Google-Ads-Landingpages unter /lp/.
const NOINDEX = ['/angebot/danke/', '/en/contact/thanks/', '/leistungsverzeichnis/vorlage/', '/404/'];

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !NOINDEX.some((p) => page.endsWith(p)) && !page.includes('/lp/'),
    }),
  ],
  image: { responsiveStyles: false },
  vite: { plugins: [tailwindcss()] },
});
