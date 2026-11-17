'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';

export default function CatalogUpload({ current, onSaved, onRemove }) {
  const input = useRef(null);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });

  async function handleUpload() {
    const file = input.current?.files?.[0];
    if (!file) return setMessage({ type: 'err', text: 'اختر ملف PDF أولاً.' });
    if (file.type !== 'application/pdf') return setMessage({ type: 'err', text: 'الملف لازم يكون PDF.' });
    if (file.size > 100 * 1024 * 1024) return setMessage({ type: 'err', text: 'حجم الملف أكبر من 100 ميجا.' });
    setBusy(true);
    setProgress(0);
    setMessage({ type: '', text: '' });
    try {
      const blob = await upload(`catalog/products-catalog.pdf`, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/catalog-upload',
        contentType: 'application/pdf',
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });
      const res = await onSaved(blob.url);
      if (res?.error) throw new Error(res.error);
      setMessage({ type: 'ok', text: 'تم رفع الكتالوج، ورابطه ظاهر الحين في الموقع.' });
      if (input.current) input.current.value = '';
      router.refresh();
    } catch (e) {
      setMessage({ type: 'err', text: e?.message || 'تعذر رفع الملف.' });
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove() {
    if (!window.confirm('إزالة رابط الكتالوج من الموقع؟')) return;
    setBusy(true);
    await onRemove();
    setBusy(false);
    setMessage({ type: 'ok', text: 'تمت إزالة الكتالوج من الموقع.' });
    router.refresh();
  }

  return (
    <div className="panel" style={{ marginBottom: 20 }}>
      <h2>كتالوج المنتجات (PDF)</h2>
      <p className="muted">يظهر رابط "تحميل كتالوج المنتجات" في قسم الروابط أسفل الموقع. رفع ملف جديد يستبدل القديم.</p>
      {message.text ? <div className={`flash ${message.type}`}>{message.text}</div> : null}
      {current ? (
        <p>
          الملف الحالي:{' '}
          <a href="/catalog.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            فتح الكتالوج ↗
          </a>
        </p>
      ) : (
        <p className="muted">لا يوجد كتالوج مرفوع حالياً.</p>
      )}
      <div className="field">
        <input ref={input} type="file" accept="application/pdf" disabled={busy} />
        <small>الحد الأقصى 100 ميجا.</small>
      </div>
      <div className="row-actions">
        <button type="button" className="btn" onClick={handleUpload} disabled={busy}>
          {busy && progress ? `جاري الرفع ${progress}%` : busy ? 'جاري الرفع...' : 'رفع الكتالوج'}
        </button>
        {current ? (
          <button type="button" className="btn danger small" onClick={handleRemove} disabled={busy}>
            إزالة الكتالوج
          </button>
        ) : null}
      </div>
    </div>
  );
}
