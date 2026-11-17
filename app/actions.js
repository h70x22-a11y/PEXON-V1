'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';
import { checkPassword, requireAdmin, sessionToken } from '@/lib/auth';
import { VENDOR_ACTIVITIES } from '@/lib/vendor';
import { DEFAULT_COUNTRY, findCountry } from '@/lib/countries';
import { QUOTE_STATUSES } from '@/lib/quotes';
import {
  addMessage,
  deleteMessage,
  getMessage,
  nextQuoteNumber,
  saveMessage,
  getCategories,
  getProducts,
  getSettings,
  saveCategories,
  saveProducts,
  saveSettings,
} from '@/lib/db';

// رابط يبدأ بـ http/https فقط، وإلا يُتجاهل
const link = (formData, key) => {
  const value = String(formData.get(key) || '').trim().slice(0, 300);
  if (!value) return '';
  const full = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const u = new URL(full);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : '';
  } catch {
    return '';
  }
};

const text = (formData, key, max = 500) => String(formData.get(key) || '').trim().slice(0, max);

// ينفذ العملية ثم يرجع للصفحة برسالة نجاح أو خطأ
async function run(path, fn) {
  await requireAdmin();
  let error = '';
  try {
    await fn();
  } catch (e) {
    error = e?.message || 'حدث خطأ غير متوقع';
  }
  revalidatePath('/', 'layout');
  redirect(error ? `${path}?error=${encodeURIComponent(error)}` : `${path}?ok=1`);
}

async function uploadImage(file) {
  if (!file || typeof file === 'string' || file.size === 0) return null;
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('رفع الصور يحتاج ربط Vercel Blob. اربطه من Storage أو استخدم رابط صورة.');
  }
  if (!file.type.startsWith('image/')) throw new Error('الملف المرفوع ليس صورة.');
  const ext = (file.name.split('.').pop() || 'jpg').replace(/[^a-zA-Z0-9]/g, '').slice(0, 5) || 'jpg';
  const { put } = await import('@vercel/blob');
  const blob = await put(`images/img-${Date.now()}.${ext}`, file, {
    access: 'public',
    addRandomSuffix: true,
  });
  return blob.url;
}

// صورة جديدة مرفوعة > رابط مكتوب > الصورة السابقة
async function resolveImage(formData, previous = '') {
  const uploaded = await uploadImage(formData.get('imageFile'));
  if (uploaded) return uploaded;
  const url = text(formData, 'imageUrl', 1000);
  if (formData.get('removeImage')) return '';
  return url || previous;
}

