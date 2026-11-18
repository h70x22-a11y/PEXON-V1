import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getSession } from '@/lib/auth';
import { addChatMessage, getChat, getChatLast, getChatUnread, hitCounter, markChatRead } from '@/lib/db';
import { teamMembers } from '@/lib/notify';

export const dynamic = 'force-dynamic';

async function me() {
  const s = await getSession();
  return s && !s.mustChange && s.termsOk ? s : null;
}

// بدون with: قائمة الأعضاء مع عدد غير المقروء. مع with: المحادثة وتعليمها كمقروءة
export async function GET(request) {
  const s = await me();
  if (!s) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const other = new URL(request.url).searchParams.get('with');
  const members = await teamMembers(s);
  if (!other) {
    const [unread, last] = await Promise.all([getChatUnread(s.id), getChatLast(s.id)]);
    const list = members
      .map((m) => ({ ...m, unread: unread[m.id] || 0, last: last[m.id] || '' }))
      .sort((a, b) => (a.last < b.last ? 1 : -1));
    return NextResponse.json({ me: s.id, members: list });
  }
  if (!members.some((m) => m.id === other)) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const messages = await getChat(s.id, other);
  await markChatRead(s.id, other);
  return NextResponse.json({ me: s.id, messages });
}

export async function POST(request) {
  const s = await me();
  if (!s) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if ((await hitCounter(`chat-rate:${s.id}`, 60)) > 40) return NextResponse.json({ error: 'rate' }, { status: 429 });
  const { to, text } = await request.json().catch(() => ({}));
  const body = String(text || '').trim().slice(0, 2000);
  if (!body) return NextResponse.json({ error: 'empty' }, { status: 400 });
  if (!(await teamMembers(s)).some((m) => m.id === to)) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const msg = { id: randomUUID(), from: s.id, to, text: body, date: new Date().toISOString() };
  await addChatMessage(msg);
  return NextResponse.json({ ok: true, message: msg });
}
