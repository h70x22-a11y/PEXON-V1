import Link from 'next/link';
import { getCategories, getProducts } from '@/lib/db';
import { brandOf, listBrands } from '@/lib/catalog';
import { ProductCard } from '@/components/Cards';

export const metadata = { title: 'جميع المنتجات' };

const LIMIT = 96;

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;
  const q = String(sp?.q || '').trim();
  const cat = String(sp?.cat || '');
  const brand = String(sp?.brand || '').trim();
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
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
          <div className="crumbs"><Link href="/">الرئيسية</Link> / جميع المنتجات</div>
          <h1>جميع المنتجات</h1>
          <p className="muted">ابحث باسم المنتج أو رقم الصنف، أو تصفح حسب التصنيف أو العلامة التجارية.</p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <form className="filters" action="/products" method="get">
            <div className="field grow">
              <label htmlFor="q">بحث</label>
              <input id="q" type="search" name="q" defaultValue={q} placeholder="اسم المنتج أو رقم الصنف..." />
            </div>
            <div className="field">
              <label htmlFor="cat">التصنيف</label>
              <select id="cat" name="cat" defaultValue={cat}>
                <option value="">كل التصنيفات</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="brand">العلامة التجارية</label>
              <select id="brand" name="brand" defaultValue={brands.find((b) => b.name.toLowerCase() === brandKey)?.name || ''}>
                <option value="">كل العلامات</option>
                {brands.map((b) => (
                  <option key={b.name} value={b.name}>{b.name} ({b.count})</option>
                ))}
              </select>
            </div>
            <button className="btn" type="submit">عرض النتائج</button>
          </form>

          {filtering ? (
            <>
              <div className="section-head">
                <h2>النتائج ({matches.length})</h2>
                <Link href="/products">مسح الفلاتر</Link>
              </div>
              {matches.length ? (
                <>
                  <div className="grid">{matches.slice(0, LIMIT).map((p) => <ProductCard key={p.id} product={p} />)}</div>
                  {matches.length > LIMIT ? (
                    <p className="muted" style={{ marginTop: 20 }}>
                      يظهر أول {LIMIT} منتج. ضيّق البحث باختيار تصنيف أو علامة تجارية.
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="muted">لا توجد منتجات مطابقة. جرّب تغيير الفلاتر.</p>
              )}
            </>
          ) : (
            <>
              {brands.length ? (
                <div style={{ marginBottom: 40 }}>
                  <div className="section-head">
                    <h2>تصفح حسب العلامة التجارية</h2>
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
                      <Link href={`/category/${c.id}`}>عرض الكل ({items.length}) ←</Link>
                    </div>
                    <div className="grid">{items.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}</div>
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
