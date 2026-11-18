import Link from 'next/link';
import { requirePerm } from '@/lib/auth';
import { getMessages } from '@/lib/db';
import Flash from '@/components/Flash';
import AdminFilters from '@/components/AdminFilters';
import { cleanDate, inRange, matchesRecord } from '@/lib/adminFilters';
import { QUOTE_STATUSES, statusOf } from '@/lib/quotes';
import { adminT } from '@/lib/adminLang';

function formatDate(iso, locale = 'ar') {
  try {
    return new Date(iso).toLocaleDateString(locale, { dateStyle: 'medium', timeZone: 'Asia/Riyadh' });
  } catch {
    return iso;
  }
}

export default async function AdminQuotes({ searchParams }) {
  const { t, lang, locale, dir } = await adminT();
  await requirePerm('quotes');
  const sp = await searchParams;
  const all = (await getMessages()).filter((m) => m.type === 'quote');
  const status = String(sp?.status || '');
  const from = cleanDate(sp?.from);
  const to = cleanDate(sp?.to);
  const quotes = all.filter(
    (m) =>
      (!status || (m.status || 'new') === status) &&
      inRange(m.date, from, to) &&
      matchesRecord(m, sp?.q, [m.number, m.name, m.company, m.phone, m.email])
  );
  const count = (key) => all.filter((m) => (m.status || 'new') === key).length;

  return (
    <>
      <h1>{t('طلبات عروض الأسعار (')}{all.length})</h1>
      <Flash params={sp} okText={t('تم الحذف.')} />

      <div className="status-tabs">
        <Link href="/admin/quotes" className={!status ? 'active' : ''}>{t('الكل (')}{all.length})</Link>
        {QUOTE_STATUSES.map((s) => (
          <Link key={s.key} href={`/admin/quotes?status=${s.key}`} className={status === s.key ? 'active' : ''}>
            <i style={{ background: s.color }} /> {t(s.ar)} ({count(s.key)})
          </Link>
        ))}
      </div>

      {all.length ? (
        <AdminFilters action="/admin/quotes" sp={sp} hidden={{ status }} placeholder={t('رقم الطلب، اسم العميل، الشركة، أو رقم الجوال')} />
      ) : null}

      {quotes.length ? (
        <div className="table-wrap">
          <table className="quote-table quotes-list">
            <thead>
              <tr>
                <th>{t('رقم الطلب')}</th>
                <th>{t('التاريخ')}</th>
                <th>{t('العميل')}</th>
                <th>{t('عدد المنتجات')}</th>
                <th>{t('الحالة')}</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((m) => {
                const st = statusOf(m.status);
                return (
                  <tr key={m.id}>
                    <td><Link href={`/admin/quotes/${m.id}`}><bdi>{m.number || t('عرض')}</bdi></Link></td>
                    <td>{formatDate(m.date, locale)}</td>
                    <td>
                      <Link href={`/admin/quotes/${m.id}`}>{m.name}</Link>
                      {m.company ? <div className="muted">{m.company}</div> : null}
                    </td>
                    <td>{m.items?.length || 0}</td>
                    <td><span className="status-pill" style={{ background: st.color }}>{t(st.ar)}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted">{all.length ? t('لا توجد طلبات مطابقة.') : t('لا توجد طلبات عروض أسعار حتى الآن. تظهر هنا الطلبات المرسلة من سلة الموقع.')}</p>
      )}
    </>
  );
}
