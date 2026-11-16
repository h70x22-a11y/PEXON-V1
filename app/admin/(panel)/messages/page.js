import { getMessages } from '@/lib/db';
import { deleteMessageAction } from '@/app/actions';
import Flash from '@/components/Flash';
import ConfirmButton from '@/components/ConfirmButton';

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
              <a href={`tel:${m.phone}`} dir="ltr">{m.phone}</a>
              {m.email ? <> · <a href={`mailto:${m.email}`} dir="ltr">{m.email}</a></> : null}
              {m.product ? <> · المنتج: {m.product}</> : null}
            </div>
            <p>{m.message}</p>
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
