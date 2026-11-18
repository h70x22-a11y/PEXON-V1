import { createHmac, randomBytes } from 'crypto';

// رموز التحقق المؤقتة (TOTP) المتوافقة مع Google Authenticator و Microsoft Authenticator
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function base32Encode(buf) {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const b of buf) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += ALPHA[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += ALPHA[(value << (5 - bits)) & 31];
  return out;
}

export function base32Decode(str) {
  const clean = String(str).toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0;
  let value = 0;
  const out = [];
  for (const c of clean) {
    value = (value << 5) | ALPHA.indexOf(c);
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

export const newSecret = () => base32Encode(randomBytes(20));

function hotp(secret, counter) {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const h = createHmac('sha1', base32Decode(secret)).update(buf).digest();
  const o = h[h.length - 1] & 15;
  const n = ((h[o] & 127) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
  return String(n % 1_000_000).padStart(6, '0');
}

// يقبل الرمز الحالي والرمز اللي قبله واللي بعده (فرق ساعة الجوال)
export function verifyTotp(secret, code) {
  const c = String(code || '').replace(/\D/g, '');
  if (c.length !== 6 || !secret) return false;
  const step = Math.floor(Date.now() / 30000);
  return [-1, 0, 1].some((d) => hotp(secret, step + d) === c);
}

export function otpauthUrl(secret, account) {
  return `otpauth://totp/${encodeURIComponent(`PEXON:${account}`)}?secret=${secret}&issuer=PEXON&algorithm=SHA1&digits=6&period=30`;
}

export function recoveryCodes(n = 8) {
  return Array.from({ length: n }, () => randomBytes(5).toString('hex').toUpperCase().replace(/(.{5})/, '$1-'));
}
