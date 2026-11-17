// فلاتر قوائم لوحة التحكم: البحث بالنص ورقم الجوال، والفترة الزمنية

// تاريخ اليوم بتوقيت الرياض بصيغة YYYY-MM-DD
export function dayOf(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Asia/Riyadh' });
  } catch {
    return '';
  }
}

// أرقام الجوال: نشيل كل شي غير الأرقام ومفتاح السعودية والصفر في البداية
// عشان 0501234567 و +966 501234567 و 966501234567 تتطابق
const phoneDigits = (v) =>
  String(v || '')
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/\D/g, '')
    .replace(/^00/, '')
    .replace(/^966/, '')
    .replace(/^0+/, '');

export function matchesRecord(m, q, fields) {
  const term = String(q || '').trim().toLowerCase();
  if (!term) return true;
  const text = fields.map((f) => String(f ?? '')).join(' ').toLowerCase();
  if (text.includes(term)) return true;
  const qd = phoneDigits(term);
  return qd.length >= 4 && /^[\d\s+\-()٠-٩]+$/.test(term) && phoneDigits(m.phone).includes(qd);
}

export function inRange(iso, from, to) {
  if (!from && !to) return true;
  const d = dayOf(iso);
  if (from && d < from) return false;
  if (to && d > to) return false;
  return true;
}

export const cleanDate = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(String(v || '')) ? String(v) : '');
