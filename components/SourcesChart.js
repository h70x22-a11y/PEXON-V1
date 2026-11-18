'use client';

import { useState } from 'react';
import { useAdminT } from '@/components/AdminLang';

// رسم مصادر الزيارات: أعمدة أفقية مرتبة (الافتراضي) أو دائري لأعلى 5 مصادر
const SLOTS = ['var(--viz-1)', 'var(--viz-2)', 'var(--viz-3)', 'var(--viz-4)', 'var(--viz-5)'];

export default function SourcesChart({ rows }) {
  const { t } = useAdminT();
  const [mode, setMode] = useState('bars');
  const [hover, setHover] = useState(-1);
  const total = rows.reduce((s, r) => s + r.value, 0);
  if (!total) return <p className="muted">{t('ما فيه بيانات للحين.')}</p>;
  const pct = (v) => Math.round((v / total) * 100);

  // الدائري: أعلى 5 والباقي "أخرى"
  const top = rows.slice(0, 5);
  const rest = rows.slice(5).reduce((s, r) => s + r.value, 0);
  const pie = rest ? [...top, { key: '_other', label: t('أخرى'), value: rest }] : top;

  const max = rows[0].value;
  const R = 90;
  const r0 = 56;
  let acc = 0;
  const arcs = pie.map((p, i) => {
    const a0 = (acc / total) * Math.PI * 2;
    acc += p.value;
    const a1 = (acc / total) * Math.PI * 2;
    const pt = (rad, a) => [110 + rad * Math.sin(a), 110 - rad * Math.cos(a)];
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const full = pie.length === 1;
    const [x0, y0] = pt(R, a0);
    const [x1, y1] = pt(R, a1);
    const [x2, y2] = pt(r0, a1);
    const [x3, y3] = pt(r0, a0);
    const d = full
      ? `M110,${110 - R} A${R},${R} 0 1 1 109.99,${110 - R} Z M110,${110 - r0} A${r0},${r0} 0 1 0 110.01,${110 - r0} Z`
      : `M${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 ${large} 0 ${x3},${y3} Z`;
    return { ...p, d, color: p.key === '_other' ? 'var(--viz-other)' : SLOTS[i] };
  });

  return (
    <div className="viz-root">
      <div className="seg" role="tablist" aria-label={t('شكل الرسم')}>
        <button type="button" role="tab" aria-selected={mode === 'bars'} className={mode === 'bars' ? 'on' : ''} onClick={() => setMode('bars')}>{t('أعمدة')}</button>
        <button type="button" role="tab" aria-selected={mode === 'pie'} className={mode === 'pie' ? 'on' : ''} onClick={() => setMode('pie')}>{t('دائري')}</button>
      </div>

      {mode === 'bars' ? (
        <div className="hbars" role="img" aria-label={rows.map((r) => `${r.label}: ${r.value}`).join('، ')}>
          {rows.map((r, i) => (
            <div className={`hbar${hover === i ? ' hov' : ''}`} key={r.key} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)}>
              <span className="hbar-label">{r.label}</span>
              <span className="hbar-track">
                <i style={{ width: `${(r.value / max) * 100}%` }} />
              </span>
              <span className="hbar-val">
                {r.value.toLocaleString('en')} <small>{pct(r.value)}%</small>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="donut-wrap">
          <svg viewBox="0 0 220 220" className="donut" role="img" aria-label={pie.map((p) => `${p.label}: ${pct(p.value)}%`).join('، ')}>
            {arcs.map((a, i) => (
              <path key={a.key} d={a.d} fill={a.color} stroke="var(--surface)" strokeWidth="2" opacity={hover === -1 || hover === i ? 1 : 0.35} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)} />
            ))}
            <text x="110" y="106" textAnchor="middle" className="donut-num">
              {hover >= 0 ? `${pct(arcs[hover].value)}%` : total.toLocaleString('en')}
            </text>
            <text x="110" y="128" textAnchor="middle" className="donut-cap">
              {hover >= 0 ? arcs[hover].label : t('زيارة')}
            </text>
          </svg>
          <ul className="donut-legend">
            {arcs.map((a, i) => (
              <li key={a.key} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)} className={hover === i ? 'hov' : ''}>
                <i style={{ background: a.color }} />
                <span>{a.label}</span>
                <b>{a.value.toLocaleString('en')}</b>
                <small>{pct(a.value)}%</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
