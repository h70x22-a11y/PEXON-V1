import Link from 'next/link';
import { ARTICLES, localize } from '@/lib/articles';
import { getLang, t } from '@/lib/i18n';

export async function generateMetadata() {
  const en = (await getLang()) === 'en';
  return {
    title: en ? 'Technical guides' : 'أدلة ومقالات فنية',
    description: en ? 'Practical guides for choosing electrical materials: disconnect switches, earthing and lightning protection, metal conduits and more.' : 'أدلة عملية لاختيار المواد الكهربائية: مفاتيح الفصل، أنظمة التأريض ومانعات الصواعق، المواسير المعدنية وغيرها.',
    alternates: { canonical: '/blog' },
  };
}

export default async function BlogPage() {
  const lang = await getLang();
  const tr = t(lang);
  const en = lang === 'en';
  const label = en ? 'Technical guides' : 'أدلة ومقالات فنية';
  return (
    <>
      <div className="page-head">
        <div className="container">
          <div className="crumbs"><Link href="/">{tr.home}</Link> / {en ? 'Guides' : 'أدلة فنية'}</div>
          <h1>{label}</h1>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container" style={{ maxWidth: 860, direction: en ? 'ltr' : 'rtl' }}>
          {ARTICLES.map((x) => localize(x, lang)).map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className="panel blog-card" style={{ display: 'block', marginBottom: 16, textDecoration: 'none', color: 'inherit' }}>
              <h2 style={{ margin: '0 0 8px', fontSize: '1.25rem' }}>{a.title}</h2>
              <p className="muted" style={{ margin: 0 }}>{a.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
