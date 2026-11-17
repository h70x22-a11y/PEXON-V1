import Link from 'next/link';
import { getCategories, getProducts } from '@/lib/db';
import { brandOf, listBrands } from '@/lib/catalog';
import { ProductCard } from '@/components/Cards';
import { getLang, t } from '@/lib/i18n';

export async function generateMetadata() {
  return { title: t(await getLang()).allProducts };
}

const LIMIT = 96;

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;
  const q = String(sp?.q || '').trim();
  const cat = String(sp?.cat || '');
  const brand = String(sp?.brand || '').trim();
  const [categories, products, lang] = await Promise.all([getCategories(), getProducts(), getLang()]);
  const tr = t(lang);
  const brands = listBrands(products);

  const needle = q.toLowerCase();
  const brandKey = brand.toLowerCase();
  const filtering = Boolean(q || cat || brand);
  const matches = filtering
    ? products.filter(
        (p) =>
          (!cat || p.categoryId === cat) &&
          (!brand || brandOf(p).toLowerCase() === brandKey) &&
          (!q || `${p.name} ${p.short} ${p.description}`.toLowerCase().includes(needle))
      )
    : [];

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
              <div className="section-head">
                <h2>{tr.results(matches.length)}</h2>
                <Link href="/products">{tr.clear}</Link>
              </div>
              {matches.length ? (
                <>
                  <div className="grid">{matches.slice(0, LIMIT).map((p) => <ProductCard key={p.id} product={p} lang={lang} />)}</div>
                  {matches.length > LIMIT ? (
                    <p className="muted" style={{ marginTop: 20 }}>
                      {tr.firstN(LIMIT)}
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="muted">{tr.noMatch}</p>
              )}
            </>
          ) : (
            <>
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
