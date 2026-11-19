import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { dumpDatabase } from '@/lib/db';

// النسخة الاحتياطية مشفّرة (AES-256-GCM) قبل رفعها، فحتى لو تسرّب رابط الملف ما ينقرأ
// المفتاح من BACKUP_KEY. النسخ القديمة (قبل إضافته) تنفتح بالمفتاح القديم تلقائياً
const derive = (secret) => createHash('sha256').update(`pexon-backup:${String(secret || '').trim()}`).digest();
function keys() {
  const list = [process.env.BACKUP_KEY, process.env.ADMIN_PASSWORD].filter((x) => String(x || '').trim());
  return (list.length ? list : ['']).map(derive);
}
const key = () => keys()[0];

export function encrypt(obj) {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', key(), iv);
  const body = Buffer.concat([c.update(JSON.stringify(obj), 'utf8'), c.final()]);
  return Buffer.concat([Buffer.from('PXB1'), iv, c.getAuthTag(), body]);
}

export function decrypt(buf) {
  if (buf.subarray(0, 4).toString() !== 'PXB1') throw new Error('bad file');
  const iv = buf.subarray(4, 16);
  const tag = buf.subarray(16, 32);
  let last;
  for (const k of keys()) {
    try {
      const d = createDecipheriv('aes-256-gcm', k, iv);
      d.setAuthTag(tag);
      return JSON.parse(Buffer.concat([d.update(buf.subarray(32)), d.final()]).toString('utf8'));
    } catch (e) {
      last = e;
    }
  }
  throw last;
}

const KEEP = 30;

export async function createBackup(by = 'تلقائي') {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('رفع الملفات غير مفعّل.');
  const { put, list, del } = await import('@vercel/blob');
  const dump = await dumpDatabase();
  dump.by = by;
  const day = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Riyadh' });
  const blob = await put(`backups/pexon-${day}.pxb`, encrypt(dump), { access: 'public', addRandomSuffix: true, contentType: 'application/octet-stream' });
  // نحتفظ بآخر 30 نسخة ونحذف الأقدم
  const { blobs } = await list({ prefix: 'backups/', limit: 1000 });
  const old = blobs.sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1)).slice(KEEP);
  if (old.length) await del(old.map((b) => b.url));
  return { url: blob.url, keys: dump.keys };
}

export async function listBackups() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  const { list } = await import('@vercel/blob');
  const { blobs } = await list({ prefix: 'backups/', limit: 1000 });
  return blobs.sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1)).map((b) => ({ url: b.url, pathname: b.pathname, size: b.size, at: new Date(b.uploadedAt).toISOString() }));
}
