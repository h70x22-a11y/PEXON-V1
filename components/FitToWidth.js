'use client';

import { useEffect } from 'react';

// يصغّر ورقة المستند (عرضها ثابت مثل A4) لتناسب عرض الجوال بدون ما يتلخبط الجدول
export default function FitToWidth({ selector, width }) {
  useEffect(() => {
    const el = document.querySelector(selector);
    if (!el) return;
    const fit = () => {
      const avail = document.documentElement.clientWidth - 16;
      el.style.zoom = avail < width ? String(Math.max(0.3, avail / width)) : '';
    };
    fit();
    window.addEventListener('resize', fit);
    window.addEventListener('beforeprint', () => (el.style.zoom = ''));
    window.addEventListener('afterprint', fit);
    return () => window.removeEventListener('resize', fit);
  }, [selector, width]);
  return null;
}
