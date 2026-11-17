import { getMessages } from '@/lib/db';
import { deleteVendorAction } from '@/app/actions';
import Flash from '@/components/Flash';
import ConfirmButton from '@/components/ConfirmButton';
import { VENDOR_ACTIVITIES, activityLabel } from '@/lib/vendor';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('ar', { dateStyle: 'medium', timeZone: 'Asia/Riyadh' });
  } catch {
    return iso;
  }
}

export default async function AdminVendors({ searchParams }) {
  const sp = await searchParams;
  const all = (await getMessages()).filter((m) => m.type === 'vendor');
  const q = String(sp?.q || '').trim().toLowerCase();
  const act = String(sp?.activity || '');
  const vendors = all.filter(
    (v) =>
      (!act || v.vendor?.activity === act) &&
      (!q || `${v.company} ${v.name} ${v.email} ${v.phone} ${v.vendor?.cr}`.toLowerCase().includes(q))
  );
  const used = VENDOR_ACTIVITIES.filter((a) => all.some((v) => v.vendor?.activity === a.key));

  return (
    <>
      <div className="section-head" style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>الموردين المسجلين ({all.length})</h1>
        {all.length ? <a className="btn ghost small" href="/api/admin/vendors-csv">تصدير Excel (CSV)</a> : null}
      </div>
      <Flash params={sp} okText="تم الحذف." />

      {all.length ? (
        <form className="search" method="get" action="/admin/vendors" style={{ flexWrap: 'wrap' }}>
          <input type="search" name="q" defaultValue={sp?.q || ''} placeholder="ابحث باسم الشركة أو المسؤول أو السجل..." style={{ minWidth: 200 }} />
          <select name="activity" defaultValue={act} style={{ maxWidth: 280 }}>
            <option value="">كل الأنشطة</option>
            {used.map((a) => (
              <option key={a.key} value={a.key}>{a.ar}</option>
            ))}
          </select>
          <button className="btn" type="submit">عرض</button>
        </form>
      ) : null}

      {vendors.length ? (
        <div className="table-wrap">
          <table className="quote-table vendors-table">
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>الشركة</th>
                <th>السجل التجاري</th>
                <th>النشاط</th>
                <th>المسؤول</th>
                <th>التواصل</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.id}>
                  <td>{formatDate(v.date)}</td>
                  <td><strong>{v.company}</strong></td>
                  <td><bdi>{v.vendor?.cr}</bdi></td>
                  <td>{activityLabel(v.vendor?.activity)}</td>
                  <td>{v.name}</td>
                  <td>
                    <a href={`mailto:${v.email}`} dir="ltr">{v.email}</a>
                    {v.phone ? <div><a href={`tel:${v.phone}`} dir="ltr">{v.phone}</a></div> : null}
                  </td>
                  <td>
                    <form action={deleteVendorAction}>
                      <input type="hidden" name="id" value={v.id} />
                      <ConfirmButton message={`حذف المورد «${v.company}»؟`}>حذف</ConfirmButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted">{all.length ? 'لا توجد نتائج مطابقة.' : 'لا يوجد موردين مسجلين حتى الآن. يظهر هنا كل من يسجّل من صفحة تسجيل الموردين.'}</p>
      )}
    </>
  );
}
