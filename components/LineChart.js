'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useAdminT } from '@/components/AdminLang';

// رسم خطي عام مع مؤشر وتلميح عند التمرير
export default function LineChart({ labels = [], series = [], height = 240, empty = '' }) {
  const { t, lang } = useAdminT();
  const [hover, setHover] = useState(-1);
  const ref = useRef(null);
  const box = useRef(null);
  // العرض يتبع عرض البطاقة الفعلي عشان الخط والنصوص تبقى بحجم ثابت
  const [W, setW] = useState(720);
  useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width);
      if (w > 0) setW(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = height;
  const P = { t: 14, r: 14, b: 28, l: 34 };
  const n = labels.length;

  const g = useMemo(() => {
    const top = Math.max(1, ...series.flatMap((s) => s.values));
    const raw = Math.max(1, Math.ceil(top / 4));
    const p = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 5, 10].map((m) => m * p).find((x) => x >= raw);
    const max = step * 4;
    const iw = W - P.l - P.r;
    const ih = H - P.t - P.b;
    const x = (i) => P.l + (n <= 1 ? iw / 2 : (i * iw) / (n - 1));
    const y = (v) => P.t + ih - (v / max) * ih;
    const path = (vals) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    return { max, x, y, path, ticks: [0, 1, 2, 3, 4].map((k) => step * k), every: Math.max(1, Math.ceil(n / Math.max(3, Math.floor((W - P.l - P.r) / 70)))) };
  }, [series, n, H, W]);

  function move(e) {
    if (!n || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    setHover(Math.max(0, Math.min(n - 1, Math.round(((px - P.l) / (W - P.l - P.r)) * (n - 1)))));
  }

  const total = series.reduce((s, x) => s + x.values.reduce((a, b) => a + b, 0), 0);

  return (
    <div>
      <div className="chart-legend" aria-hidden="true">
        {series.map((s) => (
          <span key={s.name}>
            <i className={s.dashed ? 'dash' : ''} style={s.dashed ? { borderColor: s.color } : { background: s.color }} />
            {t(s.name)}
          </span>
        ))}
      </div>
      <div className="chart-wrap" dir="ltr" ref={box}>
        <svg ref={ref} viewBox={`0 0 ${W} ${H}`} style={{ height: H }} role="img" aria-label={series.map((s) => t(s.name)).join(' / ')} onMouseMove={move} onMouseLeave={() => setHover(-1)} onTouchStart={(e) => move(e.touches[0])} onTouchMove={(e) => move(e.touches[0])}>
          {g.ticks.map((v) => (
            <g key={v}>
              <line x1={P.l} x2={W - P.r} y1={g.y(v)} y2={g.y(v)} className="chart-grid" />
              <text x={P.l - 8} y={g.y(v) + 4} textAnchor="end" className="chart-tick">{v}</text>
            </g>
          ))}
          {labels.map((l, i) => (i % g.every === 0 || i === n - 1 ? <text key={i} x={g.x(i)} y={H - 8} textAnchor="middle" className="chart-tick">{l}</text> : null))}
          {series.map((s, si) => (
            <g key={s.name}>
              {si === 0 ? <path d={`${g.path(s.values)} L${g.x(n - 1)},${g.y(0)} L${g.x(0)},${g.y(0)} Z`} fill={s.color} opacity="0.08" /> : null}
              <path d={g.path(s.values)} fill="none" stroke={s.color} strokeWidth="2" strokeDasharray={s.dashed ? '5 4' : undefined} strokeLinejoin="round" strokeLinecap="round" />
            </g>
          ))}
          {hover >= 0 ? (
            <g>
              <line x1={g.x(hover)} x2={g.x(hover)} y1={P.t} y2={H - P.b} className="chart-cross" />
              {series.map((s) => (
                <circle key={s.name} cx={g.x(hover)} cy={g.y(s.values[hover])} r="5" fill={s.color} stroke="var(--surface)" strokeWidth="2" />
              ))}
            </g>
          ) : null}
        </svg>
        {hover >= 0 ? (
          <div className="chart-tip" style={{ left: `${(g.x(hover) / W) * 100}%` }} dir={lang === 'en' ? 'ltr' : 'rtl'}>
            <strong>{labels[hover]}</strong>
            {series.map((s) => (
              <span key={s.name}><i style={{ background: s.color }} />{t(s.name)}: <b>{s.values[hover]}</b></span>
            ))}
          </div>
        ) : null}
        {!total && empty ? <p className="chart-empty">{t(empty)}</p> : null}
      </div>
    </div>
  );
}
