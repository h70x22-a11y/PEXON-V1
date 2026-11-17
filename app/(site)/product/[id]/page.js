import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategories, getProducts, getSettings } from '@/lib/db';
import { getLang, productDescription, productPrice, productShort, t } from '@/lib/i18n';

export default async function ProductPage({ params }) {
  const { id } = await params;
  const [s, categories, products, lang] = await Promise.all([getSettings(), getCategories(), getProducts(), getLang()]);
  const tr = t(lang);
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  const category = categories.find((c) => c.id === product.categoryId);
  const waText = encodeURIComponent(tr.waMessage(product.name));

  return (
    <>
      <div className="page-head">
        <div className="container">
          <div className="crumbs">
            <Link href="/">{tr.home}</Link> / <Link href="/products">{tr.allProducts}</Link>
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
              <span className="muted">{tr.noImage}</span>
            )}
          </div>
          <div>
            {product.short ? <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>{productShort(product, lang)}</p> : null}
            {product.price ? <p className="price" style={{ fontSize: '1.4rem' }}>{productPrice(product, lang)}</p> : null}
            {product.description ? <p className="desc muted">{productDescription(product, lang)}</p> : null}
            <div className="actions">
              {s.whatsapp ? (
                <a className="btn" href={`https://wa.me/${s.whatsapp}?text=${waText}`} target="_blank" rel="noopener noreferrer">
                  {tr.orderWhatsapp}
                </a>
              ) : null}
              <Link className="btn ghost" href={`/contact?product=${encodeURIComponent(product.name)}`}>
                {tr.quote}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
