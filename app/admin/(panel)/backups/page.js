import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { listBackups } from '@/lib/backup';
import { backupNowAction } from '@/app/actions';
import Flash from '@/components/Flash';
import { adminT } from '@/lib/adminLang';

export default async function BackupsPage({ searchParams }) {
  const { t, locale } = await adminT();
  const session = await requireAdmin();
  if (!session.owner) redirect('/admin?denied=1');
  const sp = await searchParams;
  const list = await listBackups();
  const fmt = (iso) => new Date(iso).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Riyadh' });
  const kb = (n) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

  return (
    <>
      <div className="section-head" style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>{t('النسخ الاحتياطية')}</h1>
        <form action={backupNowAction}><button className="btn small" type="submit">{t('نسخة احتياطية الآن')}</button></form>
      </div>
      <p className="muted" style={{ marginTop: 0 }}>
        {t('نسخة تلقائية كل يوم الساعة 3 الفجر من كل بيانات الموقع ولوحة التحكم (المنتجات، الأقسام، الطلبات، الرسائل، المستخدمين، الإعدادات، المحادثات). النسخ مشفّرة، ونحتفظ بآخر 30 نسخة.')}
      </p>
      <Flash params={sp} okText={t('تم إنشاء نسخة احتياطية.')} />
      {list.length ? (
        <div className="table-wrap">
          <table className="quote-table">
            <thead><tr><th>{t('التاريخ')}</th><th>{t('الحجم')}</th><th></th></tr></thead>
            <tbody>
              {list.map((b) => (
                <tr key={b.pathname}>
                  <td>{fmt(b.at)}</td>
                  <td className="muted">{kb(b.size)}</td>
                  <td><a className="btn ghost small" href={`/api/admin/backup?p=${encodeURIComponent(b.pathname)}`}>{t('تحميل')}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted">{t('ما فيه نسخ للحين. أول نسخة تلقائية الليلة، أو اضغط "نسخة احتياطية الآن".')}</p>
      )}
      <p className="muted" style={{ fontSize: '0.85rem', marginTop: 16 }}>{t('للاسترجاع من نسخة، تواصل مع المطوّر. الاسترجاع يستبدل البيانات الحالية بالكامل.')}</p>
    </>
  );
}
