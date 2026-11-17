import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategories, getProducts } from '@/lib/db';
import { ProductCard } from '@/components/Cards';
import { getLang, t } from '@/lib/i18n';

export default async function CategoryPage({ params }) {
  const { id } = await params;
  const [categories, products, lang] = await Promise.all([getCategories(), getProducts(), getLang()]);
  const tr = t(lang);
  const category = categories.find((c) => c.id === id);
  if (!category) notFound();
  const items = products.filter((p) => p.categoryId === id);

  return (
    <>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">
            <Link href="/">{tr.home}</Link> / <Link href="/products">{tr.allProducts}</Link> / {category.name}
          </div>
          <h1>{category.name}</h1>
          {category.description ? <p className="muted">{category.description}</p> : null}
        </div>
      </div>
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          {items.length ? (
            <div className="grid">{items.map((p) => <ProductCard key={p.id} product={p} lang={lang} />)}</div>
          ) : (
            <p className="muted">{tr.emptyCategory}</p>
          )}
        </div>
      </section>
    </>
  );
}
