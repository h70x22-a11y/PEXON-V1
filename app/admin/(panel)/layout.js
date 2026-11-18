import { redirect } from 'next/navigation';
import Link from 'next/link';
import { can, requireAdmin } from '@/lib/auth';
import { blobReady, dbReady, getAvatar } from '@/lib/db';
import { logout } from '@/app/actions';
import { AdminLangProvider, AdminLangToggle } from '@/components/AdminLang';
import AdminTopbar from '@/components/AdminTopbar';
import { adminT } from '@/lib/adminLang';

export async function generateMetadata() {
  const { t } = await adminT();
  return { title: t('لوحة التحكم'), robots: { index: false } };
}

export default async function AdminLayout({ children }) {
  const { t, lang, locale, dir } = await adminT();
  const session = await requireAdmin();
  if (session.mustChange) redirect('/admin/set-password');
  const show = (perm) => can(session, perm);
  const avatar = await getAvatar(session.id);
  return (
    <AdminLangProvider lang={lang}>
    <div className="admin" dir={dir} lang={lang}>
      <aside className="admin-side">
        <div className="title">
          <a href="/admin" className="side-logo"><img src="/logo-white.png" alt="PEXON" width={150} height={40} /></a>
          <AdminLangToggle lang={lang} />
        </div>
        <Link href="/admin">{t('نظرة عامة')}</Link>
        <Link href="/admin/inbox">{t('المحادثات')}</Link>
        {show('quotes') ? <Link href="/admin/quotes">{t('طلبات عروض الأسعار')}</Link> : null}
        {show('messages') ? <Link href="/admin/messages">{t('الرسائل')}</Link> : null}
        {show('vendors') ? <Link href="/admin/vendors">{t('الموردين المسجلين')}</Link> : null}
        {show('products') ? <Link href="/admin/products">{t('المنتجات')}</Link> : null}
        {show('categories') ? <Link href="/admin/categories">{t('الأقسام')}</Link> : null}
        {show('searches') ? <Link href="/admin/searches">{t('إحصائيات البحث')}</Link> : null}
        {show('settings') ? <Link href="/admin/settings">{t('إعدادات الموقع')}</Link> : null}
        {show('users') ? <Link href="/admin/users">{t('المستخدمين والصلاحيات')}</Link> : null}
        <div className="spacer" />
        {session.owner ? <Link href="/admin/developer">{t('‹/› المطوّر')}</Link> : null}
        <a href="/" target="_blank" rel="noopener noreferrer">{t('عرض الموقع ↗')}</a>
        <form action={logout}>
          <button type="submit">{t('تسجيل الخروج')}</button>
        </form>
      </aside>
      <div className="admin-main">
        <AdminTopbar name={t(session.name)} title={t('لوحة التحكم')} avatar={avatar} />
        {!dbReady ? (
          <div className="flash warn">
            {t('قاعدة البيانات غير مربوطة، فالتعديلات لن تُحفظ. من Vercel افتح Storage واربط Upstash Redis بالمشروع ثم أعد النشر.')}
          </div>
        ) : null}
        {dbReady && !blobReady ? (
          <div className="flash warn">
            {t('رفع الصور غير مفعّل. اربط Vercel Blob من Storage، أو استخدم روابط الصور مؤقتاً.')}
          </div>
        ) : null}
        {children}
      </div>
    </div>
    </AdminLangProvider>
  );
}
