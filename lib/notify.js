import { OWNER_USERNAME, can } from '@/lib/auth';
import { getAvatars, getChatUnread, getMessages, getNotSold, getResetRequests, getSeenAt, getUsers } from '@/lib/db';

// التنبيهات تُبنى من الطلبات والرسائل والموردين وطلبات إعادة التعيين حسب صلاحيات المستخدم
export async function buildNotifications(session) {
  const [messages, resets, seenAt] = await Promise.all([getMessages(), can(session, 'users:write') ? getResetRequests() : [], getSeenAt(session.id)]);
  const items = [];
  for (const m of messages.slice(0, 60)) {
    if (m.type === 'quote' && can(session, 'quotes')) items.push({ id: m.id, kind: 'quote', title: m.number || '', name: m.name, date: m.date, href: `/admin/quotes/${m.id}` });
    else if (m.type === 'datarequest' && can(session, 'messages')) items.push({ id: m.id, kind: 'datarequest', name: m.name, date: m.date, href: '/admin/messages/requests' });
    else if (m.type === 'vendor' && can(session, 'vendors')) items.push({ id: m.id, kind: 'vendor', name: m.company || m.name, date: m.date, href: '/admin/vendors' });
    else if (m.type !== 'quote' && m.type !== 'vendor' && m.type !== 'datarequest' && can(session, 'messages')) items.push({ id: m.id, kind: 'message', name: m.name, date: m.date, href: '/admin/messages' });
  }
  for (const r of resets) items.push({ id: r.id, kind: 'reset', name: r.name, date: r.date, href: '/admin/users' });
  if (session.owner) {
    for (const [k, v] of Object.entries(await getNotSold())) {
      if (v.status === 'pending') items.push({ id: k, kind: 'notsold', title: v.label, name: v.byName, date: v.at, href: '/admin/searches#notsold' });
    }
  }
  items.sort((a, b) => (a.date < b.date ? 1 : -1));
  const top = items.slice(0, 15).map((x) => ({ ...x, unread: !seenAt || x.date > seenAt }));
  return { items: top, unread: items.filter((x) => !seenAt || x.date > seenAt).length };
}

// أعضاء لوحة التحكم اللي يقدر المستخدم يراسلهم
export async function teamMembers(session) {
  const users = (await getUsers()).filter((u) => u.active);
  const all = [{ id: 'owner', name: 'المالك', username: OWNER_USERNAME }, ...users.map((u) => ({ id: u.id, name: u.name, username: u.username }))];
  const list = all.filter((u) => u.id !== session.id);
  const avatars = await getAvatars(list.map((u) => u.id));
  return list.map((u) => ({ ...u, avatar: avatars[u.id] || '' }));
}

export async function chatUnreadTotal(session) {
  const map = await getChatUnread(session.id);
  return Object.values(map).reduce((s, n) => s + n, 0);
}
