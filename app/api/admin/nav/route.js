import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { NAV_KEYS, recordNavUse } from '@/lib/db';

export const dynamic = 'force-dynamic';

// يسجل فتح قسم في لوحة التحكم عشان تترتب القائمة حسب استخدام كل شخص
export async function POST(request) {
  const s = await getSession();
  if (!s || s.mustChange) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { key } = await request.json().catch(() => ({}));
  if (!NAV_KEYS.includes(key)) return NextResponse.json({ error: 'bad' }, { status: 400 });
  await recordNavUse(s.id, key);
  return NextResponse.json({ ok: true });
}
