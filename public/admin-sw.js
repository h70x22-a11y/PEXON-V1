// تطبيق لوحة التحكم: ما نخزّن أي بيانات على الجهاز، بس نعرض صفحة بسيطة لو انقطع الإنترنت
const OFFLINE = '<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PEXON</title><body style="font-family:system-ui;display:grid;place-items:center;min-height:90vh;color:#333;text-align:center"><div><h2>لا يوجد اتصال بالإنترنت</h2><p>تأكد من الاتصال ثم حاول مرة ثانية.</p><button onclick="location.reload()" style="padding:12px 28px;border:0;border-radius:99px;background:#0f2a44;color:#fff;font:inherit">إعادة المحاولة</button></div></body></html>';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  if (e.request.mode !== 'navigate') return;
  e.respondWith(fetch(e.request).catch(() => new Response(OFFLINE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })));
});

// الإشعارات (تنفعّل لاحقاً)
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { title: 'PEXON', body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'PEXON', { body: d.body || '', icon: '/app/icon-192.png', badge: '/app/icon-192.png', data: { url: d.url || '/admin' }, dir: 'rtl', lang: 'ar' }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/admin';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) if (c.url.includes('/admin') && 'focus' in c) { c.navigate(url); return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
