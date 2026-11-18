import { redirect } from 'next/navigation';
import { login } from '@/app/actions';
import { isAdmin, passwordConfigured } from '@/lib/auth';
import { adminT } from '@/lib/adminLang';
import { AdminLangToggle } from '@/components/AdminLang';

export const metadata = { title: 'دخول لوحة التحكم', robots: { index: false } };

export default async function LoginPage({ searchParams }) {
  const { t, lang, locale, dir } = await adminT();
  const sp = await searchParams;
  if (await isAdmin()) redirect('/admin');

  return (
    <div className="login-box panel" dir={dir} lang={lang}>
      <h1 style={{ fontSize: '1.4rem' }}>{t('لوحة التحكم')}</h1>
      {!passwordConfigured ? (
        <div className="flash warn">
          {t('لم تُضبط كلمة المرور بعد. أضف المتغير ADMIN_PASSWORD من إعدادات المشروع في Vercel ثم أعد النشر.')}
        </div>
      ) : null}
      {sp?.error === 'locked' ? (
        <div className="flash err">{t('محاولات دخول خاطئة كثيرة. حاول مرة ثانية بعد 15 دقيقة.')}</div>
      ) : sp?.error ? (
        <div className="flash err">{t('اسم المستخدم أو كلمة المرور غير صحيحة.')}</div>
      ) : null}
      <form action={login}>
        <div className="field">
          <label htmlFor="username">{t('اسم المستخدم')}</label>
          <input id="username" type="text" name="username" required autoFocus dir="ltr" autoComplete="username" autoCapitalize="none" spellCheck={false} />
        </div>
        <div className="field">
          <label htmlFor="password">{t('كلمة المرور')}</label>
          <input id="password" type="password" name="password" required dir="ltr" autoComplete="current-password" />
        </div>
        <button className="btn" type="submit" style={{ width: '100%' }}>{t('دخول')}</button>
      </form>
      <div className="login-lang"><AdminLangToggle lang={lang} /></div>
    </div>
  );
}
