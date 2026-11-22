import Link from 'next/link';
import { getCategories, getProducts, getSettings } from '@/lib/db';
import { CategoryCard, ProductCard } from '@/components/Cards';
import { getLang, pick, t } from '@/lib/i18n';
import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/site';
import { ARTICLES, localize } from '@/lib/articles';

export const metadata = { alternates: { canonical: '/' } };

const GUIDE_TAG = {
  'ph-cables-wires': ['كيابل وأسلاك', 'Cables & wires'],
  'ph-pvc-conduits': ['مواسير', 'Conduits'],
  'ph-itcc-1': ['مواسير', 'Conduits'],
  'ph-ge-general-electric': ['مفاتيح فصل', 'Disconnect switches'],
  'ph-earthing-ysystem': ['تأريض', 'Earthing'],
};

export default async function HomePage() {
  const [s, categories, products, lang] = await Promise.all([getSettings(), getCategories(), getProducts(), getLang()]);
  const tr = t(lang);
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const countOf = (id) => products.filter((p) => p.categoryId === id).length;
  const lines = (value) => String(value || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const values = lines(pick(s, 'values', lang)).map((l) => {
    const [title, ...rest] = l.split('|');
    return { title: title.trim(), text: rest.join('|').trim() };
  });
  const services = lines(pick(s, 'services', lang));
  const brands = lines(s.brands);
  const partners = lines(s.partners).map((l) => {
    const [name, ...rest] = l.split('|');
    return { name: name.trim(), logo: rest.join('|').trim() };
  });

  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: s.siteName,
    legalName: s.legalNameEn || s.legalName || undefined,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    image: `${SITE_URL}/og.png`,
    description: pick(s, 'about', lang),
    email: s.email || undefined,
    telephone: s.phone || undefined,
    vatID: s.vatNumber || undefined,
    taxID: s.crNumber || undefined,
    address: { '@type': 'PostalAddress', streetAddress: s.addressEn || s.address || undefined, addressLocality: 'Riyadh', addressCountry: 'SA' },
    sameAs: ['instagram', 'x', 'tiktok', 'snapchat', 'facebook', 'youtube', 'linkedin'].map((k) => s[k]).filter(Boolean),
  };

  return (
    <>
      <JsonLd data={org} />
      <section className="hero">
        <div className="container">
          {pick(s, 'tagline', lang) ? <span className="tag">{pick(s, 'tagline', lang)}</span> : null}
          <h1>{pick(s, 'heroTitle', lang)}</h1>
          <p>{pick(s, 'heroText', lang)}</p>
          <div className="actions">
            <Link href="/products" className="btn light">{tr.browse}</Link>
            <Link href="/quote" className="btn ghost">{tr.quote}</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>{tr.categories}</h2>
          </div>
          <div className="grid cats-4">
            {categories.slice(0, 4).map((c) => (
              <CategoryCard key={c.id} category={c} count={countOf(c.id)} lang={lang} />
            ))}
          </div>
          {categories.length > 4 ? (
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <Link href="/products" className="btn">{tr.allCategories(categories.length)}</Link>
            </div>
          ) : null}
        </div>
      </section>

      {featured.length ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-head">
              <h2>{tr.featured}</h2>
            </div>
            <div className="grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} lang={lang} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {services.length ? (
        <section className="band">
          <div className="container">
            <h2>{tr.services}</h2>
            <ul className="ticks">
              {services.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {brands.length ? (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2>{tr.brands}</h2>
            </div>
            <div className="chips">
              {brands.map((item) => (
                <span className="chip" key={item} dir="auto">{item}</span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {values.length ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-head">
              <h2>{tr.values}</h2>
            </div>
            <div className="grid">
              {values.map((v) => (
                <div className="card value" key={v.title}>
                  <div className="body">
                    <h3>{v.title}</h3>
                    {v.text ? <p>{v.text}</p> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {partners.length ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-head">
              <h2>{tr.partners}</h2>
            </div>
            <div className="logos">
              {partners.map((item) =>
                item.logo ? (
                  <div className="logo-box" key={item.name} title={item.name}>
                    <img src={item.logo} alt={item.name} loading="lazy" />
                  </div>
                ) : (
                  <div className="logo-box text" key={item.name} dir="auto">{item.name}</div>
                )
              )}
            </div>
          </div>
        </section>
      ) : null}

      {ARTICLES.length ? (
        <section className="section home-guides">
          <div className="container">
            <div className="section-head">
              <h2>{lang === 'en' ? 'Technical guides' : 'أدلة فنية'}</h2>
              <Link href="/blog">{lang === 'en' ? 'All guides' : 'كل الأدلة'}</Link>
            </div>
            <div className="guide-grid">
              {ARTICLES.slice(0, 3).map((x) => localize(x, lang)).map((a) => {
                const tag = GUIDE_TAG[a.categories[0]];
                return (
                  <Link key={a.slug} href={`/blog/${a.slug}`} className="guide-card">
                    {tag ? <span className="guide-tag">{lang === 'en' ? tag[1] : tag[0]}</span> : null}
                    <h3>{a.title}</h3>
                    <p>{a.description}</p>
                    <span className="guide-more">{lang === 'en' ? 'Read the guide →' : 'اقرأ الدليل ←'}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section" id="about" style={{ background: 'var(--surface)', borderBlock: '1px solid var(--line)' }}>
        <div className="container" style={{ maxWidth: 780 }}>
          <h2>{tr.about}</h2>
          <p className="muted" style={{ whiteSpace: 'pre-line', fontSize: '1.05rem' }}>{pick(s, 'about', lang)}</p>
          <Link href="/contact" className="btn">{tr.contact}</Link>
        </div>
      </section>
    </>
  );
}
