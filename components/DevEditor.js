'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useAdminT } from '@/components/AdminLang';

const fmt = (iso) => {
  try {
    return new Date(iso).toLocaleString('ar', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Riyadh' });
  } catch {
    return '';
  }
};

export default function DevEditor({ repo, branch }) {
  const { t } = useAdminT();
  const [files, setFiles] = useState([]);
  const [commits, setCommits] = useState([]);
  const [filter, setFilter] = useState('');
  const [file, setFile] = useState(null); // { path, sha, content }
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState({ kind: '', msg: '' });
  const [busy, setBusy] = useState(false);
  const area = useRef(null);
  const dirty = file && text !== file.content;

  async function loadTree() {
    const r = await fetch('/api/admin/dev', { cache: 'no-store' });
    const j = await r.json();
    if (!r.ok) return setStatus({ kind: 'error', msg: j.error });
    setFiles(j.files);
    setCommits(j.commits);
  }
  useEffect(() => {
    loadTree();
  }, []);

  useEffect(() => {
    const warn = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  async function open(path) {
    if (dirty && !window.__devDiscard) {
      setStatus({ kind: 'warn', msg: t('عندك تعديلات ما انحفظت. احفظها أو اضغط الملف مرة ثانية لتجاهلها.') });
      window.__devDiscard = true;
      setTimeout(() => (window.__devDiscard = false), 4000);
      return;
    }
    window.__devDiscard = false;
    setBusy(true);
    setStatus({ kind: '', msg: '' });
    const r = await fetch(`/api/admin/dev?path=${encodeURIComponent(path)}`, { cache: 'no-store' });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) return setStatus({ kind: 'error', msg: j.error });
    setFile(j);
    setText(j.content);
    setMessage('');
  }

  async function save() {
    if (!file || !dirty || busy) return;
    setBusy(true);
    setStatus({ kind: '', msg: t('جاري الحفظ...') });
    const r = await fetch('/api/admin/dev', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: file.path, content: text, sha: file.sha, message }),
    });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) return setStatus({ kind: 'error', msg: j.error });
    setFile({ ...file, sha: j.sha, content: text });
    setMessage('');
    setStatus({ kind: 'ok', msg: t('تم الحفظ. التعديل ينشر على الموقع خلال دقيقة إلى دقيقتين.') });
    loadTree();
  }

  function onKey(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      save();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.target;
      const { selectionStart: a, selectionEnd: b } = el;
      const next = text.slice(0, a) + '  ' + text.slice(b);
      setText(next);
      requestAnimationFrame(() => el.setSelectionRange(a + 2, a + 2));
    }
  }

  const shown = useMemo(() => {
    const f = filter.trim().toLowerCase();
    return f ? files.filter((x) => x.path.toLowerCase().includes(f)) : files;
  }, [files, filter]);

  const lines = text ? text.split('\n').length : 0;

  return (
    <div className="dev">
      <aside className="dev-files" dir="ltr">
        <input type="search" placeholder="Filter files…" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label={t('بحث في الملفات')} />
        <div className="dev-list">
          {shown.map((f) => (
            <button key={f.path} type="button" className={file?.path === f.path ? 'on' : ''} onClick={() => open(f.path)} title={f.path}>
              {f.path}
            </button>
          ))}
          {!files.length ? <p className="muted">...</p> : null}
        </div>
      </aside>

      <section className="dev-main">
        {file ? (
          <>
            <div className="dev-bar">
              <code dir="ltr">{file.path}</code>
              {dirty ? <span className="dev-dirty">{t('● غير محفوظ')}</span> : null}
              <span className="muted" style={{ marginInlineStart: 'auto' }}>{lines} {t('سطر')}</span>
            </div>
            <textarea
              ref={area}
              className="dev-code"
              dir="ltr"
              spellCheck={false}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKey}
              aria-label={t('محتوى الملف')}
            />
            <div className="dev-save">
              <input
                type="text"
                placeholder={t('وصف التعديل (اختياري)، مثال: تغيير لون الزر')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={200}
                aria-label={t('وصف التعديل')}
              />
              <button className="btn" type="button" onClick={save} disabled={!dirty || busy}>
                {t('حفظ ونشر')}
              </button>
              {dirty ? (
                <button className="btn ghost" type="button" onClick={() => setText(file.content)} disabled={busy}>
                  {t('تراجع')}
                </button>
              ) : null}
            </div>
          </>
        ) : (
          <p className="muted dev-empty">{t('اختر ملف من القائمة لعرضه وتعديله. (Ctrl+S للحفظ)')}</p>
        )}
        {status.msg ? <div className={`flash ${status.kind === 'error' ? 'err' : status.kind === 'warn' ? 'warn' : status.kind === 'ok' ? 'ok' : ''}`}>{status.msg}</div> : null}

        <h2 style={{ marginTop: 28 }}>{t('آخر التعديلات على الكود')}</h2>
        <ul className="dev-commits">
          {commits.map((c) => (
            <li key={c.sha}>
              <a href={c.url} target="_blank" rel="noopener noreferrer" dir="ltr"><code>{c.sha}</code></a>
              <span>{c.message}</span>
              <span className="muted">{fmt(c.date)}</span>
            </li>
          ))}
        </ul>
        <p className="muted" style={{ fontSize: '0.85rem' }} dir="ltr">{repo} · {branch}</p>
      </section>
    </div>
  );
}
