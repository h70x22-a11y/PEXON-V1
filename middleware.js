import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/db';
import { isOwnBlob } from '@/lib/blobHost';

// يعرض الكتالوج على رابط الموقع نفسه (powercore.sa/catalog.pdf) بدل رابط التخزين
// فقط من مخزن ملفاتنا، ودائماً كملف PDF (ما يشتغل فيه أي كود)
export async function middleware(request) {
  const { catalogUrl } = await getSettings();
  if (isOwnBlob(catalogUrl) && new URL(catalogUrl).pathname.toLowerCase().endsWith('.pdf')) {
    const res = NextResponse.rewrite(new URL(catalogUrl));
    res.headers.set('Content-Type', 'application/pdf');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    return res;
  }
  return NextResponse.redirect(new URL('/products', request.url));
}

export const config = { matcher: ['/catalog.pdf'] };
