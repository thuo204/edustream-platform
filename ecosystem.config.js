module.exports = {
  apps: [
    {
      name: 'edustream',

      // With output:'standalone', the entry point is .next/standalone/server.js
      script: '.next/standalone/server.js',

      instances: 'max',        // one process per CPU core
      exec_mode: 'cluster',    // load-balance across all instances

      // ── Environment ──────────────────────────────────────────
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },

      // ── Auto-restart behaviour ────────────────────────────────
      watch: false,            // never watch files in production
      max_memory_restart: '500M',
      restart_delay: 3000,
      max_restarts: 10,
      min_uptime: '10s',

      // ── Logs ─────────────────────────────────────────────────
      output: './logs/out.log',
      error:  './logs/err.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
