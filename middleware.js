import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/db';

// يعرض الكتالوج على رابط الموقع نفسه (powercore.sa/catalog.pdf) بدل رابط التخزين
export async function middleware(request) {
  const { catalogUrl } = await getSettings();
  try {
    const u = new URL(catalogUrl);
    if (u.protocol === 'https:' && u.hostname.endsWith('.public.blob.vercel-storage.com')) {
      return NextResponse.rewrite(u);
    }
  } catch {}
  return NextResponse.redirect(new URL('/products', request.url));
}

export const config = { matcher: ['/catalog.pdf'] };
