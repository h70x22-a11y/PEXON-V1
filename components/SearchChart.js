'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminT } from '@/components/AdminLang';

// ألوان مجرّبة لعمى الألوان على الخلفية الفاتحة والداكنة
const C_TOTAL = '#1c8fd6';
const C_ZERO = '#e8590c';

const W = 760;
const H = 260;
const PAD = { t: 16, r: 16, b: 30, l: 40 };

// أعلى قيمة في المحور: 4 خطوات بأرقام صحيحة مرتبة (1، 2، 5 × 10ⁿ)
function niceMax(v) {
  const raw = Math.max(1, Math.ceil(v / 4));
  const p = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * p).find((x) => x >= raw);
  return step * 4;
}

export default function SearchChart({ days }) {
  const { t, lang } = useAdminT();
  const router = useRouter();
  const [series, setSeries] = useState([]);
  const [hover, setHover] = useState(-1);
  const [updated, setUpdated] = useState(null);
  const svg = useRef(null);
  const locale = lang === 'en' ? 'en-GB' : 'ar';

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/admin/searches?days=${days}`, { cache: 'no-store' });
      if (!r.ok) return;
      const j = await r.json();
      setSeries(j.series || []);
      setUpdated(new Date());
    } catch {}
  }, [days]);

  // تحديث تلقائي كل دقيقة: الرسم والأرقام والجداول
  useEffect(() => {
    load();
    const id = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      load();
      router.refresh();
    }, 60000);
    return () => clearInterval(id);
  }, [load, router]);

  const g = useMemo(() => {
    const n = series.length;
    const max = niceMax(Math.max(1, ...series.map((d) => d.total)));
    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;
    const x = (i) => PAD.l + (n <= 1 ? iw / 2 : (i * iw) / (n - 1));
    const y = (v) => PAD.t + ih - (v / max) * ih;
    const path = (key) => series.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(' ');
    const area = n ? `${path('total')} L${x(n - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z` : '';
    const ticks = [0, 1, 2, 3, 4].map((k) => (max / 4) * k);
    const every = Math.max(1, Math.ceil(n / 7));
    return { n, max, x, y, path, area, ticks, every };
  }, [series]);

  const dayLabel = (d, long) =>
    new Date(`${d}T12:00:00Z`).toLocaleDateString(locale, long ? { weekday: 'short', day: 'numeric', month: 'short' } : { day: 'numeric', month: 'short' });

  function onMove(e) {
    if (!g.n || !svg.current) return;
    const rect = svg.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * (g.n - 1));
    setHover(Math.max(0, Math.min(g.n - 1, i)));
  }

  const totals = series.reduce((s, d) => s + d.total, 0);
  const h = hover >= 0 ? series[hover] : null;
  const last = series.at(-1);

  return (
    <div className="panel chart-card">
      <div className="chart-head">
        <h2>{t('عمليات البحث يومياً')}</h2>
        <div className="chart-legend" aria-hidden="true">
          <span><i style={{ background: C_TOTAL }} />{t('كل عمليات البحث')}</span>
          <span><i className="dash" style={{ borderColor: C_ZERO }} />{t('بدون نتيجة')}</span>
        </div>
      </div>
      <div className="chart-wrap" dir="ltr">
        <svg
          ref={svg}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={t('رسم بياني لعمليات البحث يومياً')}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(-1)}
          onTouchStart={(e) => onMove(e.touches[0])}
          onTouchMove={(e) => onMove(e.touches[0])}
        >
          {g.ticks.map((v) => (
            <g key={v}>
              <line x1={PAD.l} x2={W - PAD.r} y1={g.y(v)} y2={g.y(v)} className="chart-grid" />
              <text x={PAD.l - 8} y={g.y(v) + 4} textAnchor="end" className="chart-tick">{v}</text>
            </g>
          ))}
          {series.map((d, i) =>
            i % g.every === 0 || i === g.n - 1 ? (
              <text key={d.day} x={g.x(i)} y={H - 8} textAnchor="middle" className="chart-tick">{dayLabel(d.day)}</text>
            ) : null
          )}
          {g.n ? (
            <>
              <path d={g.area} fill={C_TOTAL} opacity="0.1" />
              <path d={g.path('total')} fill="none" stroke={C_TOTAL} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              <path d={g.path('zero')} fill="none" stroke={C_ZERO} strokeWidth="2" strokeDasharray="5 4" strokeLinejoin="round" strokeLinecap="round" />
            </>
          ) : null}
          {h ? (
            <g>
              <line x1={g.x(hover)} x2={g.x(hover)} y1={PAD.t} y2={H - PAD.b} className="chart-cross" />
              <circle cx={g.x(hover)} cy={g.y(h.total)} r="5" fill={C_TOTAL} stroke="var(--surface)" strokeWidth="2" />
              <circle cx={g.x(hover)} cy={g.y(h.zero)} r="5" fill={C_ZERO} stroke="var(--surface)" strokeWidth="2" />
            </g>
          ) : null}
        </svg>
        {h ? (
          <div className="chart-tip" style={{ left: `${(g.x(hover) / W) * 100}%` }} dir={lang === 'en' ? 'ltr' : 'rtl'}>
            <strong>{dayLabel(h.day, true)}</strong>
            <span><i style={{ background: C_TOTAL }} />{t('كل عمليات البحث')}: <b>{h.total}</b></span>
            <span><i style={{ background: C_ZERO }} />{t('بدون نتيجة')}: <b>{h.zero}</b></span>
          </div>
        ) : null}
      </div>
      <div className="chart-foot">
        <span className="muted">
          {last ? `${t('اليوم')}: ${last.total} · ` : ''}
          {t('المجموع')}: {totals}
        </span>
        <span className="muted live-dot">{t('يتحدث تلقائياً كل دقيقة')}{updated ? ` · ${updated.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}` : ''}</span>
      </div>
      <details className="chart-table">
        <summary>{t('عرض كجدول')}</summary>
        <div className="table-wrap">
          <table className="quote-table">
            <thead>
              <tr><th>{t('التاريخ')}</th><th>{t('كل عمليات البحث')}</th><th>{t('بدون نتيجة')}</th></tr>
            </thead>
            <tbody>
              {[...series].reverse().map((d) => (
                <tr key={d.day}><td>{dayLabel(d.day, true)}</td><td>{d.total}</td><td>{d.zero}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
