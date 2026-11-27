import Link from 'next/link';
import { after } from 'next/server';
import { clientIp } from '@/lib/auth';
import { logSearch } from '@/lib/searchLog';
import { getCategories, getProducts, getSettings } from '@/lib/db';
import { brandOf, listBrands, parseSynonyms, searchProducts, shopType, shopTypeCounts, SHOP_TYPES } from '@/lib/catalog';
import { ProductCard } from '@/components/Cards';
import { getLang, t, langAlternates } from '@/lib/i18n';

export async function generateMetadata() {
  return { title: t(await getLang()).allProducts, alternates: await langAlternates('/products') };
}

const LIMIT = 96;

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;
  const q = String(sp?.q || '').trim();
  const cat = String(sp?.cat || '');
  const brand = String(sp?.brand || '').trim();
  const type = SHOP_TYPES.some((x) => x.key === sp?.type) ? sp.type : '';
  const page = Math.max(1, parseInt(sp?.page, 10) || 1);
  const [categories, products, lang, settings] = await Promise.all([getCategories(), getProducts(), getLang(), getSettings()]);
  const synonyms = parseSynonyms(settings.searchSynonyms);
  const tr = t(lang);
  const brands = listBrands(products);
  if (q) {
    const ip = await clientIp();
    after(() => logSearch(q, ip, { products, categories, synonyms }));
  }

  const brandKey = brand.toLowerCase();
  const filtering = Boolean(q || cat || brand || type);
  const matches = filtering
    ? (q ? searchProducts(products, q, categories, synonyms) : products).filter(
        (p) => (!cat || p.categoryId === cat) && (!brand || brandOf(p).toLowerCase() === brandKey) && (!type || shopType(p) === type)
      )
    : [];
  const types = shopTypeCounts(products);
  const typeLabel = (k) => { const x = SHOP_TYPES.find((t) => t.key === k); return x ? x[lang === 'en' ? 'en' : 'ar'] : ''; };
  const pages = Math.ceil(matches.length / LIMIT);
  const shown = matches.slice((page - 1) * LIMIT, page * LIMIT);
  const linkWith = (patch) => {
    const u = new URLSearchParams();
    const v = { q, cat, brand, type, ...patch };
    for (const [k, val] of Object.entries(v)) if (val) u.set(k, val);
    const str = u.toString();
    return `/products${str ? `?${str}` : ''}`;
  };
  const typeChips = (
    <div className="type-chips" role="list">
      {types.map((x) => (
        <Link key={x.key} role="listitem" className={`chip link${type === x.key ? ' active' : ''}`} href={type === x.key ? linkWith({ type: '', page: '' }) : linkWith({ type: x.key, page: '' })} aria-current={type === x.key ? 'true' : undefined}>
          {x[lang === 'en' ? 'en' : 'ar']} <span className="muted">({x.n})</span>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <div className="page-head">
        <div className="container">
          <div className="crumbs"><Link href="/">{tr.home}</Link> / {tr.allProducts}</div>
          <h1>{tr.allProducts}</h1>
          <p className="muted">{tr.productsIntro}</p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <form className="filters" action="/products" method="get">
            <div className="field grow">
              <label htmlFor="q">{tr.search}</label>
              <input id="q" type="search" name="q" defaultValue={q} placeholder={tr.searchPh} />
            </div>
            <div className="field">
              <label htmlFor="cat">{tr.category}</label>
              <select id="cat" name="cat" defaultValue={cat}>
                <option value="">{tr.allCats}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="type">{lang === 'en' ? 'Product type' : 'نوع المنتج'}</label>
              <select id="type" name="type" defaultValue={type}>
                <option value="">{lang === 'en' ? 'All types' : 'كل الأنواع'}</option>
                {types.map((x) => (
                  <option key={x.key} value={x.key}>{x[lang === 'en' ? 'en' : 'ar']} ({x.n})</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="brand">{tr.brand}</label>
              <select id="brand" name="brand" defaultValue={brands.find((b) => b.name.toLowerCase() === brandKey)?.name || ''}>
                <option value="">{tr.allBrands}</option>
                {brands.map((b) => (
                  <option key={b.name} value={b.name}>{b.name} ({b.count})</option>
                ))}
              </select>
            </div>
            <button className="btn" type="submit">{tr.showResults}</button>
          </form>

          {filtering ? (
            <>
              {typeChips}
              <div className="section-head">
                <h2>{type && !q ? `${typeLabel(type)} (${matches.length})` : tr.results(matches.length)}</h2>
                <Link href="/products">{tr.clear}</Link>
              </div>
              {matches.length ? (
                <>
                  <div className="grid">{shown.map((p) => <ProductCard key={p.id} product={p} lang={lang} />)}</div>
                  {pages > 1 ? (
                    <nav className="pager" aria-label={lang === 'en' ? 'Pages' : 'الصفحات'}>
                      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                        <Link key={n} href={linkWith({ page: n > 1 ? String(n) : '' })} className={n === page ? 'active' : ''} aria-current={n === page ? 'page' : undefined}>{n}</Link>
                      ))}
                    </nav>
                  ) : null}
                </>
              ) : (
                <p className="muted">{tr.noMatch}</p>
              )}
            </>
          ) : (
            <>
              <div style={{ marginBottom: 40 }}>
                <div className="section-head">
                  <h2>{lang === 'en' ? 'Shop by product type' : 'تسوق حسب نوع المنتج'}</h2>
                </div>
                {typeChips}
              </div>
              {brands.length ? (
                <div style={{ marginBottom: 40 }}>
                  <div className="section-head">
                    <h2>{tr.byBrand}</h2>
                  </div>
                  <div className="chips">
                    {brands.map((b) => (
                      <Link className="chip link" key={b.name} href={`/products?brand=${encodeURIComponent(b.name)}`} dir="auto">
                        {b.name} <span className="muted">({b.count})</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {categories.map((c) => {
                const items = products.filter((p) => p.categoryId === c.id);
                if (!items.length) return null;
                return (
                  <div key={c.id} style={{ marginBottom: 44 }}>
                    <div className="section-head">
                      <h2>{c.name}</h2>
                      <Link href={`/category/${c.id}`}>{tr.viewAll(items.length)} {tr.arrow}</Link>
                    </div>
                    <div className="grid">{items.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} lang={lang} />)}</div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </section>
    </>
  );
}
