import { redirect } from 'next/navigation';
import { verify2faAction } from '@/app/actions';
import { getPending2fa } from '@/lib/auth';
import { adminT } from '@/lib/adminLang';
import AuthShell from '@/components/AuthShell';

export const metadata = { robots: { index: false } };

export default async function VerifyPage({ searchParams }) {
  const { t, lang, dir } = await adminT();
  const sp = await searchParams;
  if (!(await getPending2fa())) redirect('/admin/login');

  return (
    <AuthShell lang={lang} dir={dir} t={t} title={t('التحقق بخطوتين')}>
      <p className="auth-hint">{t('افتح تطبيق التحقق في جوالك واكتب الرمز المكوّن من 6 أرقام.')}</p>
      {sp?.error ? <div className="flash err">{t(String(sp.error))}</div> : null}
      <form action={verify2faAction} className="auth-fields">
        <label htmlFor="code" className="sr-only">{t('رمز التحقق')}</label>
        <input id="code" className="auth-input otp-input" type="text" name="code" required autoFocus inputMode="numeric" autoComplete="one-time-code" maxLength={11} placeholder="••••••" dir="ltr" />
        <button className="auth-btn" type="submit">{t('تحقق')}</button>
      </form>
      <p className="muted" style={{ fontSize: '0.85rem', marginTop: 14 }}>{t('ضاع جوالك؟ اكتب أحد رموز الاسترداد بدل الرمز.')}</p>
      <p style={{ marginTop: 6 }}><a href="/admin/login">{t('رجوع لتسجيل الدخول')}</a></p>
    </AuthShell>
  );
}
