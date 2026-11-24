import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { can, getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// يمسح النسخة المؤقتة من بيانات قوقل عشان تنسحب من جديد
export async function POST() {
  const s = await getSession();
  if (!s || s.mustChange || !can(s, 'searches')) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  revalidateTag('gsc');
  return NextResponse.json({ ok: true });
}
