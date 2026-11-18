import Link from 'next/link';
import { getSettings } from '@/lib/db';
import { getLang, pick, t } from '@/lib/i18n';

export async function generateMetadata() {
  return { title: t(await getLang()).privacyTitle };
}

const UPDATED = { ar: '18 نوفمبر 2026', en: '18 November 2026' };

// [[نص]] داخل الفقرة يصير رابط لنموذج طلبات البيانات
function withLinks(p) {
  return p.split(/\[\[(.+?)\]\]/).map((part, i) => (i % 2 ? <Link key={i} href="/data-request">{part}</Link> : part));
}

// مدة الاحتفاظ بصيغة مقروءة (من إعدادات لوحة التحكم)
function period(n, lang) {
  const m = Number(n) || 0;
  if (!m) return lang === 'en' ? 'until no longer needed' : 'حتى انتفاء الحاجة إليها';
  if (m % 12 === 0) {
    const y = m / 12;
    if (lang === 'en') return `${y} year${y > 1 ? 's' : ''}`;
    return y === 1 ? 'سنة' : y === 2 ? 'سنتان' : `${y} سنوات`;
  }
  return lang === 'en' ? `${m} months` : `${m} شهراً`;
}

// كل قسم: [العنوان، فقرات، جدول اختياري]
function sections(lang, s) {
  const company = (lang === 'en' ? s.legalNameEn : s.legalName) || s.siteName;
  const cr = s.crNumber;
  const vat = s.vatNumber;
  const email = s.email;
  const phone = s.phone;
  const address = pick(s, 'address', lang);

  if (lang === 'en') {
    return {
      intro: `At ${s.siteName}, your privacy matters to us. This notice explains what personal data we collect through this website, why we collect it, how we protect it, and the rights you have under the Personal Data Protection Law of the Kingdom of Saudi Arabia.`,
      list: [
        ['1. The company', [`This website is operated by ${company}${cr ? `, Unified National Number ${cr}` : ''}${vat ? `, VAT No. ${vat}` : ''}${address ? `, ${address}` : ''}. ${company} is the controller responsible for the personal data processed through this website.`]],
        ['2. Scope of this notice', [`This notice applies to ${s.siteName}'s website and all its pages, forms and services, including the contact form, quote requests and vendor registration. It does not apply to third-party websites or services linked from our website, such as WhatsApp or social media platforms, which are governed by their own policies.`]],
        ['3. Our data protection principles', ['We process personal data lawfully and transparently; we collect only what we need for a clear and specified purpose; we do not use data for purposes incompatible with the one it was collected for; we keep data accurate and up to date; we keep it only as long as necessary; and we protect it with appropriate technical and organizational measures.']],
        ['4. What we collect and why', [
          'Identification and contact data: name, mobile number, email address and company name, so we can reply to you and communicate with you.',
          'Business and request data: the products and quantities in your quote request, the product you ask about, and the content of your message, so we can prepare quotations and answer inquiries.',
          'Vendor registration data: company name, commercial registration number, business activity, and the contact person\'s name, email and mobile number, so we can review the registration and contact the vendor.',
          'Technical data: when you browse the website, our hosting provider may automatically record technical information such as IP address, browser type and visit time, for security and service operation purposes.',
          'We do not request sensitive personal data, and we do not collect payment card data through the website.',
        ]],
        ['5. How we use your data and the legal basis', [
          'We use your data to: reply to inquiries; prepare and send quotations and follow up on them; review vendor registrations and communicate with vendors; operate the website, keep it secure and prevent misuse; and comply with our legal obligations.',
          'Legal basis: your consent, which you give by ticking the consent box before submitting any form; taking steps at your request before entering into a business relationship (such as preparing a quotation); and complying with applicable laws. You may withdraw your consent at any time, without affecting processing carried out before withdrawal.',
        ]],
        ['6. Data sharing and third parties', [
          'We do not sell your personal data, and we do not share the data you enter in our forms for marketing purposes. We only share data with:',
          '• Technical service providers that operate the website on our behalf (hosting and database), bound by confidentiality and security commitments.',
          '• Meta Platforms and Google, only for website and advertising measurement data and only if you consent to it (see section 8).',
          '• Government or judicial authorities, when required by law or an official request.',
          'If you choose to send a quote request via WhatsApp, the message is handled by WhatsApp under its own privacy policy.',
        ]],
        ['7. Cross-border data transfer', ['Our website is hosted with Vercel, and its data is stored with Upstash (database) and Vercel Blob (files); their servers may be located outside the Kingdom of Saudi Arabia. Where personal data is transferred outside the Kingdom, we do so only in the cases and under the controls set out in the Personal Data Protection Law and its regulations, ensuring an adequate level of protection and limiting the transfer to what is necessary.']],
        ['8. Cookies and similar technologies', [
          'We use two types of cookies and similar technologies on this website:',
          'Necessary (always on):',
          '• A cookie that remembers your preferred language.',
          '• Browser storage (on your device only) that remembers your display preference (light/dark) and the products in your quote cart.',
          '• A login session cookie used only by authorized staff in the dashboard.',
          '• A temporary marker in your browser session that lets us count visits as aggregate numbers (number of visits, pages viewed, traffic source and device type). It does not identify you, and we do not store your IP address or any identifier with it.',
          'Measurement and advertising (only with your consent):',
          '• The Meta Pixel from Meta Platforms, which tells us which of our ads on Facebook and Instagram led to visits to the website, adding products to the quote cart, or sending a quote request, so we can show our ads to people likely to be interested. It sends Meta technical data such as the pages visited, your browser and device information, and cookie identifiers. It does not send your name, phone or email from our forms.',
          '• Google Analytics from Google, which tells us how many people visit the website, where they come from (search, social media, ads), which pages and products they view, and how many quote requests are sent. It uses cookie identifiers and technical data about your browser and device, and does not receive your name, phone or email from our forms.',
          'These tools do not run unless you choose "OK" in the notice that appears on your first visit. You can change your choice anytime from "Cookie settings" at the bottom of the site, and you can delete all cookies from your browser settings; the website will continue to work normally.',
        ]],
        ['9. Automated decisions and profiling', ['We do not make decisions based solely on automated processing of your data, and we do not use your data to build profiles of you.']],
        ['10. Your rights', [
          'Under the Personal Data Protection Law, you have the right to:',
          '• Be informed of how and why your personal data is collected and processed.',
          '• Access your personal data and obtain a copy of it in a readable format.',
          '• Request correction, completion or update of your personal data.',
          '• Request destruction of your personal data when it is no longer needed.',
          '• Withdraw your consent to processing at any time.',
          `To exercise any of these rights, email your request to ${email || 'us'} stating your name, mobile number and the type of request, or use the [[personal data request form]]. We will respond within 30 days of receiving the request, and may ask you to verify your identity. You also have the right to file a complaint with the Saudi Data & AI Authority (SDAIA).`,
        ]],
        ['11. Data retention', [
          'We keep personal data only for as long as needed for the purposes described in this notice, or as required by applicable law. When it is no longer needed, it is securely deleted or anonymized. The retention periods are:',
        ], [
          ['Record type', 'Retention period'],
          ['Inquiries and contact messages', `${period(s.retainMessages ?? 24, 'en')} from the date the inquiry is handled, then deleted automatically`],
          ['Quote requests', `${period(s.retainQuotes ?? 36, 'en')} from the last update of the request, then deleted automatically (longer if part of a contract or transaction)`],
          ['Vendor registrations', `${period(s.retainVendors ?? 36, 'en')} from registration or the last dealing, then deleted automatically`],
          ['Personal data requests', `${period(s.retainDataRequests ?? 60, 'en')} after the request is closed, as evidence of compliance`],
          ['Contracts, invoices and accounting records', 'As required by applicable laws'],
          ['Technical website records', 'As set by the hosting provider, for security and operation purposes'],
        ]],
        ['12. Data security', ['We protect your data with appropriate technical and organizational measures, including: encrypting all communication with the website (HTTPS); restricting access to submitted data to authorized staff only, by role and permission, through a dashboard protected by strong passwords with two-step verification and fingerprint/face sign-in options; logging every access and change; encrypted daily backups; automatic deletion of data once its retention period ends; and protecting the website\'s forms against misuse.']],
        ['13. Personal data breach notification', ['If a breach of personal data occurs, we will take the necessary measures to contain it and limit its impact, notify the Saudi Data & AI Authority (SDAIA) within 72 hours of becoming aware of it as required by law, and notify you without undue delay if the breach is likely to cause you harm, explaining what happened and the steps you can take.']],
        ['14. Changes to this notice', ['We may update this notice from time to time to reflect changes in our practices or legal requirements. The latest version is always published on this page with its update date, and we will highlight material changes on the website.']],
        ['15. Children', ['This website is directed at businesses and adult individuals, and is not intended for children under 18. We do not knowingly collect personal data from children; if we learn that we have, we will delete it.']],
        ['16. Contact us', [`For any question about this notice or to exercise your rights, contact the person responsible for personal data protection at ${s.siteName}${email ? ` by email at ${email}` : ''}${phone ? `, by phone at ${phone}` : ''}, or through the contact page.`]],
      ],
    };
  }

  return {
    intro: `في ${s.siteName}، خصوصيتك تهمنا. يوضح هذا الإشعار البيانات الشخصية التي نجمعها عبر هذا الموقع، وسبب جمعها، وكيف نحميها، والحقوق المكفولة لك وفق نظام حماية البيانات الشخصية في المملكة العربية السعودية.`,
    list: [
      ['١. الشركة', [`يُدار هذا الموقع من قِبل ${company}${cr ? `، الرقم الوطني الموحد ${cr}` : ''}${vat ? `، الرقم الضريبي ${vat}` : ''}${address ? `، ${address}` : ''}. وتُعد ${company} جهة التحكم المسؤولة عن البيانات الشخصية التي تُعالج عبر هذا الموقع.`]],
      ['٢. نطاق هذا الإشعار', [`ينطبق هذا الإشعار على موقع ${s.siteName} بجميع صفحاته ونماذجه وخدماته، بما فيها نموذج التواصل وطلبات عروض الأسعار وتسجيل الموردين. ولا ينطبق على مواقع أو خدمات الجهات الأخرى المرتبطة بموقعنا، مثل واتساب ومنصات التواصل الاجتماعي، والتي تخضع لسياساتها الخاصة.`]],
      ['٣. مبادئنا لحماية البيانات', ['نعالج البيانات الشخصية بشكل مشروع وشفاف، ونجمع فقط ما نحتاجه لغرض واضح ومحدد، ولا نستخدم البيانات لغرض لا يتوافق مع الغرض الذي جُمعت من أجله، ونحرص على دقتها وتحديثها، ونحتفظ بها للمدة اللازمة فقط، ونحميها بتدابير تقنية وتنظيمية مناسبة.']],
      ['٤. ما المعلومات التي نجمعها ولماذا', [
        'بيانات التعريف والتواصل: الاسم ورقم الجوال والبريد الإلكتروني واسم الشركة، للرد عليك والتواصل معك.',
        'بيانات الطلبات والأعمال: المنتجات وكمياتها في طلب عرض السعر، والمنتج المستفسر عنه، ومحتوى رسالتك، لإعداد عروض الأسعار والرد على الاستفسارات.',
        'بيانات تسجيل الموردين: اسم الشركة ورقم السجل التجاري والنشاط التجاري، واسم المسؤول وبريده الإلكتروني ورقم جواله، لمراجعة طلب التسجيل والتواصل مع المورد.',
        'البيانات التقنية: عند تصفحك للموقع قد يسجّل مزود الاستضافة تلقائياً معلومات تقنية مثل عنوان IP ونوع المتصفح ووقت الزيارة، لأغراض الأمان وتشغيل الخدمة.',
        'لا نطلب بيانات شخصية حساسة، ولا نجمع بيانات بطاقات الدفع عبر الموقع.',
      ]],
      ['٥. كيف نستخدم بياناتك والأسس النظامية', [
        'نستخدم بياناتك من أجل: الرد على الاستفسارات، وإعداد عروض الأسعار وإرسالها ومتابعتها، ومراجعة طلبات تسجيل الموردين والتواصل معهم، وتشغيل الموقع وحمايته ومنع إساءة استخدامه، والالتزام بالمتطلبات النظامية.',
        'الأساس النظامي: موافقتك التي تمنحها بتأشير خانة الموافقة قبل إرسال أي نموذج، واتخاذ إجراءات بناءً على طلبك قبل الدخول في علاقة تجارية (مثل إعداد عرض السعر)، والالتزام بالأنظمة المعمول بها. ويحق لك سحب موافقتك في أي وقت، دون أن يؤثر ذلك على المعالجة التي تمت قبل السحب.',
      ]],
      ['٦. مشاركة البيانات والأطراف الثالثة', [
        'لا نبيع بياناتك الشخصية، ولا نشارك البيانات التي تُدخلها في نماذجنا لأغراض تسويقية، ونشارك البيانات فقط مع:',
        '• مزودي الخدمات التقنية الذين يشغّلون الموقع نيابة عنا (الاستضافة وقاعدة البيانات)، وفق التزامات بالسرية والأمان.',
        '• شركتي Meta Platforms وGoogle، لبيانات قياس الموقع والإعلانات فقط وبموافقتك (انظر البند ٨).',
        '• الجهات الحكومية أو القضائية، متى ما تطلّب النظام ذلك أو بناءً على طلب رسمي.',
        'وإذا اخترت إرسال طلب عرض السعر عبر واتساب، فتتم معالجة الرسالة لدى واتساب وفق سياسة الخصوصية الخاصة به.',
      ]],
      ['٧. نقل البيانات عبر الحدود', ['يُستضاف موقعنا لدى Vercel، وتُحفظ بياناته لدى Upstash (قاعدة البيانات) وVercel Blob (الملفات)، وقد تكون خوادمهم خارج المملكة العربية السعودية. وعند نقل بيانات شخصية خارج المملكة، فإننا نلتزم بالحالات والضوابط المنصوص عليها في نظام حماية البيانات الشخصية ولوائحه، بما يضمن مستوى حماية مناسباً، ونقتصر على الحد الأدنى من البيانات اللازمة.']],
      ['٨. ملفات تعريف الارتباط والتقنيات المشابهة', [
        'نستخدم في هذا الموقع نوعين من ملفات تعريف الارتباط والتقنيات المشابهة:',
        'الضرورية (تعمل دائماً):',
        '• ملف تعريف ارتباط يحفظ لغة العرض المفضلة لديك.',
        '• تخزين في متصفحك (على جهازك فقط) يحفظ وضع العرض (فاتح/داكن) والمنتجات المضافة لسلة عرض السعر.',
        '• ملف تعريف ارتباط لجلسة الدخول، يستخدمه الموظفون المخوّلون فقط في لوحة التحكم.',
        '• علامة مؤقتة في جلسة متصفحك تتيح لنا حساب الزيارات كأرقام إجمالية (عدد الزيارات، والصفحات المشاهدة، ومصدر الزيارة، ونوع الجهاز)، ولا تحدد هويتك، ولا نحفظ معها عنوان IP أو أي معرّف.',
        'القياس والإعلانات (بموافقتك فقط):',
        '• أداة Meta Pixel من شركة Meta Platforms، وتخبرنا أي إعلاناتنا على فيسبوك وانستقرام أدّت إلى زيارة الموقع أو إضافة منتجات لسلة عرض السعر أو إرسال طلب عرض سعر، لنعرض إعلاناتنا لمن يُحتمل اهتمامهم بها. وترسل إلى Meta بيانات تقنية مثل الصفحات التي زرتها ومعلومات متصفحك وجهازك ومعرّفات ملفات تعريف الارتباط، ولا ترسل اسمك أو جوالك أو بريدك من نماذجنا.',
        '• أداة Google Analytics من شركة Google، وتخبرنا كم شخصاً زار الموقع، ومن أين جاؤوا (البحث، أو وسائل التواصل، أو الإعلانات)، وأي الصفحات والمنتجات شاهدوا، وعدد طلبات عروض الأسعار المرسلة. وتستخدم معرّفات ملفات تعريف الارتباط وبيانات تقنية عن متصفحك وجهازك، ولا تستلم اسمك أو جوالك أو بريدك من نماذجنا.',
        'لا تعمل هذه الأدوات إلا إذا اخترت "موافق" في التنبيه الذي يظهر عند أول زيارة. ويمكنك تغيير اختيارك في أي وقت من "إعدادات ملفات تعريف الارتباط" أسفل الموقع، كما يمكنك حذف ملفات تعريف الارتباط كلها من إعدادات متصفحك، وسيستمر الموقع بالعمل بشكل طبيعي.',
      ]],
      ['٩. القرارات الآلية والتصنيف', ['لا نتخذ قرارات تعتمد كلياً على المعالجة الآلية لبياناتك، ولا نستخدم بياناتك لبناء ملفات تعريفية أو تصنيفات عنك.']],
      ['١٠. حقوقك', [
        'وفق نظام حماية البيانات الشخصية، يحق لك:',
        '• العلم بكيفية جمع بياناتك الشخصية ومعالجتها والغرض من ذلك.',
        '• الوصول إلى بياناتك الشخصية والحصول على نسخة منها بصيغة مقروءة.',
        '• طلب تصحيح بياناتك الشخصية أو إكمالها أو تحديثها.',
        '• طلب إتلاف بياناتك الشخصية متى ما انتفت الحاجة إليها.',
        '• سحب موافقتك على المعالجة في أي وقت.',
        `ولممارسة أي من هذه الحقوق، أرسل طلبك إلى البريد الإلكتروني ${email || 'الموضح أدناه'} موضحاً اسمك ورقم جوالك ونوع الطلب، أو عبر [[نموذج طلبات البيانات الشخصية]]. وسنرد خلال 30 يوماً من استلام الطلب، وقد نطلب التحقق من هويتك. كما يحق لك تقديم شكوى إلى الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا).`,
      ]],
      ['١١. الاحتفاظ بالبيانات', [
        'نحتفظ بالبيانات الشخصية فقط للمدة اللازمة لتحقيق الأغراض الموضحة في هذا الإشعار، أو للمدة التي تتطلبها الأنظمة المعمول بها. وعند انتفاء الحاجة إليها، تُحذف بشكل آمن أو تُخفى هويتها. وفيما يلي مدد الاحتفاظ:',
      ], [
        ['نوع السجل', 'مدة الاحتفاظ'],
        ['الاستفسارات ورسائل التواصل', `${period(s.retainMessages ?? 24, 'ar')} من تاريخ معالجة الاستفسار، ثم تُحذف تلقائياً`],
        ['طلبات عروض الأسعار', `${period(s.retainQuotes ?? 36, 'ar')} من آخر تحديث للطلب، ثم تُحذف تلقائياً (أو أكثر إذا أصبحت جزءاً من عقد أو معاملة)`],
        ['تسجيلات الموردين', `${period(s.retainVendors ?? 36, 'ar')} من التسجيل أو آخر تعامل، ثم تُحذف تلقائياً`],
        ['طلبات البيانات الشخصية', `${period(s.retainDataRequests ?? 60, 'ar')} بعد إغلاق الطلب، لإثبات الالتزام`],
        ['العقود والفواتير والسجلات المحاسبية', 'وفق ما تتطلبه الأنظمة المعمول بها'],
        ['السجلات التقنية للموقع', 'وفق ما يحدده مزود الاستضافة لأغراض الأمان والتشغيل'],
      ]],
      ['١٢. أمن البيانات', ['نحمي بياناتك بتدابير تقنية وتنظيمية مناسبة، منها: تشفير كل الاتصال بالموقع (HTTPS)، وقصر الوصول إلى البيانات على الموظفين المخوّلين فقط وحسب صلاحياتهم، عبر لوحة تحكم محمية بكلمات مرور قوية مع التحقق بخطوتين وخيار الدخول بالبصمة أو الوجه، وتسجيل كل وصول وتعديل، ونسخ احتياطية يومية مشفّرة، والحذف التلقائي للبيانات عند انتهاء مدة الاحتفاظ بها، وحماية نماذج الموقع من إساءة الاستخدام.']],
      ['١٣. الإخطار بخرق البيانات الشخصية', ['في حال وقوع خرق للبيانات الشخصية، سنتخذ الإجراءات اللازمة لاحتوائه والحد من آثاره، ونُخطر الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا) خلال 72 ساعة من العلم به وفق ما يتطلبه النظام، ونُخطرك دون تأخير إذا كان الخرق قد يُلحق بك ضرراً، مع توضيح ما حدث والإجراءات التي يمكنك اتخاذها.']],
      ['١٤. التغييرات على هذا الإشعار', ['قد نحدّث هذا الإشعار من وقت لآخر لمواكبة التغييرات في ممارساتنا أو المتطلبات النظامية. وتُنشر النسخة المحدثة دائماً في هذه الصفحة مع تاريخ التحديث، وسننبّه إلى التغييرات الجوهرية عبر الموقع.']],
      ['١٥. الأطفال', ['هذا الموقع موجّه للمنشآت والأفراد البالغين، وليس موجهاً لمن هم دون ١٨ عاماً. ولا نجمع عن علمٍ بيانات شخصية من الأطفال، وإذا تبيّن لنا ذلك فسنحذفها.']],
      ['١٦. التواصل معنا', [`لأي استفسار حول هذا الإشعار أو لممارسة حقوقك، تواصل مع المسؤول عن حماية البيانات الشخصية في ${s.siteName}${email ? ` عبر البريد الإلكتروني ${email}` : ''}${phone ? `، أو الهاتف ${phone}` : ''}، أو من خلال صفحة تواصل معنا.`]],
    ],
  };
}

export default async function PrivacyPage() {
  const [s, lang] = await Promise.all([getSettings(), getLang()]);
  const tr = t(lang);
  const { intro, list } = sections(lang, s);
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
        <div className="container policy" style={{ maxWidth: 860 }}>
          <p className="policy-intro">{intro}</p>
          <div className="rows">
            {list.map(([title, paras, table], i) => (
              <details className="row" key={title} open={i === 0}>
                <summary>{title}</summary>
                <div className="inner">
                  {paras.map((p) => (
                    <p key={p}>{withLinks(p)}</p>
                  ))}
                  {table ? (
                    <div className="table-wrap">
                      <table className="quote-table">
                        <thead>
                          <tr>{table[0].map((h) => <th key={h}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                          {table.slice(1).map((r) => (
                            <tr key={r[0]}>{r.map((c) => <td key={c}>{c}</td>)}</tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
