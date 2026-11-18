import { NextResponse } from 'next/server';
import { clientIp, setSession } from '@/lib/auth';
import { getPasskeys, getUsers, hitCounter, logActivity, passkeyOwner, savePasskeys } from '@/lib/db';
import { verifyAuthentication } from '@/lib/webauthn';
import { challengeOf, newChallenge, rp, takeChallenge } from '@/lib/passkeyServer';

export const dynamic = 'force-dynamic';

// GET: تحدي جديد لتسجيل الدخول بالبصمة أو الوجه
export async function GET() {
  const ip = await clientIp();
  if ((await hitCounter(`wa-opt:${ip}`, 300)) > 30) return NextResponse.json({ error: 'rate' }, { status: 429 });
  const { rpId } = await rp();
  return NextResponse.json({ challenge: await newChallenge('login'), rpId, userVerification: 'required', timeout: 120000 });
}

// POST: التحقق من توقيع الجهاز وفتح الجلسة
export async function POST(request) {
  const ip = await clientIp();
  if ((await hitCounter(`wa-fail:${ip}`, 300)) > 20) return NextResponse.json({ error: 'محاولات كثيرة، حاول بعد 5 دقائق.' }, { status: 429 });
  const body = await request.json().catch(() => ({}));
  const resp = body?.response || {};
  const challenge = challengeOf(resp.clientDataJSON);
  if (!(await takeChallenge(challenge, 'login'))) return NextResponse.json({ error: 'انتهت صلاحية الطلب، حاول مرة ثانية.' }, { status: 400 });
  const credId = String(body?.id || '');
  const userId = await passkeyOwner(credId);
  if (!userId) return NextResponse.json({ error: 'هذا المفتاح غير مسجّل. سجّل دخولك بكلمة المرور وأضفه من صفحة حسابي.' }, { status: 400 });
  const list = await getPasskeys(userId);
  const cred = list.find((k) => k.id === credId);
  if (!cred) return NextResponse.json({ error: 'هذا المفتاح غير مسجّل.' }, { status: 400 });
  let version = '1';
  let name = 'المالك';
  if (userId !== 'owner') {
    const user = (await getUsers()).find((u) => u.id === userId);
    if (!user || !user.active) return NextResponse.json({ error: 'الحساب موقوف.' }, { status: 403 });
    version = String(user.sessionVersion);
    name = user.name;
  }
  try {
    const { rpId, origin } = await rp();
    const r = verifyAuthentication({ response: resp, credential: cred, challenge, origin, rpId });
    cred.counter = r.counter;
    cred.lastUsed = new Date().toISOString();
    await savePasskeys(userId, list);
  } catch (e) {
    await logActivity({ userId, name, section: 'login', action: 'fail', what: 'محاولة دخول بالبصمة/الوجه فاشلة', ip });
    return NextResponse.json({ error: e.message || 'تعذر التحقق.' }, { status: 400 });
  }
  await setSession(userId, version);
  await logActivity({ userId, name, section: 'login', action: 'login', what: `تسجيل دخول بالبصمة/الوجه (${cred.name})`, ip });
  return NextResponse.json({ ok: true, redirect: '/admin' });
}
