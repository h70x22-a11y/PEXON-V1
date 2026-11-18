import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { setSeenAt } from '@/lib/db';
import { buildNotifications, chatUnreadTotal } from '@/lib/notify';

export const dynamic = 'force-dynamic';

export async function GET() {
  const s = await getSession();
  if (!s || s.mustChange || !s.termsOk) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const [n, chats] = await Promise.all([buildNotifications(s), chatUnreadTotal(s)]);
  return NextResponse.json({ ...n, chats }, { headers: { 'Cache-Control': 'no-store' } });
}

// تعليم كل التنبيهات كمقروءة
export async function POST() {
  const s = await getSession();
  if (!s || s.mustChange || !s.termsOk) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  await setSeenAt(s.id, new Date().toISOString());
  return NextResponse.json({ ok: true });
}
