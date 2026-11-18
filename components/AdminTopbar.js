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

// تصغير الصورة في المتصفح قبل الرفع (مربع 256 بكسل)
async function shrink(file) {
  const img = await createImageBitmap(file);
  const size = 256;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const s = Math.min(img.width, img.height);
  c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
  return new Promise((res) => c.toBlob(res, 'image/jpeg', 0.86));
}

export default function AdminTopbar({ name, title, avatar: initialAvatar = '', langToggle = null }) {
  const { t, lang } = useAdminT();
  const [data, setData] = useState({ items: [], unread: 0, chats: 0 });
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [avatar, setAvatar] = useState(initialAvatar);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  const box = useRef(null);
  const menuBox = useRef(null);
  const fileRef = useRef(null);

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setErr('');
    setUploading(true);
    try {
      const blob = await shrink(file);
      const fd = new FormData();
      fd.append('file', blob, 'avatar.jpg');
      const r = await fetch('/api/admin/avatar', { method: 'POST', body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'تعذر رفع الملف.');
      setAvatar(j.url);
      setMenu(false);
    } catch (x) {
      setErr(x.message || 'تعذر رفع الملف.');
    }
    setUploading(false);
  }

  async function removeAvatar() {
    await fetch('/api/admin/avatar', { method: 'DELETE' }).catch(() => {});
    setAvatar('');
    setMenu(false);
  }

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
    const close = (e) => {
      if (box.current && !box.current.contains(e.target)) setOpen(false);
      if (menuBox.current && !menuBox.current.contains(e.target)) setMenu(false);
    };
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
      <Link href="/admin" className="admin-top-logo"><img src="/logo.png" alt="PEXON" width={150} height={40} /></Link>
      <div className="admin-top-title">{title}</div>
      <div className="admin-top-tools">
        <span className="top-lang">{langToggle}</span>
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
        <div className="top-pop-wrap" ref={menuBox}>
          <button type="button" className="top-avatar-btn" onClick={() => setMenu((m) => !m)} aria-label={name} title={name} aria-expanded={menu}>
            {avatar ? <img src={avatar} alt="" className="top-avatar img" /> : <span className="top-avatar" aria-hidden="true">{initials}</span>}
          </button>
          {menu ? (
            <div className="top-pop top-menu" role="menu">
              <div className="top-menu-head">
                {avatar ? <img src={avatar} alt="" className="top-avatar img big" /> : <span className="top-avatar big" aria-hidden="true">{initials}</span>}
                <strong>{name}</strong>
              </div>
              <button type="button" className="top-menu-item" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? t('جاري الرفع...') : avatar ? t('تغيير الصورة الشخصية') : t('إضافة صورة شخصية')}
              </button>
              {avatar ? (
                <button type="button" className="top-menu-item" onClick={removeAvatar}>{t('إزالة الصورة')}</button>
              ) : null}
              <Link href="/admin/account" className="top-menu-item" onClick={() => setMenu(false)}>{t('حسابي')}</Link>
              {err ? <p className="top-menu-err">{t(err)}</p> : null}
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
