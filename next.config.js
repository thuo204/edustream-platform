/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ─── Images ────────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http',  hostname: '**' },
    ],
    formats: ['image/avif', 'image/webp'],
    // Disables the built-in Image Optimization when you serve via Nginx
    // (Nginx handles caching; Next.js optimises on first request)
    minimumCacheTTL: 60,
  },

  // ─── Compression ───────────────────────────────────────────
  // Let Nginx handle gzip/brotli; disable double-compression
  compress: true,

  // ─── Power / performance ───────────────────────────────────
  poweredByHeader: false,          // removes "X-Powered-By: Next.js"
  generateEtags: true,

  // ─── Security headers ──────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control',   value: 'on' },
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Never cache HTML pages (always fresh)
      {
        source: '/((?!_next/static|_next/image|favicon.ico).*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
    ];
  },

  // ─── Rewrites (optional API proxy) ─────────────────────────
  // Uncomment if your backend is on the SAME server and you want
  // to avoid CORS by proxying /api/* → backend port
  //
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
