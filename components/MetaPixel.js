'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CONSENT_KEY, readConsent } from '@/lib/pixel';

function loadPixel(id) {
  if (window.fbq) return;
  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq('init', id);
}

export default function MetaPixel({ pixelId, labels }) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [granted, setGranted] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    const c = readConsent();
    if (c === 'granted') setGranted(true);
    else if (!c) setShow(true);
    const reopen = () => setShow(true);
    window.addEventListener('pexon-consent-open', reopen);
    return () => window.removeEventListener('pexon-consent-open', reopen);
  }, []);

  // تحميل البكسل وتسجيل زيارة الصفحة (ومع كل تنقل داخل الموقع)
  useEffect(() => {
    if (!granted || !pixelId) return;
    loadPixel(pixelId);
    window.fbq('track', 'PageView');
    first.current = false;
  }, [granted, pixelId, pathname]);

  function choose(v) {
    try { localStorage.setItem(CONSENT_KEY, v); } catch {}
    setShow(false);
    if (v === 'granted') setGranted(true);
    else if (granted) window.location.reload(); // سحب الموافقة: إعادة تحميل الصفحة بدون البكسل
  }

  if (!show || !pixelId) return null;
  return (
    <div className="consent-bar" role="dialog" aria-live="polite" aria-label={labels.title}>
      <p>
        {labels.text} <Link href="/privacy">{labels.more}</Link>
      </p>
      <div className="consent-actions">
        <button type="button" className="btn" onClick={() => choose('granted')}>{labels.accept}</button>
        <button type="button" className="btn ghost" onClick={() => choose('denied')}>{labels.decline}</button>
      </div>
    </div>
  );
}
