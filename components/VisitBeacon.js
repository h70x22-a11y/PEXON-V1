'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { sendVisit } from '@/lib/pixel';

// قياس داخلي للزيارات: أرقام إجمالية فقط بدون ملفات تعريف ارتباط أو معرّفات
export default function VisitBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    let landed = false;
    try {
      landed = !sessionStorage.getItem('pexon-v');
      sessionStorage.setItem('pexon-v', '1');
    } catch {}
    const params = new URLSearchParams(window.location.search);
    sendVisit({
      k: landed ? 'land' : 'view',
      p: pathname,
      d: window.innerWidth < 768 ? 'm' : 'd',
      ...(landed ? { r: document.referrer || '', u: params.get('utm_source') || '' } : {}),
    });
  }, [pathname]);
  return null;
}
