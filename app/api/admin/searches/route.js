import { NextResponse } from 'next/server';
import { can, getSession } from '@/lib/auth';
import { getNotSoldApproved, getSearchDaily } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const s = await getSession();
  if (!s || s.mustChange || !s.termsOk || !can(s, 'searches')) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const n = Number(new URL(request.url).searchParams.get('days'));
  const days = [1, 7, 30, 90, 365].includes(n) ? n : 30;
  // اليوم الواحد نعرضه مع آخر 7 أيام عشان يكون للخط معنى
  return NextResponse.json({ series: await getSearchDaily(Math.max(days, 7), await getNotSoldApproved()) }, { headers: { 'Cache-Control': 'no-store' } });
}
