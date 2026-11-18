'use client';

import { useEffect, useState } from 'react';
import { useAdminT } from '@/components/AdminLang';

function Avatar({ p, t }) {
  return p.avatar ? <img src={p.avatar} alt="" className="top-avatar img" /> : <span className="top-avatar" aria-hidden="true">{t(p.name).slice(0, 1).toUpperCase()}</span>;
}

// عرض محادثات الموظفين للقراءة فقط
export default function ChatReview() {
  const { t, lang } = useAdminT();
  const [pairs, setPairs] = useState([]);
  const [names, setNames] = useState({});
  const [active, setActive] = useState('');
  const [messages, setMessages] = useState([]);
  const fmt = (iso) => new Date(iso).toLocaleString(lang === 'en' ? 'en-GB' : 'ar', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Riyadh' });

  useEffect(() => {
    fetch('/api/admin/chat/review', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => {
        setPairs(j.pairs || []);
        setNames(j.names || {});
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!active) return;
    setMessages([]);
    fetch(`/api/admin/chat/review?pair=${encodeURIComponent(active)}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => setMessages(j.messages || []))
      .catch(() => {});
  }, [active]);

  const cur = pairs.find((p) => p.pair === active);
  const first = cur?.people[0]?.id;

  return (
    <div className="chat">
      <aside className="chat-list">
        {pairs.length ? (
          pairs.map((p) => (
            <button key={p.pair} type="button" className={`chat-member${p.pair === active ? ' on' : ''}`} onClick={() => setActive(p.pair)}>
              <span className="pair-avatars">
                <Avatar p={p.people[0]} t={t} />
                <Avatar p={p.people[1]} t={t} />
              </span>
              <span className="chat-member-name">
                {t(p.people[0].name)} ↔ {t(p.people[1].name)}
                <small>{fmt(p.last)}</small>
              </span>
            </button>
          ))
        ) : (
          <p className="muted" style={{ padding: 12 }}>{t('ما فيه محادثات بين الموظفين للحين.')}</p>
        )}
      </aside>
      <section className="chat-main">
        {cur ? (
          <>
            <div className="chat-head">
              <strong>{t(cur.people[0].name)} ↔ {t(cur.people[1].name)}</strong>
              <span className="badge" style={{ marginInlineStart: 'auto' }}>{t('للقراءة فقط')}</span>
            </div>
            <div className="chat-body">
              {messages.map((m) => (
                <div key={m.id} className={`bubble${m.from === first ? '' : ' mine'}`}>
                  <small className="bubble-from">{t(names[m.from]?.name || '؟')}</small>
                  <p>{m.text}</p>
                  <time>{fmt(m.date)}</time>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="muted chat-empty">{t('اختر محادثة من القائمة لعرضها.')}</p>
        )}
      </section>
    </div>
  );
}
