import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { can, clientIp, getSession } from '@/lib/auth';
import { getSettings, logActivity, saveSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// ينقل ملف كتالوج موجود في مجلد /_import/ بالموقع إلى مخزن الملفات ويعتمده ككتالوج الموقع
export async function POST(request) {
  const s = await getSession();
  if (!can(s, 'settings:write') || s.mustChange) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { file } = await request.json().catch(() => ({}));
  if (!/^[a-z0-9-]+\.pdf$/.test(String(file || ''))) return NextResponse.json({ error: 'bad file' }, { status: 400 });
  const origin = new URL(request.url).origin;
  const res = await fetch(`${origin}/_import/${file}`, { cache: 'no-store' });
  if (!res.ok) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.subarray(0, 5).toString() !== '%PDF-') return NextResponse.json({ error: 'not a pdf' }, { status: 400 });
  const { put } = await import('@vercel/blob');
  const blob = await put('catalog/PEXON_Product_Catalog_2026.pdf', buf, { access: 'public', addRandomSuffix: true, contentType: 'application/pdf' });
  const current = await getSettings();
  await saveSettings({ ...current, catalogUrl: blob.url });
  await logActivity({ userId: s.id, name: s.name, section: 'settings', action: 'update', what: 'تحديث ملف الكتالوج', ip: await clientIp() });
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true, url: blob.url, bytes: buf.length });
}
