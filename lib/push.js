import { createHash } from 'crypto';
import { getPushSubs, getRoles, getUsers, getVapidKeys, initVapidKeys, pushUserIds, removePushSub, savePushSub } from '@/lib/db';
import { normalizePerms } from '@/lib/permissions';
import { newVapidKeys, sendWebPush } from '@/lib/webpush';

export async function vapidKeys() {
  return (await getVapidKeys()) || (await initVapidKeys(newVapidKeys()));
}

export const subId = (endpoint) => createHash('sha256').update(String(endpoint)).digest('hex').slice(0, 32);

function validSub(sub) {
  try {
    const u = new URL(sub?.endpoint);
    return u.protocol === 'https:' && typeof sub.keys?.p256dh === 'string' && typeof sub.keys?.auth === 'string' && sub.keys.p256dh.length < 200 && sub.keys.auth.length < 100;
  } catch {
    return false;
  }
}

export async function subscribe(userId, sub) {
  if (!validSub(sub)) throw new Error('bad subscription');
  const clean = { endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth } };
  await savePushSub(userId, subId(sub.endpoint), clean);
}

// يرسل لكل أجهزة المستخدم، ويحذف الاشتراكات المنتهية
export async function pushToUser(userId, data) {
  const subs = await getPushSubs(userId);
  const entries = Object.entries(subs);
  if (!entries.length) return 0;
  const keys = await vapidKeys();
  let sent = 0;
  await Promise.all(
    entries.map(async ([id, sub]) => {
      const status = await sendWebPush(sub, data, keys);
      if (status >= 200 && status < 300) sent++;
      else if (status === 404 || status === 410) await removePushSub(userId, id).catch(() => {});
    })
  );
  return sent;
}

// يرسل للمالك ولكل موظف عنده صلاحية القسم
export async function pushToSection(section, data) {
  try {
    const ids = await pushUserIds();
    if (!ids.length) return;
    const [users, roles] = await Promise.all([getUsers(), getRoles()]);
    const allowed = ids.filter((id) => {
      if (id === 'owner') return true;
      const u = users.find((x) => x.id === id);
      if (!u || !u.active) return false;
      const perms = u.roleId ? normalizePerms(roles.find((r) => r.id === u.roleId)?.perms || []) : normalizePerms(u.perms || []);
      return perms.includes(`${section}:read`);
    });
    await Promise.all(allowed.map((id) => pushToUser(id, data).catch(() => 0)));
  } catch {}
}

// إشعار لكل رسالة/طلب جديد يوصل للموقع
export async function pushForMessage(m) {
  const name = m.company || m.name || '';
  let section = 'messages';
  let data;
  if (m.type === 'quote') {
    section = 'quotes';
    const n = m.items?.length || 0;
    data = {
      title: m.source === 'whatsapp' ? 'طلب سعر عبر الواتساب' : 'طلب عرض سعر جديد',
      body: [m.number, name, n ? `${n} منتج` : ''].filter(Boolean).join(' · '),
      url: `/admin/quotes/${m.id}`,
    };
  } else if (m.type === 'vendor') {
    section = 'vendors';
    data = { title: 'تسجيل مورد جديد', body: name, url: '/admin/vendors' };
  } else if (m.type === 'datarequest') {
    data = { title: 'طلب جديد بخصوص البيانات الشخصية', body: name, url: '/admin/messages/requests' };
  } else {
    data = { title: 'رسالة جديدة', body: [name, String(m.message || '').slice(0, 90)].filter(Boolean).join(': '), url: '/admin/messages' };
  }
  await pushToSection(section, data);
}
