import { AdminLangToggle } from '@/components/AdminLang';

// إطار صفحات الدخول: نموذج على جهة، ولوحة بلون الهوية على الجهة الثانية
export default function AuthShell({ lang, dir, t, title, children }) {
  return (
    <div className="auth-page" dir={dir} lang={lang}>
      <div className="auth-card">
        <section className="auth-form">
          <div className="auth-lang"><AdminLangToggle lang={lang} /></div>
          <img src="/logo.png" alt="PEXON" className="auth-logo" width={180} height={48} />
          <h1>{title}</h1>
          {children}
        </section>
        <aside className="auth-side" aria-hidden="true">
          <h2>{t('أهلاً بك!')}</h2>
          <p>{t('لوحة تحكم PEXON لإدارة المنتجات وطلبات عروض الأسعار والعملاء في مكان واحد.')}</p>
          <a href="/" className="auth-ghost" tabIndex={-1}>{t('زيارة الموقع')}</a>
        </aside>
      </div>
    </div>
  );
}
