import Link from 'next/link';
import { can, requireAdmin } from '@/lib/auth';
import { getCategories, getMessages, getProducts, getSearchStats } from '@/lib/db';

export default async function AdminHome({ searchParams }) {
  const sp = await searchParams;
  const session = await requireAdmin();
  const show = (perm) => can(session, perm);
  const [categories, products, messages] = await Promise.all([getCategories(), getProducts(), getMessages()]);
  const newQuotes = messages.filter((m) => m.type === 'quote' && (m.status || 'new') === 'new').length;
  const contact = messages.filter((m) => m.type !== 'vendor' && m.type !== 'quote').length;
  const vendors = messages.filter((m) => m.type === 'vendor').length;
  const searches = show('searches') ? await getSearchStats(7) : null;

  return (
    <>
      <h1>أهلاً {session.name}</h1>
      {sp?.denied ? <div className="flash warn">ما عندك صلاحية على هذا القسم. تواصل مع المدير.</div> : null}
      <div className="stats">
        {show('quotes') ? <Link className="stat" href="/admin/quotes?status=new"><b>{newQuotes}</b>طلب عرض سعر جديد</Link> : null}
        {show('messages') ? <Link className="stat" href="/admin/messages"><b>{contact}</b>رسالة</Link> : null}
        {show('vendors') ? <Link className="stat" href="/admin/vendors"><b>{vendors}</b>مورد مسجل</Link> : null}
        {show('products') ? <Link className="stat" href="/admin/products"><b>{products.length}</b>منتج</Link> : null}
        {searches ? <Link className="stat" href="/admin/searches?days=7"><b>{searches.zeroTotal}</b>بحث بدون نتيجة (آخر 7 أيام)</Link> : null}
        {show('categories') ? <Link className="stat" href="/admin/categories"><b>{categories.length}</b>قسم</Link> : null}
      </div>
    </>
  );
}
