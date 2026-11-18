import './globals.css';
import { getSettings } from '@/lib/db';
import { getLang, pick } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const [s, lang] = await Promise.all([getSettings(), getLang()]);
  const name = s.siteName || 'PEXON';
  const description =
    pick(s, 'heroText', lang) ||
    (lang === 'en'
      ? 'Electrical supplies for government projects, private projects and homes in Saudi Arabia.'
      : 'توريد المواد الكهربائية للمشاريع الحكومية والخاصة والمنازل في المملكة العربية السعودية.');
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: name, template: `%s | ${name}` },
    description,
    applicationName: name,
    openGraph: {
      type: 'website',
      siteName: name,
      title: name,
      description,
      url: SITE_URL,
      locale: lang === 'en' ? 'en_US' : 'ar_SA',
      images: [{ url: '/og.png', width: 1200, height: 630, alt: name }],
    },
    twitter: { card: 'summary_large_image', title: name, description, images: ['/og.png'] },
    verification: {
      ...(s.googleVerification ? { google: s.googleVerification } : {}),
      ...(s.metaVerification ? { other: { 'facebook-domain-verification': s.metaVerification } } : {}),
    },
  };
}

export default async function RootLayout({ children }) {
  const [s, lang] = await Promise.all([getSettings(), getLang()]);
  const color = /^#[0-9a-fA-F]{6}$/.test(s.primaryColor) ? s.primaryColor : '#0f4c5c';
  return (
    <html lang={lang} dir={lang === 'en' ? 'ltr' : 'rtl'} suppressHydrationWarning style={{ '--primary': color }}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}",
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
