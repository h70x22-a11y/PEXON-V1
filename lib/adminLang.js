import { cookies } from 'next/headers';
import { makeT } from '@/lib/adminI18n';

// لغة لوحة التحكم مستقلة عن لغة الموقع للزوار
export async function getAdminLang() {
  const store = await cookies();
  return store.get('admin-lang')?.value === 'en' ? 'en' : 'ar';
}

export async function adminT() {
  const lang = await getAdminLang();
  return { lang, t: makeT(lang), dir: lang === 'en' ? 'ltr' : 'rtl', locale: lang === 'en' ? 'en-GB' : 'ar' };
}
