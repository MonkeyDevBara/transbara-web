import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  // SSR di Cloudflare Pages: perubahan dari /admin langsung tampil tanpa build ulang.
  output: 'server',
  adapter: cloudflare(),
  site: 'https://transbara-wahyu.pages.dev',
  server: { port: 4321 },
  devToolbar: { enabled: false },
  integrations: [preact()],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Argon/Bootstrap 4 masih memakai sintaks Sass lama; sembunyikan peringatan deprecation.
          quietDeps: true,
          silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'slash-div', 'legacy-js-api', 'if-function', 'function-units', 'abs-percent', 'strict-unary'],
        },
      },
    },
  },
});
