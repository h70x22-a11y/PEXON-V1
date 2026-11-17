'use client';

export default function LangToggle({ lang, label, title }) {
  function toggle() {
    const next = lang === 'en' ? 'ar' : 'en';
    document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  }
  return (
    <button type="button" className="lang-toggle" onClick={toggle} aria-label={title} title={title} lang={lang === 'en' ? 'ar' : 'en'}>
      {label}
    </button>
  );
}
