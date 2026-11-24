'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminT } from '@/components/AdminLang';

const r1 = (n) => Math.round(n * 10) / 10;
const fmtN = (n) => Number(n).toLocaleString('en-US');

// الكلمات اللي نشتغل عليها
const TARGETS = [
  { t: 'فيش / أفياش', re: /فيش|افياش|أفياش|socket/i },
  { t: 'سلك كهرباء', re: /سلك|wire/i },
  { t: 'كيبل / كابل كهرباء', re: /كيبل|كابل|cable/i },
  { t: 'مورد كيابل الرياض', re: /supplier|riyadh|الرياض/i },
  { t: 'مفتاح فصل', re: /فصل|isolator/i },
  { t: 'علبة أرضية', re: /علبة ارضية|علبة أرضية|floor box/i },
  { t: 'مواسير كهرباء', re: /مواسير|conduit|pvc pipe/i },
  { t: 'ليجراند', re: /legrand|ليجراند/i },
  { t: 'المواصفات السعودية', re: /saso|مواصف|سابر|saber/i },
];

function Chart({ vals, type, invert, label, fmt, fmtX }) {
  const box = useRef(null);
  const [w, setW] = useState(0);
  const [hover, setHover] = useState(null);
  useEffect(() => {
    const el = box.current;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = 220, pl = 34, pr = 8, pt = 10, pb = 26;
  const n = vals.length;
  let min = 0, max, ticks;
  if (invert) {
    min = 1;
    max = Math.ceil(Math.max(20, ...vals.map((v) => v.y)) / 10) * 10;
    ticks = [1, ...Array.from({ length: max / 10 }, (_, k) => (k + 1) * 10)];
  } else {
    const raw = Math.max(1, ...vals.map((v) => v.y)), st0 = raw / 4, mag = 10 ** Math.floor(Math.log10(st0));
    const st = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((k) => k >= st0);
    max = Math.ceil(raw / st) * st;
    ticks = [];
    for (let v = 0; v <= max + 1e-9; v += st) ticks.push(v);
  }
  const step = n ? (w - pl - pr) / n : 0;
  const xOf = (i) => w - pr - step * (i + 0.5); // الأقدم يمين
  const yOf = (v) => (invert ? pt + ((v - min) / (max - min)) * (H - pt - pb) : H - pb - ((v - min) / (max - min)) * (H - pt - pb));
  const every = Math.max(1, Math.ceil(n / Math.max(1, Math.floor((w - pl) / 64))));
  const bw = Math.max(2, Math.min(30, step * 0.6));
  return (
    <div className="seo-chart" ref={box}>
      {w > 0 && n > 0 ? (
        <svg viewBox={`0 0 ${w} ${H}`} style={{ direction: 'ltr' }} role="img" aria-label={label}>
          {ticks.map((v) => (
            <g key={v}>
              <line x1={pl} x2={w - pr} y1={yOf(v)} y2={yOf(v)} stroke="var(--line)" />
              <text x={pl - 6} y={yOf(v) + 4} fontSize="11" fill="var(--muted)" textAnchor="end">{Math.round(v)}</text>
            </g>
          ))}
          {invert ? (
            <>
              <rect x={pl} width={w - pl - pr} y={yOf(1)} height={yOf(10) - yOf(1)} fill="rgba(28,143,214,.1)" />
              <text x={pl + 6} y={yOf(10) - 5} fontSize="10.5" fill="var(--primary)">الصفحة الأولى</text>
            </>
          ) : null}
          {type === 'bar'
            ? vals.map((v, i) => {
                const y = yOf(v.y), h = H - pb - y, x = xOf(i) - bw / 2, r = Math.min(4, h, bw / 2);
                return <path key={i} d={`M${x},${H - pb} V${y + r} Q${x},${y} ${x + r},${y} H${x + bw - r} Q${x + bw},${y} ${x + bw},${y + r} V${H - pb} Z`} fill="var(--primary)" />;
              })
            : (
              <>
                <polyline points={vals.map((v, i) => `${xOf(i)},${yOf(v.y)}`).join(' ')} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                {n <= 40 ? vals.map((v, i) => <circle key={i} cx={xOf(i)} cy={yOf(v.y)} r="3.5" fill="var(--primary)" stroke="var(--surface)" strokeWidth="2" />) : null}
              </>
            )}
          {vals.map((v, i) => (i % every === 0 ? <text key={i} x={xOf(i)} y={H - 8} fontSize="11" fill="var(--muted)" textAnchor="middle">{fmtX(v.x)}</text> : null))}
          {hover != null ? <line x1={xOf(hover)} x2={xOf(hover)} y1={pt} y2={H - pb} stroke="var(--muted)" strokeDasharray="3 3" opacity=".6" /> : null}
          {vals.map((v, i) => (
            <rect key={i} x={xOf(i) - step / 2} y="0" width={step} height={H} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
          ))}
        </svg>
      ) : null}
      {hover != null && vals[hover] ? (
        <div className="seo-tip" style={{ left: xOf(hover), top: yOf(vals[hover].y) }}>
          {fmtX(vals[hover].x)}: <b>{fmt(vals[hover].y)}</b>
        </div>
      ) : null}
    </div>
  );
}

function Spark({ pts }) {
  if (pts.length < 2) return null;
  const w = 90, h = 26, ps = pts.map((p) => p.p), mn = Math.min(...ps), span = Math.max(Math.max(...ps) - mn, 1);
  const x = (i) => w - 4 - (i * (w - 8)) / (pts.length - 1), y = (p) => 4 + ((p - mn) / span) * (h - 8);
  const last = pts.at(-1).p, first = pts[0].p;
  const col = last < first ? 'var(--seo-good)' : last > first ? 'var(--seo-bad)' : 'var(--muted)';
  return (
    <svg className="seo-spark" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline points={pts.map((p, i) => `${x(i)},${y(p.p)}`).join(' ')} fill="none" stroke={col} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(pts.length - 1)} cy={y(last)} r="2.5" fill={col} />
    </svg>
  );
}

export default function SeoReport({ data }) {
  const { t, lang } = useAdminT();
  const router = useRouter();
  const [filter, setFilter] = useState('up');
  const [term, setTerm] = useState('');
  const [busy, setBusy] = useState(false);
  const locale = lang === 'en' ? 'en-GB' : 'ar-SA-u-ca-gregory-nu-latn';
  const fmtD = (s) => new Date(`${s}T12:00:00`).toLocaleDateString(locale, { day: 'numeric', month: 'short' });

  const days = useMemo(() => data.days.filter((d) => d.i > 0), [data]);
  const lastIdx = days.length - 1;

  const list = useMemo(() => {
    const Q = new Map();
    days.forEach((d, di) => d.q.forEach(([q, c, i, p]) => {
      if (!Q.has(q)) Q.set(q, { q, pts: [], c: 0, i: 0 });
      const o = Q.get(q);
      o.pts.push({ di, p });
      o.c += c;
      o.i += i;
    }));
    return [...Q.values()].map((o) => {
      const first = o.pts[0], last = o.pts.at(-1);
      return { ...o, first: first.p, last: last.p, chg: r1(first.p - last.p), multi: o.pts.length > 1, isNew: first.di === lastIdx, lastDi: last.di };
    });
  }, [days, lastIdx]);

  const sum = (k) => days.reduce((a, d) => a + d[k], 0);
  const wpos = (arr) => { const im = arr.reduce((a, d) => a + d.i, 0); return im ? r1(arr.reduce((a, d) => a + d.p * d.i, 0) / im) : 0; };
  const recent = days.slice(-3), early = days.slice(0, 3);
  const posNow = wpos(recent), posThen = wpos(early);
  const recentQ = new Map();
  recent.forEach((d) => d.q.forEach(([q, , , p]) => recentQ.set(q, Math.min(recentQ.get(q) ?? 999, p))));
  const page1 = [...recentQ.values()].filter((p) => p <= 10).length;
  const improving = list.filter((x) => x.multi && x.chg > 0).length;
  const recentList = list.filter((x) => x.lastDi >= lastIdx - 2);

  let rows = list;
  if (filter === 'up') rows = rows.filter((x) => x.multi && x.chg > 0).sort((a, b) => b.chg - a.chg);
  else if (filter === 'down') rows = rows.filter((x) => x.multi && x.chg < 0).sort((a, b) => a.chg - b.chg);
  else if (filter === 'p1') rows = rows.filter((x) => x.lastDi >= lastIdx - 2 && x.last <= 10).sort((a, b) => a.last - b.last);
  else if (filter === 'new') rows = rows.filter((x) => x.isNew).sort((a, b) => a.last - b.last);
  else rows = [...rows].sort((a, b) => b.i - a.i);
  if (term) rows = rows.filter((x) => x.q.toLowerCase().includes(term));

  async function refresh() {
    setBusy(true);
    try { await fetch('/api/admin/seo/refresh', { method: 'POST' }); } catch {}
    router.refresh();
    setTimeout(() => setBusy(false), 1500);
  }

  const FILTERS = [['up', 'تتحسن'], ['p1', 'بالصفحة الأولى'], ['new', 'جديدة'], ['down', 'تراجعت'], ['all', 'الكل']];
  const pagePath = (u) => { try { return decodeURI(new URL(u).pathname); } catch { return u; } };

  if (!days.length) return <section className="panel"><p className="muted">{t('ما فيه بيانات من قوقل في هذي الفترة للحين.')}</p></section>;

  return (
    <div className="seo">
      <div className="seo-meta">
        <span className="muted">{t('البيانات حتى')} {fmtD(data.dataThrough)} · {t('آخر سحب')} {new Date(data.fetchedAt).toLocaleString(locale, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</span>
        <button type="button" className="btn ghost" onClick={refresh} disabled={busy}>{busy ? t('جاري التحديث...') : t('تحديث الحين')}</button>
      </div>

      <div className="stats">
        <div className="stat"><b>{fmtN(sum('i'))}</b>{t('مرة ظهرنا في قوقل')} <small className="muted">({t('آخر يوم')} {fmtN(days.at(-1).i)})</small></div>
        <div className="stat"><b>{fmtN(sum('c'))}</b>{t('نقرة جت من قوقل')}</div>
        <div className="stat">
          <b>{posNow || '-'}</b>{t('متوسط الترتيب (آخر 3 أيام)')}
          {posThen && days.length > 3 ? (
            <small className={posNow < posThen ? 'seo-up' : 'seo-down'} style={{ display: 'block' }}>
              {posNow < posThen ? '▲ ' + t('تحسن') : '▼ ' + t('تراجع')} {r1(Math.abs(posThen - posNow))} {t('مركز عن البداية')} ({posThen})
            </small>
          ) : null}
        </div>
        <div className="stat"><b>{page1}</b>{t('كلمة بالصفحة الأولى')} <small className="muted">({t('من')} {recentQ.size})</small></div>
        <div className="stat"><b>{improving}</b>{t('كلمة ترتيبها يتحسن')} <small className="muted">({t('من')} {list.length})</small></div>
      </div>

      <div className="seo-grid2">
        <section className="panel">
          <h2>{t('مرات الظهور يومياً')}</h2>
          <Chart vals={days.map((d) => ({ x: d.d, y: d.i }))} type="bar" label={t('مرات الظهور يومياً')} fmt={(v) => `${fmtN(v)} ${t('ظهور')}`} fmtX={fmtD} />
        </section>
        <section className="panel">
          <h2>{t('متوسط الترتيب يومياً')}</h2>
          <p className="muted seo-hint">{t('كل ما نزل الرقم كان أحسن · 1 إلى 10 = الصفحة الأولى')}</p>
          <Chart vals={days.map((d) => ({ x: d.d, y: d.p }))} type="line" invert label={t('متوسط الترتيب يومياً')} fmt={(v) => `${t('الترتيب')} ${v}`} fmtX={fmtD} />
        </section>
      </div>

      <section className="panel">
        <h2>{t('الكلمات المستهدفة')}</h2>
        <p className="muted seo-hint">{t('أفضل ترتيب وصلنا له في آخر 3 أيام')}</p>
        <div className="seo-track">
          {TARGETS.map((T) => {
            const m = recentList.filter((x) => T.re.test(x.q)).sort((a, b) => a.last - b.last);
            const b = m[0];
            return (
              <div className="seo-trk" key={T.t}>
                <div className="seo-trk-t">{t(T.t)}{b && b.last <= 10 ? <span className="seo-p1">{t('الصفحة الأولى')}</span> : null}</div>
                {b ? (
                  <>
                    <div className="muted">{t('أفضل ترتيب')} <b>{b.last}</b> · <bdi>"{b.q}"</bdi></div>
                    <div className="muted">{m.length} {t('كلمة قريبة')}</div>
                  </>
                ) : <div className="muted">{t('ما ظهرت آخر 3 أيام')}</div>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel">
        <h2>{t('تطور الكلمات')}</h2>
        <p className="muted seo-hint">{t('ترتيب كل كلمة أول ما ظهرت مقارنة بآخر ظهور لها · الأخضر = تحسن')}</p>
        <div className="seo-toolbar">
          <div className="seo-seg" role="tablist">
            {FILTERS.map(([k, l]) => (
              <button key={k} type="button" className={filter === k ? 'on' : ''} aria-pressed={filter === k} onClick={() => setFilter(k)}>{t(l)}</button>
            ))}
          </div>
          <input type="search" placeholder={t('ابحث عن كلمة...')} value={term} onChange={(e) => setTerm(e.target.value.trim().toLowerCase())} />
        </div>
        <div className="seo-scroll">
          <table className="seo-table">
            <thead><tr><th>{t('الكلمة')}</th><th>{t('أول ترتيب')}</th><th>{t('آخر ترتيب')}</th><th>{t('التغير')}</th><th>{t('الظهور')}</th><th>{t('النقرات')}</th><th>{t('المسار')}</th></tr></thead>
            <tbody>
              {rows.length ? rows.slice(0, 300).map((x) => {
                const cls = !x.multi || x.chg === 0 ? 'same' : x.chg > 0 ? 'up' : 'down';
                const txt = !x.multi ? t('يوم واحد') : x.chg > 0 ? `▲ ${x.chg}` : x.chg < 0 ? `▼ ${Math.abs(x.chg)}` : t('ثابت');
                return (
                  <tr key={x.q}>
                    <td className="seo-q"><bdi>{x.q}</bdi>{x.last <= 10 ? <span className="seo-p1">{t('ص1')}</span> : null}</td>
                    <td className="n">{x.first}</td>
                    <td className="n"><b>{x.last}</b></td>
                    <td><span className={`seo-chg ${cls}`}>{txt}</span></td>
                    <td className="n">{fmtN(x.i)}</td>
                    <td className="n">{x.c}</td>
                    <td><Spark pts={x.pts} /></td>
                  </tr>
                );
              }) : <tr><td colSpan={7} className="muted" style={{ textAlign: 'center' }}>{t('ما فيه كلمات هنا للحين')}</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>{t('الصفحات الأكثر ظهوراً')}</h2>
        <div className="seo-scroll">
          <table className="seo-table">
            <thead><tr><th>{t('الصفحة')}</th><th>{t('الظهور')}</th><th>{t('النقرات')}</th><th>{t('متوسط الترتيب')}</th></tr></thead>
            <tbody>
              {[...data.pages].sort((a, b) => b.i - a.i).slice(0, 30).map((p) => (
                <tr key={p.page}>
                  <td className="seo-q"><a href={p.page} target="_blank" rel="noopener noreferrer" dir="ltr">{pagePath(p.page)}</a></td>
                  <td className="n">{fmtN(p.i)}</td>
                  <td className="n">{p.c}</td>
                  <td className="n">{p.p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
