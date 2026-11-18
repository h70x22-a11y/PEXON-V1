/** @type {import('next').NextConfig} */
const nextConfig = {
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
