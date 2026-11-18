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

// ---------- الأسماء العربية ----------
const AR = /[؀-ۿ]/;

// الاسم العربي: من الحقل المخصص، أو أول سطر عربي في الوصف (المنتجات المستوردة)
export function arabicName(product) {
  if (product.nameAr) return String(product.nameAr).trim();
  const line = String(product.description || '')
    .split('\n')
    .map((l) => l.trim())
    .find((l) => AR.test(l));
  // لو السطر يبدأ بوصف إنجليزي نأخذ الجزء العربي فقط
  return line ? line.slice(line.search(AR)).replace(/\s+/g, ' ').trim().slice(0, 140) : '';
}

// عنوان المنتج حسب اللغة
export function displayName(product, lang = 'ar') {
  return (lang === 'ar' && arabicName(product)) || product.name;
}

// ---------- البحث ----------
export function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[^\p{L}\p{N}.]+/gu, ' ')
    .trim();
}

export const skuOf = (product) => (String(product.short || '').match(/(?:رقم الصنف|SKU)\s*([\w\-./]+)/) || [])[1] || '';

// مرادفات: الجمع والمفرد، العربي والإنجليزي، اللهجة الدارجة، وأسماء العلامات
const BASE_SYNONYMS = [
  ['مفتاح', 'مفاتيح', 'سويتش', 'سويتشات', 'switch', 'switches'],
  ['فيش', 'افياش', 'فيشه', 'بريزه', 'بريزات', 'ابريزه', 'سوكت', 'socket', 'sockets'],
  ['كابل', 'كابلات', 'كيبل', 'كيبلات', 'كيابل', 'كبل', 'كبلات', 'cable', 'cables'],
  ['سلك', 'اسلاك', 'واير', 'wire', 'wires'],
  ['قاطع', 'قواطع', 'بريكر', 'بريكرات', 'breaker', 'breakers', 'mcb', 'mccb'],
  ['ماسوره', 'مواسير', 'بايب', 'بايبات', 'conduit', 'conduits', 'pipe'],
  ['غطاء', 'اغطيه', 'فريم', 'فريمات', 'بليته', 'بليتات', 'كفر', 'plate', 'cover', 'frame'],
  ['علبه', 'علب', 'بوكس', 'box', 'boxes'],
  ['جرس', 'اجراس', 'بيل', 'bell'],
  ['حساس', 'حساسات', 'سنسر', 'sensor'],
  ['ديمر', 'دمر', 'dimmer'],
  ['ارضي', 'تاريض', 'ارثنج', 'ارث', 'earthing', 'earth', 'grounding'],
  ['شاحن', 'شواحن', 'usb'],
  ['شريط', 'تيب', 'لزق', 'tape'],
  ['قابس', 'قوابس', 'بلق', 'plug', 'plugs'],
  ['ليجراند', 'لجراند', 'ليقراند', 'legrand'],
  ['شنايدر', 'شنيدر', 'schneider'],
  ['بحره', 'bahra'],
  ['بلدن', 'belden'],
  ['ريكم', 'رايكم', 'raychem'],
].map((g) => g.map(normalize));

// مرادفات إضافية من لوحة التحكم: كل سطر مجموعة كلمات مفصولة بفاصلة
export function parseSynonyms(text) {
  return String(text || '')
    .split(/\n+/)
    .map((line) => line.split(/[،,|]+/).map((w) => normalize(w)).filter(Boolean))
    .filter((g) => g.length >= 2);
}

function alternatives(token, groups) {
  const set = new Set([token]);
  for (const g of groups) if (g.includes(token)) g.forEach((w) => set.add(w));
  return [...set];
}

function haystack(product, categoryName = '') {
  return normalize(
    [product.name, arabicName(product), product.short, product.description, brandOf(product), categoryName, product.keywords].join(' ')
  );
}

