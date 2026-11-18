import Link from 'next/link';
import { FiFileText, FiMessageSquare, FiTruck, FiBox, FiSearch, FiArrowLeft, FiArrowRight, FiEye } from 'react-icons/fi';
import { can, requireAdmin } from '@/lib/auth';
import { getCategories, getMessages, getProducts, getResetRequests, getSearchStats, getNotSold } from '@/lib/db';
import { adminT } from '@/lib/adminLang';
import { QUOTE_STATUSES, statusOf } from '@/lib/quotes';
import LineChart from '@/components/LineChart';

const C_QUOTES = '#1c8fd6';
const C_WON = '#e8590c';

const dayKey = (d) => new Date(d).toLocaleDateString('en-CA', { timeZone: 'Asia/Riyadh' });

// دائرة توزيع حالات عروض الأسعار (SVG بدون مكتبات)
function Donut({ parts, total, t }) {
  const R = 70;
  const C = 2 * Math.PI * R;
  let off = 0;
  return (
    <svg viewBox="0 0 200 200" className="donut" role="img" aria-label={t('توزيع حالات عروض الأسعار')}>
      <circle cx="100" cy="100" r={R} fill="none" stroke="var(--line)" strokeWidth="26" />
      {total
        ? parts.map((p) => {
            const len = (p.n / total) * C;
            const gap = parts.filter((x) => x.n).length > 1 ? 2 : 0;
            const el = (
              <circle key={p.key} cx="100" cy="100" r={R} fill="none" stroke={p.color} strokeWidth="26" strokeDasharray={`${Math.max(0, len - gap)} ${C}`} strokeDashoffset={-off} transform="rotate(-90 100 100)">
                <title>{`${t(p.ar)}: ${p.n}`}</title>
              </circle>
            );
            off += len;
            return p.n ? el : null;
          })
        : null}
      <text x="100" y="96" textAnchor="middle" className="donut-num">{total}</text>
      <text x="100" y="120" textAnchor="middle" className="donut-cap">{t('طلب')}</text>
    </svg>
  );
}

