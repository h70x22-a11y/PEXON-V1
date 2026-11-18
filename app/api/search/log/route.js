import { NextResponse } from 'next/server';
import { clientIp } from '@/lib/auth';
import { hitCounter } from '@/lib/db';
import { logSearch } from '@/lib/searchLog';

// يستقبل كلمات البحث من مربع البحث (لما يختار العميل اقتراح أو يطلع بدون نتيجة)
export async function POST(request) {
  try {
    const ip = await clientIp();
    if ((await hitCounter(`search-log:${ip}`, 3600)) > 120) return new NextResponse(null, { status: 204 });
    const body = await request.text();
    const q = String(JSON.parse(body || '{}').q || '').slice(0, 80);
    await logSearch(q, ip);
  } catch {}
  return new NextResponse(null, { status: 204 });
}
