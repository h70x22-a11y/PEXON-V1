import { getCategories, getProducts } from '@/lib/db';
import { SITE_URL } from '@/lib/site';
import { ARTICLES } from '@/lib/articles';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const now = new Date();
  const page = (path, priority, changeFrequency = 'weekly') => ({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency, priority });
  return [
    page('/', 1, 'daily'),
    page('/products', 0.9, 'daily'),
    ...categories.map((c) => page(`/category/${c.id}`, 0.8)),
    ...products.map((p) => page(`/product/${p.id}`, 0.7, 'monthly')),
    page('/blog', 0.6, 'weekly'),
    ...ARTICLES.map((a) => page(`/blog/${a.slug}`, 0.6, 'monthly')),
    page('/quote', 0.5, 'monthly'),
    page('/contact', 0.5, 'monthly'),
    page('/vendor-registration', 0.4, 'monthly'),
    page('/return-policy', 0.2, 'yearly'),
    page('/privacy', 0.2, 'yearly'),
  ];
}
