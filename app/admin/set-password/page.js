import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { setFirstPassword, logout } from '@/app/actions';
import { adminT } from '@/lib/adminLang';
import { AdminLangToggle } from '@/components/AdminLang';

export const metadata = { robots: { index: false } };

export default async function SetPasswordPage({ searchParams }) {
  const { t, lang, dir } = await adminT();
  const session = await requireAdmin();
  if (!session.mustChange) redirect('/admin');
  const sp = await searchParams;

  return (
    <div className="login-box panel" dir={dir} lang={lang}>
      <h1 style={{ fontSize: '1.4rem' }}>{t('أهلاً')} {session.name}</h1>
      <p className="muted">{t('هذي أول مرة تدخل بكلمة المرور المؤقتة. اختر كلمة مرور جديدة خاصة فيك، وأعد كتابتها للتأكيد.')}</p>
      {sp?.error ? <div className="flash err">{t(String(sp.error))}</div> : null}
      <form action={setFirstPassword}>
        <div className="field">
          <label htmlFor="next">{t('كلمة المرور الجديدة')}</label>
          <input id="next" type="password" name="next" required minLength={8} maxLength={100} dir="ltr" autoComplete="new-password" autoFocus />
          <small>{t('8 أحرف على الأقل.')}</small>
        </div>
        <div className="field">
          <label htmlFor="confirm">{t('تأكيد كلمة المرور الجديدة')}</label>
          <input id="confirm" type="password" name="confirm" required minLength={8} maxLength={100} dir="ltr" autoComplete="new-password" />
        </div>
        <button className="btn" type="submit" style={{ width: '100%' }}>{t('حفظ كلمة المرور')}</button>
      </form>
      <form action={logout} style={{ textAlign: 'center', marginTop: 12 }}>
        <button type="submit" className="link-btn">{t('تسجيل الخروج')}</button>
      </form>
      <div className="login-lang"><AdminLangToggle lang={lang} /></div>
    </div>
  );
}
