import Link from 'next/link';
import { can, requireAdmin } from '@/lib/auth';
import { getCategories, getMessages, getProducts, getResetRequests, getSearchStats } from '@/lib/db';
import { adminT } from '@/lib/adminLang';

export default async function AdminHome({ searchParams }) {
  const { t, lang, locale, dir } = await adminT();
  const sp = await searchParams;
  const session = await requireAdmin();
  const show = (perm) => can(session, perm);
  const [categories, products, messages] = await Promise.all([getCategories(), getProducts(), getMessages()]);
  const newQuotes = messages.filter((m) => m.type === 'quote' && (m.status || 'new') === 'new').length;
  const contact = messages.filter((m) => m.type !== 'vendor' && m.type !== 'quote').length;
  const vendors = messages.filter((m) => m.type === 'vendor').length;
  const searches = show('searches') ? await getSearchStats(7) : null;
  const resets = can(session, 'users:write') ? (await getResetRequests()).length : 0;

  return (
    <>
      <h1>{t('لوحة التحكم')}</h1>
      {sp?.denied ? <div className="flash warn">{t('ما عندك صلاحية على هذا القسم. تواصل مع المدير.')}</div> : null}
      {sp?.welcome ? <div className="flash ok">{t('تم حفظ كلمة المرور الجديدة. أهلاً بك!')}</div> : null}
      {resets ? (
        <Link href="/admin/users" className="flash warn" style={{ display: 'block' }}>
          {t('عندك {n} طلب إعادة تعيين كلمة مرور من الموظفين ←', { n: resets })}
        </Link>
      ) : null}
      <div className="stats">
        {show('quotes') ? <Link className="stat" href="/admin/quotes?status=new"><b>{newQuotes}</b>{t('طلب عرض سعر جديد')}</Link> : null}
        {show('messages') ? <Link className="stat" href="/admin/messages"><b>{contact}</b>{t('رسالة')}</Link> : null}
        {show('vendors') ? <Link className="stat" href="/admin/vendors"><b>{vendors}</b>{t('مورد مسجل')}</Link> : null}
        {show('products') ? <Link className="stat" href="/admin/products"><b>{products.length}</b>{t('منتج')}</Link> : null}
        {searches ? <Link className="stat" href="/admin/searches?days=7"><b>{searches.zeroTotal}</b>{t('بحث بدون نتيجة (آخر 7 أيام)')}</Link> : null}
        {show('categories') ? <Link className="stat" href="/admin/categories"><b>{categories.length}</b>{t('قسم')}</Link> : null}
      </div>
    </>
  );
}
