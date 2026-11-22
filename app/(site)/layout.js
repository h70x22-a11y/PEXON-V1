import Link from 'next/link';
import { getSettings } from '@/lib/db';
import { getLang, pick, t } from '@/lib/i18n';
import SocialIcons from '@/components/SocialIcons';
import PaymentMethods from '@/components/PaymentMethods';
import SiteNav from '@/components/SiteNav';
import ThemeToggle from '@/components/ThemeToggle';
import LangToggle from '@/components/LangToggle';
import CartButton from '@/components/CartButton';
import SearchBox from '@/components/SearchBox';
import MetaPixel from '@/components/MetaPixel';
import ConsentLink from '@/components/ConsentLink';
import VisitBeacon from '@/components/VisitBeacon';

export default async function SiteLayout({ children }) {
  const [s, lang] = await Promise.all([getSettings(), getLang()]);
  const tr = t(lang);
  const links = [
    { href: '/', label: tr.home },
    { href: '/products', label: tr.allProducts },
    { href: '/blog', label: lang === 'en' ? 'Guides' : 'أدلة فنية' },
    { href: '/#about', label: tr.about },
    { href: '/contact', label: tr.contact },
  ];
  return (
    <>
      <header className="site-header">
        <div className="container">
          <Link href="/" className="brand">
            {s.logo ? <img src={s.logo} alt={s.siteName} /> : null}
            {s.logo ? null : <span>{s.siteName}</span>}
          </Link>
          <SiteNav links={links} openLabel={tr.menuOpen} closeLabel={tr.menuClose} />
          <SearchBox lang={lang} labels={{ placeholder: tr.searchPh, all: tr.searchAll, none: tr.searchNone }} />
          <div className="header-tools">
            <LangToggle lang={lang} label={tr.switchLang} title={tr.switchLangLabel} />
            <CartButton label={tr.quoteCart} />
            <ThemeToggle labels={{ toDark: tr.toDark, toLight: tr.toLight, dark: tr.dark, light: tr.light }} />
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container">
          <div className="cols">
            <div>
              <h4>{s.siteName}</h4>
              <p>{pick(s, 'tagline', lang)}</p>
              <SocialIcons settings={s} />
            </div>
            <div>
              <h4>{tr.links}</h4>
              <ul>
                {s.catalogUrl ? (
                  <li>
                    <a href="/catalog.pdf" target="_blank" rel="noopener noreferrer" className="catalog-link">
                      {tr.catalog}
                    </a>
                  </li>
                ) : null}
                <li><Link href="/vendor-registration">{tr.vendorTitle}</Link></li>
                <li><Link href="/return-policy">{tr.returnTitle}</Link></li>
                <li><Link href="/privacy">{tr.privacyTitle}</Link></li>
                {s.metaPixelId || s.gaId ? <li><ConsentLink label={tr.cookieSettings} /></li> : null}
              </ul>
            </div>
            <div>
              <h4>{tr.contactInfo}</h4>
              <ul>
                {s.phone ? <li><a href={`tel:${s.phone}`} dir="ltr">{s.phone}</a></li> : null}
                {s.email ? <li><a href={`mailto:${s.email}`} dir="ltr">{s.email}</a></li> : null}
                {s.address ? <li>{pick(s, 'address', lang)}</li> : null}
              </ul>
            </div>
          </div>
          <PaymentMethods value={s.payments} lang={lang} label={tr.payments} />
          <div className="copy">
            <div>© {new Date().getFullYear()} {s.siteName}. {tr.rights}</div>
            {s.legalName || s.crNumber || s.vatNumber ? (
              <div className="legal">
                {(lang === 'en' ? s.legalNameEn : s.legalName) || s.legalName ? <span>{(lang === 'en' ? s.legalNameEn : s.legalName) || s.legalName}</span> : null}
                {s.crNumber ? <span>{tr.crLabel}: <bdi>{s.crNumber}</bdi></span> : null}
                {s.vatNumber ? <span>{tr.vatLabel}: <bdi>{s.vatNumber}</bdi></span> : null}
              </div>
            ) : null}
          </div>
        </div>
      </footer>
      <VisitBeacon />
      <MetaPixel pixelId={s.metaPixelId} gaId={s.gaId} labels={{ title: tr.cookieTitle, text: tr.cookieText, more: tr.cookieMore, accept: tr.cookieAccept, decline: tr.cookieDecline }} />
    </>
  );
}
