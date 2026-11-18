import { can, requirePerm } from '@/lib/auth';
import { getMessages } from '@/lib/db';
import { updateDataRequest, addDataRequestManual } from '@/app/actions';
import Flash from '@/components/Flash';
import { adminT } from '@/lib/adminLang';

const TYPES = { access: 'الاطلاع على البيانات ونسخة منها', correct: 'تصحيح أو تحديث البيانات', delete: 'حذف البيانات', withdraw: 'سحب الموافقة' };
const STATUS = { new: { ar: 'جديد', color: '#f2a541' }, progress: { ar: 'قيد المعالجة', color: '#37b6ff' }, done: { ar: 'تم التنفيذ', color: '#16a34a' }, rejected: { ar: 'مرفوض', color: '#9aa3af' } };

export default async function DataRequestsPage({ searchParams }) {
  const { t, locale } = await adminT();
  await requirePerm('messages');
  const sp = await searchParams;
  const list = (await getMessages()).filter((m) => m.type === 'datarequest');
  const fmt = (iso) => new Date(iso).toLocaleDateString(locale, { dateStyle: 'medium', timeZone: 'Asia/Riyadh' });
  const daysLeft = (iso) => Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);

  return (
    <>
      <h1>{t('طلبات البيانات الشخصية')} ({list.length})</h1>
      <div className="status-tabs">
        <a href="/admin/messages">{t('رسائل التواصل')}</a>
        <a href="/admin/messages/requests" className="active">{t('طلبات البيانات الشخصية')}</a>
      </div>
      <p className="muted" style={{ marginTop: 0 }}>{t('طلبات العملاء للاطلاع على بياناتهم أو تصحيحها أو حذفها. النظام يلزم بالرد خلال 30 يوماً من تاريخ الطلب. تأكد من هوية مقدّم الطلب قبل التنفيذ.')}</p>
      <Flash params={sp} />
      <details className="panel" style={{ marginBottom: 16 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>{t('إضافة طلب وصل بالبريد')}</summary>
        <form action={addDataRequestManual} style={{ marginTop: 12 }}>
          <div className="form-grid">
            <div className="field"><label>{t('الاسم')}</label><input type="text" name="name" required maxLength={100} /></div>
            <div className="field"><label>{t('رقم الجوال')}</label><input type="tel" name="phone" maxLength={30} dir="ltr" /></div>
            <div className="field"><label>{t('البريد الإلكتروني')}</label><input type="email" name="email" maxLength={120} dir="ltr" /></div>
            <div className="field"><label>{t('تاريخ استلام الطلب')}</label><input type="date" name="received" required defaultValue={new Date().toISOString().slice(0, 10)} dir="ltr" /></div>
          </div>
          <div className="field">
            <label>{t('نوع الطلب')}</label>
            <select name="requestType" defaultValue="access">
              {Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{t(v)}</option>)}
            </select>
          </div>
          <div className="field"><label>{t('التفاصيل')}</label><textarea name="details" maxLength={1500} /></div>
          <button className="btn small" type="submit">{t('إضافة الطلب')}</button>
        </form>
      </details>
      {list.length ? (
        <div className="rows">
          {list.map((m) => {
            const st = STATUS[m.status] || STATUS.new;
            const open = !['done', 'rejected'].includes(m.status);
            const left = daysLeft(m.due);
            return (
              <div key={m.id} className={`msg${open ? ' pending' : ' handled'}`}>
                <div className="top">
                  <strong>{m.name}{m.source === 'email' ? <span className="muted" style={{ fontWeight: 400, fontSize: '0.85rem' }}> · {t('وصل بالبريد')}</span> : null}</strong>
                  <span className="status-pill" style={{ background: st.color }}>{t(st.ar)}</span>
                </div>
                <div className="muted">
                  <a href={`tel:${m.phone}`} dir="ltr">{m.phone}</a>
                  {m.email ? <> · <a href={`mailto:${m.email}`} dir="ltr">{m.email}</a></> : null}
                </div>
                <p style={{ margin: '8px 0' }}><strong>{t(TYPES[m.requestType] || m.requestType)}</strong>{m.details ? ` — ${m.details}` : ''}</p>
                <p className="muted" style={{ margin: 0, fontSize: '0.88rem' }}>
                  {t('تاريخ الطلب')}: {fmt(m.date)} · {t('آخر موعد للرد')}: {fmt(m.due)}
                  {open ? (
                    <strong className={left <= 5 ? 'dr-late' : ''}> · {left >= 0 ? t('باقي {n} يوم', { n: left }) : t('متأخر {n} يوم', { n: -left })}</strong>
                  ) : null}
                </p>
                <form action={updateDataRequest} className="status-form" style={{ marginTop: 10 }}>
                  <input type="hidden" name="id" value={m.id} />
                  <select name="status" defaultValue={m.status || 'new'} aria-label={t('الحالة')} style={{ width: 'auto' }}>
                    {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{t(v.ar)}</option>)}
                  </select>
                  <input type="text" name="note" defaultValue={m.note || ''} maxLength={1000} placeholder={t('ملاحظة (مثال: تم حذف البيانات بتاريخ...)')} aria-label={t('ملاحظة')} style={{ flex: 1, minWidth: 200 }} />
                  <button className="btn small" type="submit">{t('حفظ')}</button>
                </form>
                {m.handledBy ? <p className="muted" style={{ fontSize: '0.82rem', margin: '6px 0 0' }}>{t('آخر تحديث')}: {t(m.handledBy)} · {fmt(m.handledAt)}</p> : null}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="muted">{t('ما فيه طلبات للحين. العملاء يرسلونها بالبريد أو من النموذج المرتبط في سياسة الخصوصية. الطلبات اللي تجيك بالبريد سجّلها من "إضافة طلب وصل بالبريد".')}</p>
      )}
    </>
  );
}
