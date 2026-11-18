import Link from 'next/link';
import { can, requireAdmin } from '@/lib/auth';
import { blobReady, dbReady } from '@/lib/db';
import { logout } from '@/app/actions';

export const metadata = { title: 'لوحة التحكم', robots: { index: false } };

export default async function AdminLayout({ children }) {
  const session = await requireAdmin();
  const show = (perm) => can(session, perm);
  return (
    <div className="admin" dir="rtl" lang="ar">
      <aside className="admin-side">
        <div className="title">لوحة التحكم</div>
        <Link href="/admin">نظرة عامة</Link>
        {show('quotes') ? <Link href="/admin/quotes">طلبات عروض الأسعار</Link> : null}
        {show('messages') ? <Link href="/admin/messages">الرسائل</Link> : null}
        {show('vendors') ? <Link href="/admin/vendors">الموردين المسجلين</Link> : null}
        {show('products') ? <Link href="/admin/products">المنتجات</Link> : null}
        {show('categories') ? <Link href="/admin/categories">الأقسام</Link> : null}
        {show('searches') ? <Link href="/admin/searches">إحصائيات البحث</Link> : null}
        {show('settings') ? <Link href="/admin/settings">إعدادات الموقع</Link> : null}
        {show('users') ? <Link href="/admin/users">المستخدمين والصلاحيات</Link> : null}
        <div className="spacer" />
        {session.owner ? <Link href="/admin/developer">‹/› المطوّر</Link> : null}
        <Link href="/admin/account" className="side-user">👤 {session.name}</Link>
        <a href="/" target="_blank" rel="noopener noreferrer">عرض الموقع ↗</a>
        <form action={logout}>
          <button type="submit">تسجيل الخروج</button>
        </form>
      </aside>
      <div className="admin-main">
        {!dbReady ? (
          <div className="flash warn">
            قاعدة البيانات غير مربوطة، فالتعديلات لن تُحفظ. من Vercel افتح Storage واربط Upstash Redis بالمشروع ثم أعد النشر.
          </div>
        ) : null}
        {dbReady && !blobReady ? (
          <div className="flash warn">
            رفع الصور غير مفعّل. اربط Vercel Blob من Storage، أو استخدم روابط الصور مؤقتاً.
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
