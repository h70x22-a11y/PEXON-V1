import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { blobReady, dbReady } from '@/lib/db';
import { logout } from '@/app/actions';

export const metadata = { title: 'لوحة التحكم', robots: { index: false } };

export default async function AdminLayout({ children }) {
  await requireAdmin();
  return (
    <div className="admin" dir="rtl" lang="ar">
      <aside className="admin-side">
        <div className="title">لوحة التحكم</div>
        <Link href="/admin">نظرة عامة</Link>
        <Link href="/admin/products">المنتجات</Link>
        <Link href="/admin/categories">الأقسام</Link>
        <Link href="/admin/messages">الرسائل</Link>
        <Link href="/admin/vendors">الموردين المسجلين</Link>
        <Link href="/admin/settings">إعدادات الموقع</Link>
        <div className="spacer" />
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
