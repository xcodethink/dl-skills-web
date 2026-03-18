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
    changefreq: 'weekly',
    lastmod: new Date(),
    serialize(item) {
      // Higher priority for key content pages
      if (item.url.includes('/guides/') || item.url.includes('/blog/')) {
        item.changefreq = 'weekly';
        item.priority = 0.8;
      }
      if (item.url.includes('/faq')) {
        item.changefreq = 'monthly';
        item.priority = 0.7;
      }
      if (item.url === 'https://claudecodeskills.wayjet.io/') {
        item.changefreq = 'daily';
        item.priority = 1.0;
      }
      if (item.url.includes('/guides') && !item.url.includes('/guides/')) {
        item.priority = 0.9;
      }
      if (item.url.includes('/blog') && !item.url.includes('/blog/')) {
        item.priority = 0.9;
      }
      return item;
    },
  })]
});