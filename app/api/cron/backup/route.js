import { NextResponse } from 'next/server';
import { createBackup } from '@/lib/backup';
import { hitCounter, logActivity } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// تشغّله Vercel Cron يومياً (الساعة 3 الفجر بتوقيت الرياض)
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    if (request.headers.get('authorization') !== `Bearer ${secret}`) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  } else {
    if (!String(request.headers.get('user-agent') || '').includes('vercel-cron')) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    // بدون CRON_SECRET: نسخة وحدة كل 6 ساعات كحد أقصى
    if ((await hitCounter('backup-cron', 6 * 3600)) > 1) return NextResponse.json({ skipped: true });
  }
  try {
    const r = await createBackup('تلقائي (يومي)');
    await logActivity({ userId: 'system', name: 'النظام', section: 'backup', action: 'write', what: `نسخة احتياطية تلقائية (${r.keys} عنصر)` });
    return NextResponse.json({ ok: true, keys: r.keys });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
