import { defineConfig, squooshImageService } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
  image: {
    service: squooshImageService(),
  },
	integrations: [mdx(), sitemap()],
});
