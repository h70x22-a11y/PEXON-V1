import Link from 'next/link';
import { ARTICLES } from '@/lib/articles';
import { getLang, t } from '@/lib/i18n';

export const metadata = {
  title: 'أدلة ومقالات فنية',
  description: 'أدلة عملية لاختيار المواد الكهربائية: مفاتيح الفصل، أنظمة التأريض ومانعات الصواعق، المواسير المعدنية وغيرها.',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage() {
  const tr = t(await getLang());
  return (
    <>
      <div className="page-head">
        <div className="container">
          <div className="crumbs"><Link href="/">{tr.home}</Link> / أدلة فنية</div>
          <h1>أدلة ومقالات فنية</h1>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container" style={{ maxWidth: 860, direction: 'rtl' }}>
          {ARTICLES.map((a) => (
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
