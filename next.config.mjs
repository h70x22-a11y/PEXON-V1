/** @type {import('next').NextConfig} */
// ترويسات حماية لكل صفحات الموقع
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'; upgrade-insecure-requests" },
];

const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // لوحة التحكم ما تنحفظ في ذاكرة المتصفح المؤقتة ولا تظهر في محركات البحث
      { source: '/admin/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }, { key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
  experimental: {
    serverActions: { bodySizeLimit: '4mb' },
  },
  // ضغط صور المنتجات وتصغيرها تلقائياً (WebP) مع تخزينها مؤقتاً لمدة شهر
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
    formats: ['image/webp'],
    deviceSizes: [640, 1080],
    imageSizes: [96, 256, 384],
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
