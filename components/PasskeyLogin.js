'use client';

import { useEffect, useState } from 'react';
import { loginWithPasskey, passkeysSupported } from '@/lib/passkeyClient';
import { makeT } from '@/lib/adminI18n';

// زر الدخول بالبصمة أو الوجه في صفحة الدخول
export default function PasskeyLogin({ lang }) {
  const t = makeT(lang);
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  useEffect(() => setOk(passkeysSupported()), []);
  if (!ok) return null;

  async function go() {
    setErr('');
    setBusy(true);
    try {
      window.location.href = await loginWithPasskey();
    } catch (e) {
      // إلغاء المستخدم للنافذة ما نعتبره خطأ
      if (e?.name !== 'NotAllowedError' && e?.name !== 'AbortError') setErr(e.message || 'تعذر التحقق.');
      setBusy(false);
    }
  }

  return (
    <div className="passkey-login">
      <div className="or"><span>{t('أو')}</span></div>
      <button type="button" className="passkey-btn" onClick={go} disabled={busy}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M12 11c0 3.5-1 6.5-2.5 8.5" /><path d="M15 12.5c0 3-.6 5.6-1.6 7.5" /><path d="M7 16c.6-1.4 1-3 1-5a4 4 0 0 1 8 0" /><path d="M5 12a7 7 0 0 1 12.7-4" /><path d="M18.6 10.5c.3 1 .4 2 .4 3 0 2.4-.4 4.6-1.1 6.5" /><path d="M3.5 8.5A9.5 9.5 0 0 1 8 4" />
        </svg>
        {busy ? t('جاري التحقق...') : t('الدخول بالبصمة أو الوجه')}
      </button>
      {err ? <div className="flash err" style={{ marginTop: 10 }}>{t(err)}</div> : null}
    </div>
  );
}
