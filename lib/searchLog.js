import { getCategories, getProducts, getSettings, recordSearch } from '@/lib/db';
import { normalize, parseSynonyms, searchProducts } from '@/lib/catalog';

// يسجل كلمة البحث مع عدد نتائجها (نحسبها هنا، ما نعتمد على المتصفح)
export async function logSearch(term, ip, data) {
  const label = String(term || '').trim().slice(0, 80);
  const key = normalize(label).replace(/\s+/g, ' ');
  if (key.length < 2) return;
  const { products, categories, synonyms } = data || {
    products: await getProducts(),
    categories: await getCategories(),
    synonyms: parseSynonyms((await getSettings()).searchSynonyms),
  };
  const hits = searchProducts(products, label, categories, synonyms).length;
  await recordSearch({ key, label, hits, ip });
}
