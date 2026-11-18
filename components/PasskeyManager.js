'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { passkeysSupported, registerPasskey } from '@/lib/passkeyClient';
import { useAdminT } from '@/components/AdminLang';

function guessDevice() {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua)) return 'iPhone';
  if (/iPad/.test(ua)) return 'iPad';
  if (/Macintosh/.test(ua)) return 'Mac';
  if (/Android/.test(ua)) return 'Android';
  if (/Windows/.test(ua)) return 'Windows';
  return 'جهاز';
}

// إضافة مفتاح مرور للجهاز الحالي
export default function PasskeyManager() {
  const { t } = useAdminT();
  const router = useRouter();
  const [ok, setOk] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ kind: '', text: '' });
  useEffect(() => setOk(passkeysSupported()), []);

  async function add() {
    setBusy(true);
    setMsg({ kind: '', text: '' });
    try {
      await registerPasskey(guessDevice());
      setMsg({ kind: 'ok', text: 'تمت إضافة الجهاز ✓ تقدر الحين تدخل بالبصمة أو الوجه.' });
      router.refresh();
    } catch (e) {
      if (e?.name === 'InvalidStateError') setMsg({ kind: 'warn', text: 'هذا الجهاز مضاف من قبل.' });
      else if (e?.name !== 'NotAllowedError' && e?.name !== 'AbortError') setMsg({ kind: 'err', text: e.message || 'تعذر التسجيل.' });
    }
    setBusy(false);
  }

  if (!ok) return <p className="muted">{t('متصفحك ما يدعم الدخول بالبصمة أو الوجه.')}</p>;
  return (
    <>
      <button type="button" className="btn" onClick={add} disabled={busy}>{busy ? t('جاري التسجيل...') : t('+ إضافة هذا الجهاز')}</button>
      {msg.text ? <div className={`flash ${msg.kind}`} style={{ marginTop: 10 }}>{t(msg.text)}</div> : null}
    </>
  );
}
