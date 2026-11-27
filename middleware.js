import { NextResponse } from 'next/server';
import { getCatalogUrl } from '@/lib/catalogUrl';
import { isOwnBlob } from '@/lib/blobHost';

// يعرض الكتالوج على رابط الموقع نفسه (powercore.sa/catalog.pdf) بدل رابط التخزين
// فقط من مخزن ملفاتنا، ودائماً كملف PDF (ما يشتغل فيه أي كود)
export async function middleware(request) {
  const { pathname, search } = request.nextUrl;
  // نسخة إنجليزية بروابط مستقلة: /en/... تعرض نفس الصفحة بالإنجليزي
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || '/';
    url.search = search;
    const h = new Headers(request.headers);
    h.set('x-pexon-lang', 'en');
    const res = NextResponse.rewrite(url, { request: { headers: h } });
    res.cookies.set('lang', 'en', { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
    return res;
  }
  const catalogUrl = await getCatalogUrl();
  if (catalogUrl && isOwnBlob(catalogUrl) && new URL(catalogUrl).pathname.toLowerCase().endsWith('.pdf')) {
    const res = NextResponse.rewrite(new URL(catalogUrl));
    res.headers.set('Content-Type', 'application/pdf');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    return res;
  }
  return NextResponse.redirect(new URL('/products', request.url));
}

export const config = { matcher: ['/catalog.pdf', '/en', '/en/:path*'] };
