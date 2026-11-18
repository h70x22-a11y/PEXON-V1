import Link from 'next/link';
import { requestPasswordReset } from '@/app/actions';
import { adminT } from '@/lib/adminLang';
import { AdminLangToggle } from '@/components/AdminLang';

export const metadata = { robots: { index: false } };

export default async function ForgotPage({ searchParams }) {
  const { t, lang, dir } = await adminT();
  const sp = await searchParams;

  return (
    <div className="login-box panel" dir={dir} lang={lang}>
      <h1 style={{ fontSize: '1.4rem' }}>{t('نسيت كلمة المرور')}</h1>
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
      <div className="login-lang"><AdminLangToggle lang={lang} /></div>
    </div>
  );
}
