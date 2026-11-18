import { redirect } from 'next/navigation';
import { login } from '@/app/actions';
import { isAdmin, passwordConfigured } from '@/lib/auth';
import { adminT } from '@/lib/adminLang';
import AuthShell from '@/components/AuthShell';
import PasskeyLogin from '@/components/PasskeyLogin';

export const metadata = { title: 'دخول لوحة التحكم', robots: { index: false } };

export default async function LoginPage({ searchParams }) {
  const { t, lang, locale, dir } = await adminT();
  const sp = await searchParams;
  if (await isAdmin()) redirect('/admin');

  return (
    <AuthShell lang={lang} dir={dir} t={t} title={t('تسجيل الدخول')}>
      {!passwordConfigured ? (
        <div className="flash warn">
          {t('لم تُضبط كلمة المرور بعد. أضف المتغير ADMIN_PASSWORD من إعدادات المشروع في Vercel ثم أعد النشر.')}
        </div>
      ) : null}
      {sp?.error === 'expired' ? (
        <div className="flash warn">{t('انتهت مهلة التحقق، سجّل دخولك من جديد.')}</div>
      ) : sp?.error === 'locked' ? (
        <div className="flash err">{t('محاولات دخول خاطئة كثيرة. حاول مرة ثانية بعد 5 دقائق.')}</div>
      ) : sp?.error ? (
        <div className="flash err">
          {t('اسم المستخدم أو كلمة المرور غير صحيحة.')}
          {Number(sp.left) > 0 ? <div style={{ fontWeight: 400, marginTop: 4 }}>{t('بقي لك {n} محاولات قبل القفل المؤقت.', { n: Number(sp.left) })}</div> : null}
        </div>
      ) : null}
      <form action={login} className="auth-fields">
        <p className="auth-hint">{t('ادخل باسم المستخدم وكلمة المرور')}</p>
        <label htmlFor="username" className="sr-only">{t('اسم المستخدم')}</label>
        <input id="username" className="auth-input" type="text" name="username" required autoFocus autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder={t('اسم المستخدم')} />
        <label htmlFor="password" className="sr-only">{t('كلمة المرور')}</label>
        <input id="password" className="auth-input" type="password" name="password" required autoComplete="current-password" placeholder={t('كلمة المرور')} />
        <a href="/admin/forgot" className="auth-forgot">{t('نسيت كلمة المرور؟')}</a>
        <button className="auth-btn" type="submit">{t('دخول')}</button>
      </form>
      <PasskeyLogin lang={lang} />

    </AuthShell>
  );
}
