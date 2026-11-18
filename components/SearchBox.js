'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';

export default function SearchBox({ lang, labels }) {
  const [q, setQ] = useState('');
  const [res, setRes] = useState({ total: 0, items: [] });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const router = useRouter();
  const pathname = usePathname();
  const box = useRef(null);

  useEffect(() => setOpen(false), [pathname]);

  // نسجل البحث لإحصائيات لوحة التحكم: لما يختار اقتراح، أو يقفل البحث وما لقى شي
  const logged = useRef('');
  function track(term) {
    const v = String(term || '').trim();
    if (v.length < 2 || logged.current === v) return;
    logged.current = v;
    try {
      navigator.sendBeacon('/api/search/log', JSON.stringify({ q: v }));
    } catch {}
  }
  const resRef = useRef(res);
  resRef.current = res;
  const qRef = useRef(q);
  qRef.current = q;

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setRes({ total: 0, items: [] });
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(term)}&lang=${lang}`, { signal: ctrl.signal });
        setRes(await r.json());
        setActive(-1);
        setOpen(true);
      } catch {}
    }, 200);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q, lang]);

  useEffect(() => {
    const close = (e) => {
      if (!box.current || box.current.contains(e.target)) return;
      if (qRef.current.trim().length >= 3 && resRef.current.total === 0) track(qRef.current);
      setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  function submit(e) {
    e.preventDefault();
    if (active >= 0 && res.items[active]) {
      track(q);
      router.push(`/product/${res.items[active].id}`);
    } else if (q.trim()) {
      router.push(`/products?q=${encodeURIComponent(q.trim())}`);
    }
    setOpen(false);
  }

  function onKey(e) {
    if (!open || !res.items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, res.items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === 'Escape') {
      if (q.trim().length >= 3 && res.total === 0) track(q);
      setOpen(false);
    }
  }

  return (
    <div className="search-box" ref={box}>
      <form onSubmit={submit} role="search">
        <FiSearch aria-hidden="true" className="search-icon" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => res.items.length && setOpen(true)}
          onKeyDown={onKey}
          placeholder={labels.placeholder}
          aria-label={labels.placeholder}
          autoComplete="off"
          enterKeyHint="search"
        />
      </form>
      {open && q.trim().length >= 2 ? (
        <div className="search-pop" role="listbox">
          {res.items.length ? (
            <>
              {res.items.map((it, i) => (
                <Link
                  key={it.id}
                  href={`/product/${it.id}`}
                  className={`search-item${i === active ? ' active' : ''}`}
                  role="option"
                  aria-selected={i === active}
                  onClick={() => {
                    track(q);
                    setOpen(false);
                  }}
                >
                  <span className="si-thumb">{it.image ? <img src={it.image} alt="" /> : null}</span>
                  <span className="si-text">
                    <strong>{it.title}</strong>
                    {it.sub ? <small>{it.sub}</small> : null}
                  </span>
                </Link>
              ))}
              {res.total > res.items.length ? (
                <Link href={`/products?q=${encodeURIComponent(q.trim())}`} className="search-all" onClick={() => setOpen(false)}>
                  {labels.all.replace('{n}', res.total)}
                </Link>
              ) : null}
            </>
          ) : (
            <div className="search-empty">{labels.none}</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
