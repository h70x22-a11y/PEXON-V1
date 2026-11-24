// ربط مباشر مع Google Search Console عن طريق حساب خدمة (Service Account)
// المتغيرات في Vercel:
//   GSC_SERVICE_ACCOUNT = محتوى ملف JSON حق حساب الخدمة كامل
//   GSC_SITE (اختياري) = https://powercore.sa/
import crypto from 'node:crypto';
import { unstable_cache } from 'next/cache';

const SITE = process.env.GSC_SITE || 'https://powercore.sa/';

function creds() {
  const raw = process.env.GSC_SERVICE_ACCOUNT;
  if (!raw) return null;
  try {
    const j = JSON.parse(raw);
    if (!j.client_email || !j.private_key) return null;
    return { email: j.client_email, key: j.private_key.replace(/\\n/g, '\n') };
  } catch {
    return null;
  }
}

export const gscReady = () => Boolean(creds());
export const gscEmail = () => creds()?.email || '';

const b64url = (b) => Buffer.from(b).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

async function token() {
  const c = creds();
  if (!c) throw new Error('NO_CREDS');
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify({ iss: c.email, scope: 'https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const sig = crypto.createSign('RSA-SHA256').update(`${head}.${body}`).sign(c.key);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${body}.${b64url(sig)}` }),
    cache: 'no-store',
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`AUTH: ${j.error_description || j.error || res.status}`);
  return j.access_token;
}

async function query(tk, body) {
  const res = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, {
    method: 'POST',
    headers: { authorization: `Bearer ${tk}`, 'content-type': 'application/json' },
    body: JSON.stringify({ type: 'web', dataState: 'final', ...body }),
    cache: 'no-store',
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`API ${res.status}: ${j.error?.message || ''}`);
  return j.rows || [];
}

const ymd = (d) => d.toISOString().slice(0, 10);
const r1 = (n) => Math.round(n * 10) / 10;

async function fetchSeo(days) {
  const tk = await token();
  const end = new Date(Date.now() - 864e5);
  const start = new Date(end.getTime() - (days - 1) * 864e5);
  const range = { startDate: ymd(start), endDate: ymd(end) };
  const [byDate, byDateQuery, byPage] = await Promise.all([
    query(tk, { ...range, dimensions: ['date'], rowLimit: 1000 }),
    query(tk, { ...range, dimensions: ['date', 'query'], rowLimit: 25000 }),
    query(tk, { ...range, dimensions: ['page'], rowLimit: 100 }),
  ]);
  const map = new Map(byDate.map((r) => [r.keys[0], { d: r.keys[0], c: r.clicks, i: r.impressions, p: r1(r.position), q: [] }]));
  for (const r of byDateQuery) {
    const day = map.get(r.keys[0]);
    if (day) day.q.push([r.keys[1], r.clicks, r.impressions, r1(r.position)]);
  }
  const list = [...map.values()].sort((a, b) => a.d.localeCompare(b.d));
  return {
    site: SITE,
    fetchedAt: new Date().toISOString(),
    dataThrough: list.at(-1)?.d || null,
    days: list,
    pages: byPage.map((r) => ({ page: r.keys[0], c: r.clicks, i: r.impressions, p: r1(r.position) })),
  };
}

// تخزين مؤقت 6 ساعات، وزر "تحديث الحين" يمسحه
export const getSeoData = unstable_cache(fetchSeo, ['gsc-v1'], { revalidate: 21600, tags: ['gsc'] });
