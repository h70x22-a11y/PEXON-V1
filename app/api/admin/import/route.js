import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/auth';
import { getCategories, getProducts, saveCategories, saveProducts } from '@/lib/db';

export const maxDuration = 60;

// استيراد منتجات على دفعات (للمدير فقط). الصور تُنسخ إلى Vercel Blob.
const ALLOWED_IMAGE_HOSTS = new Set(['images.cdn-files-a.com', 'files.cdn-files-a.com']);
const str = (v, max) => String(v ?? '').trim().slice(0, max);

async function copyImage(url) {
  let u;
  try {
    u = new URL(url);
  } catch {
    return '';
  }
  if (u.protocol !== 'https:' || !ALLOWED_IMAGE_HOSTS.has(u.hostname)) return '';
  if (!process.env.BLOB_READ_WRITE_TOKEN) return u.href;
  try {
    const res = await fetch(u.href, { cache: 'no-store' });
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !type.startsWith('image/')) return u.href;
    const name = (u.pathname.split('/').pop() || `img-${Date.now()}`).replace(/[^a-zA-Z0-9._-]/g, '');
    const { put } = await import('@vercel/blob');
    const blob = await put(`products/${name}`, Buffer.from(await res.arrayBuffer()), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: type,
    });
    return blob.url;
  } catch {
    return u.href;
  }
}

export async function POST(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }

  try {
    const categories = await getCategories();
    for (const c of (body.categories || []).slice(0, 100)) {
      const id = str(c.id, 60);
      if (!id || categories.some((x) => x.id === id)) continue;
      categories.push({ id, name: str(c.name, 100), description: str(c.description, 400), image: '' });
    }

    const incoming = (body.products || []).slice(0, 20);
    const images = await Promise.all(incoming.map((p) => copyImage(p.image)));
    const products = await getProducts();
    let copied = 0;
    incoming.forEach((p, i) => {
      const id = str(p.id, 60);
      const name = str(p.name, 140);
      if (!id || !name) return;
      const item = {
        id,
        categoryId: str(p.categoryId, 60),
        name,
        short: str(p.short, 200),
        description: str(p.description, 4000),
        price: str(p.price, 40),
        brand: str(p.brand, 80),
        image: images[i],
        featured: false,
      };
      if (item.image && !item.image.includes('cdn-files-a.com')) copied++;
      const index = products.findIndex((x) => x.id === id);
      if (index >= 0) products[index] = item;
      else products.push(item);
      const cat = categories.find((c) => c.id === item.categoryId);
      if (cat && !cat.image && item.image) cat.image = item.image;
    });

    await saveProducts(products);
    await saveCategories(categories);
    revalidatePath('/', 'layout');
    return NextResponse.json({ ok: true, received: incoming.length, copied, total: products.length });
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 });
  }
}
