// PM2: pm2 start deploy/ecosystem.config.cjs && pm2 save
// Jalankan dari root repo setelah `npm ci && npm run build`.
module.exports = {
  apps: [
    {
      name: 'transbara-web',
      script: './dist/server/entry.mjs',
      cwd: __dirname + '/..',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: '4321',
      },
    },
  ],
};
