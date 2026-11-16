import './globals.css';
import { getSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const s = await getSettings();
  return { title: s.siteName, description: s.tagline };
}

export default async function RootLayout({ children }) {
  const s = await getSettings();
  const color = /^#[0-9a-fA-F]{6}$/.test(s.primaryColor) ? s.primaryColor : '#0f4c5c';
  return (
    <html lang="ar" dir="rtl" style={{ '--primary': color }}>
      <head>
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
