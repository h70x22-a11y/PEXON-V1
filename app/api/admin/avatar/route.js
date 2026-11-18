import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAvatar, setAvatar } from '@/lib/db';

// رفع الصورة الشخصية (المتصفح يصغّرها قبل الرفع)
export async function POST(request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: 'رفع الصور غير مفعّل.' }, { status: 400 });
  const form = await request.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string' || !file.type.startsWith('image/')) return NextResponse.json({ error: 'الملف المرفوع ليس صورة.' }, { status: 400 });
  if (file.size > 600_000) return NextResponse.json({ error: 'حجم الصورة كبير.' }, { status: 400 });
  const { put, del } = await import('@vercel/blob');
  const old = await getAvatar(s.id);
  const blob = await put(`avatars/${s.id}.jpg`, file, { access: 'public', addRandomSuffix: true, contentType: 'image/jpeg' });
  await setAvatar(s.id, blob.url);
  if (old) await del(old).catch(() => {});
  return NextResponse.json({ url: blob.url });
}

export async function DELETE() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const old = await getAvatar(s.id);
  await setAvatar(s.id, '');
  if (old) {
    const { del } = await import('@vercel/blob');
    await del(old).catch(() => {});
  }
  return NextResponse.json({ ok: true });
}