// ---------- الدخول ----------
export async function login(formData) {
  const password = String(formData.get('password') || '');
  await new Promise((r) => setTimeout(r, 600));
  if (!checkPassword(password)) redirect('/admin/login?error=1');
  const store = await cookies();
  store.set('admin', sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect('/admin');
}

export async function logout() {
  const store = await cookies();
  store.delete('admin');
  redirect('/admin/login');
}

// ---------- الإعدادات ----------
export async function saveSettingsAction(formData) {
  await run('/admin/settings', async () => {
    const current = await getSettings();
    const color = text(formData, 'primaryColor', 7);
    await saveSettings({
      ...current,
      siteName: text(formData, 'siteName', 80) || current.siteName,
      tagline: text(formData, 'tagline', 160),
      heroTitle: text(formData, 'heroTitle', 160),
      heroText: text(formData, 'heroText', 400),
      about: text(formData, 'about', 2000),
      phone: text(formData, 'phone', 30),
      whatsapp: text(formData, 'whatsapp', 30).replace(/[^0-9]/g, ''),
      email: text(formData, 'email', 120),
      address: text(formData, 'address', 200),
      primaryColor: /^#[0-9a-fA-F]{6}$/.test(color) ? color : current.primaryColor,
      logo: await resolveImage(formData, current.logo),
      instagram: link(formData, 'instagram'),
      x: link(formData, 'x'),
      tiktok: link(formData, 'tiktok'),
      snapchat: link(formData, 'snapchat'),
      facebook: link(formData, 'facebook'),
      youtube: link(formData, 'youtube'),
      linkedin: link(formData, 'linkedin'),
      telegram: link(formData, 'telegram'),
      values: text(formData, 'values', 2000),
      services: text(formData, 'services', 2000),
      brands: text(formData, 'brands', 2000),
      partners: text(formData, 'partners', 2000),
      payments: text(formData, 'payments', 1000),
      taglineEn: text(formData, 'taglineEn', 160),
      heroTitleEn: text(formData, 'heroTitleEn', 160),
      heroTextEn: text(formData, 'heroTextEn', 400),
      aboutEn: text(formData, 'aboutEn', 2000),
      valuesEn: text(formData, 'valuesEn', 2000),
      servicesEn: text(formData, 'servicesEn', 2000),
      addressEn: text(formData, 'addressEn', 200),
      legalName: text(formData, 'legalName', 150),
      legalNameEn: text(formData, 'legalNameEn', 150),
      crNumber: text(formData, 'crNumber', 20).replace(/[^0-9]/g, ''),
      vatNumber: text(formData, 'vatNumber', 20).replace(/[^0-9]/g, ''),
      googleVerification: text(formData, 'googleVerification', 200).replace(/^.*content=["']?([^"'\s>]+).*$/i, '$1').replace(/[^A-Za-z0-9_\-]/g, ''),
    });
  });
}

// ---------- الكتالوج ----------
// يحفظ رابط الكتالوج بعد رفعه من المتصفح (الرابط لازم يكون من تخزين Vercel Blob)
export async function saveCatalogAction(url) {
  await requireAdmin();
  let u;
  try {
    u = new URL(String(url));
  } catch {
    return { error: 'رابط غير صالح.' };
  }
  if (u.protocol !== 'https:' || !u.hostname.endsWith('.public.blob.vercel-storage.com') || !u.pathname.toLowerCase().endsWith('.pdf')) {
    return { error: 'رابط غير صالح.' };
  }
  const current = await getSettings();
  await saveSettings({ ...current, catalogUrl: u.href });
  revalidatePath('/', 'layout');
  return { ok: true };
}

export async function removeCatalogAction() {
  await requireAdmin();
  const current = await getSettings();
  await saveSettings({ ...current, catalogUrl: '' });
  revalidatePath('/', 'layout');
  return { ok: true };
}

// ---------- الأقسام ----------
export async function addCategory(formData) {
  await run('/admin/categories', async () => {
    const name = text(formData, 'name', 100);
    if (!name) throw new Error('اسم القسم مطلوب.');
    const list = await getCategories();
    list.push({
      id: randomUUID(),
      name,
      description: text(formData, 'description', 400),
      image: await resolveImage(formData),
    });
    await saveCategories(list);
  });
}

export async function updateCategory(formData) {
  await run('/admin/categories', async () => {
    const id = text(formData, 'id', 60);
    const name = text(formData, 'name', 100);
    if (!name) throw new Error('اسم القسم مطلوب.');
    const list = await getCategories();
    const item = list.find((c) => c.id === id);
    if (!item) throw new Error('القسم غير موجود.');
    item.name = name;
    item.description = text(formData, 'description', 400);
    item.image = await resolveImage(formData, item.image);
    await saveCategories(list);
  });
}

export async function deleteCategory(formData) {
  await run('/admin/categories', async () => {
    const id = text(formData, 'id', 60);
    const products = await getProducts();
    if (products.some((p) => p.categoryId === id)) {
      throw new Error('لا يمكن حذف قسم فيه منتجات. احذف منتجاته أو انقلها أولاً.');
    }
    const list = await getCategories();
    await saveCategories(list.filter((c) => c.id !== id));
  });
}

// ---------- المنتجات ----------
function productFields(formData) {
  return {
    name: text(formData, 'name', 140),
    categoryId: text(formData, 'categoryId', 60),
    short: text(formData, 'short', 200),
    description: text(formData, 'description', 4000),
    price: text(formData, 'price', 40),
    brand: text(formData, 'brand', 80),
    featured: Boolean(formData.get('featured')),
  };
}

export async function addProduct(formData) {
  await run('/admin/products', async () => {
    const fields = productFields(formData);
    if (!fields.name) throw new Error('اسم المنتج مطلوب.');
    if (!fields.categoryId) throw new Error('اختر قسماً للمنتج.');
    const list = await getProducts();
    list.unshift({ id: randomUUID(), ...fields, image: await resolveImage(formData) });
    await saveProducts(list);
  });
}

export async function updateProduct(formData) {
  await run('/admin/products', async () => {
    const id = text(formData, 'id', 60);
    const fields = productFields(formData);
    if (!fields.name) throw new Error('اسم المنتج مطلوب.');
    const list = await getProducts();
    const item = list.find((p) => p.id === id);
    if (!item) throw new Error('المنتج غير موجود.');
    Object.assign(item, fields, { image: await resolveImage(formData, item.image) });
    await saveProducts(list);
  });
}

export async function deleteProduct(formData) {
  await run('/admin/products', async () => {
    const id = text(formData, 'id', 60);
    const list = await getProducts();
    await saveProducts(list.filter((p) => p.id !== id));
  });
}

// ---------- الرسائل ----------
// ---------- إدارة طلبات عروض الأسعار ----------
export async function updateQuoteStatus(formData) {
  const id = text(formData, 'id', 60);
  await run(`/admin/quotes/${id}`, async () => {
    const quote = await getMessage(id);
    if (!quote || quote.type !== 'quote') throw new Error('الطلب غير موجود.');
    const status = text(formData, 'status', 20);
    if (!QUOTE_STATUSES.some((st) => st.key === status)) throw new Error('حالة غير صحيحة.');
    quote.status = status;
    quote.statusNote = text(formData, 'statusNote', 1000);
    quote.updated = new Date().toISOString();
    if (!quote.number) quote.number = await nextQuoteNumber();
    await saveMessage(quote);
  });
}

export async function deleteQuoteAction(formData) {
  await run('/admin/quotes', async () => {
    await deleteMessage(text(formData, 'id', 60));
  });
}

export async function deleteVendorAction(formData) {
  await run('/admin/vendors', async () => {
    await deleteMessage(text(formData, 'id', 60));
  });
}

export async function deleteMessageAction(formData) {
  await run('/admin/messages', async () => {
    await deleteMessage(text(formData, 'id', 60));
  });
}

// طلب عرض سعر لعدة منتجات (من سلة الموقع)
export async function submitQuote(input) {
  const data = input && typeof input === 'object' ? input : {};
  if (data.website) return { ok: true };
  const clean = (v, max) => String(v ?? '').trim().slice(0, max);
  const name = clean(data.name, 100);
  const phone = clean(data.phone, 30);
  if (data.consent !== true) return { error: 'consent' };
  if (!name || !phone) return { error: 'missing' };
  const products = await getProducts();
  const byId = new Map(products.map((p) => [p.id, p]));
  const items = (Array.isArray(data.items) ? data.items : [])
    .slice(0, 300)
    .map((i) => {
      const p = byId.get(String(i?.id || ''));
      const qty = Math.max(1, Math.min(100000, Math.floor(Number(i?.qty) || 1)));
      return p ? { id: p.id, name: p.name, short: p.short || '', qty } : null;
    })
    .filter(Boolean);
  if (!items.length) return { error: 'empty' };
  try {
    let number = '';
    try {
      number = await nextQuoteNumber();
    } catch {}
    await addMessage({
      id: randomUUID(),
      type: 'quote',
      number,
      status: 'new',
      source: 'website',
      name,
      phone,
      email: clean(data.email, 120),
      company: clean(data.company, 120),
      message: clean(data.notes, 2000),
      items,
      date: new Date().toISOString(),
    });
  } catch {
    return { error: 'failed' };
  }
  return { ok: true };
}

// يدمج مفتاح الدولة مع رقم الجوال: +966 5XXXXXXXX
function vendorPhone(formData) {
  const digits = text(formData, 'phone', 20).replace(/[^0-9]/g, '').replace(/^0+/, '');
  if (!digits) return '';
  const country = findCountry(text(formData, 'phoneCountry', 4)) || findCountry(DEFAULT_COUNTRY);
  return `+${country.code} ${digits}`;
}

// نموذج تسجيل الموردين
export async function submitVendor(formData) {
  if (formData.get('website_hp')) redirect('/vendor-registration?ok=1');
  const company = text(formData, 'company', 150);
  const firstName = text(formData, 'firstName', 60);
  const lastName = text(formData, 'lastName', 60);
  const email = text(formData, 'email', 120);
  const cr = text(formData, 'cr', 30);
  const activity = text(formData, 'activity', 40);
  let ok = Boolean(
    formData.get('consent') === 'yes' &&
    company && firstName && lastName && cr && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      VENDOR_ACTIVITIES.some((a) => a.key === activity)
  );
  if (ok) {
    try {
      await addMessage({
        id: randomUUID(),
        type: 'vendor',
        name: `${firstName} ${lastName}`,
        phone: vendorPhone(formData),
        email,
        company,
        vendor: { cr, activity },
        message: '',
        date: new Date().toISOString(),
      });
    } catch {
      ok = false;
    }
  }
  redirect(ok ? '/vendor-registration?ok=1' : '/vendor-registration?error=1');
}

// نموذج "تواصل معنا" العام
export async function sendMessage(formData) {
  // حقل مخفي لصد الروبوتات
  if (formData.get('website')) redirect('/contact?ok=1');
  const name = text(formData, 'name', 100);
  const phone = text(formData, 'phone', 30);
  const body = text(formData, 'message', 2000);
  let error = '';
  if (formData.get('consent') !== 'yes') {
    error = 'فضلاً وافق على سياسة الخصوصية قبل الإرسال.';
  } else if (!name || !phone || !body) {
    error = 'فضلاً عبّئ الاسم ورقم الجوال والرسالة.';
  } else {
    try {
      await addMessage({
        id: randomUUID(),
        name,
        phone,
        email: text(formData, 'email', 120),
        product: text(formData, 'product', 140),
        message: body,
        date: new Date().toISOString(),
      });
    } catch {
      error = 'تعذر إرسال الرسالة حالياً. حاول لاحقاً.';
    }
  }
  redirect(error ? `/contact?error=${encodeURIComponent(error)}` : '/contact?ok=1');
}
