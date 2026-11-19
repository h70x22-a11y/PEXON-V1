import AppRegister from '@/components/AppRegister';

// لوحة التحكم كتطبيق على الجوال (iPhone / Android)
export const metadata = {
  manifest: '/admin.webmanifest',
  appleWebApp: { capable: true, title: 'PEXON', statusBarStyle: 'default' },
};

export const viewport = { themeColor: '#0f2a44' };

export default function AdminRootLayout({ children }) {
  return (
    <>
      {children}
      <AppRegister />
    </>
  );
}
