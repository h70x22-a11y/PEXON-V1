// حالات طلبات عروض الأسعار
export const QUOTE_STATUSES = [
  { key: 'new', ar: 'جديد', color: '#f2a541' },
  { key: 'pricing', ar: 'قيد التسعير', color: '#37b6ff' },
  { key: 'sent', ar: 'أُرسل العرض', color: '#7c5cff' },
  { key: 'won', ar: 'تم البيع', color: '#16a34a' },
  { key: 'lost', ar: 'لم يتم', color: '#9aa3af' },
];

export const statusOf = (key) => QUOTE_STATUSES.find((s) => s.key === key) || QUOTE_STATUSES[0];
