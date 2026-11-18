import { getSettings } from '@/lib/db';
import { can, requirePerm } from '@/lib/auth';
import { removeCatalogAction, saveCatalogAction, saveSettingsAction } from '@/app/actions';
import CatalogUpload from '@/components/CatalogUpload';
import Flash from '@/components/Flash';
import ImageField from '@/components/ImageField';
import { SOCIALS } from '@/components/SocialIcons';
import { adminT } from '@/lib/adminLang';

export default async function AdminSettings({ searchParams }) {
  const { t, lang, locale, dir } = await adminT();
  const session = await requirePerm('settings');
  const canW = can(session, 'settings:write');
  const canD = can(session, 'settings:delete');
  const sp = await searchParams;
  const s = await getSettings();

  return (
    <>
      <h1>{t('إعدادات الموقع')}</h1>
      <Flash params={sp} />
      {canW ? <CatalogUpload current={s.catalogUrl} onSaved={saveCatalogAction} onRemove={removeCatalogAction} /> : null}
      <form action={saveSettingsAction} className="panel">
        <h2>{t('الهوية')}</h2>
        <div className="form-grid">
          <div className="field">
            <label>{t('اسم الموقع')}</label>
            <input type="text" name="siteName" defaultValue={s.siteName} required maxLength={80} />
          </div>
          <div className="field">
            <label>{t('الشعار النصي')}</label>
            <input type="text" name="tagline" defaultValue={s.tagline} maxLength={160} />
          </div>
          <div className="field">
            <label>{t('اللون الأساسي')}</label>
            <input type="color" name="primaryColor" defaultValue={s.primaryColor} style={{ width: 80, height: 44, padding: 2 }} />
          </div>
        </div>
        <ImageField current={s.logo} label={t('الشعار (Logo)')} />

        <h2>{t('الصفحة الرئيسية')}</h2>
        <div className="field">
          <label>{t('العنوان الرئيسي')}</label>
          <input type="text" name="heroTitle" defaultValue={s.heroTitle} maxLength={160} />
        </div>
        <div className="field">
          <label>{t('النص تحت العنوان')}</label>
          <textarea name="heroText" defaultValue={s.heroText} maxLength={400} style={{ minHeight: 80 }} />
        </div>
        <div className="field">
          <label>{t('من نحن')}</label>
          <textarea name="about" defaultValue={s.about} maxLength={2000} />
        </div>

        <h2>{t('أقسام الصفحة الرئيسية')}</h2>
        <p className="muted">{t('اكتب كل عنصر في سطر. القسم الفاضي لا يظهر في الموقع.')}</p>
        <div className="field">
          <label>{t('قيمنا')}</label>
          <textarea name="values" defaultValue={s.values} maxLength={2000} placeholder={t('العنوان | الشرح')} />
          <small>{t('كل سطر بصيغة: العنوان | الشرح')}</small>
        </div>
        <div className="field">
          <label>{t('خدمات تميزنا')}</label>
          <textarea name="services" defaultValue={s.services} maxLength={2000} />
        </div>
        <div className="form-grid">
          <div className="field">
            <label>{t('العلامات التجارية')}</label>
            <textarea name="brands" defaultValue={s.brands} maxLength={2000} dir="auto" />
          </div>
          <div className="field">
            <label>{t('شركاء النجاح')}</label>
            <textarea name="partners" defaultValue={s.partners} maxLength={2000} dir="auto" placeholder={t('الاسم | رابط الشعار')} />
            <small>{t('لإظهار شعار: الاسم | رابط صورة الشعار. بدون رابط يظهر الاسم نصاً.')}</small>
          </div>
        </div>

        <div className="field">
          <label>{t('وسائل الدفع المقبولة')}</label>
          <textarea name="payments" defaultValue={s.payments} maxLength={1000} dir="auto" style={{ minHeight: 120 }} />
          <small>{t('كل وسيلة في سطر، وتظهر في أسفل الموقع. Visa و Mastercard و Apple Pay والنقد والتحويل البنكي تظهر بأيقونتها تلقائياً. لشعار مخصص: الاسم | رابط صورة الشعار.')}</small>
        </div>

        <h2>{t('البيانات النظامية')}</h2>
        <p className="muted">{t('تظهر أسفل الموقع وفي سياسة الخصوصية.')}</p>
        <div className="form-grid">
          <div className="field">
            <label>{t('الاسم النظامي للشركة')}</label>
            <input type="text" name="legalName" defaultValue={s.legalName} maxLength={150} />
          </div>
          <div className="field">
            <label>{t('الاسم النظامي بالإنجليزي')}</label>
            <input type="text" name="legalNameEn" defaultValue={s.legalNameEn} maxLength={150} dir="ltr" />
          </div>
          <div className="field">
            <label>{t('الرقم الوطني الموحد (السجل التجاري)')}</label>
            <input type="text" name="crNumber" defaultValue={s.crNumber} maxLength={20} dir="ltr" inputMode="numeric" />
          </div>
          <div className="field">
            <label>{t('الرقم الضريبي')}</label>
            <input type="text" name="vatNumber" defaultValue={s.vatNumber} maxLength={20} dir="ltr" inputMode="numeric" />
          </div>
        </div>

        <h2>{t('مدة الاحتفاظ بالبيانات')}</h2>
        <p className="muted">{t('البيانات اللي تتعدى المدة تنحذف تلقائياً كل ليلة بعد النسخة الاحتياطية، وتظهر في سياسة الخصوصية. اكتب 0 لإيقاف الحذف التلقائي.')}</p>
        <div className="form-grid">
          <div className="field">
            <label>{t('رسائل التواصل (بالأشهر)')}</label>
            <input type="number" name="retainMessages" defaultValue={s.retainMessages ?? 24} min={0} max={120} />
          </div>
          <div className="field">
            <label>{t('طلبات عروض الأسعار (بالأشهر)')}</label>
            <input type="number" name="retainQuotes" defaultValue={s.retainQuotes ?? 36} min={0} max={120} />
          </div>
          <div className="field">
            <label>{t('تسجيلات الموردين (بالأشهر)')}</label>
            <input type="number" name="retainVendors" defaultValue={s.retainVendors ?? 36} min={0} max={120} />
          </div>
          <div className="field">
            <label>{t('طلبات البيانات الشخصية المغلقة (بالأشهر)')}</label>
            <input type="number" name="retainDataRequests" defaultValue={s.retainDataRequests ?? 60} min={0} max={120} />
          </div>
        </div>

        <h2>{t('محركات البحث')}</h2>
        <div className="field">
          <label>{t('رمز التحقق من Google Search Console')}</label>
          <input type="text" name="googleVerification" defaultValue={s.googleVerification} maxLength={200} dir="ltr" placeholder='google-site-verification' />
          <small>{t('من Search Console اختر طريقة "HTML tag" والصق الوسم كامل أو قيمة content فقط.')}</small>
        </div>
        <div className="field">
          <label>{t('رمز التحقق من النطاق في Meta (فيسبوك وانستقرام)')}</label>
          <input type="text" name="metaVerification" defaultValue={s.metaVerification} maxLength={300} dir="ltr" placeholder='facebook-domain-verification' />
          <small>{t('من Meta Business: الإعدادات ← النطاقات ← طريقة meta-tag. الصق الوسم كامل أو قيمة content فقط.')}</small>
        </div>
        <div className="field">
          <label>{t('معرّف Meta Pixel')}</label>
          <input type="text" name="metaPixelId" defaultValue={s.metaPixelId} maxLength={30} dir="ltr" inputMode="numeric" />
          <small>{t('يقيس زيارات الموقع والإضافة للسلة وطلبات عروض الأسعار لإعلانات فيسبوك وانستقرام. ما يشتغل إلا لما يوافق الزائر على ملفات تعريف الارتباط. اتركه فاضي لإيقافه.')}</small>
        </div>

        <h2>{t('بيانات التواصل')}</h2>
        <div className="form-grid">
          <div className="field">
            <label>{t('الهاتف')}</label>
            <input type="text" name="phone" defaultValue={s.phone} maxLength={30} dir="ltr" />
          </div>
          <div className="field">
            <label>{t('واتساب')}</label>
            <input type="text" name="whatsapp" defaultValue={s.whatsapp} maxLength={30} dir="ltr" placeholder="9665xxxxxxxx" />
            <small>{t('بالصيغة الدولية بدون + أو أصفار.')}</small>
          </div>
          <div className="field">
            <label>{t('البريد الإلكتروني')}</label>
            <input type="email" name="email" defaultValue={s.email} maxLength={120} dir="ltr" />
          </div>
          <div className="field">
            <label>{t('العنوان')}</label>
            <input type="text" name="address" defaultValue={s.address} maxLength={200} />
          </div>
        </div>
        <h2>{t('حسابات التواصل الاجتماعي')}</h2>
        <p className="muted">{t('الصق رابط كل حساب. الأيقونة تظهر في أسفل الموقع للحسابات المعبأة فقط. (أيقونة واتساب تظهر من رقم الواتساب أعلاه.)')}</p>
        <div className="form-grid">
          {SOCIALS.map((item) => (
            <div className="field" key={item.key}>
              <label>{item.label}</label>
              <input type="text" name={item.key} defaultValue={s[item.key] || ''} maxLength={300} dir="ltr" placeholder="https://" />
            </div>
          ))}
        </div>
        <h2>{t('النسخة الإنجليزية')}</h2>
        <p className="muted">{t('تظهر لما يختار الزائر English من أعلى الموقع. أي خانة فاضية يظهر مكانها النص العربي.')}</p>
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

        {canW ? <button className="btn" type="submit">{t('حفظ الإعدادات')}</button> : null}
      </form>
    </>
  );
}
