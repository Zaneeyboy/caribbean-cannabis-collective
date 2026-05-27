import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable the 'use cache' directive and cacheTag/cacheLife APIs (Next.js 15+)
  cacheComponents: true,
  images: {
    // Cloudflare Images CDN delivers its own resized/optimised variants —
    // mark it unoptimized so Next.js doesn't double-process the URL.
    // placehold.co is only used during development with placeholder images.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    // All images go through Cloudflare Images CDN — CF handles optimization, resizing, and format conversion
    unoptimized: true,
  },
  async headers() {
    return [
      // Security headers on all routes
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Static assets — immutable for 7 days (fonts, local images)
      {
        source: '/(.*)\\.(png|jpg|jpeg|webp|avif|svg|ico|woff2|woff|ttf)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400, immutable' }],
      },
      // Home page — 1 min edge cache, serve stale for 1 hr
      {
        source: '/',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=3600' }],
      },
      // Static content pages — 1 hr edge cache, serve stale for 24 hrs
      {
        source: '/(about|shipping|faq|privacy|terms)',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' }],
      },
      // Contact — short cache (form may show dynamic state)
      {
        source: '/contact',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=3600' }],
      },
      // Shop listing — 5 min edge cache, 24 hr stale
      {
        source: '/shop',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=86400' }],
      },
      // Product pages — 5 min edge cache, 24 hr stale
      {
        source: '/shop/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=86400' }],
      },
      // API routes — never cache (checkout, webhooks, uploads)
      {
        source: '/api/(.*)',
        headers: [{ key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' }],
      },
      // Admin — auth-protected, always fresh
      {
        source: '/admin(.*)',
        headers: [{ key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' }],
      },
      // Account — personalized, never cache
      {
        source: '/account(.*)',
        headers: [{ key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' }],
      },
    ];
  },
};

export default nextConfig;