// يرجّع المنتجات المطابقة مرتبة: رقم الصنف المطابق أولاً ثم الأقرب للاسم
export function searchProducts(products, query, categories = [], extraSynonyms = []) {
  const q = normalize(query);
  if (!q) return [];
  const tokens = q.split(' ').filter(Boolean);
  const catName = new Map(categories.map((c) => [c.id, c.name]));
  const compactQ = q.replace(/\s+/g, '');
  const groups = extraSynonyms.length ? [...BASE_SYNONYMS, ...extraSynonyms] : BASE_SYNONYMS;
  const alts = tokens.map((t) => alternatives(t, groups));
  const results = [];
  for (const p of products) {
    const hay = haystack(p, catName.get(p.categoryId));
    if (!alts.every((a) => a.some((alt) => hay.includes(alt)))) continue;
    const sku = normalize(skuOf(p)).replace(/\s+/g, '');
    const name = normalize(p.name);
    const nameAr = normalize(arabicName(p));
    let score = 0;
    if (sku && sku === compactQ) score += 100;
    else if (sku && sku.startsWith(compactQ)) score += 50;
    if (name.startsWith(q) || nameAr.startsWith(q)) score += 20;
    if (name.includes(q) || nameAr.includes(q)) score += 10;
    results.push({ p, score });
  }
  return results.sort((a, b) => b.score - a.score).map((r) => r.p);
}

// ---------- فلاتر الأقسام ----------
const TYPES = [
  { key: 'switch', ar: 'مفاتيح', en: 'Switches', re: /switch|seitch|s\.?\s?sw\b|مفتاح|مفاتيح/i },
  { key: 'socket', ar: 'أفياش', en: 'Sockets', re: /socket|receptacle|فيش|بريزه|بريزة/i },
  { key: 'plug', ar: 'قوابس', en: 'Plugs', re: /\bplug\b|قابس/i },
  { key: 'plate', ar: 'أغطية وإطارات', en: 'Plates & frames', re: /plate|frame|cover|غطاء|فريم|بليته|بليتة/i },
  { key: 'dimmer', ar: 'ديمر', en: 'Dimmers', re: /dimmer|demmer|ديمر/i },
  { key: 'usb', ar: 'شواحن USB', en: 'USB chargers', re: /\busb\b/i },
  { key: 'data', ar: 'بيانات وتلفون وتلفاز', en: 'Data, phone & TV', re: /\bdata\b|rj45|rj11|\btel\b|\btv\b|hdmi|cat\s?\d/i },
  { key: 'bell', ar: 'أجراس وأزرار', en: 'Bells & push buttons', re: /bell|push|botton|button|جرس/i },
  { key: 'sensor', ar: 'حساسات', en: 'Sensors', re: /sensor|حساس/i },
  { key: 'box', ar: 'علب', en: 'Boxes', re: /\bbox\b|علبه|علبة/i },
  { key: 'isolator', ar: 'مفاتيح عزل', en: 'Isolators', re: /isolator|solator|s\.?\s?sw\b/i },
  { key: 'conduit', ar: 'مواسير', en: 'Conduits', re: /conduit|ماسوره|ماسورة|مواسير/i },
  { key: 'fitting', ar: 'وصلات وملحقات', en: 'Fittings & accessories', re: /connector|coupling|adaptor|bend|saddle|clamp|gland|lug|joint/i },
  { key: 'cable', ar: 'كابلات وأسلاك', en: 'Cables & wires', re: /cable|wire|كابل|سلك|اسلاك/i },
  { key: 'breaker', ar: 'قواطع', en: 'Breakers', re: /\bmcb\b|mccb|rccb|breaker|قاطع/i },
];

