import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import { ARTICLES, articleBySlug } from '@/lib/articles';
import { getCategories } from '@/lib/db';
import { getLang, t } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const a = articleBySlug((await params).slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: { type: 'article', title: a.title, description: a.description, url: `/blog/${a.slug}` },
  };
}

export default async function ArticlePage({ params }) {
  const a = articleBySlug((await params).slug);
  if (!a) notFound();
  const [categories, lang] = await Promise.all([getCategories(), getLang()]);
  const tr = t(lang);
  const cats = a.categories.map((id) => categories.find((c) => c.id === id)).filter(Boolean);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    dateModified: a.date,
    inLanguage: 'ar',
    mainEntityOfPage: `${SITE_URL}/blog/${a.slug}`,
    author: { '@type': 'Organization', name: 'PEXON' },
    publisher: { '@type': 'Organization', name: 'PEXON', logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.png` } },
  };
  return (
    <>
      <JsonLd data={ld} />
      <div className="page-head">
        <div className="container">
          <div className="crumbs"><Link href="/">{tr.home}</Link> / <Link href="/blog">أدلة فنية</Link></div>
          <h1>{a.title}</h1>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 32 }}>
        <article className="container policy" style={{ maxWidth: 860, direction: 'rtl', lineHeight: 1.9 }}>
          <p style={{ fontSize: '1.1rem' }}>{a.description}</p>
          {a.sections.map(([h, paras]) => (
            <div key={h} style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.3rem', margin: '24px 0 8px' }}>{h}</h2>
              {paras.map((p) => (
                <p key={p} style={{ margin: '0 0 10px' }}>{p}</p>
              ))}
            </div>
          ))}
          <div className="panel" style={{ marginTop: 28 }}>
            <h2 style={{ marginTop: 0, fontSize: '1.15rem' }}>منتجات ذات علاقة</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
              {cats.map((c) => (
                <Link key={c.id} href={`/category/${c.id}`} className="btn ghost">{c.name}</Link>
              ))}
            </div>
            <Link href="/quote" className="btn">اطلب عرض سعر</Link>
          </div>
        </article>
      </section>
    </>
  );
}
