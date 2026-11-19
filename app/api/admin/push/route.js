import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hitCounter, removePushSub } from '@/lib/db';
import { pushToUser, subId, subscribe, vapidKeys } from '@/lib/push';

export const dynamic = 'force-dynamic';

async function session() {
  const s = await getSession();
  return s && !s.mustChange ? s : null;
}

// المفتاح العام اللي يحتاجه الجوال للاشتراك
export async function GET() {
  if (!(await session())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { publicKey } = await vapidKeys();
  return NextResponse.json({ publicKey });
}

// اشتراك الجهاز أو إرسال إشعار تجريبي
export async function POST(request) {
  const s = await session();
  if (!s) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  try {
    if (body?.test) {
      if ((await hitCounter(`push-test:${s.id}`, 600)) > 10) return NextResponse.json({ error: 'limit' }, { status: 429 });
      const sent = await pushToUser(s.id, { title: 'PEXON', body: `أهلاً ${s.name}، الإشعارات شغالة ✅`, url: '/admin' });
      return NextResponse.json({ ok: sent > 0, sent });
    }
    await subscribe(s.id, body?.subscription);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 400 });
  }
}

// إلغاء الإشعارات على هذا الجهاز
export async function DELETE(request) {
  const s = await session();
  if (!s) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  if (body?.endpoint) await removePushSub(s.id, subId(body.endpoint)).catch(() => {});
  return NextResponse.json({ ok: true });
}
