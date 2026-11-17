import { getMessages } from '@/lib/db';
import { deleteMessageAction } from '@/app/actions';
import Flash from '@/components/Flash';
import ConfirmButton from '@/components/ConfirmButton';
import { activityLabel } from '@/lib/vendor';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('ar', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Riyadh' });
  } catch {
    return iso;
  }
}

export default async function AdminMessages({ searchParams }) {
  const sp = await searchParams;
  const messages = await getMessages();

  return (
    <>
      <h1>الرسائل ({messages.length})</h1>
      <Flash params={sp} okText="تم الحذف." />
      <div className="rows">
        {messages.map((m) => (
          <div className="msg" key={m.id}>
            <div className="top">
              <strong>{m.name}</strong>
              <span className="muted">{formatDate(m.date)}</span>
            </div>
            <div className="muted">
              {m.phone ? <a href={`tel:${m.phone}`} dir="ltr">{m.phone}</a> : null}
              {m.email ? <>{m.phone ? ' · ' : ''}<a href={`mailto:${m.email}`} dir="ltr">{m.email}</a></> : null}
              {m.product ? <> · المنتج: {m.product}</> : null}
            </div>
            {m.type === 'quote' ? <span className="badge" style={{ display: 'inline-block', marginTop: 8 }}>طلب عرض سعر</span> : null}
            {m.type === 'vendor' ? <span className="badge" style={{ display: 'inline-block', marginTop: 8, background: '#c7e9ff' }}>تسجيل مورد</span> : null}
            {m.company ? <div className="muted">الشركة: {m.company}</div> : null}
            {m.vendor ? (
              <ul className="vendor-info">
                <li><span>السجل التجاري:</span> <bdi>{m.vendor.cr}</bdi></li>
                {m.vendor.activity ? <li><span>النشاط:</span> {activityLabel(m.vendor.activity)}</li> : null}
              </ul>
            ) : null}
            {m.items?.length ? (
              <table className="quote-table">
                <thead>
                  <tr><th>#</th><th>المنتج</th><th>الكمية</th></tr>
                </thead>
                <tbody>
                  {m.items.map((it, n) => (
                    <tr key={it.id + n}>
                      <td>{n + 1}</td>
                      <td>
                        <a href={`/product/${it.id}`} target="_blank" rel="noopener noreferrer">{it.name}</a>
                        {it.short ? <div className="muted" style={{ fontSize: '0.85rem' }}>{it.short}</div> : null}
                      </td>
                      <td>{it.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
            {m.message ? <p>{m.message}</p> : null}
            <form action={deleteMessageAction}>
              <input type="hidden" name="id" value={m.id} />
              <ConfirmButton message="حذف هذه الرسالة؟">حذف</ConfirmButton>
            </form>
          </div>
        ))}
        {!messages.length ? <p className="muted">لا توجد رسائل حتى الآن.</p> : null}
      </div>
    </>
  );
}
