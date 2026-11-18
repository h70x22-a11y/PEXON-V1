'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { useAdminT } from '@/components/AdminLang';

export default function TeamChat({ initialWith = '' }) {
  const { t, lang } = useAdminT();
  const [members, setMembers] = useState([]);
  const [me, setMe] = useState('');
  const [active, setActive] = useState(initialWith);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const end = useRef(null);
  const fmt = (iso) => new Date(iso).toLocaleString(lang === 'en' ? 'en-GB' : 'ar', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Riyadh' });

  const loadMembers = useCallback(async () => {
    const r = await fetch('/api/admin/chat', { cache: 'no-store' });
    if (!r.ok) return;
    const j = await r.json();
    setMe(j.me);
    setMembers(j.members);
  }, []);

  const loadThread = useCallback(async (id) => {
    if (!id) return;
    const r = await fetch(`/api/admin/chat?with=${encodeURIComponent(id)}`, { cache: 'no-store' });
    if (!r.ok) return;
    const j = await r.json();
    setMessages((prev) => (prev.length === j.messages.length && prev.at(-1)?.id === j.messages.at(-1)?.id ? prev : j.messages));
    setMembers((ms) => ms.map((m) => (m.id === id ? { ...m, unread: 0 } : m)));
    window.dispatchEvent(new Event('admin-chat-read'));
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  useEffect(() => {
    setMessages([]);
    loadThread(active);
    const id = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      loadMembers();
      loadThread(active);
    }, 6000);
    return () => clearInterval(id);
  }, [active, loadThread, loadMembers]);

  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  async function send(e) {
    e.preventDefault();
    const body = text.trim();
    if (!body || !active || busy) return;
    setBusy(true);
    const r = await fetch('/api/admin/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: active, text: body }),
    });
    setBusy(false);
    if (r.ok) {
      const j = await r.json();
      setMessages((m) => [...m, j.message]);
      setText('');
      loadMembers();
    }
  }

  const other = members.find((m) => m.id === active);

  return (
    <div className="chat">
      <aside className="chat-list">
        {members.length ? (
          members.map((m) => (
            <button key={m.id} type="button" className={`chat-member${m.id === active ? ' on' : ''}`} onClick={() => setActive(m.id)}>
              <span className="top-avatar" aria-hidden="true">{t(m.name).slice(0, 1).toUpperCase()}</span>
              <span className="chat-member-name">
                {t(m.name)}
                <small dir="ltr">{m.username}</small>
              </span>
              {m.unread ? <span className="top-badge static">{m.unread}</span> : null}
            </button>
          ))
        ) : (
          <p className="muted" style={{ padding: 12 }}>{t('ما فيه مستخدمين ثانيين في لوحة التحكم للحين.')}</p>
        )}
      </aside>
      <section className="chat-main">
        {other ? (
          <>
            <div className="chat-head">
              <span className="top-avatar" aria-hidden="true">{t(other.name).slice(0, 1).toUpperCase()}</span>
              <strong>{t(other.name)}</strong>
            </div>
            <div className="chat-body">
              {messages.length ? (
                messages.map((m) => (
                  <div key={m.id} className={`bubble${m.from === me ? ' mine' : ''}`}>
                    <p>{m.text}</p>
                    <time>{fmt(m.date)}</time>
                  </div>
                ))
              ) : (
                <p className="muted chat-empty">{t('ابدأ المحادثة برسالة.')}</p>
              )}
              <div ref={end} />
            </div>
            <form className="chat-send" onSubmit={send}>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) send(e);
                }}
                placeholder={t('اكتب رسالة...')}
                aria-label={t('اكتب رسالة...')}
                rows={1}
                maxLength={2000}
                dir="auto"
              />
              <button className="btn" type="submit" disabled={busy || !text.trim()} aria-label={t('إرسال')}>
                <FiSend aria-hidden="true" />
              </button>
            </form>
          </>
        ) : (
          <p className="muted chat-empty">{t('اختر شخص من القائمة عشان تراسله.')}</p>
        )}
      </section>
    </div>
  );
}
