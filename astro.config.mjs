import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://avkean.com',
  build: {
    // external css so the csp needs no unsafe-inline
    inlineStylesheets: 'never',
  },
});
