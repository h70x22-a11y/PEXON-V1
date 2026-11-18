'use client';

import { createContext, useContext } from 'react';
import { makeT } from '@/lib/adminI18n';

const Ctx = createContext('ar');

export function AdminLangProvider({ lang, children }) {
  return <Ctx.Provider value={lang}>{children}</Ctx.Provider>;
}

export function useAdminT() {
  const lang = useContext(Ctx);
  return { lang, t: makeT(lang) };
}

export function AdminLangToggle({ lang }) {
  function toggle() {
    document.cookie = `admin-lang=${lang === 'en' ? 'ar' : 'en'}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  }
  return (
    <button type="button" onClick={toggle} lang={lang === 'en' ? 'ar' : 'en'}>
      🌐 {lang === 'en' ? 'العربية' : 'English'}
    </button>
  );
}
