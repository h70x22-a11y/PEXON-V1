import Link from 'next/link';
import { requirePerm } from '@/lib/auth';
import { getActivity, getUsers } from '@/lib/db';
import { adminT } from '@/lib/adminLang';
import { cleanDate, dayOf } from '@/lib/adminFilters';

const KIND = {
  login: { ar: 'دخول', color: '#16a34a' },
  fail: { ar: 'محاولة فاشلة', color: '#b42318' },
  write: { ar: 'إضافة/تعديل', color: '#1c8fd6' },
  delete: { ar: 'حذف', color: '#b45309' },
  read: { ar: 'تحديث', color: '#6b7280' },
};

export default async function ActivityPage({ searchParams }) {
  const { t, locale } = await adminT();
  await requirePerm('audit');
  const sp = await searchParams;
  const [all, users] = await Promise.all([getActivity(2000), getUsers()]);
  const who = String(sp?.user || '');
  const kind = String(sp?.kind || '');
  const from = cleanDate(sp?.from);
  const to = cleanDate(sp?.to);
  const list = all
    .filter((a) => (!who || a.userId === who) && (!kind || a.action === kind))
    .filter((a) => {
      const d = dayOf(a.at);
      return (!from || d >= from) && (!to || d <= to);
    })
    .slice(0, 300);
  const fmt = (iso) => new Date(iso).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Riyadh' });

  return (
    <>
      <h1>{t('سجل النشاط')}</h1>
      <p className="muted" style={{ marginTop: 0 }}>{t('كل تسجيل دخول وكل إضافة أو تعديل أو حذف في لوحة التحكم، مع اسم المستخدم والوقت.')}</p>
      <form className="admin-filters" method="get" action="/admin/activity">
        <div className="field">
          <label>{t('المستخدم')}</label>
          <select name="user" defaultValue={who}>
            <option value="">{t('الكل')}</option>
            <option value="owner">{t('المالك')}</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>{t('النوع')}</label>
          <select name="kind" defaultValue={kind}>
            <option value="">{t('الكل')}</option>
            {Object.entries(KIND).map(([k, v]) => <option key={k} value={k}>{t(v.ar)}</option>)}
          </select>
        </div>
        <div className="field"><label>{t('من تاريخ')}</label><input type="date" name="from" defaultValue={from} /></div>
        <div className="field"><label>{t('إلى تاريخ')}</label><input type="date" name="to" defaultValue={to} /></div>
        <button className="btn" type="submit">{t('بحث')}</button>
        {who || kind || from || to ? <Link href="/admin/activity" className="clear-link">{t('مسح')}</Link> : null}
      </form>
      {list.length ? (
        <div className="table-wrap">
          <table className="quote-table">
            <thead>
              <tr><th>{t('الوقت')}</th><th>{t('المستخدم')}</th><th>{t('النوع')}</th><th>{t('التفاصيل')}</th><th>IP</th></tr>
            </thead>
            <tbody>
              {list.map((a, i) => {
                const k = KIND[a.action] || KIND.read;
                return (
                  <tr key={a.at + i}>
                    <td style={{ whiteSpace: 'nowrap' }}>{fmt(a.at)}</td>
                    <td>{t(a.name || '—')}</td>
                    <td><span className="status-pill" style={{ background: k.color }}>{t(k.ar)}</span></td>
                    <td>{t(a.what || '')}</td>
                    <td className="muted" dir="ltr" style={{ fontSize: '0.8rem' }}>{a.ip || ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted">{t('ما فيه نشاط مسجّل يطابق البحث. السجل يبدأ من الحين.')}</p>
      )}
    </>
  );
}
