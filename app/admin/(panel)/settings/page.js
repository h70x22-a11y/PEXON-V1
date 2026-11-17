import { getSettings } from '@/lib/db';
import { removeCatalogAction, saveCatalogAction, saveSettingsAction } from '@/app/actions';
import CatalogUpload from '@/components/CatalogUpload';
import Flash from '@/components/Flash';
import ImageField from '@/components/ImageField';
import { SOCIALS } from '@/components/SocialIcons';

export default async function AdminSettings({ searchParams }) {
  const sp = await searchParams;
  const s = await getSettings();

  return (
    <>
      <h1>إعدادات الموقع</h1>
      <Flash params={sp} />
      <CatalogUpload current={s.catalogUrl} onSaved={saveCatalogAction} onRemove={removeCatalogAction} />
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

        <h2>أقسام الصفحة الرئيسية</h2>
        <p className="muted">اكتب كل عنصر في سطر. القسم الفاضي لا يظهر في الموقع.</p>
        <div className="field">
          <label>قيمنا</label>
          <textarea name="values" defaultValue={s.values} maxLength={2000} placeholder="العنوان | الشرح" />
          <small>كل سطر بصيغة: العنوان | الشرح</small>
        </div>
        <div className="field">
          <label>خدمات تميزنا</label>
          <textarea name="services" defaultValue={s.services} maxLength={2000} />
        </div>
        <div className="form-grid">
          <div className="field">
            <label>العلامات التجارية</label>
            <textarea name="brands" defaultValue={s.brands} maxLength={2000} dir="auto" />
          </div>
          <div className="field">
            <label>شركاء النجاح</label>
            <textarea name="partners" defaultValue={s.partners} maxLength={2000} dir="auto" placeholder="الاسم | رابط الشعار" />
            <small>لإظهار شعار: الاسم | رابط صورة الشعار. بدون رابط يظهر الاسم نصاً.</small>
          </div>
        </div>

        <div className="field">
          <label>وسائل الدفع المقبولة</label>
          <textarea name="payments" defaultValue={s.payments} maxLength={1000} dir="auto" style={{ minHeight: 120 }} />
          <small>كل وسيلة في سطر، وتظهر في أسفل الموقع. Visa و Mastercard و Apple Pay والنقد والتحويل البنكي تظهر بأيقونتها تلقائياً. لشعار مخصص: الاسم | رابط صورة الشعار.</small>
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
        <h2>حسابات التواصل الاجتماعي</h2>
        <p className="muted">الصق رابط كل حساب. الأيقونة تظهر في أسفل الموقع للحسابات المعبأة فقط. (أيقونة واتساب تظهر من رقم الواتساب أعلاه.)</p>
        <div className="form-grid">
          {SOCIALS.map((item) => (
            <div className="field" key={item.key}>
              <label>{item.label}</label>
              <input type="text" name={item.key} defaultValue={s[item.key] || ''} maxLength={300} dir="ltr" placeholder="https://" />
            </div>
          ))}
        </div>
        <h2>النسخة الإنجليزية</h2>
        <p className="muted">تظهر لما يختار الزائر English من أعلى الموقع. أي خانة فاضية يظهر مكانها النص العربي.</p>
        <div dir="ltr" lang="en">
          <div className="form-grid">
            <div className="field">
              <label>Tagline</label>
              <input type="text" name="taglineEn" defaultValue={s.taglineEn} maxLength={160} />
            </div>
            <div className="field">
              <label>Address</label>
              <input type="text" name="addressEn" defaultValue={s.addressEn} maxLength={200} />
            </div>
          </div>
          <div className="field">
            <label>Hero title</label>
            <input type="text" name="heroTitleEn" defaultValue={s.heroTitleEn} maxLength={160} />
          </div>
          <div className="field">
            <label>Hero text</label>
            <textarea name="heroTextEn" defaultValue={s.heroTextEn} maxLength={400} style={{ minHeight: 80 }} />
          </div>
          <div className="field">
            <label>About us</label>
            <textarea name="aboutEn" defaultValue={s.aboutEn} maxLength={2000} />
          </div>
          <div className="field">
            <label>Our values (one per line: Title | Description)</label>
            <textarea name="valuesEn" defaultValue={s.valuesEn} maxLength={2000} />
          </div>
          <div className="field">
            <label>Our services (one per line)</label>
            <textarea name="servicesEn" defaultValue={s.servicesEn} maxLength={2000} />
          </div>
        </div>

        <button className="btn" type="submit">حفظ الإعدادات</button>
      </form>
    </>
  );
}
