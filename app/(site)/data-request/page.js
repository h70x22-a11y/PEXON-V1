import Link from 'next/link';
import { getLang, t } from '@/lib/i18n';
import { submitDataRequest } from '@/app/actions';
import Consent from '@/components/Consent';

const TXT = {
  ar: {
    title: 'طلب يخص بياناتك الشخصية',
    intro: 'وفق نظام حماية البيانات الشخصية، يحق لك الاطلاع على بياناتك لدينا، أو تصحيحها، أو طلب حذفها، أو سحب موافقتك. عبّئ النموذج وسنرد عليك خلال 30 يوماً كحد أقصى، وقد نطلب التحقق من هويتك.',
    name: 'الاسم',
    phone: 'رقم الجوال',
    email: 'البريد الإلكتروني',
    type: 'نوع الطلب',
    types: { access: 'الاطلاع على بياناتي والحصول على نسخة منها', correct: 'تصحيح بياناتي أو تحديثها', delete: 'حذف بياناتي', withdraw: 'سحب موافقتي على المعالجة' },
    details: 'التفاصيل (اختياري)',
    detailsPh: 'مثال: أرسلت طلب عرض سعر باسم شركة كذا وأبي حذف بياناتي',
    send: 'إرسال الطلب',
    ok: 'وصلنا طلبك. سنتواصل معك خلال 30 يوماً كحد أقصى.',
    consent: 'أوافق على معالجة البيانات في هذا النموذج لغرض تنفيذ طلبي وفق',
    policy: 'سياسة الخصوصية',
  },
  en: {
    title: 'Personal data request',
    intro: 'Under the Personal Data Protection Law, you have the right to access your data held by us, correct it, request its deletion, or withdraw your consent. Fill in the form and we will respond within 30 days at most; we may ask you to verify your identity.',
    name: 'Name',
    phone: 'Mobile number',
    email: 'Email',
    type: 'Request type',
    types: { access: 'Access my data and get a copy', correct: 'Correct or update my data', delete: 'Delete my data', withdraw: 'Withdraw my consent to processing' },
    details: 'Details (optional)',
    detailsPh: 'e.g. I sent a quote request for company X and want my data deleted',
    send: 'Send request',
    ok: 'We received your request and will contact you within 30 days at most.',
    consent: 'I agree to the processing of the data in this form to fulfil my request under the',
    policy: 'Privacy Policy',
  },
};

export async function generateMetadata() {
  return { title: TXT[await getLang()].title };
}

export default async function DataRequestPage({ searchParams }) {
  const lang = await getLang();
  const tr = t(lang);
  const x = TXT[lang];
  const sp = await searchParams;
  return (
    <>
      <div className="page-head">
        <div className="container">
          <div className="crumbs"><Link href="/">{tr.home}</Link> / {x.title}</div>
          <h1>{x.title}</h1>
          <p className="muted" style={{ maxWidth: 760 }}>{x.intro}</p>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container" style={{ maxWidth: 680 }}>
          {sp?.ok ? (
            <div className="flash ok">{x.ok}</div>
          ) : (
            <form action={submitDataRequest} className="panel">
              {sp?.error ? <div className="flash err">{String(sp.error)}</div> : null}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} aria-hidden="true" />
              <div className="form-grid">
                <div className="field"><label htmlFor="dr-name">{x.name}</label><input id="dr-name" name="name" required maxLength={100} /></div>
                <div className="field"><label htmlFor="dr-phone">{x.phone}</label><input id="dr-phone" name="phone" type="tel" required maxLength={30} dir="ltr" /></div>
              </div>
              <div className="field"><label htmlFor="dr-email">{x.email}</label><input id="dr-email" name="email" type="email" maxLength={120} dir="ltr" /></div>
              <div className="field">
                <label htmlFor="dr-type">{x.type}</label>
                <select id="dr-type" name="requestType" required defaultValue="access">
                  {Object.entries(x.types).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="field"><label htmlFor="dr-details">{x.details}</label><textarea id="dr-details" name="details" maxLength={1500} placeholder={x.detailsPh} /></div>
              <Consent label={x.consent} linkText={x.policy} />
              <button className="btn" type="submit">{x.send}</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
