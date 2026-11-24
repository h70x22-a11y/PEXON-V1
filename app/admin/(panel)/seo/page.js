import Link from 'next/link';
import { requirePerm } from '@/lib/auth';
import { adminT } from '@/lib/adminLang';
import { getSeoData, gscEmail, gscReady } from '@/lib/gsc';
import SeoReport from '@/components/SeoReport';

export const dynamic = 'force-dynamic';

const PERIODS = [
  { days: 7, label: '7 أيام' },
  { days: 28, label: '28 يوم' },
  { days: 90, label: '3 شهور' },
  { days: 180, label: '6 شهور' },
  { days: 480, label: '16 شهر' },
];

export default async function SeoPage({ searchParams }) {
  const { t } = await adminT();
  await requirePerm('searches');
  const sp = await searchParams;
  const days = PERIODS.some((p) => p.days === Number(sp?.days)) ? Number(sp.days) : 90;

  let data = null, error = null;
  if (gscReady()) {
    try {
      data = await getSeoData(days);
    } catch (e) {
      error = String(e?.message || e);
    }
  }

  return (
    <>
      <h1>{t('SEO')}</h1>
      <p className="muted" style={{ marginTop: 0 }}>{t('ظهور الموقع في نتائج قوقل، من Google Search Console مباشرة. قوقل يعرض البيانات متأخرة يومين إلى ثلاثة أيام تقريباً.')}</p>

      <div className="period-tabs" role="tablist">
        {PERIODS.map((p) => (
          <Link key={p.days} href={`/admin/seo?days=${p.days}`} className={p.days === days ? 'active' : ''} aria-current={p.days === days ? 'page' : undefined}>
            {t(p.label)}
          </Link>
        ))}
      </div>

      {!gscReady() ? (
        <section className="panel">
          <h2>{t('الربط مع قوقل غير مفعّل')}</h2>
          <p className="muted">{t('أضف المتغير GSC_SERVICE_ACCOUNT في إعدادات Vercel (محتوى ملف JSON حق حساب الخدمة)، وأضف إيميل حساب الخدمة كمستخدم في Search Console بصلاحية قراءة، ثم أعد النشر.')}</p>
        </section>
      ) : error ? (
        <section className="panel">
          <h2>{t('ما قدرنا نسحب البيانات من قوقل')}</h2>
          <p className="muted">{t('تأكد إن هذا الإيميل مضاف كمستخدم في Search Console للموقع:')} <bdi dir="ltr">{gscEmail()}</bdi></p>
          <pre dir="ltr" style={{ whiteSpace: 'pre-wrap', fontSize: '.8rem' }}>{error}</pre>
        </section>
      ) : (
        <SeoReport data={data} />
      )}
    </>
  );
}
