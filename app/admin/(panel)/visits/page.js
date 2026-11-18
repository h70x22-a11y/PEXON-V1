import Link from 'next/link';
import { requirePerm } from '@/lib/auth';
import { getCategories, getProducts, getVisitStats } from '@/lib/db';
import { pick } from '@/lib/i18n';
import LineChart from '@/components/LineChart';
import { adminT } from '@/lib/adminLang';

export const dynamic = 'force-dynamic';

const PERIODS = [
  { days: 1, label: 'اليوم' },
  { days: 7, label: '7 أيام' },
  { days: 30, label: '30 يوم' },
  { days: 90, label: '90 يوم' },
  { days: 365, label: 'سنة' },
];

const SOURCES = {
  direct: 'دخول مباشر',
  google: 'بحث قوقل',
  'google-ads': 'إعلانات قوقل',
  'search-other': 'محركات بحث أخرى',
  instagram: 'انستقرام',
  facebook: 'فيسبوك',
  whatsapp: 'واتساب',
  x: 'إكس (تويتر)',
  tiktok: 'تيك توك',
  snapchat: 'سناب شات',
  linkedin: 'لينكدإن',
  youtube: 'يوتيوب',
  email: 'البريد الإلكتروني',
  campaign: 'حملات أخرى',
  other: 'مواقع أخرى',
};

const STATIC_PAGES = {
  '/': 'الصفحة الرئيسية',
  '/products': 'جميع المنتجات',
  '/contact': 'تواصل معنا',
  '/quote': 'سلة عرض السعر',
  '/privacy': 'سياسة الخصوصية',
  '/return-policy': 'سياسة الاسترجاع',
  '/vendor-registration': 'تسجيل الموردين',
  '/data-request': 'طلب يخص البيانات',
};

function Bars({ rows, total, label }) {
  return (
    <div className="vbars">
      {rows.map(([key, n]) => {
        const pct = total ? Math.round((n / total) * 100) : 0;
        return (
          <div className="vbar" key={key}>
            <div className="vbar-top">
              <bdi>{label(key)}</bdi>
              <span>{n.toLocaleString('en')} <small>({pct}%)</small></span>
            </div>
            <div className="vbar-track"><i style={{ width: `${Math.max(2, pct)}%` }} /></div>
          </div>
        );
      })}
    </div>
  );
}

export default async function VisitsPage({ searchParams }) {
  const { t, lang, locale } = await adminT();
  await requirePerm('searches');
  const sp = await searchParams;
  const days = PERIODS.some((p) => p.days === Number(sp?.days)) ? Number(sp.days) : 30;
  const [stats, products, categories] = await Promise.all([getVisitStats(days), getProducts(), getCategories()]);
  const { totals } = stats;
  const requests = totals.lead + totals.contact;
  const conv = totals.sessions ? ((requests / totals.sessions) * 100).toFixed(1) : '0';
  const mobilePct = totals.m + totals.d ? Math.round((totals.m / (totals.m + totals.d)) * 100) : 0;

  const prodName = Object.fromEntries(products.map((p) => [String(p.id), pick(p, 'name', lang) || p.name]));
  const catName = Object.fromEntries(categories.map((c) => [String(c.id), pick(c, 'name', lang) || c.name]));
  const pageLabel = (path) => {
    if (STATIC_PAGES[path]) return t(STATIC_PAGES[path]);
    const m = path.match(/^\/(product|category)\/(.+)$/);
    if (m) {
      const name = (m[1] === 'product' ? prodName : catName)[m[2]];
      if (name) return `${m[1] === 'product' ? t('منتج') : t('قسم')}: ${name}`;
    }
    return path;
  };
  const fmt = (d) => new Date(`${d}T12:00:00`).toLocaleDateString(locale, { day: 'numeric', month: 'short' });

  return (
    <>
      <h1>{t('الزيارات')}</h1>
      <p className="muted" style={{ marginTop: 0 }}>{t('قياس داخلي من الموقع نفسه: أرقام إجمالية بدون أي بيانات شخصية، ويحسب كل الزوار. الزيارة = دخول زائر للموقع، والمشاهدات = عدد الصفحات المفتوحة.')}</p>

      <div className="period-tabs" role="tablist">
        {PERIODS.map((p) => (
          <Link key={p.days} href={`/admin/visits?days=${p.days}`} className={p.days === days ? 'active' : ''} aria-current={p.days === days ? 'page' : undefined}>
            {t(p.label)}
          </Link>
        ))}
      </div>

      <div className="stats">
        <div className="stat"><b>{totals.sessions.toLocaleString('en')}</b>{t('زيارة')}</div>
        <div className="stat"><b>{totals.views.toLocaleString('en')}</b>{t('مشاهدة صفحة')}</div>
        <div className="stat"><b>{totals.add.toLocaleString('en')}</b>{t('إضافة للسلة')}</div>
        <div className="stat"><b>{requests.toLocaleString('en')}</b>{t('طلب عرض سعر')} <small className="muted">({t('الموقع')} {totals.lead} · {t('واتساب')} {totals.contact})</small></div>
        <div className="stat"><b>{conv}%</b>{t('نسبة الزيارات اللي طلبت عرض سعر')}</div>
      </div>

      {days > 1 ? (
        <section className="panel">
          <h2>{t('الزيارات يومياً')}</h2>
          <LineChart
            labels={stats.daily.map((d) => fmt(d.day))}
            series={[
              { name: 'الزيارات', color: '#1c8fd6', values: stats.daily.map((d) => d.sessions) },
              { name: 'مشاهدات الصفحات', color: '#e8590c', dashed: true, values: stats.daily.map((d) => d.views) },
            ]}
            empty={t('ما فيه زيارات مسجلة في هذي الفترة.')}
          />
        </section>
      ) : null}

      <div className="vgrid">
        <section className="panel">
          <h2>{t('من وين جاء الزوار')}</h2>
          {stats.sources.length ? (
            <Bars rows={stats.sources} total={totals.sessions} label={(k) => t(SOURCES[k] || k)} />
          ) : (
            <p className="muted">{t('ما فيه بيانات للحين.')}</p>
          )}
          <p className="muted" style={{ fontSize: '0.82rem', marginBottom: 0 }}>{t('"دخول مباشر" يشمل اللي كتبوا الرابط بأنفسهم أو فتحوه من تطبيق ما يرسل مصدره، مثل بعض روابط الواتساب.')}</p>
        </section>

        <section className="panel">
          <h2>{t('نوع الجهاز')}</h2>
          {totals.m + totals.d ? (
            <Bars rows={[['m', totals.m], ['d', totals.d]]} total={totals.m + totals.d} label={(k) => (k === 'm' ? t('جوال') : t('كمبيوتر'))} />
          ) : (
            <p className="muted">{t('ما فيه بيانات للحين.')}</p>
          )}
          {totals.m + totals.d ? <p className="muted" style={{ fontSize: '0.85rem', marginBottom: 0 }}>{t('{n}% من الزوار يستخدمون الجوال.', { n: mobilePct })}</p> : null}
        </section>
      </div>

      <section className="panel">
        <h2>{t('أكثر الصفحات مشاهدة')}</h2>
        {stats.pages.length ? (
          <Bars rows={stats.pages} total={totals.views} label={pageLabel} />
        ) : (
          <p className="muted">{t('ما فيه بيانات للحين.')}</p>
        )}
      </section>
    </>
  );
}
