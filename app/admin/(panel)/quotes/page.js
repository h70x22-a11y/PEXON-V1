import Link from 'next/link';
import { requirePerm } from '@/lib/auth';
import { getMessages } from '@/lib/db';
import Flash from '@/components/Flash';
import AdminFilters from '@/components/AdminFilters';
import { cleanDate, inRange, matchesRecord } from '@/lib/adminFilters';
import { QUOTE_STATUSES, statusOf } from '@/lib/quotes';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('ar', { dateStyle: 'medium', timeZone: 'Asia/Riyadh' });
  } catch {
    return iso;
  }
}

export default async function AdminQuotes({ searchParams }) {
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
      <h1>طلبات عروض الأسعار ({all.length})</h1>
      <Flash params={sp} okText="تم الحذف." />

      <div className="status-tabs">
        <Link href="/admin/quotes" className={!status ? 'active' : ''}>الكل ({all.length})</Link>
        {QUOTE_STATUSES.map((s) => (
          <Link key={s.key} href={`/admin/quotes?status=${s.key}`} className={status === s.key ? 'active' : ''}>
            <i style={{ background: s.color }} /> {s.ar} ({count(s.key)})
          </Link>
        ))}
      </div>

      {all.length ? (
        <AdminFilters action="/admin/quotes" sp={sp} hidden={{ status }} placeholder="رقم الطلب، اسم العميل، الشركة، أو رقم الجوال" />
      ) : null}

      {quotes.length ? (
        <div className="table-wrap">
          <table className="quote-table quotes-list">
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>التاريخ</th>
                <th>العميل</th>
                <th>عدد المنتجات</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((m) => {
                const st = statusOf(m.status);
                return (
                  <tr key={m.id}>
                    <td><Link href={`/admin/quotes/${m.id}`}><bdi>{m.number || 'عرض'}</bdi></Link></td>
                    <td>{formatDate(m.date)}</td>
                    <td>
                      <Link href={`/admin/quotes/${m.id}`}>{m.name}</Link>
                      {m.company ? <div className="muted">{m.company}</div> : null}
                    </td>
                    <td>{m.items?.length || 0}</td>
                    <td><span className="status-pill" style={{ background: st.color }}>{st.ar}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted">{all.length ? 'لا توجد طلبات مطابقة.' : 'لا توجد طلبات عروض أسعار حتى الآن. تظهر هنا الطلبات المرسلة من سلة الموقع.'}</p>
      )}
    </>
  );
}
