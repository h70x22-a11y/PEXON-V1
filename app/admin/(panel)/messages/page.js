import { getMessages } from '@/lib/db';
import { can, requirePerm } from '@/lib/auth';
import { deleteMessageAction } from '@/app/actions';
import Flash from '@/components/Flash';
import AdminFilters from '@/components/AdminFilters';
import { cleanDate, inRange, matchesRecord } from '@/lib/adminFilters';
import ConfirmButton from '@/components/ConfirmButton';
import { activityLabel } from '@/lib/vendor';
import { adminT } from '@/lib/adminLang';

function formatDate(iso, locale = 'ar') {
  try {
    return new Date(iso).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Riyadh' });
  } catch {
    return iso;
  }
}

export default async function AdminMessages({ searchParams }) {
  const { t, lang, locale, dir } = await adminT();
  const session = await requirePerm('messages');
  const canW = can(session, 'messages:write');
  const canD = can(session, 'messages:delete');
  const sp = await searchParams;
  const all = (await getMessages()).filter((m) => m.type !== 'vendor' && m.type !== 'quote');
  const from = cleanDate(sp?.from);
  const to = cleanDate(sp?.to);
  const messages = all.filter(
    (m) => inRange(m.date, from, to) && matchesRecord(m, sp?.q, [m.name, m.phone, m.email, m.product, m.message])
  );

  return (
    <>
      <h1>{t('الرسائل (')}{all.length})</h1>
      <Flash params={sp} okText={t('تم الحذف.')} />
      {all.length ? <AdminFilters action="/admin/messages" sp={sp} placeholder={t('الاسم، رقم الجوال، الإيميل، أو نص الرسالة')} /> : null}
      {all.length && !messages.length ? <p className="muted">{t('لا توجد رسائل مطابقة.')}</p> : null}
      <div className="rows">
        {messages.map((m) => (
          <div className="msg" key={m.id}>
            <div className="top">
              <strong>{m.name}</strong>
              <span className="muted">{formatDate(m.date, locale)}</span>
            </div>
            <div className="muted">
              {m.phone ? <a href={`tel:${m.phone}`} dir="ltr">{m.phone}</a> : null}
              {m.email ? <>{m.phone ? ' · ' : ''}<a href={`mailto:${m.email}`} dir="ltr">{m.email}</a></> : null}
              {m.product ? <> {t('· المنتج:')} {m.product}</> : null}
            </div>
            {m.type === 'quote' ? <span className="badge" style={{ display: 'inline-block', marginTop: 8 }}>{t('طلب عرض سعر')}</span> : null}
            {m.type === 'vendor' ? <span className="badge" style={{ display: 'inline-block', marginTop: 8, background: '#c7e9ff' }}>{t('تسجيل مورد')}</span> : null}
            {m.company ? <div className="muted">{t('الشركة:')} {m.company}</div> : null}
            {m.vendor ? (
              <ul className="vendor-info">
                <li><span>{t('السجل التجاري:')}</span> <bdi>{m.vendor.cr}</bdi></li>
                {m.vendor.activity ? <li><span>{t('النشاط:')}</span> {activityLabel(m.vendor.activity, lang)}</li> : null}
              </ul>
            ) : null}
            {m.items?.length ? (
              <table className="quote-table">
                <thead>
                  <tr><th>#</th><th>{t('المنتج')}</th><th>{t('الكمية')}</th></tr>
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
            {canD ? (
            <form action={deleteMessageAction}>
              <input type="hidden" name="id" value={m.id} />
              <ConfirmButton message={t('حذف هذه الرسالة؟')}>{t('حذف')}</ConfirmButton>
            </form>
            ) : null}
          </div>
        ))}
        {!messages.length ? <p className="muted">{t('لا توجد رسائل حتى الآن.')}</p> : null}
      </div>
    </>
  );
}
