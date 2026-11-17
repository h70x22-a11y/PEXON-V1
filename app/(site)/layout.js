import Link from 'next/link';
import { getSettings } from '@/lib/db';
import SocialIcons from '@/components/SocialIcons';
import PaymentMethods from '@/components/PaymentMethods';

export default async function SiteLayout({ children }) {
  const s = await getSettings();
  return (
    <>
      <header className="site-header">
        <div className="container">
          <Link href="/" className="brand">
            {s.logo ? <img src={s.logo} alt={s.siteName} /> : null}
            {s.logo ? null : <span>{s.siteName}</span>}
          </Link>
          <nav className="nav">
            <Link href="/">الرئيسية</Link>
            <Link href="/products">جميع المنتجات</Link>
            <Link href="/#about">من نحن</Link>
            <Link href="/contact">تواصل معنا</Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container">
          <div className="cols">
            <div>
              <h4>{s.siteName}</h4>
              <p>{s.tagline}</p>
              <SocialIcons settings={s} />
            </div>
            <div>
              <h4>روابط</h4>
              <ul>
                <li><Link href="/products">جميع المنتجات</Link></li>
                <li><Link href="/contact">تواصل معنا</Link></li>
              </ul>
            </div>
            <div>
              <h4>التواصل</h4>
              <ul>
                {s.phone ? <li><a href={`tel:${s.phone}`} dir="ltr">{s.phone}</a></li> : null}
                {s.email ? <li><a href={`mailto:${s.email}`} dir="ltr">{s.email}</a></li> : null}
                {s.address ? <li>{s.address}</li> : null}
              </ul>
            </div>
          </div>
          <PaymentMethods value={s.payments} />
          <div className="copy">© {new Date().getFullYear()} {s.siteName}. جميع الحقوق محفوظة.</div>
        </div>
      </footer>
    </>
  );
}
