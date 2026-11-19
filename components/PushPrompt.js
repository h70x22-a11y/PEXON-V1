'use client';
import { useEffect, useState } from 'react';
import { TbBellRinging } from 'react-icons/tb';
import { currentSub, enablePush, isPhone, pushSupported, subscribeDevice } from '@/lib/pushClient';

const LATER_KEY = 'px-push-later';
const LATER_DAYS = 7;

// بعد الدخول من الجوال: نافذة بنص الشاشة تطلب الموافقة على الإشعارات، وما تقدر تكمل لين تختار
export default function PushPrompt({ lang = 'ar' }) {
  const en = lang === 'en';
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      if (!pushSupported() || !isPhone()) return;
      const perm = Notification.permission;
      if (perm === 'denied') return;
      if (perm === 'granted') {
        // سبق ووافق: نتأكد إن الجهاز مشترك بدون ما نسأله
        if (!(await currentSub())) await subscribeDevice().catch(() => {});
        return;
      }
      let later = 0;
      try {
        later = Number(localStorage.getItem(LATER_KEY)) || 0;
      } catch {}
      if (later && Date.now() - later < LATER_DAYS * 86400000) return;
      setOpen(true);
    })().catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const allow = async () => {
    setBusy(true);
    try {
      await enablePush();
    } catch {}
    setBusy(false);
    setOpen(false);
  };
  const later = () => {
    try {
      localStorage.setItem(LATER_KEY, String(Date.now()));
    } catch {}
    setOpen(false);
  };

  return (
    <div className="push-modal" role="dialog" aria-modal="true" aria-labelledby="push-modal-title" dir={en ? 'ltr' : 'rtl'}>
      <div className="push-modal-card">
        <div className="push-modal-ico"><TbBellRinging /></div>
        <h2 id="push-modal-title">{en ? 'Turn on notifications?' : 'تفعيل الإشعارات؟'}</h2>
        <p>
          {en
            ? 'Get an instant notification on this phone for new quote requests, messages and vendor sign-ups.'
            : 'يوصلك إشعار فوري على جوالك عند وصول طلب عرض سعر أو رسالة أو تسجيل مورد جديد.'}
        </p>
        <button type="button" className="push-modal-allow" onClick={allow} disabled={busy}>
          {en ? 'Allow notifications' : 'السماح بالإشعارات'}
        </button>
        <button type="button" className="push-modal-later" onClick={later} disabled={busy}>
          {en ? 'Not now' : 'ليس الآن'}
        </button>
      </div>
    </div>
  );
}
