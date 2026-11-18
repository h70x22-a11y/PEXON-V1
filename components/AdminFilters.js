'use client';

import Link from 'next/link';
import { useAdminT } from '@/components/AdminLang';

// شريط البحث والفترة الزمنية لقوائم لوحة التحكم
export default function AdminFilters({ action, sp, placeholder, hidden = {}, children }) {
  const { t } = useAdminT();
  const active = sp?.q || sp?.from || sp?.to;
  return (
    <form className="admin-filters" method="get" action={action}>
      {Object.entries(hidden).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <div className="field grow">
        <label>{t('بحث')}</label>
        <input type="search" name="q" defaultValue={sp?.q || ''} placeholder={placeholder} />
      </div>
      {children}
      <div className="field">
        <label>{t('من تاريخ')}</label>
        <input type="date" name="from" defaultValue={sp?.from || ''} />
      </div>
      <div className="field">
        <label>{t('إلى تاريخ')}</label>
        <input type="date" name="to" defaultValue={sp?.to || ''} />
      </div>
      <button className="btn" type="submit">{t('بحث')}</button>
      {active ? <Link href={action + (hidden.status ? `?status=${hidden.status}` : '')} className="clear-link">{t('مسح')}</Link> : null}
    </form>
  );
}
