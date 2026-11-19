import AppRegister from '@/components/AppRegister';

// لوحة التحكم كتطبيق على الجوال (iPhone / Android)
export const metadata = {
  title: { default: 'PX System', template: '%s | PX System' },
  applicationName: 'PX System',
  manifest: '/admin.webmanifest',
  appleWebApp: { capable: true, title: 'PX System', statusBarStyle: 'default' },
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
