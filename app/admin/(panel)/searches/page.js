import Link from 'next/link';
import { can, requirePerm } from '@/lib/auth';
import { getCategories, getProducts, getSearchStats, getSettings } from '@/lib/db';
import { parseSynonyms, searchProducts } from '@/lib/catalog';
import { saveSynonymsAction } from '@/app/actions';
import Flash from '@/components/Flash';
import SearchChart from '@/components/SearchChart';
import { adminT } from '@/lib/adminLang';

export const dynamic = 'force-dynamic';

const PERIODS = [
  { days: 1, label: 'اليوم' },
  { days: 7, label: '7 أيام' },
  { days: 30, label: '30 يوم' },
  { days: 90, label: '90 يوم' },
  { days: 365, label: 'سنة' },
];

function Table({ t, rows, nowCount, zero }) {
  return (
    <div className="table-wrap">
      <table className="quote-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{t('كلمة البحث')}</th>
            <th>{zero ? t('مرات البحث بدون نتيجة') : t('مرات البحث')}</th>
            <th>{t('نتائجها الحين')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const n = nowCount(r.label);
            return (
              <tr key={r.key}>
                <td className="muted">{i + 1}</td>
                <td><strong><bdi>{r.label}</bdi></strong></td>
                <td>{r.count}</td>
                <td>
                  {n ? n : <span className="search-miss">{t('لا يوجد')}</span>}
                  {zero && n ? <span className="search-fixed"> {t('· صار لها نتائج')}</span> : null}
                </td>
                <td>
                  <a href={`/products?q=${encodeURIComponent(r.label)}`} target="_blank" rel="noopener noreferrer">{t('جرّب ↗')}</a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminSearches({ searchParams }) {
  const { t, lang, locale, dir } = await adminT();
  const session = await requirePerm('searches');
  const canW = can(session, 'searches:write');
  const canD = can(session, 'searches:delete');
  const sp = await searchParams;
  const days = PERIODS.some((p) => p.days === Number(sp?.days)) ? Number(sp.days) : 30;
  const [stats, products, categories, settings] = await Promise.all([getSearchStats(days), getProducts(), getCategories(), getSettings()]);
  const synonyms = parseSynonyms(settings.searchSynonyms);
  const cache = new Map();
  const nowCount = (label) => {
    if (!cache.has(label)) cache.set(label, searchProducts(products, label, categories, synonyms).length);
    return cache.get(label);
  };
  const zeroPct = stats.total ? Math.round((stats.zeroTotal / stats.total) * 100) : 0;

  return (
    <>
      <h1>{t('إحصائيات البحث')}</h1>
      <p className="muted">{t('وش يبحث عنه العملاء في الموقع، والكلمات اللي ما لقوا لها منتج. الكلمات اللي ما لها نتائج تساعدك تعرف وش المنتجات اللي تستاهل تضيفها، أو المرادفات اللي نحتاج نضيفها للبحث.')}</p>

      <Flash params={sp} okText={t('تم حفظ الكلمات المرادفة.')} />
      <details className="synonyms-box" open={Boolean(sp?.ok || sp?.error)}>
        <summary>{t('الكلمات المرادفة للبحث')}</summary>
        <p className="muted">{t('إذا العميل بحث بكلمة وما لقى نتيجة وهي موجودة عندك باسم ثاني، أضفها هنا. كل سطر مجموعة كلمات بنفس المعنى مفصولة بفاصلة، والبحث بأي كلمة منها يطلّع نتائج الباقي.')}</p>
        <p className="muted" style={{ fontSize: '0.88rem' }}>{t('مضافة تلقائياً: كيبل وكيابل وكابل وcable، سويتش ومفتاح، بريكر وقاطع، بايب وماسورة، بوكس وعلبة، وغيرها.')}</p>
        <form action={saveSynonymsAction}>
          <textarea name="searchSynonyms" defaultValue={settings.searchSynonyms || ''} maxLength={5000} dir="auto" placeholder={t('لمبة، لمبات، اضاءة، سبوت\nسلك تمديد، توصيلة، مشترك')} style={{ minHeight: 140 }} />
          {canW ? <button className="btn" type="submit" style={{ marginTop: 10 }}>{t('حفظ')}</button> : null}
        </form>
      </details>

      <div className="period-tabs" role="tablist">
        {PERIODS.map((p) => (
          <Link key={p.days} href={`/admin/searches?days=${p.days}`} className={p.days === days ? 'active' : ''} aria-current={p.days === days ? 'page' : undefined}>
            {t(p.label)}
          </Link>
        ))}
      </div>

      <div className="stats">
        <div className="stat"><b>{stats.total}</b>{t('عملية بحث')}</div>
        <div className="stat"><b>{stats.unique}</b>{t('كلمة مختلفة')}</div>
        <div className="stat"><b>{stats.zeroTotal}</b>{t('بحث بدون نتيجة (')}{zeroPct}%)</div>

      <SearchChart days={days} />

      </div>

      {stats.total ? (
        <div className="search-stats">
          <section>
            <h2>{t('بحث بدون نتائج')}</h2>
            {stats.zero.length ? (
              <Table t={t} rows={stats.zero} nowCount={nowCount} zero />
            ) : (
              <p className="muted">{t('ممتاز، كل عمليات البحث في هالفترة لقت نتائج.')}</p>
            )}
          </section>
          <section>
            <h2>{t('الأكثر بحثاً')}</h2>
            <Table t={t} rows={stats.top} nowCount={nowCount} />
          </section>
        </div>
      ) : (
        <p className="muted">{t('ما فيه عمليات بحث مسجلة في هالفترة. تبدأ الإحصائيات تتجمع من الحين مع كل بحث في الموقع.')}</p>
      )}
    </>
  );
}
