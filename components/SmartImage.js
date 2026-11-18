import Image from 'next/image';

// صور المنتجات المحفوظة في تخزين الموقع تُضغط وتُصغّر تلقائياً،
// وأي رابط خارجي آخر يظهر كما هو
const OPTIMIZABLE = /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//i;

export default function SmartImage({ src, alt, sizes, priority = false, fit = 'cover' }) {
  if (!src) return null;
  if (OPTIMIZABLE.test(src)) {
    return <Image src={src} alt={alt || ''} fill sizes={sizes} priority={priority} quality={75} style={{ objectFit: fit }} />;
  }
  return <img src={src} alt={alt || ''} loading={priority ? 'eager' : 'lazy'} decoding="async" style={{ width: '100%', height: '100%', objectFit: fit }} />;
}
