import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { decrypt, listBackups } from '@/lib/backup';

export const dynamic = 'force-dynamic';

// تحميل نسخة احتياطية بعد فك تشفيرها (للمالك فقط)
export async function GET(request) {
  const s = await getSession();
  if (!s?.owner) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const path = new URL(request.url).searchParams.get('p') || '';
  const item = (await listBackups()).find((b) => b.pathname === path);
  if (!item) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const buf = Buffer.from(await (await fetch(item.url, { cache: 'no-store' })).arrayBuffer());
  let data;
  try {
    data = decrypt(buf);
  } catch {
    return NextResponse.json({ error: 'تعذر فك التشفير. ربما تغيّرت كلمة مرور المالك أو BACKUP_KEY.' }, { status: 400 });
  }
  const name = path.split('/').pop().replace(/\.pxb$/, '.json');
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Disposition': `attachment; filename="${name}"`, 'Cache-Control': 'no-store' },
  });
}
