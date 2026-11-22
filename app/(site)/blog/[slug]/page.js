import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import { ARTICLES, articleBySlug, localize } from '@/lib/articles';
import { getCategories } from '@/lib/db';
import { getLang, t } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const raw = articleBySlug((await params).slug);
  if (!raw) return {};
  const a = localize(raw, await getLang());
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: { type: 'article', title: a.title, description: a.description, url: `/blog/${a.slug}` },
  };
}

export default async function ArticlePage({ params }) {
  const raw = articleBySlug((await params).slug);
  if (!raw) notFound();
  const [categories, lang] = await Promise.all([getCategories(), getLang()]);
  const a = localize(raw, lang);
  const en = lang === 'en';
  const tr = t(lang);
  const cats = a.categories.map((id) => categories.find((c) => c.id === id)).filter(Boolean);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    dateModified: a.date,
    inLanguage: a.lang,
    mainEntityOfPage: `${SITE_URL}/blog/${a.slug}`,
    citation: a.refs?.length ? a.refs.map((r) => ({ '@type': 'CreativeWork', name: r.t, url: r.u })) : undefined,
    author: { '@type': 'Organization', name: 'PEXON' },
    publisher: { '@type': 'Organization', name: 'PEXON', logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.png` } },
  };
  return (
    <>
      <JsonLd data={ld} />
      <div className="page-head">
        <div className="container">
          <div className="crumbs"><Link href="/">{tr.home}</Link> / <Link href="/blog">{en ? 'Guides' : 'أدلة فنية'}</Link></div>
          <h1>{a.title}</h1>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 32 }}>
        <article className="container policy" style={{ maxWidth: 860, direction: en ? 'ltr' : 'rtl', lineHeight: 1.9 }}>
          <p style={{ fontSize: '1.1rem' }}>{a.description}</p>
          {a.sections.map(([h, paras]) => (
            <div key={h} style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.3rem', margin: '24px 0 8px' }}>{h}</h2>
              {paras.map((p, i) =>
                typeof p === 'string' ? (
                  <p key={i} style={{ margin: '0 0 10px' }}>{p}</p>
                ) : (
                  <div key={i} className="table-wrap" style={{ margin: '6px 0 14px' }}>
                    <table className="art-table">
                      <thead><tr>{p.table[0].map((c) => <th key={c}>{c}</th>)}</tr></thead>
                      <tbody>{p.table.slice(1).map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}>{c}</td>)}</tr>)}</tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          ))}
          {a.refs?.length ? (
            <div style={{ marginTop: 28 }}>
              <h2 style={{ fontSize: '1.3rem', margin: '24px 0 8px' }}>{en ? 'References' : 'المصادر والمراجع'}</h2>
              <ol className="art-refs" dir="ltr">
                {a.refs.map((r) => (
                  <li key={r.u}><a href={r.u} target="_blank" rel="noopener noreferrer">{r.t}</a></li>
                ))}
              </ol>
            </div>
          ) : null}
          <div className="panel" style={{ marginTop: 28 }}>
            <h2 style={{ marginTop: 0, fontSize: '1.15rem' }}>{en ? 'Related products' : 'منتجات ذات علاقة'}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
              {cats.map((c) => (
                <Link key={c.id} href={`/category/${c.id}`} className="btn ghost">{c.name}</Link>
              ))}
            </div>
            <Link href="/quote" className="btn">{en ? 'Request a quote' : 'اطلب عرض سعر'}</Link>
          </div>
        </article>
      </section>
    </>
  );
}
