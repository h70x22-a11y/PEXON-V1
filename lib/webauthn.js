import { createHash, createPublicKey, verify as cryptoVerify } from 'crypto';

// ---------- مفاتيح المرور (WebAuthn / Passkeys): بصمة، Face ID، Touch ID ----------
// تحقق كامل في الخادم بدون مكتبات خارجية: ES256 (أبل وأندرويد) و RS256 (Windows Hello)

export const b64url = (buf) => Buffer.from(buf).toString('base64url');
export const fromB64url = (s) => Buffer.from(String(s || ''), 'base64url');
const sha256 = (b) => createHash('sha256').update(b).digest();

// قارئ CBOR مختصر يكفي لبيانات WebAuthn
function cbor(buf, pos = 0) {
  const ib = buf[pos++];
  const major = ib >> 5;
  let info = ib & 31;
  let len = info;
  if (info === 24) len = buf[pos++];
  else if (info === 25) { len = buf.readUInt16BE(pos); pos += 2; }
  else if (info === 26) { len = buf.readUInt32BE(pos); pos += 4; }
  else if (info === 27) { len = Number(buf.readBigUInt64BE(pos)); pos += 8; }
  switch (major) {
    case 0: return [len, pos];
    case 1: return [-1 - len, pos];
    case 2: return [buf.subarray(pos, pos + len), pos + len];
    case 3: return [buf.subarray(pos, pos + len).toString('utf8'), pos + len];
    case 4: {
      const arr = [];
      for (let i = 0; i < len; i++) { const [v, p] = cbor(buf, pos); arr.push(v); pos = p; }
      return [arr, pos];
    }
    case 5: {
      const map = new Map();
      for (let i = 0; i < len; i++) {
        const [k, p1] = cbor(buf, pos);
        const [v, p2] = cbor(buf, p1);
        map.set(k, v);
        pos = p2;
      }
      return [map, pos];
    }
    case 7: return [info === 20 ? false : info === 21 ? true : null, pos];
    default: throw new Error('cbor');
  }
}

function parseAuthData(ad) {
  const out = { rpIdHash: ad.subarray(0, 32), flags: ad[32], counter: ad.readUInt32BE(33) };
  if (out.flags & 0x40) {
    let p = 37 + 16;
    const idLen = ad.readUInt16BE(p);
    p += 2;
    out.credId = ad.subarray(p, p + idLen);
    p += idLen;
    const [cose] = cbor(ad, p);
    out.cose = cose;
  }
  return out;
}

function coseToJwk(cose) {
  const kty = cose.get(1);
  const alg = cose.get(3);
  if (kty === 2 && alg === -7) return { alg, jwk: { kty: 'EC', crv: 'P-256', x: b64url(cose.get(-2)), y: b64url(cose.get(-3)) } };
  if (kty === 3 && alg === -257) return { alg, jwk: { kty: 'RSA', n: b64url(cose.get(-1)), e: b64url(cose.get(-2)) } };
  throw new Error('نوع المفتاح غير مدعوم.');
}

function checkClient(clientDataJSON, type, challenge, origin) {
  const c = JSON.parse(fromB64url(clientDataJSON).toString('utf8'));
  if (c.type !== type) throw new Error('نوع غير صحيح.');
  if (c.challenge !== challenge) throw new Error('انتهت صلاحية الطلب، حاول مرة ثانية.');
  if (c.origin !== origin) throw new Error('مصدر غير صحيح.');
}

function checkAuthData(a, rpId) {
  if (!a.rpIdHash.equals(sha256(Buffer.from(rpId)))) throw new Error('الموقع غير مطابق.');
  if (!(a.flags & 0x01)) throw new Error('لازم تأكيد من المستخدم.');
  if (!(a.flags & 0x04)) throw new Error('لازم بصمة أو وجه أو رمز الجهاز.');
}

export function verifyRegistration({ response, challenge, origin, rpId }) {
  checkClient(response.clientDataJSON, 'webauthn.create', challenge, origin);
  const [att] = cbor(fromB64url(response.attestationObject));
  const a = parseAuthData(att.get('authData'));
  checkAuthData(a, rpId);
  if (!a.credId || !a.cose) throw new Error('بيانات المفتاح ناقصة.');
  const { alg, jwk } = coseToJwk(a.cose);
  return { id: b64url(a.credId), alg, jwk, counter: a.counter };
}

export function verifyAuthentication({ response, credential, challenge, origin, rpId }) {
  checkClient(response.clientDataJSON, 'webauthn.get', challenge, origin);
  const authData = fromB64url(response.authenticatorData);
  const a = parseAuthData(authData);
  checkAuthData(a, rpId);
  const data = Buffer.concat([authData, sha256(fromB64url(response.clientDataJSON))]);
  const key = createPublicKey({ key: credential.jwk, format: 'jwk' });
  const ok = cryptoVerify('sha256', data, key, fromB64url(response.signature));
  if (!ok) throw new Error('التوقيع غير صحيح.');
  if (a.counter && credential.counter && a.counter <= credential.counter) throw new Error('مفتاح مكرر، تم رفضه.');
  return { counter: a.counter };
}
