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
  // مدد الاحتفاظ بالبيانات بالأشهر (0 = بدون حذف تلقائي)
  retainMessages: 24,
  retainQuotes: 36,
  retainVendors: 36,
  retainDataRequests: 60,
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
  // رمز التحقق من النطاق في Meta (فيسبوك وانستقرام)
  metaVerification: 'ksl54zva731imsf8ukdysxw6md7qwl',
  // معرّف Meta Pixel (يشتغل فقط بعد موافقة الزائر)
  metaPixelId: '1812714666690223',
  // معرّف قياس Google Analytics (يشتغل فقط بعد موافقة الزائر)
  gaId: 'G-D4C1LY8DXD',
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
    // حد إجمالي باليوم عشان ما تكبر قوائم البحث بلا نهاية
    if ((await hitCounter(`search:cap:${day}`, 86400)) > 3000) return;
    const cmds = [
      ['ZINCRBY', `search:d:${day}`, 1, key],
      ['EXPIRE', `search:d:${day}`, KEEP],
      ['HSET', 'search:label', key, String(label).slice(0, 80)],
    ];
    if (!hits) {
      cmds.push(['ZINCRBY', `search:z:${day}`, 1, key], ['EXPIRE', `search:z:${day}`, KEEP]);
      // كلمة بدون نتيجة: تدخل قائمة "ناقصة" لين نحلها
      cmds.push(['HSETNX', 'search:missing', key, new Date().toISOString()], ['HINCRBY', 'search:missed-count', key, 1]);
      cmds.push(['HDEL', 'search:fixed', key]);
    } else {
      cmds.push(['HINCRBY', 'search:found-after-fix', key, 1]);
    }
    await pipeline(cmds);
    // كلمة كانت ناقصة وصار لها نتائج: تنتقل لقائمة "تم حلها"
    if (hits && (await cmd('HEXISTS', 'search:missing', key))) await markFixed([key]);
  } catch {}
}

const toPairs = (flat) => {
  const out = [];
  for (let i = 0; i < (flat || []).length; i += 2) out.push({ key: flat[i], count: Number(flat[i + 1]) || 0 });
  return out.sort((a, b) => b.count - a.count);
};

