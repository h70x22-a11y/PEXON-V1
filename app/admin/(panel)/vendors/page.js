import { getMessages } from '@/lib/db';
import { can, requirePerm } from '@/lib/auth';
import { deleteVendorAction } from '@/app/actions';
import Flash from '@/components/Flash';
import AdminFilters from '@/components/AdminFilters';
import { cleanDate, inRange, matchesRecord } from '@/lib/adminFilters';
import ConfirmButton from '@/components/ConfirmButton';
import { VENDOR_ACTIVITIES, activityLabel } from '@/lib/vendor';
import { adminT } from '@/lib/adminLang';

function formatDate(iso, locale = 'ar') {
  try {
    return new Date(iso).toLocaleDateString(locale, { dateStyle: 'medium', timeZone: 'Asia/Riyadh' });
  } catch {
    return iso;
  }
}

export default async function AdminVendors({ searchParams }) {
  const { t, lang, locale, dir } = await adminT();
  const session = await requirePerm('vendors');
  const canW = can(session, 'vendors:write');
  const canD = can(session, 'vendors:delete');
  const sp = await searchParams;
  const all = (await getMessages()).filter((m) => m.type === 'vendor');
  const act = String(sp?.activity || '');
  const from = cleanDate(sp?.from);
  const to = cleanDate(sp?.to);
  const vendors = all.filter(
    (v) =>
      (!act || v.vendor?.activity === act) &&
      inRange(v.date, from, to) &&
      matchesRecord(v, sp?.q, [v.company, v.name, v.email, v.phone, v.vendor?.cr])
  );
  const used = VENDOR_ACTIVITIES.filter((a) => all.some((v) => v.vendor?.activity === a.key));

  return (
    <>
      <div className="section-head" style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>{t('الموردين المسجلين (')}{all.length})</h1>
        {all.length ? <a className="btn ghost small" href="/api/admin/vendors-csv">{t('تصدير Excel (CSV)')}</a> : null}
      </div>
      <Flash params={sp} okText={t('تم الحذف.')} />

      {all.length ? (
        <AdminFilters action="/admin/vendors" sp={sp} placeholder={t('اسم الشركة، المسؤول، السجل، أو رقم الجوال')}>
          <div className="field">
            <label>{t('النشاط')}</label>
            <select name="activity" defaultValue={act} style={{ maxWidth: 260 }}>
              <option value="">{t('كل الأنشطة')}</option>
              {used.map((a) => (
                <option key={a.key} value={a.key}>{a[lang]}</option>
              ))}
            </select>
          </div>
        </AdminFilters>
      ) : null}

      {vendors.length ? (
        <div className="table-wrap">
          <table className="quote-table vendors-table">
            <thead>
              <tr>
                <th>{t('التاريخ')}</th>
                <th>{t('الشركة')}</th>
                <th>{t('السجل التجاري')}</th>
                <th>{t('النشاط')}</th>
                <th>{t('المسؤول')}</th>
                <th>{t('التواصل')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.id}>
                  <td>{formatDate(v.date, locale)}</td>
                  <td><strong>{v.company}</strong></td>
                  <td><bdi>{v.vendor?.cr}</bdi></td>
                  <td>{activityLabel(v.vendor?.activity, lang)}</td>
                  <td>{v.name}</td>
                  <td>
                    <a href={`mailto:${v.email}`} dir="ltr">{v.email}</a>
                    {v.phone ? <div><a href={`tel:${v.phone}`} dir="ltr">{v.phone}</a></div> : null}
                  </td>
                  <td>
                    {canD ? (
                    <form action={deleteVendorAction}>
                      <input type="hidden" name="id" value={v.id} />
                      <ConfirmButton message={t('حذف المورد «{name}»؟', { name: v.company })}>{t('حذف')}</ConfirmButton>
                    </form>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted">{all.length ? t('لا توجد نتائج مطابقة.') : t('لا يوجد موردين مسجلين حتى الآن. يظهر هنا كل من يسجّل من صفحة تسجيل الموردين.')}</p>
      )}
    </>
  );
}
