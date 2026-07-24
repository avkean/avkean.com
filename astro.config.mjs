import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://avkean.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // error page, not content
      filter: (page) => !page.includes('/404'),
    }),
  ],
  build: {
    // external css so the csp needs no unsafe-inline
    inlineStylesheets: 'never',
  },
});
