import { getCategories, getProducts } from '@/lib/db';
import { requirePerm } from '@/lib/auth';
import { addCategory, deleteCategory, updateCategory } from '@/app/actions';
import Flash from '@/components/Flash';
import ImageField from '@/components/ImageField';
import ConfirmButton from '@/components/ConfirmButton';
import { adminT } from '@/lib/adminLang';

function Fields({ t, category }) {
  return (
    <>
      <div className="field">
        <label>{t('اسم القسم')}</label>
        <input type="text" name="name" defaultValue={category?.name || ''} required maxLength={100} />
      </div>
      <div className="field">
        <label>{t('وصف مختصر')}</label>
        <textarea name="description" defaultValue={category?.description || ''} maxLength={400} style={{ minHeight: 70 }} />
      </div>
      <ImageField current={category?.image || ''} label={t('صورة القسم')} />
    </>
  );
}

export default async function AdminCategories({ searchParams }) {
  const { t, lang, locale, dir } = await adminT();
  await requirePerm('categories');
  const sp = await searchParams;
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <>
      <h1>{t('الأقسام')}</h1>
      <Flash params={sp} />

      <details className="row">
        <summary>{t('+ إضافة قسم جديد')}</summary>
        <div className="inner">
          <form action={addCategory}>
            <Fields t={t} />
            <button className="btn" type="submit">{t('إضافة القسم')}</button>
          </form>
        </div>
      </details>

      <div className="rows">
        {categories.map((c) => {
          const count = products.filter((p) => p.categoryId === c.id).length;
          return (
            <details className="row" key={c.id}>
              <summary>
                {c.image ? <img src={c.image} alt="" /> : null}
                {c.name}
                <span className="meta">{count} {t('منتج · تعديل')}</span>
              </summary>
              <div className="inner">
                <form action={updateCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <Fields t={t} category={c} />
                  <button className="btn" type="submit">{t('حفظ التعديلات')}</button>
                </form>
                <form action={deleteCategory} style={{ marginTop: 12 }}>
                  <input type="hidden" name="id" value={c.id} />
                  <ConfirmButton message={t('حذف قسم «{name}»؟', { name: c.name })}>{t('حذف القسم')}</ConfirmButton>
                </form>
              </div>
            </details>
          );
        })}
        {!categories.length ? <p className="muted">{t('لا توجد أقسام بعد.')}</p> : null}
      </div>
    </>
  );
}
