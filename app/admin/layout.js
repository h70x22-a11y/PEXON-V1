import AppRegister from '@/components/AppRegister';

// لوحة التحكم كتطبيق على الجوال (iPhone / Android)
export const metadata = {
  manifest: '/admin.webmanifest',
  appleWebApp: { capable: true, title: 'PEXON', statusBarStyle: 'default' },
  icons: { apple: '/app/apple-180.png' },
};

export const viewport = { themeColor: '#37b6ff' };

export default function AdminRootLayout({ children }) {
  return (
    <>
      {children}
      <AppRegister />
    </>
  );
}