export default async function AdminHome({ searchParams }) {
  const { t, lang, locale, dir } = await adminT();
  const sp = await searchParams;
  const session = await requireAdmin();
  const show = (perm) => can(session, perm);
  const [categories, products, messages, notSold] = await Promise.all([getCategories(), getProducts(), getMessages(), show('searches') ? getNotSold() : {}]);
  const excluded = new Set(Object.entries(notSold).filter(([, v]) => v.status === 'approved').map(([k]) => k));
  const searches = show('searches') ? await getSearchStats(30, excluded) : null;
  const resets = can(session, 'users:write') ? (await getResetRequests()).length : 0;

  const quotes = messages.filter((m) => m.type === 'quote');
  const contacts = messages.filter((m) => m.type !== 'vendor' && m.type !== 'quote' && m.type !== 'datarequest');
  const vendors = messages.filter((m) => m.type === 'vendor');
  const newQuotes = quotes.filter((m) => (m.status || 'new') === 'new').length;
  const openMsgs = contacts.filter((m) => !m.handled).length;
  const openVendors = vendors.filter((m) => !m.handled).length;

  // آخر 30 يوم: الطلبات الواردة واللي تم بيعها
  const days = [];
  for (let i = 29; i >= 0; i--) days.push(dayKey(Date.now() - i * 86400000));
  const idx = Object.fromEntries(days.map((d, i) => [d, i]));
  const recv = days.map(() => 0);
  const won = days.map(() => 0);
  for (const q of quotes) {
    const i = idx[dayKey(q.date)];
    if (i !== undefined) recv[i]++;
    if ((q.status || 'new') === 'won') {
      const j = idx[dayKey(q.updated || q.date)];
      if (j !== undefined) won[j]++;
    }
  }
  const dayLabels = days.map((d) => new Date(`${d}T12:00:00Z`).toLocaleDateString(locale, { day: 'numeric', month: 'short' }));
  const recv30 = recv.reduce((a, b) => a + b, 0);

  // توزيع الحالات ونسبة التحويل
  const parts = QUOTE_STATUSES.map((s) => ({ ...s, n: quotes.filter((q) => (q.status || 'new') === s.key).length }));
  const closed = parts.find((p) => p.key === 'won').n + parts.find((p) => p.key === 'lost').n;
  const winRate = closed ? Math.round((parts.find((p) => p.key === 'won').n / closed) * 100) : null;

  // أكثر المنتجات طلباً في عروض الأسعار
  const demand = new Map();
  for (const q of quotes)
    for (const it of q.items || []) {
      const cur = demand.get(it.id) || { id: it.id, name: it.name, qty: 0, times: 0 };
      cur.qty += Number(it.qty) || 0;
      cur.times += 1;
      demand.set(it.id, cur);
    }
  const topProducts = [...demand.values()].sort((a, b) => b.times - a.times || b.qty - a.qty).slice(0, 6);

  // آخر النشاط
  const activity = [
    ...(show('quotes') ? quotes : []),
    ...(show('messages') ? contacts : []),
    ...(show('vendors') ? vendors : []),
  ]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 6);
  const fmt = (iso) => new Date(iso).toLocaleString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Riyadh' });
  const Arrow = dir === 'rtl' ? FiArrowLeft : FiArrowRight;
  const hour = Number(new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: 'Asia/Riyadh' }));
  const greet = hour < 12 ? t('صباح الخير') : t('مساء الخير');
  const todo = [
    show('quotes') && newQuotes ? t('{n} طلب عرض سعر جديد', { n: newQuotes }) : '',
    show('messages') && openMsgs ? t('{n} رسالة تحتاج رد', { n: openMsgs }) : '',
    show('vendors') && openVendors ? t('{n} مورد جديد', { n: openVendors }) : '',
  ].filter(Boolean);

  const tiles = [
    show('quotes') && { href: '/admin/quotes?status=new', n: newQuotes, label: t('طلبات عروض أسعار جديدة'), Icon: FiFileText, tone: 'orange' },
    show('messages') && { href: '/admin/messages', n: openMsgs, label: t('رسائل تحتاج معالجة'), Icon: FiMessageSquare, tone: 'blue' },
    show('vendors') && { href: '/admin/vendors', n: openVendors, label: t('موردين جدد'), Icon: FiTruck, tone: 'violet' },
    show('products') && { href: '/admin/products', n: products.length, label: t('منتج في {c} قسم', { c: categories.length }), Icon: FiBox, tone: 'green' },
    searches && { href: '/admin/searches', n: searches.zeroTotal, label: t('بحث بدون نتيجة (آخر 30 يوم)'), Icon: FiSearch, tone: 'gray' },
  ].filter(Boolean);

  return (
    <>
      <div className="dash-head">
        <h1>{t('لوحة التحكم')}</h1>
      </div>
      {sp?.denied ? <div className="flash warn">{t('ما عندك صلاحية على هذا القسم. تواصل مع المدير.')}</div> : null}
      {sp?.welcome ? <div className="flash ok">{t('تم حفظ كلمة المرور الجديدة. أهلاً بك!')}</div> : null}
      {resets ? (
        <Link href="/admin/users" className="flash warn" style={{ display: 'block' }}>
          {t('عندك {n} طلب إعادة تعيين كلمة مرور من الموظفين ←', { n: resets })}
        </Link>
      ) : null}

      <div className="dash-grid">
        <section className="dcard dash-hello">
          <div className="hello-art" aria-hidden="true">
            <svg viewBox="0 0 200 120" width="200" height="120">
              <circle cx="40" cy="30" r="14" fill="none" stroke="#37b6ff" strokeWidth="2.5" />
              <path d="M40 22v8l6 4" stroke="#37b6ff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <rect x="70" y="40" width="80" height="54" rx="8" fill="#e9f6fe" stroke="#37b6ff" strokeWidth="2.5" />
              <path d="M70 48l40 26 40-26" fill="none" stroke="#37b6ff" strokeWidth="2.5" />
              <circle cx="150" cy="40" r="11" fill="#37b6ff" />
              <path d="M145 40l4 4 7-8" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M165 18l18-8-6 18-4-6z" fill="none" stroke="#37b6ff" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          <h2>{greet}، {t(session.name)}!</h2>
          <p className="muted">{todo.length ? `${t('عندك اليوم')}: ${todo.join(t('، '))}.` : t('كل شي متعالج، ما فيه شي معلّق حالياً 👌')}</p>
          {show('quotes') && newQuotes ? (
            <Link href="/admin/quotes?status=new" className="btn small">{t('راجعها')}</Link>
          ) : null}
        </section>

        <div className="dash-tiles">
          {tiles.map((x) => (
            <Link key={x.href} href={x.href} className="dtile">
              <span>
                <b>{x.n}</b>
                <small>{x.label}</small>
              </span>
              <i className={`dtile-ico ${x.tone}`}><x.Icon aria-hidden="true" /></i>
            </Link>
          ))}
        </div>

        {show('quotes') ? (
          <section className="dcard dash-chart">
            <div className="dcard-head">
              <h2>{t('أداء عروض الأسعار')}</h2>
              <span className="muted">{t('آخر 30 يوم')} · {t('{n} طلب', { n: recv30 })}</span>
            </div>
            <LineChart
              labels={dayLabels}
              series={[
                { name: 'طلبات واردة', color: C_QUOTES, values: recv },
                { name: 'تم البيع', color: C_WON, values: won, dashed: true },
              ]}
              empty="ما فيه طلبات في آخر 30 يوم."
            />
          </section>
        ) : null}

        {show('quotes') ? (
          <section className="dcard dash-donut">
            <div className="dcard-head"><h2>{t('حالات الطلبات')}</h2></div>
            <Donut parts={parts} total={quotes.length} t={t} />
            <ul className="donut-legend">
              {parts.map((p) => (
                <li key={p.key}>
                  <i style={{ background: p.color }} />
                  <span>{t(p.ar)}</span>
                  <b>{p.n}</b>
                </li>
              ))}
            </ul>
            <p className="muted donut-rate">{winRate === null ? t('نسبة التحويل تظهر بعد إغلاق أول طلب') : t('نسبة التحويل: {p}% من الطلبات المغلقة', { p: winRate })}</p>
          </section>
        ) : null}

        {show('quotes') ? (
          <section className="dcard dash-table">
            <div className="dcard-head">
              <h2>{t('آخر طلبات عروض الأسعار')}</h2>
              <Link href="/admin/quotes" className="dcard-more">{t('عرض الكل')} <Arrow aria-hidden="true" /></Link>
            </div>
            {quotes.length ? (
              <div className="table-wrap">
                <table className="quote-table">
                  <thead>
                    <tr><th>{t('رقم الطلب')}</th><th>{t('العميل')}</th><th>{t('المنتجات')}</th><th>{t('الحالة')}</th><th><span className="sr-only">{t('عرض')}</span></th></tr>
                  </thead>
                  <tbody>
                    {quotes.slice(0, 6).map((q) => {
                      const st = statusOf(q.status);
                      return (
                        <tr key={q.id}>
                          <td><Link href={`/admin/quotes/${q.id}`}><bdi>{q.number || '—'}</bdi></Link></td>
                          <td>{q.name}{q.company ? <div className="muted" style={{ fontSize: '0.82rem' }}>{q.company}</div> : null}</td>
                          <td>{q.items?.length || 0}</td>
                          <td><span className="status-pill" style={{ background: st.color }}>{t(st.ar)}</span></td>
                          <td><Link href={`/admin/quotes/${q.id}`} aria-label={t('عرض')} className="eye"><FiEye aria-hidden="true" /></Link></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="muted">{t('لا توجد طلبات عروض أسعار حتى الآن. تظهر هنا الطلبات المرسلة من سلة الموقع.')}</p>
            )}
          </section>
        ) : null}

        {activity.length || show('quotes') || show('messages') ? (
          <section className="dcard dash-activity">
            <div className="dcard-head"><h2>{t('آخر النشاط')}</h2></div>
            {activity.length ? (
              <ul className="act-list">
                {activity.map((m) => {
                  const kind = m.type === 'quote' ? 'quote' : m.type === 'vendor' ? 'vendor' : 'message';
                  const Icon = kind === 'quote' ? FiFileText : kind === 'vendor' ? FiTruck : FiMessageSquare;
                  const href = kind === 'quote' ? `/admin/quotes/${m.id}` : kind === 'vendor' ? '/admin/vendors' : '/admin/messages';
                  return (
                    <li key={m.id}>
                      <Link href={href}>
                        <i className={`note-ico k-${kind}`}><Icon aria-hidden="true" /></i>
                        <span className="act-text">
                          <strong>{kind === 'quote' ? t('طلب عرض سعر') : kind === 'vendor' ? t('تسجيل مورد') : t('رسالة')}</strong>
                          <span className="muted">{m.company || m.name}</span>
                        </span>
                        <span className="muted act-time">{fmt(m.date)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="muted">{t('ما فيه نشاط للحين.')}</p>
            )}
          </section>
        ) : null}

        {show('quotes') ? (
          <section className="dcard dash-top">
            <div className="dcard-head"><h2>{t('أكثر المنتجات طلباً')}</h2></div>
            {topProducts.length ? (
              <ul className="top-prod">
                {topProducts.map((p, i) => (
                  <li key={p.id || i}>
                    <span className="rank">{i + 1}</span>
                    <a href={`/product/${p.id}`} target="_blank" rel="noopener noreferrer" className="tp-name">{p.name}</a>
                    <span className="muted tp-meta">{t('{n} طلب', { n: p.times })} · {t('كمية {q}', { q: p.qty })}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">{t('تظهر هنا المنتجات الأكثر طلباً في عروض الأسعار.')}</p>
            )}
          </section>
        ) : null}
      </div>
    </>
  );
}
