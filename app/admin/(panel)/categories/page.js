import { getCategories, getProducts } from '@/lib/db';
import { addCategory, deleteCategory, updateCategory } from '@/app/actions';
import Flash from '@/components/Flash';
import ImageField from '@/components/ImageField';
import ConfirmButton from '@/components/ConfirmButton';

function Fields({ category }) {
  return (
    <>
      <div className="field">
        <label>اسم القسم</label>
        <input type="text" name="name" defaultValue={category?.name || ''} required maxLength={100} />
      </div>
      <div className="field">
        <label>وصف مختصر</label>
        <textarea name="description" defaultValue={category?.description || ''} maxLength={400} style={{ minHeight: 70 }} />
      </div>
      <ImageField current={category?.image || ''} label="صورة القسم" />
    </>
  );
}

export default async function AdminCategories({ searchParams }) {
  const sp = await searchParams;
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <>
      <h1>الأقسام</h1>
      <Flash params={sp} />

      <details className="row">
        <summary>+ إضافة قسم جديد</summary>
        <div className="inner">
          <form action={addCategory}>
            <Fields />
            <button className="btn" type="submit">إضافة القسم</button>
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
                <span className="meta">{count} منتج · تعديل</span>
              </summary>
              <div className="inner">
                <form action={updateCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <Fields category={c} />
                  <button className="btn" type="submit">حفظ التعديلات</button>
                </form>
                <form action={deleteCategory} style={{ marginTop: 12 }}>
                  <input type="hidden" name="id" value={c.id} />
                  <ConfirmButton message={`حذف قسم «${c.name}»؟`}>حذف القسم</ConfirmButton>
                </form>
              </div>
            </details>
          );
        })}
        {!categories.length ? <p className="muted">لا توجد أقسام بعد.</p> : null}
      </div>
    </>
  );
}
