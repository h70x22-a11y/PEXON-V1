import PushPrompt from '@/components/PushPrompt';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { can, requireAdmin } from '@/lib/auth';
import { blobReady, dbReady, getAvatar, getChatUnread, getMessages, getNotSold, getResetRequests, getSearchProgress } from '@/lib/db';
import { AdminLangProvider, AdminLangToggle } from '@/components/AdminLang';
import AdminTopbar from '@/components/AdminTopbar';
import { TbChartPie, TbMessages, TbFileDollar, TbInbox, TbBriefcase, TbPackage, TbLayoutGrid, TbChartBar, TbChartLine, TbSettings, TbHistory, TbCloudUpload, TbUserShield, TbCode, TbWorld } from 'react-icons/tb';
import { adminT } from '@/lib/adminLang';

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
  const [msgs, prog, notSold, resets, chats] = await Promise.all([
    getMessages(),
    show('searches') ? getSearchProgress() : null,
    show('searches') ? getNotSold() : {},
    can(session, 'users:write') ? getResetRequests() : [],
    getChatUnread(session.id),
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
  const dot = (k) => (pending[k] ? <span className="side-dot" title={t('يحتاج معالجة')} aria-label={t('يحتاج معالجة')} /> : null);
  return (
    <AdminLangProvider lang={lang}>
    <div className="admin-shell" dir={dir} lang={lang}>
    <AdminTopbar name={t(session.name)} title="" avatar={avatar} langToggle={<AdminLangToggle lang={lang} />} />
    <div className="admin">
      <aside className="admin-side">
        <Link href="/admin"><TbChartPie className="side-ic" aria-hidden="true" />{t('نظرة عامة')}</Link>
        <Link href="/admin/inbox"><TbMessages className="side-ic" aria-hidden="true" />{t('المحادثات')}{dot('inbox')}</Link>
        {show('quotes') ? <Link href="/admin/quotes"><TbFileDollar className="side-ic" aria-hidden="true" />{t('طلبات عروض الأسعار')}{dot('quotes')}</Link> : null}
        {show('messages') ? <Link href="/admin/messages"><TbInbox className="side-ic" aria-hidden="true" />{t('الرسائل')}{dot('messages')}</Link> : null}
        {show('vendors') ? <Link href="/admin/vendors"><TbBriefcase className="side-ic" aria-hidden="true" />{t('الموردين المسجلين')}{dot('vendors')}</Link> : null}
        {show('products') ? <Link href="/admin/products"><TbPackage className="side-ic" aria-hidden="true" />{t('المنتجات')}</Link> : null}
        {show('categories') ? <Link href="/admin/categories"><TbLayoutGrid className="side-ic" aria-hidden="true" />{t('الأقسام')}</Link> : null}
        {show('searches') ? <Link href="/admin/visits"><TbChartLine className="side-ic" aria-hidden="true" />{t('الزيارات')}</Link> : null}
        {show('searches') ? <Link href="/admin/searches"><TbChartBar className="side-ic" aria-hidden="true" />{t('إحصائيات البحث')}{dot('searches')}</Link> : null}
        {show('settings') ? <Link href="/admin/settings"><TbSettings className="side-ic" aria-hidden="true" />{t('إعدادات الموقع')}</Link> : null}
        {show('audit') ? <Link href="/admin/activity"><TbHistory className="side-ic" aria-hidden="true" />{t('سجل النشاط')}</Link> : null}
        {session.owner ? <Link href="/admin/backups"><TbCloudUpload className="side-ic" aria-hidden="true" />{t('النسخ الاحتياطية')}</Link> : null}
        {show('users') ? <Link href="/admin/users"><TbUserShield className="side-ic" aria-hidden="true" />{t('المستخدمين والصلاحيات')}{dot('users')}</Link> : null}
        <div className="spacer" />
        {session.owner ? <Link href="/admin/developer"><TbCode className="side-ic" aria-hidden="true" />{t('المطوّر')}</Link> : null}
        <a href="/" target="_blank" rel="noopener noreferrer"><TbWorld className="side-ic" aria-hidden="true" />{t('عرض الموقع ↗')}</a>
      </aside>
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
