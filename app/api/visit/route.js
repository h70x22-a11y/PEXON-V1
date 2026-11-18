import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { clientIp } from '@/lib/auth';
import { hitCounter, recordVisit, VISIT_EVENTS } from '@/lib/db';

// يستقبل الزيارات من الموقع ويجمعها كأرقام إجمالية (بدون حفظ IP أو معرّفات)
const BOT = /bot|crawl|spider|slurp|facebookexternalhit|preview|lighthouse|headless|monitor|curl|wget|python|vercel/i;

function classify(ref, utm) {
  const u = String(utm || '').toLowerCase().trim();
  if (u) {
    if (/^(fb|facebook|meta)/.test(u)) return 'facebook';
    if (/^(ig|insta)/.test(u)) return 'instagram';
    if (/^(google|gads|adwords)/.test(u)) return 'google-ads';
    if (/whats|^wa$/.test(u)) return 'whatsapp';
    if (/tiktok/.test(u)) return 'tiktok';
    if (/snap/.test(u)) return 'snapchat';
    if (/^(x|twitter)$/.test(u)) return 'x';
    if (/linkedin/.test(u)) return 'linkedin';
    if (/mail/.test(u)) return 'email';
    return 'campaign';
  }
  let host = '';
  try {
    host = new URL(ref).hostname.replace(/^www\./, '');
  } catch {
    return 'direct';
  }
  if (!host || /(^|\.)powercore\.sa$|vercel\.app$/.test(host)) return 'direct';
  if (/google\./.test(host)) return 'google';
  if (/bing\.|duckduckgo|yahoo|yandex/.test(host)) return 'search-other';
  if (/instagram/.test(host)) return 'instagram';
  if (/facebook|fb\.com|fb\.me/.test(host)) return 'facebook';
  if (/whatsapp|wa\.me/.test(host)) return 'whatsapp';
  if (/(^|\.)t\.co$|twitter|x\.com/.test(host)) return 'x';
  if (/tiktok/.test(host)) return 'tiktok';
  if (/snapchat/.test(host)) return 'snapchat';
  if (/linkedin|lnkd\.in/.test(host)) return 'linkedin';
  if (/youtube|youtu\.be/.test(host)) return 'youtube';
  return 'other';
}

export async function POST(request) {
  try {
    const ua = (await headers()).get('user-agent') || '';
    if (!ua || BOT.test(ua)) return new NextResponse(null, { status: 204 });
    const ip = await clientIp();
    if ((await hitCounter(`visit:${ip}`, 600)) > 200) return new NextResponse(null, { status: 204 });
    const b = JSON.parse((await request.text()) || '{}');
    const kind = ['land', 'view', 'event'].includes(b.k) ? b.k : 'view';
    if (kind === 'event') {
      if (VISIT_EVENTS.includes(b.e)) await recordVisit({ kind, event: b.e });
    } else {
      let path = String(b.p || '/').split('?')[0].slice(0, 120);
      if (!path.startsWith('/') || path.startsWith('/admin') || path.startsWith('/api')) return new NextResponse(null, { status: 204 });
      path = decodeURIComponent(path).replace(/\/+$/, '') || '/';
      await recordVisit({ kind, path, device: b.d === 'm' ? 'm' : 'd', source: kind === 'land' ? classify(b.r, b.u) : '' });
    }
  } catch {}
  return new NextResponse(null, { status: 204 });
}
