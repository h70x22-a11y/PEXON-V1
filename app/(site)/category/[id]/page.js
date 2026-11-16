import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategories, getProducts } from '@/lib/db';
import { ProductCard } from '@/components/Cards';

export default async function CategoryPage({ params }) {
  const { id } = await params;
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const category = categories.find((c) => c.id === id);
  if (!category) notFound();
  const items = products.filter((p) => p.categoryId === id);

  return (
    <>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">
            <Link href="/">الرئيسية</Link> / <Link href="/products">جميع المنتجات</Link> / {category.name}
          </div>
          <h1>{category.name}</h1>
          {category.description ? <p className="muted">{category.description}</p> : null}
        </div>
      </div>
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          {items.length ? (
            <div className="grid">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          ) : (
            <p className="muted">لا توجد منتجات في هذا القسم حالياً.</p>
          )}
        </div>
      </section>
    </>
  );
}
