import { headers } from 'next/headers';
import { randomBytes } from 'crypto';
import { getTemp, setTemp } from '@/lib/db';
import { b64url } from '@/lib/webauthn';

// الموقع اللي ينربط فيه المفتاح (powercore.sa) ومصدره
export async function rp() {
  const h = await headers();
  const host = (h.get('x-forwarded-host') || h.get('host') || 'powercore.sa').split(':')[0];
  const proto = host === 'localhost' ? 'http' : 'https';
  return { rpId: host, origin: `${proto}://${host}${host === 'localhost' ? ':3000' : ''}` };
}

export async function newChallenge(scope, data = {}) {
  const challenge = b64url(randomBytes(32));
  await setTemp(`wa-chal:${challenge}`, { scope, ...data }, 300);
  return challenge;
}

// التحدي يُستخدم مرة وحدة فقط
export async function takeChallenge(challenge, scope) {
  const v = await getTemp(`wa-chal:${challenge}`);
  if (!v || v.scope !== scope) return null;
  await setTemp(`wa-chal:${challenge}`, null);
  return v;
}

export function challengeOf(clientDataJSON) {
  try {
    return JSON.parse(Buffer.from(String(clientDataJSON), 'base64url').toString('utf8')).challenge || '';
  } catch {
    return '';
  }
}
