import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { can, clientIp, getSession } from '@/lib/auth';
import { getCategories, getProducts, logActivity, saveCategories, saveProducts } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// تعديل جماعي لبيانات المنتجات والأقسام (تحسين الظهور في البحث) — لمن عنده صلاحية الكتابة
const P_FIELDS = { name: 140, nameAr: 140, brand: 80, short: 200, description: 4000, keywords: 300 };
const C_FIELDS = { name: 100, description: 1200 };
const clean = (v, max) => String(v ?? '').replace(/\s+\n/g, '\n').trim().slice(0, max);

export async function GET() {
  const s = await getSession();
  if (!can(s, 'products:read')) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return NextResponse.json({
    products: products.map((p) => ({ id: p.id, categoryId: p.categoryId, name: p.name, nameAr: p.nameAr || '', brand: p.brand || '', short: p.short || '', description: p.description || '', keywords: p.keywords || '' })),
    categories: categories.map((c) => ({ id: c.id, name: c.name, description: c.description || '' })),
  });
}

export async function POST(request) {
  const s = await getSession();
  if (!s || s.mustChange) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }
  const pUpd = Array.isArray(body.products) ? body.products.slice(0, 800) : [];
  const cUpd = Array.isArray(body.categories) ? body.categories.slice(0, 100) : [];
  if (pUpd.length && !can(s, 'products:write')) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (cUpd.length && !can(s, 'categories:write')) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let pCount = 0;
  let cCount = 0;
  if (pUpd.length) {
    const list = await getProducts();
    const byId = new Map(list.map((p) => [p.id, p]));
    for (const u of pUpd) {
      const item = byId.get(String(u?.id || ''));
      if (!item) continue;
      let changed = false;
      for (const [k, max] of Object.entries(P_FIELDS)) {
        if (u[k] === undefined) continue;
        const v = clean(u[k], max);
        if (k === 'name' && !v) continue;
        if ((item[k] || '') !== v) {
          item[k] = v;
          changed = true;
        }
      }
      if (changed) pCount++;
    }
    if (pCount) await saveProducts(list);
  }
  if (cUpd.length) {
    const list = await getCategories();
    for (const u of cUpd) {
      const item = list.find((c) => c.id === String(u?.id || ''));
      if (!item) continue;
      let changed = false;
      for (const [k, max] of Object.entries(C_FIELDS)) {
        if (u[k] === undefined) continue;
        const v = clean(u[k], max);
        if (k === 'name' && !v) continue;
        if ((item[k] || '') !== v) {
          item[k] = v;
          changed = true;
        }
      }
      if (changed) cCount++;
    }
    if (cCount) await saveCategories(list);
  }
  if (pCount || cCount) {
    await logActivity({ userId: s.id, name: s.name, section: 'products', action: 'update', what: `تعديل جماعي لتحسين البحث: ${pCount} منتج، ${cCount} قسم${body.note ? ` (${clean(body.note, 80)})` : ''}`, ip: await clientIp() });
    revalidatePath('/', 'layout');
  }
  return NextResponse.json({ ok: true, products: pCount, categories: cCount });
}
