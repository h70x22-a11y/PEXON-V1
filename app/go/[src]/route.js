import { NextResponse } from 'next/server';
import { TRACK_KEYS } from '@/lib/trackLinks';

// رابط تتبع قصير: يحوّل للموقع مع مصدر الزيارة
export async function GET(request, { params }) {
  const { src } = await params;
  const key = String(src || '').toLowerCase();
  const url = new URL('/', request.url);
  if (TRACK_KEYS.has(key)) {
    url.searchParams.set('utm_source', key);
    url.searchParams.set('utm_medium', key === 'qr' ? 'print' : 'social');
  }
  return NextResponse.redirect(url, 302);
}
