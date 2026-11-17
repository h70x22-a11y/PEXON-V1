import Link from 'next/link';
import { getCategories, getProducts } from '@/lib/db';
import { ProductCard } from '@/components/Cards';

export const metadata = { title: 'جميع المنتجات' };

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;
  const q = String(sp?.q || '').trim();
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const needle = q.toLowerCase();
  const matches = q
    ? products.filter((p) => `${p.name} ${p.short} ${p.description}`.toLowerCase().includes(needle))
    : products;

  return (
    <>
      <div className="page-head">
        <div className="container">
          <div className="crumbs"><Link href="/">الرئيسية</Link> / جميع المنتجات</div>
          <h1>جميع المنتجات</h1>
          <p className="muted">تصفح المنتجات حسب القسم أو ابحث باسم المنتج.</p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <form className="search" action="/products" method="get">
            <input type="search" name="q" defaultValue={q} placeholder="ابحث عن منتج..." />
            <button className="btn" type="submit">بحث</button>
          </form>

          {q ? (
            <>
              <div className="section-head">
                <h2>نتائج البحث عن «{q}» ({matches.length})</h2>
                <Link href="/products">إلغاء البحث</Link>
              </div>
              {matches.length ? (
                <div className="grid">{matches.slice(0, 96).map((p) => <ProductCard key={p.id} product={p} />)}</div>
              ) : (
                <p className="muted">لا توجد منتجات مطابقة.</p>
              )}
            </>
          ) : (
            categories.map((c) => {
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
            })
          )}
        </div>
      </section>
    </>
  );
}
