import Link from 'next/link';
import { requestPasswordReset } from '@/app/actions';
import { adminT } from '@/lib/adminLang';
import AuthShell from '@/components/AuthShell';

export const metadata = { robots: { index: false } };

export default async function ForgotPage({ searchParams }) {
  const { t, lang, dir } = await adminT();
  const sp = await searchParams;

  return (
    <AuthShell lang={lang} dir={dir} t={t} title={t('نسيت كلمة المرور')}>
      {sp?.sent ? (
        <>
          <div className="flash ok">{t('وصل طلبك للمدير. بيعطيك كلمة مرور مؤقتة، وأول ما تدخل فيها تختار كلمة مرور جديدة.')}</div>
          <Link href="/admin/login" className="btn ghost" style={{ width: '100%', textAlign: 'center' }}>{t('رجوع لتسجيل الدخول')}</Link>
        </>
      ) : (
        <>
          <p className="muted">{t('اكتب اسم المستخدم، ويوصل للمدير طلب إعادة تعيين كلمة المرور.')}</p>
          <form action={requestPasswordReset}>
            <div className="field">
              <label htmlFor="username">{t('اسم المستخدم')}</label>
              <input id="username" type="text" name="username" required maxLength={30} dir="ltr" autoCapitalize="none" spellCheck={false} autoFocus />
            </div>
            <div className="field">
              <label htmlFor="note">{t('ملاحظة للمدير (اختياري)')}</label>
              <input id="note" type="text" name="note" maxLength={200} placeholder={t('مثال: رقم جوالي للتواصل')} />
            </div>
            <button className="btn" type="submit" style={{ width: '100%' }}>{t('إرسال الطلب')}</button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 12 }}><Link href="/admin/login">{t('رجوع لتسجيل الدخول')}</Link></p>
        </>
      )}
    </AuthShell>
  );
}
