'use client';

import { useEffect, useState } from 'react';
import { passkeysSupported, registerPasskey } from '@/lib/passkeyClient';
import { makeT } from '@/lib/adminI18n';

function guessDevice() {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua)) return 'iPhone';
  if (/iPad/.test(ua)) return 'iPad';
  if (/Macintosh/.test(ua)) return 'Mac';
  if (/Android/.test(ua)) return 'Android';
  if (/Windows/.test(ua)) return 'Windows';
  return 'جهاز';
}

// نتذكر اختيار هذا الجهاز سنة كاملة عشان ما نسأل كل مرة
const remember = (v) => {
  document.cookie = `pk-device=${v}; path=/; max-age=31536000; samesite=lax; secure`;
};

export default function PasskeyOffer({ lang, next }) {
  const t = makeT(lang);
  const [state, setState] = useState('check'); // check | offer | busy | done | unsupported
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!passkeysSupported()) {
      setState('unsupported');
      window.location.replace(next);
      return;
    }
    // نتأكد إن الجهاز فيه بصمة أو وجه أو رمز
    window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable?.()
      .then((ok) => {
        if (ok) setState('offer');
        else {
          remember('none');
          window.location.replace(next);
        }
      })
      .catch(() => setState('offer'));
  }, [next]);

  async function enable() {
    setErr('');
    setState('busy');
    try {
      await registerPasskey(guessDevice());
      remember('registered');
      setState('done');
      setTimeout(() => window.location.replace(next), 1400);
    } catch (e) {
      if (e?.name === 'InvalidStateError') {
        remember('registered');
        window.location.replace(next);
        return;
      }
      if (e?.name !== 'NotAllowedError' && e?.name !== 'AbortError') setErr(e.message || 'تعذر التسجيل.');
      setState('offer');
    }
  }

  function later() {
    remember('skipped');
    window.location.replace(next);
  }

  if (state === 'check' || state === 'unsupported') return <p className="muted">{t('جاري التحقق...')}</p>;
  if (state === 'done') return <div className="flash ok">{t('تمت إضافة الجهاز ✓ تقدر الحين تدخل بالبصمة أو الوجه.')}</div>;

  return (
    <div className="pk-offer">
      <div className="pk-hero" aria-hidden="true">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#37b6ff" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12 11c0 3.5-1 6.5-2.5 8.5" /><path d="M15 12.5c0 3-.6 5.6-1.6 7.5" /><path d="M7 16c.6-1.4 1-3 1-5a4 4 0 0 1 8 0" /><path d="M5 12a7 7 0 0 1 12.7-4" /><path d="M18.6 10.5c.3 1 .4 2 .4 3 0 2.4-.4 4.6-1.1 6.5" /><path d="M3.5 8.5A9.5 9.5 0 0 1 8 4" />
        </svg>
      </div>
      <p className="auth-hint">{t('تبي تدخل المرة الجاية بـ Face ID أو Touch ID أو البصمة بدل كلمة المرور؟ البصمة ما تطلع من جهازك أبداً.')}</p>
      {err ? <div className="flash err">{t(err)}</div> : null}
      <button type="button" className="auth-btn" onClick={enable} disabled={state === 'busy'}>
        {state === 'busy' ? t('جاري التسجيل...') : t('تفعيل على هذا الجهاز')}
      </button>
      <button type="button" className="link-btn pk-later" onClick={later}>{t('لاحقاً')}</button>
    </div>
  );
}
