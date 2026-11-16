import { getSettings } from '@/lib/db';
import { saveSettingsAction } from '@/app/actions';
import Flash from '@/components/Flash';
import ImageField from '@/components/ImageField';

export default async function AdminSettings({ searchParams }) {
  const sp = await searchParams;
  const s = await getSettings();

  return (
    <>
      <h1>إعدادات الموقع</h1>
      <Flash params={sp} />
      <form action={saveSettingsAction} className="panel">
        <h2>الهوية</h2>
        <div className="form-grid">
          <div className="field">
            <label>اسم الموقع</label>
            <input type="text" name="siteName" defaultValue={s.siteName} required maxLength={80} />
          </div>
          <div className="field">
            <label>الشعار النصي</label>
            <input type="text" name="tagline" defaultValue={s.tagline} maxLength={160} />
          </div>
          <div className="field">
            <label>اللون الأساسي</label>
            <input type="color" name="primaryColor" defaultValue={s.primaryColor} style={{ width: 80, height: 44, padding: 2 }} />
          </div>
        </div>
        <ImageField current={s.logo} label="الشعار (Logo)" />

        <h2>الصفحة الرئيسية</h2>
        <div className="field">
          <label>العنوان الرئيسي</label>
          <input type="text" name="heroTitle" defaultValue={s.heroTitle} maxLength={160} />
        </div>
        <div className="field">
          <label>النص تحت العنوان</label>
          <textarea name="heroText" defaultValue={s.heroText} maxLength={400} style={{ minHeight: 80 }} />
        </div>
        <div className="field">
          <label>من نحن</label>
          <textarea name="about" defaultValue={s.about} maxLength={2000} />
        </div>

        <h2>بيانات التواصل</h2>
        <div className="form-grid">
          <div className="field">
            <label>الهاتف</label>
            <input type="text" name="phone" defaultValue={s.phone} maxLength={30} dir="ltr" />
          </div>
          <div className="field">
            <label>واتساب</label>
            <input type="text" name="whatsapp" defaultValue={s.whatsapp} maxLength={30} dir="ltr" placeholder="9665xxxxxxxx" />
            <small>بالصيغة الدولية بدون + أو أصفار.</small>
          </div>
          <div className="field">
            <label>البريد الإلكتروني</label>
            <input type="email" name="email" defaultValue={s.email} maxLength={120} dir="ltr" />
          </div>
          <div className="field">
            <label>العنوان</label>
            <input type="text" name="address" defaultValue={s.address} maxLength={200} />
          </div>
        </div>
        <button className="btn" type="submit">حفظ الإعدادات</button>
      </form>
    </>
  );
}
