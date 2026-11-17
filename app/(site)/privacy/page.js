import Link from 'next/link';
import { getSettings } from '@/lib/db';
import { getLang, pick, t } from '@/lib/i18n';

export async function generateMetadata() {
  return { title: t(await getLang()).privacyTitle };
}

const UPDATED = { ar: '18 نوفمبر 2026', en: '18 November 2026' };

function content(lang, s) {
  const company = (lang === 'en' ? s.legalNameEn : s.legalName) || s.siteName;
  const cr = s.crNumber;
  const email = s.email;
  const address = pick(s, 'address', lang);
  if (lang === 'en') {
    return [
      ['Who we are', `This website (${s.siteName}) is operated by ${company}${cr ? `, Unified National Number ${cr}` : ''}${address ? `, ${address}` : ''}. We are responsible for the personal data you submit through this website.`],
      ['Data we collect', 'We only collect the data you choose to send us through the website forms:\n• Contact form: name, mobile number, email (optional), the product you ask about, and your message.\n• Quote request via the website: name, mobile number, company name and email (optional), notes, and the products and quantities in your cart.\n• Vendor registration: company name, first and last name, email, mobile number (optional), commercial registration number, and business activity.\nWe do not collect payment card data, and we do not use advertising or tracking cookies.'],
      ['Why we use it', 'We use your data only to reply to your inquiry, prepare and send quotations, review vendor registrations, and communicate with you about them. We do not use it for any other purpose without your consent.'],
      ['Legal basis', 'We process your data based on your consent, which you give by ticking the consent box before submitting a form. You may withdraw your consent at any time by contacting us.'],
      ['Sharing your data', 'We do not sell or share your data with third parties for marketing. The website is hosted with technical service providers (website hosting and database) that store data on our behalf under security commitments; their servers may be located outside the Kingdom of Saudi Arabia. If you choose to send a quote request via WhatsApp, it is handled by WhatsApp under its own privacy policy.'],
      ['Retention', 'We keep your data only for as long as needed to handle your request and our business relationship, or as required by law, and then delete it.'],
      ['Security', 'All communication with the website is encrypted (HTTPS), and access to the submitted data is limited to authorized staff through a password-protected dashboard.'],
      ['Your rights', 'Under the Saudi Personal Data Protection Law, you have the right to be informed about how your data is processed, to access and obtain a copy of your data, to request correction of inaccurate data, to request deletion of data that is no longer needed, and to withdraw your consent. To exercise any of these rights, contact us and we will respond within the legally required period. You may also file a complaint with the Saudi Data & AI Authority (SDAIA).'],
      ['Data stored on your device', 'The website stores a few settings in your own browser only: your language and display (dark/light) preference, and the products in your quote cart. This data stays on your device and is not sent to us unless you submit a quote request.'],
      ['Contact us', `For any question or request about your personal data${email ? `, email us at ${email}` : ''}, or use the contact page.`],
      ['Changes to this policy', 'We may update this policy from time to time. The date of the latest update is shown at the top of this page.'],
    ];
  }
  return [
    ['من نحن', `يُدار هذا الموقع (${s.siteName}) من قِبل ${company}${cr ? `، الرقم الوطني الموحد ${cr}` : ''}${address ? `، ${address}` : ''}. ونحن المسؤولون عن البيانات الشخصية التي ترسلها عبر هذا الموقع.`],
    ['البيانات التي نجمعها', 'نجمع فقط البيانات التي تختار إرسالها إلينا عبر نماذج الموقع:\n• نموذج التواصل: الاسم، رقم الجوال، البريد الإلكتروني (اختياري)، المنتج المستفسر عنه، ونص الرسالة.\n• طلب عرض السعر عبر الموقع: الاسم، رقم الجوال، اسم الشركة والبريد الإلكتروني (اختياريان)، الملاحظات، والمنتجات وكمياتها في السلة.\n• تسجيل الموردين: اسم الشركة، الاسم الأول واسم العائلة، البريد الإلكتروني، رقم الجوال (اختياري)، رقم السجل التجاري، والنشاط التجاري.\nلا نجمع بيانات بطاقات الدفع، ولا نستخدم ملفات تتبّع أو إعلانات.'],
    ['الغرض من استخدامها', 'نستخدم بياناتك فقط للرد على استفسارك، وإعداد عروض الأسعار وإرسالها، ومراجعة طلبات تسجيل الموردين، والتواصل معك بخصوصها. ولا نستخدمها لأي غرض آخر بدون موافقتك.'],
    ['الأساس النظامي للمعالجة', 'نعالج بياناتك بناءً على موافقتك التي تمنحها بتأشير خانة الموافقة قبل إرسال أي نموذج. ويحق لك سحب موافقتك في أي وقت بالتواصل معنا.'],
    ['مشاركة البيانات', 'لا نبيع بياناتك ولا نشاركها مع أي جهة لأغراض تسويقية. الموقع مستضاف لدى مزودي خدمات تقنية (استضافة الموقع وقاعدة البيانات) يحفظون البيانات نيابة عنا وفق التزامات أمنية، وقد تكون خوادمهم خارج المملكة العربية السعودية. وإذا اخترت إرسال طلب عرض السعر عبر واتساب، فتتم معالجته لدى واتساب وفق سياسة الخصوصية الخاصة به.'],
    ['مدة الاحتفاظ', 'نحتفظ ببياناتك فقط المدة اللازمة لمعالجة طلبك وعلاقتنا التجارية، أو المدة التي تتطلبها الأنظمة، ثم نحذفها.'],
    ['حماية البيانات', 'كل الاتصال بالموقع مشفّر (HTTPS)، والوصول للبيانات المرسلة مقصور على الموظفين المخوّلين عبر لوحة تحكم محمية بكلمة مرور.'],
    ['حقوقك', 'وفق نظام حماية البيانات الشخصية في المملكة، يحق لك: العلم بكيفية معالجة بياناتك، والوصول إليها والحصول على نسخة منها، وطلب تصحيح البيانات غير الدقيقة، وطلب إتلاف البيانات التي لم تعد هناك حاجة إليها، وسحب موافقتك. ولممارسة أي من هذه الحقوق تواصل معنا وسنرد عليك خلال المدة النظامية. كما يحق لك تقديم شكوى للهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا).'],
    ['البيانات المحفوظة في جهازك', 'يحفظ الموقع بعض الإعدادات في متصفحك فقط: اللغة المفضلة، ووضع العرض (فاتح/داكن)، والمنتجات المضافة لسلة عرض السعر. هذه البيانات تبقى في جهازك ولا تُرسل لنا إلا إذا أرسلت طلب عرض السعر.'],
    ['التواصل معنا', `لأي استفسار أو طلب يخص بياناتك الشخصية${email ? `، راسلنا على ${email}` : ''} أو عبر صفحة تواصل معنا.`],
    ['التعديلات على هذه السياسة', 'قد نحدّث هذه السياسة من وقت لآخر، ويُوضَّح تاريخ آخر تحديث أعلى الصفحة.'],
  ];
}

export default async function PrivacyPage() {
  const [s, lang] = await Promise.all([getSettings(), getLang()]);
  const tr = t(lang);
  return (
    <>
      <div className="page-head">
        <div className="container">
          <div className="crumbs"><Link href="/">{tr.home}</Link> / {tr.privacyTitle}</div>
          <h1>{tr.privacyTitle}</h1>
          <p className="muted">{tr.lastUpdated}: {UPDATED[lang]}</p>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container policy" style={{ maxWidth: 820 }}>
          {content(lang, s).map(([title, body]) => (
            <div key={title}>
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
