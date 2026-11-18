import { requireAdmin } from '@/lib/auth';
import { adminT } from '@/lib/adminLang';
import TeamChat from '@/components/TeamChat';

export default async function InboxPage({ searchParams }) {
  const { t } = await adminT();
  await requireAdmin();
  const sp = await searchParams;
  return (
    <>
      <h1>{t('المحادثات')}</h1>
      <p className="muted" style={{ marginTop: 0 }}>{t('تواصل مع زملائك في لوحة التحكم.')}</p>
      <TeamChat initialWith={String(sp?.with || '')} />
    </>
  );
}
