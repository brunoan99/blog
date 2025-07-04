import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.brunoan.dev',
  integrations: [mdx(), sitemap()],
  viewTransitions: true,
});
