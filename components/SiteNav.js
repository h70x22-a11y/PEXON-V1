'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SiteNav({ links, openLabel, closeLabel }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // يقفل القائمة عند الانتقال لصفحة ثانية
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <button
        type="button"
        className={`nav-toggle${open ? ' open' : ''}`}
        aria-label={open ? closeLabel : openLabel}
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
      <nav id="site-nav" className={`nav${open ? ' open' : ''}`}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
