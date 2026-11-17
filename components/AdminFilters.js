import Link from 'next/link';

// شريط البحث والفترة الزمنية لقوائم لوحة التحكم
export default function AdminFilters({ action, sp, placeholder, hidden = {}, children }) {
  const active = sp?.q || sp?.from || sp?.to;
  return (
    <form className="admin-filters" method="get" action={action}>
      {Object.entries(hidden).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <div className="field grow">
        <label>بحث</label>
        <input type="search" name="q" defaultValue={sp?.q || ''} placeholder={placeholder} />
      </div>
      {children}
      <div className="field">
        <label>من تاريخ</label>
        <input type="date" name="from" defaultValue={sp?.from || ''} />
      </div>
      <div className="field">
        <label>إلى تاريخ</label>
        <input type="date" name="to" defaultValue={sp?.to || ''} />
      </div>
      <button className="btn" type="submit">بحث</button>
      {active ? <Link href={action + (hidden.status ? `?status=${hidden.status}` : '')} className="clear-link">مسح</Link> : null}
    </form>
  );
}
