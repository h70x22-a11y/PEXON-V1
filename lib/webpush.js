// إرسال إشعار Web Push بدون مكتبات خارجية (RFC 8291 تشفير + RFC 8292 VAPID)
import { createECDH, createPrivateKey, generateKeyPairSync, hkdfSync, randomBytes, createCipheriv, sign } from 'crypto';

const b64u = (buf) => Buffer.from(buf).toString('base64url');
const unb64u = (s) => Buffer.from(String(s), 'base64url');

export function newVapidKeys() {
  const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
  const jwk = privateKey.export({ format: 'jwk' });
  const pub = Buffer.concat([Buffer.from([4]), unb64u(jwk.x), unb64u(jwk.y)]);
  return { publicKey: b64u(pub), jwk };
}

function vapidHeader(endpoint, keys, subject) {
  const aud = new URL(endpoint).origin;
  const head = b64u(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  const body = b64u(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: subject }));
  const key = createPrivateKey({ key: keys.jwk, format: 'jwk' });
  const sig = sign('sha256', Buffer.from(`${head}.${body}`), { key, dsaEncoding: 'ieee-p1363' });
  return `vapid t=${head}.${body}.${b64u(sig)}, k=${keys.publicKey}`;
}

export function encryptPayload(sub, payload) {
  const uaPublic = unb64u(sub.keys.p256dh);
  const auth = unb64u(sub.keys.auth);
  const ecdh = createECDH('prime256v1');
  const asPublic = ecdh.generateKeys();
  const shared = ecdh.computeSecret(uaPublic);
  const keyInfo = Buffer.concat([Buffer.from('WebPush: info\0'), uaPublic, asPublic]);
  const ikm = Buffer.from(hkdfSync('sha256', shared, auth, keyInfo, 32));
  const salt = randomBytes(16);
  const cek = Buffer.from(hkdfSync('sha256', ikm, salt, Buffer.from('Content-Encoding: aes128gcm\0'), 16));
  const nonce = Buffer.from(hkdfSync('sha256', ikm, salt, Buffer.from('Content-Encoding: nonce\0'), 12));
  const c = createCipheriv('aes-128-gcm', cek, nonce);
  const enc = Buffer.concat([c.update(Buffer.concat([Buffer.from(payload), Buffer.from([2])])), c.final(), c.getAuthTag()]);
  const rs = Buffer.alloc(4);
  rs.writeUInt32BE(4096);
  return Buffer.concat([salt, rs, Buffer.from([asPublic.length]), asPublic, enc]);
}

// يرجع رقم الحالة من خدمة الإشعارات (201 = تم، 404/410 = الاشتراك انتهى)
export async function sendWebPush(sub, data, keys, subject = 'mailto:info@powercore.sa') {
  const body = encryptPayload(sub, JSON.stringify(data));
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(sub.endpoint, {
      method: 'POST',
      headers: {
        Authorization: vapidHeader(sub.endpoint, keys, subject),
        'Content-Encoding': 'aes128gcm',
        'Content-Type': 'application/octet-stream',
        TTL: '86400',
        Urgency: 'high',
      },
      body,
      signal: ctrl.signal,
    });
    return res.status;
  } catch {
    return 0;
  } finally {
    clearTimeout(timer);
  }
}
