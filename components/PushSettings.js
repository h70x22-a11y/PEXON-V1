'use client';
import { useEffect, useState } from 'react';
import { TbBell, TbBellOff, TbSend } from 'react-icons/tb';

const toKey = (b64) => {
  const s = (b64 + '='.repeat((4 - (b64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
};

async function reg() {
  return (await navigator.serviceWorker.getRegistration('/admin')) || navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin' });
}

// تفعيل إشعارات الجوال لهذا الجهاز
export default function PushSettings({ lang = 'ar' }) {
  const en = lang === 'en';
  const [state, setState] = useState('loading'); // loading | unsupported | ios-install | off | on | denied
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
      if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
        setState(ios && !standalone ? 'ios-install' : 'unsupported');
        return;
      }
      if (Notification.permission === 'denied') return setState('denied');
      const r = await reg();
      const sub = await r.pushManager.getSubscription();
      setState(sub ? 'on' : 'off');
    })().catch(() => setState('unsupported'));
  }, []);

  const enable = async () => {
    setBusy(true);
    setMsg('');
    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        setState(perm === 'denied' ? 'denied' : 'off');
        return;
      }
      const { publicKey } = await fetch('/api/admin/push').then((r) => r.json());
      const r = await reg();
      await navigator.serviceWorker.ready;
      const sub = (await r.pushManager.getSubscription()) || (await r.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: toKey(publicKey) }));
      const res = await fetch('/api/admin/push', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subscription: sub.toJSON() }) });
      if (!res.ok) throw new Error();
      setState('on');
      setMsg(en ? 'Notifications enabled on this device.' : 'تم تفعيل الإشعارات على هذا الجهاز.');
    } catch {
      setMsg(en ? 'Could not enable notifications. Try again.' : 'تعذر التفعيل، حاول مرة ثانية.');
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    try {
      const r = await reg();
      const sub = await r.pushManager.getSubscription();
      if (sub) {
        await fetch('/api/admin/push', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ endpoint: sub.endpoint }) });
        await sub.unsubscribe();
      }
      setState('off');
      setMsg('');
    } finally {
      setBusy(false);
    }
  };

  const test = async () => {
    setBusy(true);
    setMsg('');
    try {
      const r = await fetch('/api/admin/push', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ test: true }) }).then((x) => x.json());
      setMsg(r.ok ? (en ? 'Test sent. It should arrive in a few seconds.' : 'انرسل إشعار تجريبي، بيوصلك خلال ثواني.') : (en ? 'Could not send. Turn notifications off and on again.' : 'ما وصل. أوقف الإشعارات وفعّلها من جديد.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel push-panel">
      <h2 style={{ marginTop: 0 }}>{en ? 'Phone notifications' : 'إشعارات الجوال'}</h2>
      <p className="muted" style={{ marginTop: 0 }}>
        {en
          ? 'Get an instant notification for new quote requests, messages and vendor sign-ups (based on your permissions).'
          : 'يوصلك إشعار فوري عند وصول طلب عرض سعر أو رسالة أو تسجيل مورد جديد (حسب صلاحياتك).'}
      </p>
      {state === 'loading' ? null : state === 'ios-install' ? (
        <div className="flash warn">{en ? 'On iPhone, install the app first (Share → Add to Home Screen), then open it from the home screen and enable notifications here.' : 'في الآيفون: ثبّت التطبيق أول (زر المشاركة ← إضافة إلى الشاشة الرئيسية)، وافتحه من الشاشة الرئيسية وفعّل الإشعارات من هنا.'}</div>
      ) : state === 'unsupported' ? (
        <div className="flash warn">{en ? 'This browser does not support notifications.' : 'هذا المتصفح ما يدعم الإشعارات.'}</div>
      ) : state === 'denied' ? (
        <div className="flash warn">{en ? 'Notifications are blocked. Allow them from the phone settings for this app, then reopen.' : 'الإشعارات مقفلة. اسمح لها من إعدادات الجوال لهذا التطبيق، وافتحه من جديد.'}</div>
      ) : state === 'off' ? (
        <button type="button" className="btn" onClick={enable} disabled={busy}><TbBell /> {en ? 'Enable notifications' : 'تفعيل الإشعارات'}</button>
      ) : (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" className="btn" onClick={test} disabled={busy}><TbSend /> {en ? 'Send test notification' : 'إرسال إشعار تجريبي'}</button>
          <button type="button" className="btn ghost" onClick={disable} disabled={busy}><TbBellOff /> {en ? 'Turn off on this device' : 'إيقاف على هذا الجهاز'}</button>
        </div>
      )}
      {msg ? <p style={{ marginBottom: 0 }}>{msg}</p> : null}
    </div>
  );
}
