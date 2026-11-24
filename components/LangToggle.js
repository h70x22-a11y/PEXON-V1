'use client';

export default function LangToggle({ lang, label, title }) {
  function toggle() {
    const next = lang === 'en' ? 'ar' : 'en';
    document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
    const { pathname, search, hash } = window.location;
    // روابط /en/... إنجليزية دائماً: عند التحويل للعربي نروح لنفس الصفحة بدون /en
    if (next === 'ar' && (pathname === '/en' || pathname.startsWith('/en/'))) {
      window.location.href = (pathname.slice(3) || '/') + search + hash;
    } else {
      window.location.reload();
    }
  }
  return (
    <button type="button" className="lang-toggle" onClick={toggle} aria-label={title} title={title} lang={lang === 'en' ? 'ar' : 'en'}>
      {label}
    </button>
  );
}
