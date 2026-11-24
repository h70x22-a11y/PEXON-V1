import { getCategories, getProducts } from '@/lib/db';
import { SITE_URL } from '@/lib/site';
import { ARTICLES } from '@/lib/articles';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const now = new Date();
  // كل صفحة بنسختين: العربي /path والإنجليزي /en/path، مع ربط اللغتين ببعض
  const en = (path) => (path === '/' ? '/en' : `/en${path}`);
  const pair = (path, priority, changeFrequency = 'weekly') => {
    const languages = { ar: `${SITE_URL}${path}`, en: `${SITE_URL}${en(path)}` };
    return [
      { url: `${SITE_URL}${path}`, lastModified: now, changeFrequency, priority, alternates: { languages } },
      { url: `${SITE_URL}${en(path)}`, lastModified: now, changeFrequency, priority, alternates: { languages } },
    ];
  };
  const page = pair;
  return [
    ...page('/', 1, 'daily'),
    ...page('/products', 0.9, 'daily'),
    ...categories.flatMap((c) => page(`/category/${c.id}`, 0.8)),
    ...products.flatMap((p) => page(`/product/${p.id}`, 0.7, 'monthly')),
    ...page('/cable-supplier-riyadh', 0.8, 'monthly'),
    ...page('/sockets', 0.8, 'weekly'),
    ...page('/blog', 0.6, 'weekly'),
    ...ARTICLES.flatMap((a) => page(`/blog/${a.slug}`, 0.6, 'monthly')),
    ...page('/quote', 0.5, 'monthly'),
    ...page('/contact', 0.5, 'monthly'),
    ...page('/vendor-registration', 0.4, 'monthly'),
    ...page('/return-policy', 0.2, 'yearly'),
    ...page('/privacy', 0.2, 'yearly'),
  ];
}
