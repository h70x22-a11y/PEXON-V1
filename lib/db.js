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
  searchSynonyms: '',
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
  // البيانات النظامية
  legalName: '',
  legalNameEn: '',
  crNumber: '',
  vatNumber: '',
  googleVerification: '',
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

export async function getMessage(id) {
  if (!dbReady) return null;
  try {
    const raw = await cmd('HGET', 'messages', id);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveMessage(message) {
  await cmd('HSET', 'messages', message.id, JSON.stringify(message));
}

// رقم تسلسلي لعروض الأسعار: Q-2026-0001
export async function nextQuoteNumber() {
  const n = await cmd('INCR', 'quote-counter');
  return `Q-${new Date().getFullYear()}-${String(n).padStart(4, '0')}`;
}

// ---------- مستخدمي لوحة التحكم ----------
export async function getUsers() {
  return readJSON('users', []);
}
// طلبات إعادة تعيين كلمة المرور
export async function getResetRequests() {
  return readJSON('reset-requests', []);
}
export async function saveResetRequests(list) {
  await writeJSON('reset-requests', list);
}

export async function getRoles() {
  return readJSON('roles', []);
}
export async function saveRoles(list) {
  await writeJSON('roles', list);
}
export async function saveUsers(list) {
  await writeJSON('users', list);
}

// ---------- عدّاد محاولات الدخول ----------
export async function hitCounter(key, ttlSeconds) {
  if (!dbReady) return 0;
  try {
    const n = await cmd('INCR', key);
    if (n === 1) await cmd('EXPIRE', key, ttlSeconds);
    return n;
  } catch {
    return 0;
  }
}
export async function getCounter(key) {
  if (!dbReady) return 0;
  try {
    return Number(await cmd('GET', key)) || 0;
  } catch {
    return 0;
  }
}
export async function clearCounter(key) {
  if (!dbReady) return;
  try {
    await cmd('DEL', key);
  } catch {}
}


// ---------- إحصائيات البحث ----------
// لكل يوم (بتوقيت الرياض) مجموعتين: كل عمليات البحث، واللي ما لها نتائج. تنحذف تلقائياً بعد 400 يوم.
async function pipeline(commands) {
  const res = await fetch(`${URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
    cache: 'no-store',
  });
  return res.json();
}

const riyadhDay = (d = new Date()) => d.toLocaleDateString('en-CA', { timeZone: 'Asia/Riyadh' });
const KEEP = 400 * 86400;

// key: الكلمة بعد التوحيد، label: آخر صيغة كتبها العميل، hits: عدد النتائج وقت البحث
export async function recordSearch({ key, label, hits, ip }) {
  if (!dbReady || !key) return;
  try {
    // نفس الزائر ونفس الكلمة خلال 10 دقايق تنحسب مرة وحدة
    const seen = await cmd('SET', `search:seen:${ip}:${key}`.slice(0, 200), '1', 'NX', 'EX', 600);
    if (seen !== 'OK') return;
    const day = riyadhDay();
    const cmds = [
      ['ZINCRBY', `search:d:${day}`, 1, key],
      ['EXPIRE', `search:d:${day}`, KEEP],
      ['HSET', 'search:label', key, String(label).slice(0, 80)],
    ];
    if (!hits) cmds.push(['ZINCRBY', `search:z:${day}`, 1, key], ['EXPIRE', `search:z:${day}`, KEEP]);
    await pipeline(cmds);
  } catch {}
}

const toPairs = (flat) => {
  const out = [];
  for (let i = 0; i < (flat || []).length; i += 2) out.push({ key: flat[i], count: Number(flat[i + 1]) || 0 });
  return out.sort((a, b) => b.count - a.count);
};

export async function getSearchStats(days) {
  const empty = { top: [], zero: [], total: 0, zeroTotal: 0, unique: 0 };
  if (!dbReady) return empty;
  try {
    const list = [];
    for (let i = 0; i < days; i++) list.push(riyadhDay(new Date(Date.now() - i * 86400000)));
    const [all, zero] = await pipeline([
      ['ZUNION', list.length, ...list.map((d) => `search:d:${d}`), 'WITHSCORES'],
      ['ZUNION', list.length, ...list.map((d) => `search:z:${d}`), 'WITHSCORES'],
    ]);
    const top = toPairs(all?.result);
    const zeroList = toPairs(zero?.result);
    const keys = [...new Set([...top.slice(0, 100), ...zeroList.slice(0, 100)].map((x) => x.key))];
    const labels = keys.length ? (await cmd('HMGET', 'search:label', ...keys)) || [] : [];
    const label = Object.fromEntries(keys.map((k, i) => [k, labels[i] || k]));
    const withLabel = (x) => ({ ...x, label: label[x.key] || x.key });
    return {
      top: top.slice(0, 100).map(withLabel),
      zero: zeroList.slice(0, 100).map(withLabel),
      total: top.reduce((s, x) => s + x.count, 0),
      zeroTotal: zeroList.reduce((s, x) => s + x.count, 0),
      unique: top.length,
    };
  } catch {
    return empty;
  }
}
