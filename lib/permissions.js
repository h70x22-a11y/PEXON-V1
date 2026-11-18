// صلاحيات لوحة التحكم على طريقة المناصب: لكل قسم عمليات (عرض، إضافة وتعديل، حذف)
// الصلاحية تُكتب "القسم:العملية" مثل quotes:read أو products:delete
export const ACTIONS = [
  { key: 'read', ar: 'العرض' },
  { key: 'write', ar: 'الإضافة والتعديل' },
  { key: 'delete', ar: 'الحذف' },
];

export const PERM_GROUPS = [
  {
    ar: 'المبيعات',
    items: [
      { key: 'quotes', ar: 'طلبات عروض الأسعار', actions: ['read', 'write', 'delete'] },
      { key: 'messages', ar: 'الرسائل', actions: ['read', 'delete'] },
      { key: 'vendors', ar: 'الموردين المسجلين', actions: ['read', 'delete'] },
    ],
  },
  {
    ar: 'الكتالوج',
    items: [
      { key: 'products', ar: 'المنتجات', actions: ['read', 'write', 'delete'] },
      { key: 'categories', ar: 'الأقسام', actions: ['read', 'write', 'delete'] },
      { key: 'searches', ar: 'إحصائيات البحث', actions: ['read', 'write'] },
    ],
  },
  {
    ar: 'الإعدادات',
    items: [
      { key: 'settings', ar: 'إعدادات الموقع والكتالوج', actions: ['read', 'write'] },
      { key: 'users', ar: 'المستخدمين والمناصب', actions: ['read', 'write', 'delete'] },
    ],
  },
];

export const PERMISSIONS = PERM_GROUPS.flatMap((g) => g.items);
export const ALL_PERMS = PERMISSIONS.flatMap((p) => p.actions.map((a) => `${p.key}:${a}`));

// تحويل الصلاحيات القديمة (اسم القسم فقط) إلى صلاحيات كاملة على القسم
export function normalizePerms(perms = []) {
  const out = new Set();
  for (const p of perms) {
    if (p.includes(':')) {
      if (ALL_PERMS.includes(p)) out.add(p);
    } else {
      const sec = PERMISSIONS.find((x) => x.key === p);
      if (sec) sec.actions.forEach((a) => out.add(`${p}:${a}`));
    }
  }
  // أي عملية تعني إمكانية العرض
  for (const p of [...out]) out.add(`${p.split(':')[0]}:read`);
  return [...out];
}
