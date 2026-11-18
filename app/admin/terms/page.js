import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { acceptTermsAction, logout } from '@/app/actions';
import { adminT } from '@/lib/adminLang';
import { AdminLangToggle } from '@/components/AdminLang';
import { TERMS } from '@/lib/terms';

export const metadata = { robots: { index: false } };

export default async function TermsPage({ searchParams }) {
  const { t, lang, dir } = await adminT();
  const session = await requireAdmin();
  if (session.mustChange) redirect('/admin/set-password');
  const sp = await searchParams;
  const view = sp?.view === '1';
  if (session.termsOk && !view) redirect('/admin');
  const T = TERMS[lang] || TERMS.ar;

  return (
    <div className="auth-page" dir={dir} lang={lang}>
      <div className="terms-card">
        <div className="terms-head">
          <img src="/logo.png" alt="PEXON" width={150} height={40} />
          <AdminLangToggle lang={lang} />
        </div>
        <h1>{T.title}</h1>
        <p className="muted">{T.intro}</p>
        <div className="terms-body">
          {T.sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              <ul>
                {s.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        {sp?.error ? <div className="flash err">{t(String(sp.error))}</div> : null}
        {session.termsOk ? (
          <a href="/admin" className="auth-btn terms-btn">{t('رجوع')}</a>
        ) : (
          <form action={acceptTermsAction} className="terms-form">
            <label className="check terms-agree">
              <input type="checkbox" name="agree" required /> {T.agree}
            </label>
            <div className="terms-actions">
              <button className="auth-btn" type="submit">{t('موافق ومتابعة')}</button>
            </div>
          </form>
        )}
        {!session.termsOk ? (
          <form action={logout} style={{ textAlign: 'center', marginTop: 10 }}>
            <button type="submit" className="link-btn">{t('تسجيل الخروج')}</button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
