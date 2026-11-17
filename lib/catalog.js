// العلامة التجارية للمنتج: من الحقل المخصص، أو من أول جزء في الوصف المختصر للمنتجات المستوردة
export function brandOf(product) {
  if (product.brand) return String(product.brand).trim();
  const first = String(product.short || '').split(' · ')[0].trim();
  return first && !first.startsWith('رقم الصنف') ? first : '';
}

export function listBrands(products) {
  const map = new Map();
  for (const p of products) {
    const name = brandOf(p);
    if (!name) continue;
    const key = name.toLowerCase();
    const entry = map.get(key) || { name, count: 0 };
    entry.count++;
    map.set(key, entry);
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}
