// قاعدة البيانات: Upstash Redis عبر REST (تُربط من Vercel > Storage)
const URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const dbReady = Boolean(URL && TOKEN);
export const blobReady = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function cmd(...args) {
  if (!dbReady) throw new Error('قاعدة البيانات غير مربوطة بعد. اربط Upstash Redis من Vercel أولاً.');
  const res = await fetch(URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    cache: 'no-store',
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.result;
}

async function readJSON(key, fallback) {
  if (!dbReady) return fallback;
  try {
    const raw = await cmd('GET', key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

async function writeJSON(key, value) {
  await cmd('SET', key, JSON.stringify(value));
}

// ---------- بيانات افتراضية تظهر قبل أول تعديل ----------
export const defaultSettings = {
  siteName: 'اسم نشاطك',
  tagline: 'منتجات وحلول كهربائية موثوقة',
  heroTitle: 'كل ما تحتاجه من المنتجات الكهربائية في مكان واحد',
  heroText: 'تصفح أقسامنا واختر المنتج المناسب لمشروعك، وتواصل معنا لطلب عرض سعر.',
  about: 'اكتب هنا نبذة مختصرة عن نشاطك. تقدر تعدلها من لوحة التحكم.',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  primaryColor: '#0f4c5c',
  logo: '',
  instagram: '',
  x: '',
  tiktok: '',
  snapchat: '',
  facebook: '',
  youtube: '',
  linkedin: '',
  telegram: '',
  // كل سطر عنصر. القيم بصيغة: العنوان | الشرح
  values: '',
  services: '',
  brands: '',
  partners: '',
  payments: '',
  catalogUrl: '',
  // النسخة الإنجليزية (تظهر عند اختيار English، وإن كانت فاضية يظهر النص العربي)
  taglineEn: '',
  heroTitleEn: '',
  heroTextEn: '',
  aboutEn: '',
  valuesEn: '',
  servicesEn: '',
  addressEn: '',
};

const defaultCategories = [
  { id: 'c1', name: 'القواطع واللوحات الكهربائية', description: 'قواطع، لوحات توزيع، وملحقاتها.', image: '' },
  { id: 'c2', name: 'المفاتيح والأفياش', description: 'مفاتيح إنارة وأفياش للمنازل والمكاتب.', image: '' },
  { id: 'c3', name: 'الإنارة', description: 'حلول إنارة داخلية وخارجية.', image: '' },
  { id: 'c4', name: 'الكابلات والأسلاك', description: 'كابلات وأسلاك بمقاسات متعددة.', image: '' },
  { id: 'c5', name: 'الطاقة الشمسية', description: 'ألواح، محولات، وبطاريات تخزين.', image: '' },
  { id: 'c6', name: 'التحكم والأتمتة', description: 'كونتاكتورات، ريليهات، وأنظمة تحكم.', image: '' },
];

const defaultProducts = [
  { id: 'p1', categoryId: 'c1', name: 'قاطع كهربائي 32 أمبير', short: 'قاطع أحادي القطب للاستخدام المنزلي.', description: 'منتج تجريبي. عدّل الوصف من لوحة التحكم.', price: '', image: '', featured: true },
  { id: 'p2', categoryId: 'c2', name: 'فيش ثلاثي مع مفتاح', short: 'فيش جداري بتصميم عصري.', description: 'منتج تجريبي. عدّل الوصف من لوحة التحكم.', price: '', image: '', featured: true },
  { id: 'p3', categoryId: 'c3', name: 'كشاف LED 50 واط', short: 'كشاف خارجي مقاوم للماء.', description: 'منتج تجريبي. عدّل الوصف من لوحة التحكم.', price: '', image: '', featured: true },
  { id: 'p4', categoryId: 'c5', name: 'لوح شمسي 550 واط', short: 'لوح عالي الكفاءة للمشاريع السكنية.', description: 'منتج تجريبي. عدّل الوصف من لوحة التحكم.', price: '', image: '', featured: true },
];

// ---------- الإعدادات ----------
export async function getSettings() {
  const saved = await readJSON('settings', {});
  return { ...defaultSettings, ...saved };
}
export async function saveSettings(settings) {
  await writeJSON('settings', settings);
}

// ---------- الأقسام ----------
export async function getCategories() {
  return readJSON('categories', defaultCategories);
}
export async function saveCategories(list) {
  await writeJSON('categories', list);
}

// ---------- المنتجات ----------
export async function getProducts() {
  return readJSON('products', defaultProducts);
}
export async function saveProducts(list) {
  await writeJSON('products', list);
}

// ---------- الرسائل ----------
export async function getMessages() {
  if (!dbReady) return [];
  try {
    const values = (await cmd('HVALS', 'messages')) || [];
    return values
      .map((v) => {
        try { return JSON.parse(v); } catch { return null; }
      })
      .filter(Boolean)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch {
    return [];
  }
}
export async function addMessage(message) {
  await cmd('HSET', 'messages', message.id, JSON.stringify(message));
}
export async function deleteMessage(id) {
  await cmd('HDEL', 'messages', id);
}
