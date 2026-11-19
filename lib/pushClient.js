'use client';
// أدوات الإشعارات في المتصفح (مشتركة بين صفحة حسابي ونافذة الموافقة)

const toKey = (b64) => {
  const s = (b64 + '='.repeat((4 - (b64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
};

export const pushSupported = () => typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

export const isPhone = () => /iphone|ipad|ipod|android/i.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

export async function swReg() {
  return (await navigator.serviceWorker.getRegistration('/admin')) || navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin' });
}

export async function currentSub() {
  const r = await swReg();
  return r.pushManager.getSubscription();
}

// يشترك ويحفظ الاشتراك في السيرفر (يفترض إن الإذن تم منحه)
export async function subscribeDevice() {
  const { publicKey } = await fetch('/api/admin/push').then((r) => r.json());
  const r = await swReg();
  await navigator.serviceWorker.ready;
  const sub = (await r.pushManager.getSubscription()) || (await r.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: toKey(publicKey) }));
  const res = await fetch('/api/admin/push', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subscription: sub.toJSON() }) });
  if (!res.ok) throw new Error('save failed');
  return sub;
}

// يطلب الإذن (لازم من ضغطة زر) ثم يشترك. يرجع: granted | denied | default
export async function enablePush() {
  const perm = await Notification.requestPermission();
  if (perm === 'granted') await subscribeDevice();
  return perm;
}

export async function disablePush() {
  const sub = await currentSub();
  if (sub) {
    await fetch('/api/admin/push', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ endpoint: sub.endpoint }) });
    await sub.unsubscribe();
  }
}
