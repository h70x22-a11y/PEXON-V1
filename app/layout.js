import './globals.css';
import { getSettings } from '@/lib/db';
import { getLang } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const s = await getSettings();
  return { title: s.siteName, description: s.tagline };
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
