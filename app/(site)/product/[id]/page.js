import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategories, getProducts, getSettings } from '@/lib/db';

export default async function ProductPage({ params }) {
  const { id } = await params;
  const [s, categories, products] = await Promise.all([getSettings(), getCategories(), getProducts()]);
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  const category = categories.find((c) => c.id === product.categoryId);
  const waText = encodeURIComponent(`السلام عليكم، أرغب بالاستفسار عن: ${product.name}`);

  return (
    <>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">
            <Link href="/">الرئيسية</Link> / <Link href="/products">جميع المنتجات</Link>
            {category ? <> / <Link href={`/category/${category.id}`}>{category.name}</Link></> : null}
          </div>
          <h1>{product.name}</h1>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 36 }}>
        <div className="container product">
          <div className="photo">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <span className="muted">لا توجد صورة</span>
            )}
          </div>
          <div>
            {product.short ? <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>{product.short}</p> : null}
            {product.price ? <p className="price" style={{ fontSize: '1.4rem' }}>{product.price}</p> : null}
            {product.description ? <p className="desc muted">{product.description}</p> : null}
            <div className="actions">
              {s.whatsapp ? (
                <a className="btn" href={`https://wa.me/${s.whatsapp}?text=${waText}`} target="_blank" rel="noopener noreferrer">
                  اطلب عبر واتساب
                </a>
              ) : null}
              <Link className="btn ghost" href={`/contact?product=${encodeURIComponent(product.name)}`}>
                اطلب عرض سعر
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
