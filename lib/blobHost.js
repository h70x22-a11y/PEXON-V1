// عنوان مخزن الملفات الخاص بموقعنا فقط (Vercel Blob) — مو أي مخزن على Vercel
const KNOWN = 'swzxjmv9urme27oc.public.blob.vercel-storage.com';

export function ownBlobHosts() {
  const hosts = new Set([KNOWN]);
  const m = String(process.env.BLOB_READ_WRITE_TOKEN || '').match(/^vercel_blob_rw_([A-Za-z0-9]+)_/);
  if (m) hosts.add(`${m[1].toLowerCase()}.public.blob.vercel-storage.com`);
  return hosts;
}

export function isOwnBlob(url) {
  try {
    const u = new URL(String(url));
    return u.protocol === 'https:' && ownBlobHosts().has(u.hostname);
  } catch {
    return false;
  }
}
