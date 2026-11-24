import PushPrompt from '@/components/PushPrompt';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { can, requireAdmin } from '@/lib/auth';
import { blobReady, dbReady, getAvatar, getChatUnread, getNavUse, getMessages, getNotSold, getResetRequests, getSearchProgress } from '@/lib/db';
import { AdminLangProvider, AdminLangToggle } from '@/components/AdminLang';
import AdminTopbar from '@/components/AdminTopbar';
import { TbChartPie, TbMessages, TbFileDollar, TbInbox, TbBriefcase, TbPackage, TbLayoutGrid, TbChartBar, TbChartLine, TbSettings, TbHistory, TbCloudUpload, TbUserShield, TbCode, TbWorld, TbTrendingUp } from 'react-icons/tb';
import { adminT } from '@/lib/adminLang';
import NavTracker from '@/components/NavTracker';

export async function generateMetadata() {
  const { t } = await adminT();
  return { title: t('لوحة التحكم'), robots: { index: false } };
}

export default async function AdminLayout({ children }) {
  const { t, lang, locale, dir } = await adminT();
  const session = await requireAdmin();
  if (session.mustChange) redirect('/admin/set-password');
  if (!session.termsOk) redirect('/admin/terms');
  const show = (perm) => can(session, perm);
  const avatar = await getAvatar(session.id);

  // نقطة سماوية جنب القسم اللي فيه شي يحتاج معالجة، وتختفي بعد المعالجة
  const [msgs, prog, notSold, resets, chats, navUse] = await Promise.all([
    getMessages(),
    show('searches') ? getSearchProgress() : null,
    show('searches') ? getNotSold() : {},
    can(session, 'users:write') ? getResetRequests() : [],
    getChatUnread(session.id),
    getNavUse(session.id),
  ]);
  const approved = new Set(Object.entries(notSold).filter(([, v]) => v.status === 'approved').map(([k]) => k));
  const pending = {
    quotes: show('quotes') && msgs.some((m) => m.type === 'quote' && (m.status || 'new') === 'new'),
    messages: show('messages') && msgs.some((m) => (m.type !== 'quote' && m.type !== 'vendor' && !m.handled) || (m.type === 'datarequest' && !['done', 'rejected'].includes(m.status))),
    vendors: show('vendors') && msgs.some((m) => m.type === 'vendor' && !m.handled),
    searches:
      show('searches') &&
      (Object.keys(prog?.missing || {}).some((k) => !approved.has(k)) || (session.owner && Object.values(notSold).some((v) => v.status === 'pending'))),
    users: resets.length > 0,
    inbox: Object.values(chats).some((n) => n > 0),
  };
  // القائمة تترتب حسب استخدام كل شخص: النظرة العامة أول، والباقي حسب عدد مرات الفتح
  const NAV = [
    { key: 'home', href: '/admin', Icon: TbChartPie, label: 'نظرة عامة', ok: true },
    { key: 'quotes', href: '/admin/quotes', Icon: TbFileDollar, label: 'طلبات عروض الأسعار', ok: show('quotes'), dot: 'quotes' },
    { key: 'inbox', href: '/admin/inbox', Icon: TbMessages, label: 'المحادثات', ok: true, dot: 'inbox' },
    { key: 'messages', href: '/admin/messages', Icon: TbInbox, label: 'الرسائل', ok: show('messages'), dot: 'messages' },
    { key: 'products', href: '/admin/products', Icon: TbPackage, label: 'المنتجات', ok: show('products') },
    { key: 'visits', href: '/admin/visits', Icon: TbChartLine, label: 'الزيارات', ok: show('searches') },
    { key: 'seo', href: '/admin/seo', Icon: TbTrendingUp, label: 'SEO', ok: show('searches') },
    { key: 'searches', href: '/admin/searches', Icon: TbChartBar, label: 'إحصائيات البحث', ok: show('searches'), dot: 'searches' },
    { key: 'vendors', href: '/admin/vendors', Icon: TbBriefcase, label: 'الموردين المسجلين', ok: show('vendors'), dot: 'vendors' },
    { key: 'categories', href: '/admin/categories', Icon: TbLayoutGrid, label: 'الأقسام', ok: show('categories') },
    { key: 'settings', href: '/admin/settings', Icon: TbSettings, label: 'إعدادات الموقع', ok: show('settings') },
    { key: 'users', href: '/admin/users', Icon: TbUserShield, label: 'المستخدمين والصلاحيات', ok: show('users'), dot: 'users' },
    { key: 'activity', href: '/admin/activity', Icon: TbHistory, label: 'سجل النشاط', ok: show('audit') },
    { key: 'backups', href: '/admin/backups', Icon: TbCloudUpload, label: 'النسخ الاحتياطية', ok: session.owner },
  ];
  const navItems = NAV.filter((x) => x.ok)
    .map((x, i) => ({ ...x, i, n: x.key === 'home' ? Infinity : navUse[x.key] || 0 }))
    .sort((a, b) => b.n - a.n || a.i - b.i);
  const dot = (k) => (pending[k] ? <span className="side-dot" title={t('يحتاج معالجة')} aria-label={t('يحتاج معالجة')} /> : null);
  return (
    <AdminLangProvider lang={lang}>
    <div className="admin-shell" dir={dir} lang={lang}>
    <AdminTopbar name={t(session.name)} title="" avatar={avatar} langToggle={<AdminLangToggle lang={lang} />} />
    <div className="admin">
      <aside className="admin-side">
        {navItems.map((x) => (
          <Link key={x.key} href={x.href}><x.Icon className="side-ic" aria-hidden="true" />{t(x.label)}{x.dot ? dot(x.dot) : null}</Link>
        ))}
        <div className="spacer" />
        {session.owner ? <Link href="/admin/developer"><TbCode className="side-ic" aria-hidden="true" />{t('المطوّر')}</Link> : null}
        <a href="/" target="_blank" rel="noopener noreferrer"><TbWorld className="side-ic" aria-hidden="true" />{t('عرض الموقع ↗')}</a>
      </aside>
      <NavTracker />
      <div className="admin-main">
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
    </div>
    <PushPrompt lang={lang} />
    </AdminLangProvider>
  );
}
