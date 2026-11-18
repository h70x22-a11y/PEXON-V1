import { getCategories, getProducts, getSettings } from '@/lib/db';
import { can, requirePerm } from '@/lib/auth';
import { addProduct, deleteProduct, updateProduct } from '@/app/actions';
import Flash from '@/components/Flash';
import ImageField from '@/components/ImageField';
import ConfirmButton from '@/components/ConfirmButton';
import { arabicName, brandOf, parseSynonyms, searchProducts } from '@/lib/catalog';
import { UNITS } from '@/lib/quotes';
import { adminT } from '@/lib/adminLang';

function Fields({ t, product, categories }) {
  return (
    <>
      <div className="form-grid">
        <div className="field">
          <label>{t('اسم المنتج')}</label>
          <input type="text" name="name" defaultValue={product?.name || ''} required maxLength={140} />
        </div>
        <div className="field">
          <label>{t('الاسم بالعربي')}</label>
          <input type="text" name="nameAr" defaultValue={product ? arabicName(product) : ''} maxLength={140} placeholder={t('يظهر للزوار في النسخة العربية')} />
        </div>
        <div className="field">
          <label>{t('القسم')}</label>
          <select name="categoryId" defaultValue={product?.categoryId || ''} required>
            <option value="" disabled>{t('اختر القسم')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-grid">
        <div className="field">
          <label>{t('وصف مختصر')}</label>
          <input type="text" name="short" defaultValue={product?.short || ''} maxLength={200} />
        </div>
        <div className="field">
          <label>{t('العلامة التجارية')}</label>
          <input type="text" name="brand" defaultValue={product ? brandOf(product) : ''} maxLength={80} dir="auto" placeholder={t('مثال: Legrand')} />
        </div>
        <div className="field">
          <label>{t('الوحدة')}</label>
          <input type="text" name="unit" list="units" defaultValue={product?.unit || 'حبة'} maxLength={20} />
          <datalist id="units">{UNITS.map((u) => <option key={u} value={u} />)}</datalist>
        </div>
        <div className="field">
          <label>{t('السعر (اختياري)')}</label>
          <input type="text" name="price" defaultValue={product?.price || ''} maxLength={40} placeholder={t('مثال: 120 ريال')} />
        </div>
      </div>
      <div className="field">
        <label>{t('الوصف الكامل')}</label>
        <textarea name="description" defaultValue={product?.description || ''} maxLength={4000} />
      </div>
      <div className="field">
        <label>{t('كلمات البحث (اختياري)')}</label>
        <input type="text" name="keywords" defaultValue={product?.keywords || ''} maxLength={300} dir="auto" placeholder={t('كلمات يكتبها العميل وما هي في اسم المنتج، مثال: كيبل، كيابل، سلك تمديد')} />
      </div>
      <ImageField current={product?.image || ''} label={t('صورة المنتج')} />
      <div className="field">
        <label className="check">
          <input type="checkbox" name="featured" defaultChecked={Boolean(product?.featured)} />
          {t('عرضه ضمن «منتجات مميزة» في الصفحة الرئيسية')}
        </label>
      </div>
    </>
  );
}

export default async function AdminProducts({ searchParams }) {
  const { t, lang, locale, dir } = await adminT();
  const session = await requirePerm('products');
  const canW = can(session, 'products:write');
  const canD = can(session, 'products:delete');
  const sp = await searchParams;
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const nameOf = (id) => categories.find((c) => c.id === id)?.name || t('بدون قسم');
  const q = String(sp?.q || '').trim();
  const cat = String(sp?.cat || '');
  const filtered = (q ? searchProducts(products, q, categories, parseSynonyms((await getSettings()).searchSynonyms)) : products).filter((p) => !cat || p.categoryId === cat);
  const LIMIT = 40;
  const shown = filtered.slice(0, LIMIT);

  return (
    <>
      <h1>{t('المنتجات')}</h1>
      <Flash params={sp} />

      {!canW ? null : categories.length ? (
        <details className="row">
          <summary>{t('+ إضافة منتج جديد')}</summary>
          <div className="inner">
            <form action={addProduct}>
              <Fields t={t} categories={categories} />
              <button className="btn" type="submit">{t('إضافة المنتج')}</button>
            </form>
          </div>
        </details>
      ) : (
        <div className="flash warn">{t('أضف قسماً واحداً على الأقل قبل إضافة المنتجات.')}</div>
      )}

      <form className="search" method="get" action="/admin/products" style={{ marginTop: 18, marginBottom: 0, flexWrap: 'wrap' }}>
        <input type="search" name="q" defaultValue={q} placeholder={t('ابحث بالاسم أو رقم الصنف...')} style={{ minWidth: 180 }} />
        <select name="cat" defaultValue={cat} style={{ maxWidth: 230 }}>
          <option value="">{t('كل الأقسام')}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button className="btn" type="submit">{t('عرض')}</button>
      </form>
      <p className="muted" style={{ margin: '10px 0 0' }}>
        {t('يظهر')} {shown.length} {t('من')} {filtered.length} {t('منتج')}{filtered.length > LIMIT ? t('. استخدم البحث أو اختر قسماً لتضييق النتائج.') : '.'}
      </p>

      <div className="rows">
        {shown.map((p) => (
          <details className="row" key={p.id}>
            <summary>
              {p.image ? <img src={p.image} alt="" /> : null}
              {p.name}
              {p.featured ? <span className="badge">{t('مميز')}</span> : null}
              <span className="meta">{nameOf(p.categoryId)} {t('· تعديل')}</span>
            </summary>
            <div className="inner">
              <form action={updateProduct}>
                <input type="hidden" name="id" value={p.id} />
                <Fields t={t} product={p} categories={categories} />
                {canW ? <button className="btn" type="submit">{t('حفظ التعديلات')}</button> : null}
              </form>
              {canD ? (
              <form action={deleteProduct} style={{ marginTop: 12 }}>
                <input type="hidden" name="id" value={p.id} />
                <ConfirmButton message={t('حذف المنتج «{name}»؟', { name: p.name })}>{t('حذف المنتج')}</ConfirmButton>
              </form>
              ) : null}
            </div>
          </details>
        ))}
        {!products.length ? <p className="muted">{t('لا توجد منتجات بعد.')}</p> : null}
      </div>
    </>
  );
}
