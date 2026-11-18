import { NextResponse } from 'next/server';
import { getCategories, getProducts, getSettings } from '@/lib/db';
import { arabicName, displayName, parseSynonyms, searchProducts, skuOf } from '@/lib/catalog';

// نسخة مؤقتة في الذاكرة لتسريع الاقتراحات أثناء الكتابة
let cache = { at: 0, products: [], categories: [], synonyms: [] };
async function data() {
  if (Date.now() - cache.at > 60_000) {
    const [products, categories, settings] = await Promise.all([getProducts(), getCategories(), getSettings()]);
    cache = { at: Date.now(), products, categories, synonyms: parseSynonyms(settings.searchSynonyms) };
  }
  return cache;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = String(searchParams.get('q') || '').slice(0, 80);
  const lang = searchParams.get('lang') === 'en' ? 'en' : 'ar';
  if (q.trim().length < 2) return NextResponse.json({ total: 0, items: [] });
  const { products, categories, synonyms } = await data();
  const found = searchProducts(products, q, categories, synonyms);
  const items = found.slice(0, 8).map((p) => ({
    id: p.id,
    title: displayName(p, lang),
    sub: [lang === 'ar' && arabicName(p) ? p.name : '', skuOf(p) ? `${lang === 'en' ? 'SKU' : 'رقم الصنف'} ${skuOf(p)}` : '']
      .filter(Boolean)
      .join(' · '),
    image: p.image || '',
  }));
  return NextResponse.json({ total: found.length, items }, { headers: { 'Cache-Control': 'no-store' } });
}
