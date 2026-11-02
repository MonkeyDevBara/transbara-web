import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import preact from '@astrojs/preact';
import node from '@astrojs/node';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

export default defineConfig({
  // SSR di VPS (Node standalone, di belakang Nginx): halaman publik dibuat saat diakses,
  // jadi perubahan dari /admin langsung tampil tanpa build ulang. /admin tetap file statis.
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  // URL publik situs (opsional). Bila kosong, Astro memakai origin dari request.
  site: env.PUBLIC_SITE_URL || undefined,
  // Server mendengarkan hanya di localhost; Nginx yang terbuka ke publik.
  // Bisa ditimpa saat runtime lewat variabel HOST dan PORT.
  server: { host: '127.0.0.1', port: 4321 },
  devToolbar: { enabled: false },
  integrations: [preact()],
  vite: {
    css: { preprocessorOptions: { scss: { quietDeps: true } } },
  },
});
