import Link from 'next/link';
import { can, requireAdmin } from '@/lib/auth';
import { adminT } from '@/lib/adminLang';
import TeamChat from '@/components/TeamChat';

export default async function InboxPage({ searchParams }) {
  const { t } = await adminT();
  const session = await requireAdmin();
  const sp = await searchParams;
  return (
    <>
      <h1>{t('المحادثات')}</h1>
      {can(session, 'chats') ? (
        <div className="status-tabs">
          <Link href="/admin/inbox" className="active">{t('محادثاتي')}</Link>
          <Link href="/admin/inbox/review">{t('محادثات الموظفين')}</Link>
        </div>
      ) : null}
      <p className="muted" style={{ marginTop: 0 }}>{t('تواصل مع زملائك في لوحة التحكم.')} {t('المحادثات تحفظ في النظام وممكن تراجعها الإدارة.')}</p>
      <TeamChat initialWith={String(sp?.with || '')} />
    </>
  );
}
