import Link from 'next/link';
import { getCategories, getProducts, getSettings } from '@/lib/db';
import { CategoryCard, ProductCard } from '@/components/Cards';

export default async function HomePage() {
  const [s, categories, products] = await Promise.all([getSettings(), getCategories(), getProducts()]);
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const countOf = (id) => products.filter((p) => p.categoryId === id).length;
  const lines = (value) => String(value || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const values = lines(s.values).map((l) => {
    const [title, ...rest] = l.split('|');
    return { title: title.trim(), text: rest.join('|').trim() };
  });
  const services = lines(s.services);
  const brands = lines(s.brands);
  const partners = lines(s.partners).map((l) => {
    const [name, ...rest] = l.split('|');
    return { name: name.trim(), logo: rest.join('|').trim() };
  });

  return (
    <>
      <section className="hero">
        <div className="container">
          {s.tagline ? <span className="tag">{s.tagline}</span> : null}
          <h1>{s.heroTitle}</h1>
          <p>{s.heroText}</p>
          <div className="actions">
            <Link href="/products" className="btn light">تصفح المنتجات</Link>
            <Link href="/contact" className="btn ghost">اطلب عرض سعر</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>أقسام المنتجات</h2>
            <Link href="/products">عرض الكل ←</Link>
          </div>
          <div className="grid">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} count={countOf(c.id)} />
            ))}
          </div>
        </div>
      </section>

      {featured.length ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-head">
              <h2>منتجات مميزة</h2>
            </div>
            <div className="grid">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {services.length ? (
        <section className="band">
          <div className="container">
            <h2>خدمات تميزنا</h2>
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
              <h2>العلامات التجارية</h2>
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
              <h2>قيمنا</h2>
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
              <h2>شركاء النجاح</h2>
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

      <section className="section" id="about" style={{ background: '#fff', borderBlock: '1px solid var(--line)' }}>
        <div className="container" style={{ maxWidth: 780 }}>
          <h2>من نحن</h2>
          <p className="muted" style={{ whiteSpace: 'pre-line', fontSize: '1.05rem' }}>{s.about}</p>
          <Link href="/contact" className="btn">تواصل معنا</Link>
        </div>
      </section>
    </>
  );
}
