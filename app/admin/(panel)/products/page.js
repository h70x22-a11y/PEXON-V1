import { getCategories, getProducts } from '@/lib/db';
import { addProduct, deleteProduct, updateProduct } from '@/app/actions';
import Flash from '@/components/Flash';
import ImageField from '@/components/ImageField';
import ConfirmButton from '@/components/ConfirmButton';

function Fields({ product, categories }) {
  return (
    <>
      <div className="form-grid">
        <div className="field">
          <label>اسم المنتج</label>
          <input type="text" name="name" defaultValue={product?.name || ''} required maxLength={140} />
        </div>
        <div className="field">
          <label>القسم</label>
          <select name="categoryId" defaultValue={product?.categoryId || ''} required>
            <option value="" disabled>اختر القسم</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-grid">
        <div className="field">
          <label>وصف مختصر</label>
          <input type="text" name="short" defaultValue={product?.short || ''} maxLength={200} />
        </div>
        <div className="field">
          <label>السعر (اختياري)</label>
          <input type="text" name="price" defaultValue={product?.price || ''} maxLength={40} placeholder="مثال: 120 ريال" />
        </div>
      </div>
      <div className="field">
        <label>الوصف الكامل</label>
        <textarea name="description" defaultValue={product?.description || ''} maxLength={4000} />
      </div>
      <ImageField current={product?.image || ''} label="صورة المنتج" />
      <div className="field">
        <label className="check">
          <input type="checkbox" name="featured" defaultChecked={Boolean(product?.featured)} />
          عرضه ضمن «منتجات مميزة» في الصفحة الرئيسية
        </label>
      </div>
    </>
  );
}

export default async function AdminProducts({ searchParams }) {
  const sp = await searchParams;
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const nameOf = (id) => categories.find((c) => c.id === id)?.name || 'بدون قسم';
  const q = String(sp?.q || '').trim();
  const cat = String(sp?.cat || '');
  const needle = q.toLowerCase();
  const filtered = products.filter(
    (p) => (!cat || p.categoryId === cat) && (!q || `${p.name} ${p.short}`.toLowerCase().includes(needle))
  );
  const LIMIT = 40;
  const shown = filtered.slice(0, LIMIT);

  return (
    <>
      <h1>المنتجات</h1>
      <Flash params={sp} />

      {categories.length ? (
        <details className="row">
          <summary>+ إضافة منتج جديد</summary>
          <div className="inner">
            <form action={addProduct}>
              <Fields categories={categories} />
              <button className="btn" type="submit">إضافة المنتج</button>
            </form>
          </div>
        </details>
      ) : (
        <div className="flash warn">أضف قسماً واحداً على الأقل قبل إضافة المنتجات.</div>
      )}

      <form className="search" method="get" action="/admin/products" style={{ marginTop: 18, marginBottom: 0, flexWrap: 'wrap' }}>
        <input type="search" name="q" defaultValue={q} placeholder="ابحث بالاسم أو رقم الصنف..." style={{ minWidth: 180 }} />
        <select name="cat" defaultValue={cat} style={{ maxWidth: 230 }}>
          <option value="">كل الأقسام</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button className="btn" type="submit">عرض</button>
      </form>
      <p className="muted" style={{ margin: '10px 0 0' }}>
        يظهر {shown.length} من {filtered.length} منتج{filtered.length > LIMIT ? '. استخدم البحث أو اختر قسماً لتضييق النتائج.' : '.'}
      </p>

      <div className="rows">
        {shown.map((p) => (
          <details className="row" key={p.id}>
            <summary>
              {p.image ? <img src={p.image} alt="" /> : null}
              {p.name}
              {p.featured ? <span className="badge">مميز</span> : null}
              <span className="meta">{nameOf(p.categoryId)} · تعديل</span>
            </summary>
            <div className="inner">
              <form action={updateProduct}>
                <input type="hidden" name="id" value={p.id} />
                <Fields product={p} categories={categories} />
                <button className="btn" type="submit">حفظ التعديلات</button>
              </form>
              <form action={deleteProduct} style={{ marginTop: 12 }}>
                <input type="hidden" name="id" value={p.id} />
                <ConfirmButton message={`حذف المنتج «${p.name}»؟`}>حذف المنتج</ConfirmButton>
              </form>
            </div>
          </details>
        ))}
        {!products.length ? <p className="muted">لا توجد منتجات بعد.</p> : null}
      </div>
    </>
  );
}
