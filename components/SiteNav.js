'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const LINKS = [
  { href: '/', label: 'الرئيسية' },
  { href: '/products', label: 'جميع المنتجات' },
  { href: '/#about', label: 'من نحن' },
  { href: '/contact', label: 'تواصل معنا' },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // يقفل القائمة عند الانتقال لصفحة ثانية
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <button
        type="button"
        className={`nav-toggle${open ? ' open' : ''}`}
        aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
      <nav id="site-nav" className={`nav${open ? ' open' : ''}`}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
