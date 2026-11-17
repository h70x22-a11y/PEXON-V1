import Link from 'next/link';
import { requirePerm } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { getMessage } from '@/lib/db';
import { deleteQuoteAction, updateQuoteStatus } from '@/app/actions';
import Flash from '@/components/Flash';
import ConfirmButton from '@/components/ConfirmButton';
import { QUOTE_STATUSES, statusOf } from '@/lib/quotes';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('ar', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Riyadh' });
  } catch {
    return iso;
  }
}

export default async function AdminQuote({ params, searchParams }) {
  await requirePerm('quotes');
  const { id } = await params;
  const sp = await searchParams;
  const q = await getMessage(id);
  if (!q || q.type !== 'quote') notFound();
  const st = statusOf(q.status);
  const wa = String(q.phone || '').replace(/[^0-9]/g, '').replace(/^0/, '966');

  return (
    <>
      <div className="crumbs"><Link href="/admin/quotes">طلبات عروض الأسعار</Link> / <bdi>{q.number || 'طلب'}</bdi></div>
      <div className="section-head" style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>طلب عرض سعر <bdi>{q.number}</bdi></h1>
        <span className="status-pill" style={{ background: st.color, fontSize: '0.95rem', padding: '4px 16px' }}>{st.ar}</span>
      </div>
      <Flash params={sp} okText="تم تحديث الحالة." />

      <div className="panel">
        <h2>تحديث الحالة</h2>
        <form action={updateQuoteStatus} className="status-form">
          <input type="hidden" name="id" value={q.id} />
          <div className="field">
            <label htmlFor="status">الحالة</label>
            <select id="status" name="status" defaultValue={q.status || 'new'} style={{ width: 'auto', minWidth: 180 }}>
              {QUOTE_STATUSES.map((s) => (
                <option key={s.key} value={s.key}>{s.ar}</option>
              ))}
            </select>
          </div>
          <div className="field" style={{ flex: 1, minWidth: 220 }}>
            <label htmlFor="statusNote">ملاحظة داخلية (اختياري)</label>
            <input id="statusNote" type="text" name="statusNote" defaultValue={q.statusNote || ''} maxLength={1000} placeholder="مثال: أُرسل العرض بالإيميل، بانتظار رد العميل" />
          </div>
          <button className="btn" type="submit">حفظ</button>
        </form>
        {q.updated ? <p className="muted" style={{ margin: '10px 0 0', fontSize: '0.88rem' }}>آخر تحديث: {formatDate(q.updated)}{q.updatedBy ? ` · بواسطة ${q.updatedBy}` : ''}</p> : null}
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <h2>بيانات العميل</h2>
        <ul className="vendor-info">
          <li><span>الاسم:</span> {q.name}</li>
          {q.company ? <li><span>الشركة:</span> {q.company}</li> : null}
          {q.phone ? (
            <li>
              <span>الجوال:</span> <a href={`tel:${q.phone}`} dir="ltr">{q.phone}</a>
              {wa ? <> · <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">واتساب</a></> : null}
            </li>
          ) : null}
          {q.email ? <li><span>البريد:</span> <a href={`mailto:${q.email}`} dir="ltr">{q.email}</a></li> : null}
          <li><span>تاريخ الطلب:</span> {formatDate(q.date)}</li>
        </ul>
        {q.message ? <div className="flash warn" style={{ marginBottom: 0 }}>ملاحظة العميل: {q.message}</div> : null}
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <h2>المنتجات المطلوبة ({q.items?.length || 0})</h2>
        <div className="table-wrap">
          <table className="quote-table">
            <thead>
              <tr><th>#</th><th>المنتج</th><th>الكمية</th></tr>
            </thead>
            <tbody>
              {(q.items || []).map((it, n) => (
                <tr key={(it.id || '') + n}>
                  <td>{n + 1}</td>
                  <td>
                    {it.id ? <a href={`/product/${it.id}`} target="_blank" rel="noopener noreferrer">{it.name}</a> : it.name}
                    {it.short ? <div className="muted" style={{ fontSize: '0.85rem' }}>{it.short}</div> : null}
                  </td>
                  <td>{it.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form action={deleteQuoteAction} style={{ marginTop: 24 }}>
        <input type="hidden" name="id" value={q.id} />
        <ConfirmButton message="حذف الطلب نهائياً؟">حذف الطلب</ConfirmButton>
      </form>
    </>
  );
}
