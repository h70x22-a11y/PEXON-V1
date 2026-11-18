import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getSession } from '@/lib/auth';
import { githubReady, isEditable, listFiles, readFile, recentCommits, writeFile } from '@/lib/github';

// لوحة المطوّر: للمالك فقط
async function guard(write = false) {
  const s = await getSession();
  if (!s?.owner) return 'هذي الصفحة للمالك فقط.';
  if (!githubReady) return 'مفتاح GitHub غير مضاف. أضف GITHUB_TOKEN في Vercel.';
  if (write) {
    const h = await headers();
    const origin = h.get('origin');
    if (origin && new URL(origin).host !== h.get('host')) return 'طلب غير مسموح.';
  }
  return '';
}

const fail = (error, status = 400) => NextResponse.json({ error }, { status });

export async function GET(request) {
  const err = await guard();
  if (err) return fail(err, 403);
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  try {
    if (path) {
      if (!isEditable(path)) return fail('هذا الملف غير قابل للتعديل من هنا.');
      return NextResponse.json(await readFile(path));
    }
    const [files, commits] = await Promise.all([listFiles(), recentCommits()]);
    return NextResponse.json({ files, commits });
  } catch (e) {
    return fail(e.message, 502);
  }
}

export async function PUT(request) {
  const err = await guard(true);
  if (err) return fail(err, 403);
  try {
    const { path, content, sha, message } = await request.json();
    if (!path || !isEditable(path)) return fail('هذا الملف غير قابل للتعديل من هنا.');
    if (typeof content !== 'string' || content.length > 500_000) return fail('حجم الملف كبير.');
    const s = await getSession();
    const msg = String(message || '').trim().slice(0, 200) || `تعديل ${path} من لوحة التحكم`;
    return NextResponse.json(await writeFile(path, content, sha, `${msg}\n\nبواسطة: ${s.name} (لوحة المطوّر)`));
  } catch (e) {
    const conflict = /does not match|sha/i.test(e.message);
    return fail(conflict ? 'الملف تغيّر من مكان ثاني بعد ما فتحته. أعد فتحه وطبّق تعديلك مرة ثانية.' : e.message, conflict ? 409 : 502);
  }
}