const COLORS = [
  { key: 'white', ar: 'أبيض', en: 'White', re: /white|ابيض|أبيض/i },
  { key: 'black', ar: 'أسود', en: 'Black', re: /black|اسود|أسود/i },
  { key: 'silver', ar: 'فضي', en: 'Silver', re: /silver|فضي/i },
  { key: 'gold', ar: 'ذهبي', en: 'Gold', re: /gold|ذهبي/i },
  { key: 'aluminium', ar: 'ألمنيوم', en: 'Aluminium', re: /alumin|المنيوم|ألمنيوم/i },
  { key: 'titanium', ar: 'تيتانيوم', en: 'Titanium', re: /titanium|تيتانيوم/i },
  { key: 'grey', ar: 'رمادي', en: 'Grey', re: /\bgr[ae]y\b|رمادي/i },
  { key: 'red', ar: 'أحمر', en: 'Red', re: /\bred\b|احمر|أحمر/i },
  { key: 'green', ar: 'أخضر', en: 'Green', re: /green|اخضر|أخضر/i },
];

function facetValues(product) {
  const text = `${product.name}\n${product.description || ''}`;
  const name = String(product.name || '');
  const types = TYPES.filter((t) => t.re.test(text)).map((t) => t.key);
  const amp = (name.match(/(\d+(?:\.\d+)?)\s?A\b/i) || [])[1];
  const gang = (name.match(/\b(\d)\s?G\b/i) || [])[1];
  const colors = COLORS.filter((c) => c.re.test(text)).map((c) => c.key);
  return { types, amp: amp ? `${amp}A` : '', gang: gang || '', colors };
}

// يبني الفلاتر المتاحة في مجموعة منتجات (يظهر الفلتر لو فيه خيارين على الأقل)
export function buildFacets(products, lang = 'ar') {
  const count = { type: new Map(), amp: new Map(), gang: new Map(), color: new Map() };
  for (const p of products) {
    const f = facetValues(p);
    f.types.forEach((k) => count.type.set(k, (count.type.get(k) || 0) + 1));
    if (f.amp) count.amp.set(f.amp, (count.amp.get(f.amp) || 0) + 1);
    if (f.gang) count.gang.set(f.gang, (count.gang.get(f.gang) || 0) + 1);
    f.colors.forEach((k) => count.color.set(k, (count.color.get(k) || 0) + 1));
  }
  const total = products.length;
  const useful = (m) => [...m.entries()].filter(([, n]) => n < total || m.size > 1);
  const groups = [];
  const typeOpts = useful(count.type)
    .map(([k, n]) => ({ value: k, label: TYPES.find((t) => t.key === k)[lang], n }))
    .sort((a, b) => b.n - a.n);
  if (typeOpts.length >= 2) groups.push({ key: 'type', label: lang === 'en' ? 'Type' : 'النوع', options: typeOpts });
  const ampOpts = [...count.amp.entries()]
    .map(([k, n]) => ({ value: k, label: k, n }))
    .sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
  if (ampOpts.length >= 2) groups.push({ key: 'amp', label: lang === 'en' ? 'Current' : 'الأمبير', options: ampOpts });
  const gangOpts = [...count.gang.entries()]
    .map(([k, n]) => ({ value: k, label: lang === 'en' ? `${k} gang` : `${k} خانة`, n }))
    .sort((a, b) => a.value - b.value);
  if (gangOpts.length >= 2) groups.push({ key: 'gang', label: lang === 'en' ? 'Gangs' : 'عدد الخانات', options: gangOpts });
  const colorOpts = [...count.color.entries()]
    .map(([k, n]) => ({ value: k, label: COLORS.find((c) => c.key === k)[lang], n }))
    .sort((a, b) => b.n - a.n);
  if (colorOpts.length >= 2) groups.push({ key: 'color', label: lang === 'en' ? 'Color' : 'اللون', options: colorOpts });
  return groups;
}

export function applyFacets(products, filters) {
  return products.filter((p) => {
    const f = facetValues(p);
    if (filters.type && !f.types.includes(filters.type)) return false;
    if (filters.amp && f.amp !== filters.amp) return false;
    if (filters.gang && f.gang !== filters.gang) return false;
    if (filters.color && !f.colors.includes(filters.color)) return false;
    return true;
  });
}
