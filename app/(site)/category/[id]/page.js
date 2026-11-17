import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategories, getProducts } from '@/lib/db';
import { ProductCard } from '@/components/Cards';
import { getLang, t } from '@/lib/i18n';
import { applyFacets, buildFacets } from '@/lib/catalog';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const [categories, products, lang] = await Promise.all([getCategories(), getProducts(), getLang()]);
  const c = categories.find((x) => x.id === id);
  if (!c) return {};
  const n = products.filter((p) => p.categoryId === id).length;
  const description = c.description || (lang === 'en' ? `${n} ${c.name} products available for quotation.` : `${n} منتج من ${c.name}، متوفرة لطلب عرض سعر.`);
  const image = c.image || products.find((p) => p.categoryId === id && p.image)?.image;
  return {
    title: c.name,
    description,
    alternates: { canonical: `/category/${c.id}` },
    openGraph: { title: c.name, description, url: `/category/${c.id}`, images: image ? [{ url: image, alt: c.name }] : undefined },
  };
}

const FILTER_KEYS = ['type', 'amp', 'gang', 'color'];

export default async function CategoryPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const [categories, products, lang] = await Promise.all([getCategories(), getProducts(), getLang()]);
  const tr = t(lang);
  const category = categories.find((c) => c.id === id);
  if (!category) notFound();
  const all = products.filter((p) => p.categoryId === id);
  const filters = Object.fromEntries(FILTER_KEYS.map((k) => [k, String(sp?.[k] || '')]));
  const active = FILTER_KEYS.some((k) => filters[k]);
  const items = active ? applyFacets(all, filters) : all;
  const facets = buildFacets(all, lang);
  const hrefWith = (key, value) => {
    const next = { ...filters, [key]: filters[key] === value ? '' : value };
    const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v)).toString();
    return `/category/${id}${qs ? `?${qs}` : ''}`;
  };

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
      <section className="section" style={{ paddingTop: 28 }}>
        <div className="container">
          {facets.length ? (
            <div className="facets">
              {facets.map((g) => (
                <div className="facet" key={g.key}>
                  <span className="facet-label">{g.label}</span>
                  <div className="facet-chips">
                    {g.options.map((o) => (
                      <Link
                        key={o.value}
                        href={hrefWith(g.key, o.value)}
                        className={`facet-chip${filters[g.key] === o.value ? ' on' : ''}`}
                        scroll={false}
                        dir="auto"
                      >
                        {o.label} <span>{o.n}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="facet-foot">
                <span className="muted">{tr.results(items.length)}</span>
                {active ? <Link href={`/category/${id}`} scroll={false}>{tr.clear}</Link> : null}
              </div>
            </div>
          ) : null}
          {items.length ? (
            <div className="grid">{items.map((p) => <ProductCard key={p.id} product={p} lang={lang} />)}</div>
          ) : (
            <p className="muted">{active ? tr.noMatch : tr.emptyCategory}</p>
          )}
        </div>
      </section>
    </>
  );
}
