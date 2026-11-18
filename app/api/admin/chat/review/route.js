import { NextResponse } from 'next/server';
import { can, getSession } from '@/lib/auth';
import { getAvatars, getChatByPair, getChatPairs, getUsers } from '@/lib/db';

export const dynamic = 'force-dynamic';

// مراجعة محادثات الموظفين: للمالك ومن عنده صلاحية "مراجعة محادثات الموظفين". قراءة فقط، وما تغيّر حالة المقروء
export async function GET(request) {
  const s = await getSession();
  if (!s || s.mustChange || !can(s, 'chats')) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const users = await getUsers();
  const names = { owner: { name: 'المالك', username: 'admin' } };
  for (const u of users) names[u.id] = { name: u.name, username: u.username };
  const pair = new URL(request.url).searchParams.get('pair');
  if (pair) {
    const messages = await getChatByPair(pair);
    return NextResponse.json({ messages, names });
  }
  const pairs = await getChatPairs();
  const ids = [...new Set(pairs.flatMap((p) => p.pair.split(':')))];
  const avatars = await getAvatars(ids);
  return NextResponse.json({
    names,
    pairs: pairs.map((p) => ({ ...p, people: p.pair.split(':').map((id) => ({ id, ...(names[id] || { name: '؟', username: '' }), avatar: avatars[id] || '' })) })),
  });
}
