import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategories, getProducts, getSettings } from '@/lib/db';
import { getLang, productDescription, productPrice, productShort, t } from '@/lib/i18n';
import AddToQuote from '@/components/AddToQuote';
import SmartImage from '@/components/SmartImage';
import JsonLd from '@/components/JsonLd';
import { arabicName, brandOf, displayName } from '@/lib/catalog';
import { SITE_URL } from '@/lib/site';

const skuFrom = (short) => (String(short || '').match(/(?:رقم الصنف|SKU)\s*([\w\-./]+)/) || [])[1] || '';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const [products, categories, lang] = await Promise.all([getProducts(), getCategories(), getLang()]);
  const p = products.find((x) => x.id === id);
  if (!p) return {};
  const brand = brandOf(p);
  const sku = skuFrom(p.short);
  const category = categories.find((c) => c.id === p.categoryId)?.name || '';
  const title = [displayName(p, lang), lang === 'ar' && arabicName(p) ? p.name : '', sku].filter(Boolean).join(' - ');
  const desc = productDescription(p, lang).replace(/\s+/g, ' ').trim();
  const description = [desc, brand, category, sku ? (lang === 'en' ? `SKU ${sku}` : `رقم الصنف ${sku}`) : ''].filter(Boolean).join(' · ').slice(0, 300);
  return {
    title,
    description,
    alternates: { canonical: `/product/${p.id}` },
    openGraph: { title, description, url: `/product/${p.id}`, images: p.image ? [{ url: p.image, alt: p.name }] : undefined },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const [s, categories, products, lang] = await Promise.all([getSettings(), getCategories(), getProducts(), getLang()]);
  const tr = t(lang);
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  const category = categories.find((c) => c.id === product.categoryId);
  const waText = encodeURIComponent(tr.waMessage(product.name));

  const sku = skuFrom(product.short);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    alternateName: arabicName(product) || undefined,
    description: productDescription(product, lang).replace(/\s+/g, ' ').trim() || undefined,
    image: product.image || undefined,
    sku: sku || undefined,
    mpn: sku || undefined,
    brand: brandOf(product) ? { '@type': 'Brand', name: brandOf(product) } : undefined,
    category: category?.name,
    url: `${SITE_URL}/product/${product.id}`,
  };

  return (
    <>
      <JsonLd data={ld} />
      <div className="page-head">
        <div className="container">
          <div className="crumbs">
            <Link href="/">{tr.home}</Link> / <Link href="/products">{tr.allProducts}</Link>
            {category ? <> / <Link href={`/category/${category.id}`}>{category.name}</Link></> : null}
          </div>
          <h1>{displayName(product, lang)}</h1>
          {displayName(product, lang) !== product.name ? <p className="muted en-name" dir="ltr" style={{ margin: 0, fontSize: '1.05rem' }}>{product.name}</p> : null}
        </div>
      </div>
      <section className="section" style={{ paddingTop: 36 }}>
        <div className="container product">
          <div className="photo">
            {product.image ? (
              <SmartImage src={product.image} alt={displayName(product, lang)} sizes="(max-width: 760px) 92vw, 540px" priority fit="contain" />
            ) : (
              <span className="muted">{tr.noImage}</span>
            )}
          </div>
          <div>
            {product.short ? <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>{productShort(product, lang)}</p> : null}
            {product.price ? <p className="price" style={{ fontSize: '1.4rem' }}>{productPrice(product, lang)}</p> : null}
            {product.description ? <p className="desc muted">{productDescription(product, lang)}</p> : null}
            <AddToQuote
              withQty
              product={{ id: product.id, name: displayName(product, lang), short: productShort(product, lang), image: product.image }}
              labels={{ add: tr.addToQuote, added: tr.added, qty: tr.qty }}
            />
            <div className="actions">
              <Link className="btn ghost" href="/quote">
                {tr.quoteCart} {tr.arrow}
              </Link>
              {s.whatsapp ? (
                <a className="btn ghost" href={`https://wa.me/${s.whatsapp}?text=${waText}`} target="_blank" rel="noopener noreferrer">
                  {tr.orderWhatsapp}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
