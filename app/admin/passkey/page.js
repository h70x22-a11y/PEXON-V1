import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { adminT } from '@/lib/adminLang';
import AuthShell from '@/components/AuthShell';
import PasskeyOffer from '@/components/PasskeyOffer';

export const metadata = { robots: { index: false } };

// تظهر مباشرة بعد تسجيل الدخول: تفعيل الدخول بالبصمة أو الوجه على هذا الجهاز
export default async function PasskeyOfferPage({ searchParams }) {
  const { t, lang, dir } = await adminT();
  await requireAdmin();
  const sp = await searchParams;
  const next = String(sp?.next || '/admin');
  const safeNext = next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin';
  if (!safeNext) redirect('/admin');

  return (
    <AuthShell lang={lang} dir={dir} t={t} title={t('الدخول بالبصمة أو الوجه')}>
      <PasskeyOffer lang={lang} next={safeNext} />
    </AuthShell>
  );
}
