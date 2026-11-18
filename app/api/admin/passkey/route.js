import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { clientIp } from '@/lib/auth';
import { getPasskeys, logActivity, savePasskeys, setPasskeyOwner } from '@/lib/db';
import { b64url, verifyRegistration } from '@/lib/webauthn';
import { challengeOf, newChallenge, rp, takeChallenge } from '@/lib/passkeyServer';

export const dynamic = 'force-dynamic';

// GET: خيارات تسجيل مفتاح جديد للمستخدم الحالي
export async function GET() {
  const s = await getSession();
  if (!s || s.mustChange) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { rpId } = await rp();
  const existing = await getPasskeys(s.id);
  const challenge = await newChallenge('register', { userId: s.id });
  return NextResponse.json({
    challenge,
    rp: { name: 'PEXON', id: rpId },
    user: { id: b64url(Buffer.from(s.id)), name: s.username, displayName: s.name },
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 },
      { type: 'public-key', alg: -257 },
    ],
    authenticatorSelection: { residentKey: 'required', requireResidentKey: true, userVerification: 'required' },
    excludeCredentials: existing.map((k) => ({ type: 'public-key', id: k.id })),
    attestation: 'none',
    timeout: 120000,
  });
}

// POST: حفظ المفتاح بعد ما يأكد الجهاز بالبصمة أو الوجه
export async function POST(request) {
  const s = await getSession();
  if (!s || s.mustChange) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const resp = body?.response || {};
  const challenge = challengeOf(resp.clientDataJSON);
  const ch = await takeChallenge(challenge, 'register');
  if (!ch || ch.userId !== s.id) return NextResponse.json({ error: 'انتهت صلاحية الطلب، حاول مرة ثانية.' }, { status: 400 });
  try {
    const { rpId, origin } = await rp();
    const cred = verifyRegistration({ response: resp, challenge, origin, rpId });
    const list = await getPasskeys(s.id);
    const name = String(body?.name || '').trim().slice(0, 40) || 'جهاز';
    list.push({ ...cred, name, created: new Date().toISOString(), lastUsed: '' });
    await savePasskeys(s.id, list);
    await setPasskeyOwner(cred.id, s.id);
    await logActivity({ userId: s.id, name: s.name, section: 'security', action: 'write', what: `إضافة مفتاح مرور (بصمة/وجه): ${name}`, ip: await clientIp() });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'تعذر التسجيل.' }, { status: 400 });
  }
}
