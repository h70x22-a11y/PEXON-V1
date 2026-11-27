import Link from 'next/link';
import { getProducts } from '@/lib/db';
import { ProductCard } from '@/components/Cards';
import { getLang, t, langAlternates } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';

// صفحة تجميع لكلمة بحث أساسية (أقسام منتجات + نصائح + أسئلة شائعة)
// cfg = { path, sections: [{ key, href, test, ar: [عنوان, وصف], en: [...] }], C: { ar: {...}, en: {...} } }

export async function hubMetadata(cfg) {
  const lang = await getLang();
  const c = cfg.C[lang];
  const url = `${SITE_URL}${lang === 'en' ? '/en' : ''}${cfg.path}`;
  return {
    title: { absolute: c.seo },
    description: c.meta,
    alternates: await langAlternates(cfg.path),
    openGraph: { title: c.seo, description: c.meta, url, locale: lang === 'en' ? 'en_US' : 'ar_SA' },
  };
}

export default async function HubPage({ cfg }) {
  const [lang, products] = await Promise.all([getLang(), getProducts()]);
  const c = cfg.C[lang];
  const tr = t(lang);
  const en = lang === 'en';
  const pre = en ? '/en' : '';
  const groups = cfg.sections.map((s) => ({ ...s, items: products.filter(s.test) })).filter((g) => g.items.length);
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: c.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: tr.home, item: `${SITE_URL}${pre || '/'}` },
      { '@type': 'ListItem', position: 2, name: c.title, item: `${SITE_URL}${pre}${cfg.path}` },
    ] },
    { '@context': 'https://schema.org', '@type': 'CollectionPage', name: c.title, description: c.meta, url: `${SITE_URL}${pre}${cfg.path}`, inLanguage: en ? 'en' : 'ar' },
  ];
  const href = (h) => (h.startsWith('/products') ? h : `${pre}${h}`);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <div className="page-head">
        <div className="container">
          <div className="crumbs"><Link href={pre || '/'}>{tr.home}</Link> / {c.title}</div>
          <h1>{c.h1 || c.title}</h1>
          {c.lead.map((p) => <p key={p} className="muted" style={{ maxWidth: 800, marginTop: 10, lineHeight: 1.9 }}>{p}</p>)}
          <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
            {groups.map((g) => <a key={g.key} className="chip" href={`#${g.key}`}>{(en ? g.en : g.ar)[0]} ({g.items.length})</a>)}
          </nav>
        </div>
      </div>
      {groups.map((g) => {
        const [h, d] = en ? g.en : g.ar;
        return (
          <section className="section" key={g.key} id={g.key}>
            <div className="container">
              <div className="section-head">
                <h2>{h}</h2>
                {g.href ? <Link href={href(g.href)}>{en ? 'View all' : 'عرض الكل'}</Link> : null}
              </div>
              <p className="muted" style={{ margin: '-6px 0 18px', lineHeight: 1.8 }}>{d}</p>
              <div className="grid">
                {g.items.slice(0, g.limit || 8).map((p) => <ProductCard key={p.id} product={p} lang={lang} />)}
              </div>
            </div>
          </section>
        );
      })}
      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          {c.table ? (
            <>
              <h2 style={{ fontSize: '1.5rem', marginBottom: 12 }}>{c.table.title}</h2>
              <div style={{ overflowX: 'auto' }}>
                <table className="art-table">
                  <thead><tr>{c.table.rows[0].map((x) => <th key={x}>{x}</th>)}</tr></thead>
                  <tbody>{c.table.rows.slice(1).map((r) => <tr key={r[0]}>{r.map((x, i) => <td key={i}>{x}</td>)}</tr>)}</tbody>
                </table>
              </div>
            </>
          ) : null}
          <h2 style={{ fontSize: '1.5rem', margin: c.table ? '30px 0 12px' : '0 0 12px' }}>{c.tipsTitle}</h2>
          <ul style={{ lineHeight: 2, paddingInlineStart: 22 }}>{c.tips.map((x) => <li key={x}>{x}</li>)}</ul>
          <h2 style={{ fontSize: '1.5rem', margin: '30px 0 12px' }}>{en ? 'Frequently asked questions' : 'أسئلة شائعة'}</h2>
          {c.faq.map(([q, a]) => (
            <details key={q} className="panel" style={{ marginBottom: 10 }}>
              <summary style={{ fontWeight: 700, cursor: 'pointer' }}>{q}</summary>
              <p style={{ margin: '10px 0 0', lineHeight: 1.9 }}>{a}</p>
            </details>
          ))}
          {c.related?.length ? (
            <>
              <h2 style={{ fontSize: '1.25rem', margin: '30px 0 12px' }}>{en ? 'Related' : 'صفحات ذات علاقة'}</h2>
              <div className="chips">
                {c.related.map(([label, h]) => <Link key={h} className="chip link" href={href(h)}>{label}</Link>)}
              </div>
            </>
          ) : null}
          <div className="panel" style={{ marginTop: 24, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <b>{c.cta || c.title}</b>
            <Link className="btn" href="/quote">{en ? 'Request a quote' : 'اطلب عرض سعر'}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
