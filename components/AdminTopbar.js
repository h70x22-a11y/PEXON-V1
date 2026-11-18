'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FiBell, FiMail, FiFileText, FiMessageSquare, FiTruck, FiKey } from 'react-icons/fi';
import { useAdminT } from '@/components/AdminLang';

const ICONS = { quote: FiFileText, message: FiMessageSquare, vendor: FiTruck, reset: FiKey };
const LABEL = {
  quote: 'طلب عرض سعر جديد',
  message: 'رسالة جديدة من الموقع',
  vendor: 'مورد جديد سجّل',
  reset: 'طلب إعادة تعيين كلمة مرور',
};

function ago(iso, lang) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(lang === 'en' ? 'en' : 'ar', { numeric: 'auto' });
  if (s < 60) return rtf.format(0, 'second');
  if (s < 3600) return rtf.format(-Math.floor(s / 60), 'minute');
  if (s < 86400) return rtf.format(-Math.floor(s / 3600), 'hour');
  return rtf.format(-Math.floor(s / 86400), 'day');
}

export default function AdminTopbar({ name, title }) {
  const { t, lang } = useAdminT();
  const [data, setData] = useState({ items: [], unread: 0, chats: 0 });
  const [open, setOpen] = useState(false);
  const box = useRef(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/notify', { cache: 'no-store' });
      if (r.ok) setData(await r.json());
    } catch {}
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(() => document.visibilityState === 'visible' && load(), 30000);
    window.addEventListener('admin-chat-read', load);
    return () => {
      clearInterval(id);
      window.removeEventListener('admin-chat-read', load);
    };
  }, [load]);

  useEffect(() => {
    const close = (e) => box.current && !box.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next && data.unread) {
      await fetch('/api/admin/notify', { method: 'POST' }).catch(() => {});
      setData((d) => ({ ...d, unread: 0 }));
    }
  }

  const initials = String(name || '').trim().slice(0, 1).toUpperCase();

  return (
    <header className="admin-top">
      <div className="admin-top-title">{title}</div>
      <div className="admin-top-tools">
        <Link href="/admin/inbox" className="top-icon" aria-label={t('المحادثات')} title={t('المحادثات')}>
          <FiMail aria-hidden="true" />
          {data.chats ? <span className="top-badge">{data.chats > 99 ? '99+' : data.chats}</span> : null}
        </Link>
        <div className="top-pop-wrap" ref={box}>
          <button type="button" className="top-icon" onClick={toggle} aria-label={t('التنبيهات')} title={t('التنبيهات')} aria-expanded={open}>
            <FiBell aria-hidden="true" />
            {data.unread ? <span className="top-badge">{data.unread > 99 ? '99+' : data.unread}</span> : null}
          </button>
          {open ? (
            <div className="top-pop" role="dialog" aria-label={t('التنبيهات')}>
              <div className="top-pop-head">{t('التنبيهات')}</div>
              {data.items.length ? (
                data.items.map((n) => {
                  const Icon = ICONS[n.kind] || FiBell;
                  return (
                    <Link key={n.kind + n.id} href={n.href} className={`top-note${n.unread ? ' unread' : ''}`} onClick={() => setOpen(false)}>
                      <span className={`note-ico k-${n.kind}`}><Icon aria-hidden="true" /></span>
                      <span className="note-text">
                        <strong>{t(LABEL[n.kind])}</strong>
                        <span>{[n.title, n.name].filter(Boolean).join(' · ')}</span>
                      </span>
                      <span className="note-time">{ago(n.date, lang)}</span>
                    </Link>
                  );
                })
              ) : (
                <p className="muted top-empty">{t('ما فيه تنبيهات.')}</p>
              )}
            </div>
          ) : null}
        </div>
        <Link href="/admin/account" className="top-user" title={t('حسابي')}>
          <span className="top-avatar" aria-hidden="true">{initials}</span>
          <span className="top-name">{name}</span>
        </Link>
      </div>
    </header>
  );
}
