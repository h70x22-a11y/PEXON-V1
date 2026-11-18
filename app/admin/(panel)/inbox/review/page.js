import Link from 'next/link';
import { requirePerm } from '@/lib/auth';
import { adminT } from '@/lib/adminLang';
import ChatReview from '@/components/ChatReview';

export default async function ChatReviewPage() {
  const { t } = await adminT();
  await requirePerm('chats');
  return (
    <>
      <h1>{t('المحادثات')}</h1>
      <div className="status-tabs">
        <Link href="/admin/inbox">{t('محادثاتي')}</Link>
        <Link href="/admin/inbox/review" className="active">{t('محادثات الموظفين')}</Link>
      </div>
      <p className="muted" style={{ marginTop: 0 }}>{t('مراجعة المحادثات بين الموظفين لمتابعة بيئة العمل. المراجعة ما تغيّر حالة المقروء عندهم.')}</p>
      <ChatReview />
    </>
  );
}
