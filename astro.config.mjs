// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://claudecodeskills.wayjet.io',
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js']
      }
    }
  },

  integrations: [preact(), sitemap({
    filter: (page) => !page.includes(process.env.CONSOLE_PATH || 'console'),
  })]
});