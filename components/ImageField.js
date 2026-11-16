export default function ImageField({ current = '', label = 'الصورة' }) {
  return (
    <div className="field">
      <label>{label}</label>
      {current ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <img src={current} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
          <label className="check" style={{ margin: 0 }}>
            <input type="checkbox" name="removeImage" /> حذف الصورة الحالية
          </label>
        </div>
      ) : null}
      <input type="file" name="imageFile" accept="image/*" />
      <div style={{ marginTop: 8 }}>
        <input type="text" name="imageUrl" placeholder="أو الصق رابط صورة https://..." dir="ltr" />
      </div>
      <small>حجم الصورة المرفوعة لا يتجاوز 4 ميجا.</small>
    </div>
  );
}