export async function getSearchStats(days, exclude = new Set()) {
  const empty = { top: [], zero: [], total: 0, zeroTotal: 0, unique: 0 };
  if (!dbReady) return empty;
  try {
    const list = [];
    for (let i = 0; i < days; i++) list.push(riyadhDay(new Date(Date.now() - i * 86400000)));
    const [all, zero] = await pipeline([
      ['ZUNION', list.length, ...list.map((d) => `search:d:${d}`), 'WITHSCORES'],
      ['ZUNION', list.length, ...list.map((d) => `search:z:${d}`), 'WITHSCORES'],
    ]);
    // الكلمات المعتمدة "لا نبيعه" ما تدخل في المؤشرات
    const top = toPairs(all?.result).filter((x) => !exclude.has(x.key));
    const zeroList = toPairs(zero?.result).filter((x) => !exclude.has(x.key));
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

// ---------- التنبيهات والمحادثات بين مستخدمي لوحة التحكم ----------
export async function getSeenAt(userId) {
  if (!dbReady) return '';
  try {
    return (await cmd('GET', `notif-seen:${userId}`)) || '';
  } catch {
    return '';
  }
}
export async function setSeenAt(userId, iso) {
  await cmd('SET', `notif-seen:${userId}`, iso);
}

const chatKey = (a, b) => `chat:${[a, b].sort().join(':')}`;

export async function getChat(a, b, limit = 200) {
  if (!dbReady) return [];
  try {
    const list = (await cmd('LRANGE', chatKey(a, b), -limit, -1)) || [];
    return list.map((v) => {
      try { return JSON.parse(v); } catch { return null; }
    }).filter(Boolean);
  } catch {
    return [];
  }
}

export async function addChatMessage(msg) {
  const key = chatKey(msg.from, msg.to);
  await cmd('RPUSH', key, JSON.stringify(msg));
  await cmd('LTRIM', key, -1000, -1);
  await cmd('HINCRBY', `chat-unread:${msg.to}`, msg.from, 1);
  await cmd('HSET', 'chat-pairs', [msg.from, msg.to].sort().join(':'), msg.date);
  await cmd('HSET', `chat-last:${msg.to}`, msg.from, msg.date);
  await cmd('HSET', `chat-last:${msg.from}`, msg.to, msg.date);
}

export async function getChatUnread(userId) {
  if (!dbReady) return {};
  try {
    const flat = (await cmd('HGETALL', `chat-unread:${userId}`)) || [];
    const out = {};
    for (let i = 0; i < flat.length; i += 2) out[flat[i]] = Number(flat[i + 1]) || 0;
    return out;
  } catch {
    return {};
  }
}

export async function getChatLast(userId) {
  if (!dbReady) return {};
  try {
    const flat = (await cmd('HGETALL', `chat-last:${userId}`)) || [];
    const out = {};
    for (let i = 0; i < flat.length; i += 2) out[flat[i]] = flat[i + 1];
    return out;
  } catch {
    return {};
  }
}

export async function markChatRead(userId, fromId) {
  try {
    await cmd('HDEL', `chat-unread:${userId}`, fromId);
  } catch {}
}

// الصورة الشخصية لمستخدمي لوحة التحكم
export async function getAvatar(id) {
  if (!dbReady) return '';
  try {
    return (await cmd('GET', `avatar:${id}`)) || '';
  } catch {
    return '';
  }
}
export async function getAvatars(ids) {
  if (!dbReady || !ids.length) return {};
  try {
    const vals = (await cmd('MGET', ...ids.map((id) => `avatar:${id}`))) || [];
    return Object.fromEntries(ids.map((id, i) => [id, vals[i] || '']));
  } catch {
    return {};
  }
}
export async function setAvatar(id, url) {
  if (url) await cmd('SET', `avatar:${id}`, url);
  else await cmd('DEL', `avatar:${id}`);
}

// كل المحادثات بين الموظفين (للمراجعة): زوج المستخدمين وتاريخ آخر رسالة
export async function getChatPairs() {
  if (!dbReady) return [];
  try {
    const flat = (await cmd('HGETALL', 'chat-pairs')) || [];
    const out = [];
    for (let i = 0; i < flat.length; i += 2) out.push({ pair: flat[i], last: flat[i + 1] });
    return out.sort((a, b) => (a.last < b.last ? 1 : -1));
  } catch {
    return [];
  }
}
export async function getChatByPair(pair, limit = 500) {
  const [a, b] = String(pair).split(':');
  return a && b ? getChat(a, b, limit) : [];
}

// عدد عمليات البحث لكل يوم (كل البحث، وبدون نتيجة) لرسم الإحصائيات
export async function getSearchDaily(days, exclude = new Set()) {
  const list = [];
  for (let i = days - 1; i >= 0; i--) list.push(riyadhDay(new Date(Date.now() - i * 86400000)));
  if (!dbReady) return list.map((day) => ({ day, total: 0, zero: 0 }));
  try {
    const cmds = list.flatMap((d) => [
      ['ZRANGE', `search:d:${d}`, 0, -1, 'WITHSCORES'],
      ['ZRANGE', `search:z:${d}`, 0, -1, 'WITHSCORES'],
    ]);
    const res = await pipeline(cmds);
    const sum = (flat) => {
      let s = 0;
      for (let i = 1; i < (flat || []).length; i += 2) if (!exclude.has(flat[i - 1])) s += Number(flat[i]) || 0;
      return s;
    };
    return list.map((day, i) => ({ day, total: sum(res[i * 2]?.result), zero: sum(res[i * 2 + 1]?.result) }));
  } catch {
    return list.map((day) => ({ day, total: 0, zero: 0 }));
  }
}

// ---------- تتبّع تحسين البحث: الكلمات الناقصة واللي تم حلها ----------
const hmap = async (key) => {
  const flat = (await cmd('HGETALL', key)) || [];
  const out = {};
  for (let i = 0; i < flat.length; i += 2) out[flat[i]] = flat[i + 1];
  return out;
};

export async function markFixed(keys) {
  if (!dbReady || !keys.length) return;
  const now = new Date().toISOString();
  await pipeline(keys.flatMap((k) => [['HDEL', 'search:missing', k], ['HSETNX', 'search:fixed', k, now]]));
}

export async function addMissing(keys) {
  if (!dbReady || !keys.length) return;
  const now = new Date().toISOString();
  await pipeline(keys.map((k) => ['HSETNX', 'search:missing', k, now]));
}

export async function getSearchProgress() {
  if (!dbReady) return { missing: {}, fixed: {}, missed: {}, labels: {} };
  try {
    const [missing, fixed, missed, labels] = await Promise.all([hmap('search:missing'), hmap('search:fixed'), hmap('search:missed-count'), hmap('search:label')]);
    return { missing, fixed, missed, labels };
  } catch {
    return { missing: {}, fixed: {}, missed: {}, labels: {} };
  }
}

// ---------- كلمات لمنتجات لا نبيعها (تحتاج اعتماد المالك) ----------
export async function getNotSold() {
  if (!dbReady) return {};
  try {
    const m = await hmap('search:notsold');
    const out = {};
    for (const [k, v] of Object.entries(m)) {
      try { out[k] = JSON.parse(v); } catch {}
    }
    return out;
  } catch {
    return {};
  }
}
export async function setNotSold(key, data) {
  if (data) {
    await cmd('HSET', 'search:notsold', key, JSON.stringify(data));
    if (data.status === 'approved') await cmd('HDEL', 'search:missing', key);
  } else {
    await cmd('HDEL', 'search:notsold', key);
  }
}
export async function getNotSoldApproved() {
  const all = await getNotSold();
  return new Set(Object.entries(all).filter(([, v]) => v.status === 'approved').map(([k]) => k));
}

// ---------- ترتيب قائمة لوحة التحكم حسب الاستخدام ----------
export const NAV_KEYS = ['home', 'inbox', 'quotes', 'messages', 'vendors', 'products', 'categories', 'visits', 'searches', 'settings', 'activity', 'backups', 'users'];
export async function recordNavUse(userId, key) {
  if (!dbReady || !NAV_KEYS.includes(key)) return;
  try {
    await cmd('HINCRBY', `nav:${userId}`, key, 1);
  } catch {}
}
export async function getNavUse(userId) {
  if (!dbReady) return {};
  try {
    const flat = (await cmd('HGETALL', `nav:${userId}`)) || [];
    const o = {};
    for (let i = 0; i < flat.length; i += 2) o[flat[i]] = Number(flat[i + 1]) || 0;
    return o;
  } catch {
    return {};
  }
}

// ---------- سجل النشاط ----------
export async function logActivity(entry) {
  if (!dbReady) return;
  try {
    await pipeline([
      ['LPUSH', 'audit', JSON.stringify({ at: new Date().toISOString(), ...entry })],
      ['LTRIM', 'audit', 0, 4999],
    ]);
  } catch {}
}
export async function getActivity(limit = 500) {
  if (!dbReady) return [];
  try {
    const list = (await cmd('LRANGE', 'audit', 0, limit - 1)) || [];
    return list.map((v) => {
      try { return JSON.parse(v); } catch { return null; }
    }).filter(Boolean);
  } catch {
    return [];
  }
}

// ---------- التحقق بخطوتين ----------
export async function get2fa(id) {
  return readJSON(`2fa:${id}`, null);
}
export async function set2fa(id, data) {
  if (data) await writeJSON(`2fa:${id}`, data);
  else await cmd('DEL', `2fa:${id}`);
}
export async function getTemp(key) {
  if (!dbReady) return null;
  try {
    const raw = await cmd('GET', key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export async function setTemp(key, value, seconds) {
  if (value === null) await cmd('DEL', key);
  else await cmd('SET', key, JSON.stringify(value), 'EX', seconds);
}

// ---------- النسخ الاحتياطي: قراءة كل البيانات المهمة من قاعدة البيانات ----------
const SKIP = /^(login-fail|search:seen|chat-rate|search-log|reset-req|2fa-setup|2fa-show|2fa-fail|notif-seen)/;

export async function dumpDatabase() {
  const keys = [];
  let cursor = '0';
  do {
    const [next, batch] = await cmd('SCAN', cursor, 'COUNT', 500);
    cursor = String(next);
    for (const k of batch || []) if (!SKIP.test(k)) keys.push(k);
  } while (cursor !== '0');
  const types = keys.length ? await pipeline(keys.map((k) => ['TYPE', k])) : [];
  const reads = keys.map((k, i) => {
    const t = types[i]?.result;
    if (t === 'string') return ['GET', k];
    if (t === 'hash') return ['HGETALL', k];
    if (t === 'list') return ['LRANGE', k, 0, -1];
    if (t === 'zset') return ['ZRANGE', k, 0, -1, 'WITHSCORES'];
    if (t === 'set') return ['SMEMBERS', k];
    return ['GET', k];
  });
  const values = [];
  for (let i = 0; i < reads.length; i += 200) values.push(...(await pipeline(reads.slice(i, i + 200))));
  const data = {};
  keys.forEach((k, i) => (data[k] = { type: types[i]?.result, value: values[i]?.result }));
  return { version: 1, created: new Date().toISOString(), keys: keys.length, data };
}

// ---------- مفاتيح المرور (بصمة / وجه) ----------
export async function getPasskeys(userId) {
  return readJSON(`passkeys:${userId}`, []);
}
export async function savePasskeys(userId, list) {
  await writeJSON(`passkeys:${userId}`, list);
}
export async function passkeyOwner(credId) {
  if (!dbReady) return '';
  try {
    return (await cmd('HGET', 'passkey-owner', credId)) || '';
  } catch {
    return '';
  }
}
export async function setPasskeyOwner(credId, userId) {
  if (userId) await cmd('HSET', 'passkey-owner', credId, userId);
  else await cmd('HDEL', 'passkey-owner', credId);
}

// ---------- قياس الزيارات الداخلي (أرقام إجمالية فقط، بدون أي بيانات شخصية) ----------
const VIS_TTL = 60 * 60 * 24 * 400;
export const VISIT_EVENTS = ['add', 'lead', 'contact'];

export async function recordVisit({ kind, path, source, device, event }) {
  if (!dbReady) return;
  const day = riyadhDay();
  const k = `vis:${day}`;
  const cmds = [];
  if (kind === 'event') {
    if (!VISIT_EVENTS.includes(event)) return;
    cmds.push(['HINCRBY', k, `ev:${event}`, 1]);
  } else {
    cmds.push(['HINCRBY', k, 'views', 1]);
    if (path) cmds.push(['HINCRBY', `vis:page:${day}`, path, 1], ['EXPIRE', `vis:page:${day}`, VIS_TTL]);
    if (kind === 'land') {
      cmds.push(['HINCRBY', k, 'sessions', 1], ['HINCRBY', k, device === 'm' ? 'm' : 'd', 1]);
      cmds.push(['HINCRBY', `vis:src:${day}`, source || 'direct', 1], ['EXPIRE', `vis:src:${day}`, VIS_TTL]);
    }
  }
  cmds.push(['EXPIRE', k, VIS_TTL]);
  try {
    await pipeline(cmds);
  } catch {}
}

export async function getVisitStats(days) {
  const list = [];
  for (let i = days - 1; i >= 0; i--) list.push(riyadhDay(new Date(Date.now() - i * 86400000)));
  const empty = { daily: list.map((day) => ({ day, views: 0, sessions: 0 })), totals: { views: 0, sessions: 0, m: 0, d: 0, add: 0, lead: 0, contact: 0 }, sources: [], pages: [] };
  if (!dbReady) return empty;
  try {
    const res = await pipeline(list.flatMap((d) => [['HGETALL', `vis:${d}`], ['HGETALL', `vis:src:${d}`], ['HGETALL', `vis:page:${d}`]]));
    const toObj = (flat) => {
      const o = {};
      for (let i = 0; i < (flat || []).length; i += 2) o[flat[i]] = Number(flat[i + 1]) || 0;
      return o;
    };
    const totals = { ...empty.totals };
    const src = {};
    const pages = {};
    const daily = list.map((day, i) => {
      const v = toObj(res[i * 3]?.result);
      totals.views += v.views || 0;
      totals.sessions += v.sessions || 0;
      totals.m += v.m || 0;
      totals.d += v.d || 0;
      totals.add += v['ev:add'] || 0;
      totals.lead += v['ev:lead'] || 0;
      totals.contact += v['ev:contact'] || 0;
      for (const [k2, n] of Object.entries(toObj(res[i * 3 + 1]?.result))) src[k2] = (src[k2] || 0) + n;
      for (const [k2, n] of Object.entries(toObj(res[i * 3 + 2]?.result))) pages[k2] = (pages[k2] || 0) + n;
      return { day, views: v.views || 0, sessions: v.sessions || 0 };
    });
    const sort = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);
    return { daily, totals, sources: sort(src, 12), pages: sort(pages, 15) };
  } catch {
    return empty;
  }
}

// ---------- إشعارات الجوال (Web Push) ----------
// مفاتيح VAPID تتولّد تلقائياً أول مرة وتنحفظ هنا
export async function getVapidKeys() {
  return readJSON('push:vapid', null);
}
export async function initVapidKeys(keys) {
  await cmd('SET', 'push:vapid', JSON.stringify(keys), 'NX');
  return readJSON('push:vapid', null);
}
export async function savePushSub(userId, id, sub) {
  await pipeline([
    ['HSET', `push:subs:${userId}`, id, JSON.stringify(sub)],
    ['SADD', 'push:users', userId],
  ]);
}
export async function removePushSub(userId, id) {
  await cmd('HDEL', `push:subs:${userId}`, id);
}
export async function getPushSubs(userId) {
  if (!dbReady) return {};
  try {
    const m = await hmap(`push:subs:${userId}`);
    const out = {};
    for (const [k, v] of Object.entries(m)) {
      try {
        out[k] = JSON.parse(v);
      } catch {}
    }
    return out;
  } catch {
    return {};
  }
}
export async function pushUserIds() {
  if (!dbReady) return [];
  try {
    return (await cmd('SMEMBERS', 'push:users')) || [];
  } catch {
    return [];
  }
}

// مسح كل إحصائيات البحث (بدون نتيجة وبنتيجة) — المرادفات محفوظة في الإعدادات وما تنمسح
export async function clearSearchData() {
  let cursor = '0';
  let removed = 0;
  do {
    const [next, keys] = await cmd('SCAN', cursor, 'MATCH', 'search:*', 'COUNT', 500);
    cursor = String(next);
    if (keys?.length) {
      await cmd('DEL', ...keys);
      removed += keys.length;
    }
  } while (cursor !== '0');
  return removed;
}
