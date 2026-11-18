// صلاحيات لوحة التحكم (يُستخدم في الواجهة والخادم)
export const PERMISSIONS = [
  { key: 'quotes', ar: 'طلبات عروض الأسعار' },
  { key: 'messages', ar: 'الرسائل' },
  { key: 'vendors', ar: 'الموردين المسجلين' },
  { key: 'products', ar: 'المنتجات' },
  { key: 'categories', ar: 'الأقسام' },
  { key: 'searches', ar: 'إحصائيات البحث' },
  { key: 'settings', ar: 'إعدادات الموقع والكتالوج' },
  { key: 'users', ar: 'المستخدمين والصلاحيات' },
];

export const ALL_PERMS = PERMISSIONS.map((p) => p.key);
