// حالات طلبات عروض الأسعار
export const QUOTE_STATUSES = [
  { key: 'new', ar: 'جديد', color: '#f2a541' },
  { key: 'pricing', ar: 'قيد التسعير', color: '#37b6ff' },
  { key: 'sent', ar: 'أُرسل العرض', color: '#7c5cff' },
  { key: 'won', ar: 'تم البيع', color: '#16a34a' },
  { key: 'lost', ar: 'لم يتم', color: '#9aa3af' },
];

export const statusOf = (key) => QUOTE_STATUSES.find((s) => s.key === key) || QUOTE_STATUSES[0];

export const UNITS = ['حبة', 'متر', 'لفة', 'كرتون', 'علبة', 'طقم', 'رول', 'كيلو', 'لتر'];

// رقم الصنف من الوصف المختصر ("رقم الصنف XXX" أو "SKU XXX")
export const skuOf = (short) => (String(short || '').match(/(?:رقم الصنف|SKU)\s*[:：]?\s*([\w\-./]+)/) || [])[1] || '';

// الوصف المختصر بدون رقم الصنف
export const shortWithoutSku = (short) => String(short || '').replace(/[·|،,-]?\s*(?:رقم الصنف|SKU)\s*[:：]?\s*[\w\-./]+/g, '').trim();

// نسخة ثابتة من المنتج داخل الطلب (عشان المستند ما يتغير لو تعدّل المنتج بعدين)
export function quoteItem(p, qty) {
  return {
    id: p.id,
    name: p.name,
    short: p.short || '',
    sku: skuOf(p.short),
    desc: String(p.description || '').replace(/\s+/g, ' ').trim().slice(0, 300),
    unit: p.unit || 'حبة',
    image: p.image || '',
    qty,
  };
}
