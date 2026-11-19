import { NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'crypto';
import { createBackup } from '@/lib/backup';
import { applyRetention } from '@/lib/retention';
import { hitCounter, logActivity } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// تشغّله Vercel Cron يومياً (الساعة 3 الفجر بتوقيت الرياض)
export async function GET(request) {
  // لازم CRON_SECRET في Vercel: Vercel يرسله تلقائياً مع التشغيل اليومي، وأي طلب ثاني ينرفض
  const secret = String(process.env.CRON_SECRET || '');
  const got = String(request.headers.get('authorization') || '');
  const want = `Bearer ${secret}`;
  const a = createHash('sha256').update(got).digest();
  const b = createHash('sha256').update(want).digest();
  if (secret.length < 16 || !timingSafeEqual(a, b)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  // حتى مع المفتاح: نسخة وحدة كل 6 ساعات كحد أقصى
  if ((await hitCounter('backup-cron', 6 * 3600)) > 1) return NextResponse.json({ skipped: true });
  try {
    const r = await createBackup('تلقائي (يومي)');
    await logActivity({ userId: 'system', name: 'النظام', section: 'backup', action: 'write', what: `نسخة احتياطية تلقائية (${r.keys} عنصر)` });
    // بعد النسخة الاحتياطية: حذف البيانات اللي انتهت مدة الاحتفاظ بها
    const removed = await applyRetention();
    return NextResponse.json({ ok: true, keys: r.keys, removed });
  } catch (e) {
    console.error('backup cron failed', e);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
