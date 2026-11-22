'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// يرسل اسم القسم اللي انفتح (مرة لكل فتح) عشان ترتيب القائمة يتبع الاستخدام
export default function NavTracker() {
  const path = usePathname();
  useEffect(() => {
    const m = path?.match(/^\/admin(?:\/([a-z-]+))?/);
    if (!m) return;
    const key = m[1] || 'home';
    fetch('/api/admin/nav', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ key }), keepalive: true }).catch(() => {});
  }, [path]);
  return null;
}
