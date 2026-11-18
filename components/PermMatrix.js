'use client';

import { Fragment, useState } from 'react';
import { ACTIONS, PERM_GROUPS } from '@/lib/permissions';
import { useAdminT } from '@/components/AdminLang';

// جدول صلاحيات المنصب: الأقسام في الصفوف والعمليات في الأعمدة
export default function PermMatrix({ selected = [], readOnly = false }) {
  const { t } = useAdminT();
  const [on, setOn] = useState(() => new Set(selected));

  const set = (keys, value) =>
    setOn((prev) => {
      const next = new Set(prev);
      for (const k of keys) {
        if (value) next.add(k);
        else next.delete(k);
      }
      // أي عملية تحتاج صلاحية العرض، وإلغاء العرض يلغي باقي عمليات القسم
      for (const g of PERM_GROUPS)
        for (const it of g.items) {
          const others = it.actions.filter((a) => a !== 'read').some((a) => next.has(`${it.key}:${a}`));
          if (others && value) next.add(`${it.key}:read`);
          if (!value && keys.includes(`${it.key}:read`)) it.actions.forEach((a) => next.delete(`${it.key}:${a}`));
        }
      return next;
    });

  const groupKeys = (g, action) => g.items.filter((it) => it.actions.includes(action)).map((it) => `${it.key}:${action}`);
  const all = (keys) => keys.length > 0 && keys.every((k) => on.has(k));

  return (
    <div className="table-wrap">
      <table className="perm-matrix">
        <thead>
          <tr>
            <th>{t('القسم')}</th>
            {ACTIONS.map((a) => (
              <th key={a.key}>{t(a.ar)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERM_GROUPS.map((g) => groupRows(g))}
        </tbody>
      </table>
      {[...on].map((k) => (
        <input key={k} type="hidden" name={`perm_${k}`} value="1" />
      ))}
    </div>
  );

  function groupRows(g) {
    return (
      <Fragment key={g.ar}>
        <tr className="perm-group">
          <th scope="row">{t(g.ar)}</th>
          {ACTIONS.map((a) => {
            const keys = groupKeys(g, a.key);
            return (
              <td key={a.key}>
                {keys.length ? (
                  <input type="checkbox" aria-label={`${t(g.ar)} - ${t(a.ar)}`} checked={all(keys)} disabled={readOnly} onChange={(e) => set(keys, e.target.checked)} />
                ) : null}
              </td>
            );
          })}
        </tr>
        {g.items.map((it) => (
          <tr key={it.key}>
            <td className="perm-item">{t(it.ar)}</td>
            {ACTIONS.map((a) => {
              const k = `${it.key}:${a.key}`;
              return (
                <td key={a.key}>
                  {it.actions.includes(a.key) ? (
                    <input type="checkbox" aria-label={`${t(it.ar)} - ${t(a.ar)}`} checked={on.has(k)} disabled={readOnly} onChange={(e) => set([k], e.target.checked)} />
                  ) : (
                    <span className="muted" aria-hidden="true">—</span>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </Fragment>
    );
  }
}
