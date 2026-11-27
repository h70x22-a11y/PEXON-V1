import Link from 'next/link';
import { getProducts } from '@/lib/db';
import { ProductCard } from '@/components/Cards';
import { getLang, t, langAlternates } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';

// صفحة تجمع كل الأفياش (عربي /sockets وإنجليزي /en/sockets)
const PATH = '/sockets';
const WIRING = ['ph-legrand-belanko-s', 'ph-legrand-mallia-senses', 'ph-legrand-arteor', 'ph-legrand-mosaic', 'ph-legrand-synergy', 'ph-legrand-antimicrobial'];
const notPlate = (p) => !/PLATE|COVER|FRAME|BLANK/i.test(p.name);

const SECTIONS = [
  { key: 'home', cat: 'ph-legrand-belanko-s', test: (p) => WIRING.includes(p.categoryId) && notPlate(p) && /SOCKET|SCOKET/i.test(p.name) && !/USB|DATA|TEL|TV|RJ|HDMI/i.test(p.name),
    ar: ['أفياش كهرباء منزلية 13 أمبير', 'الفيش البريطاني بثلاث فتحات مستطيلة، مفرد أو مجوز، مع مفتاح أو بدون، من سلاسل ليجراند (بلانكو، ماليا، أرتيور، موزايك، سينرجي).'],
    en: ['13A household sockets', 'British-style three-pin sockets, single or double, switched or unswitched, from Legrand series (Belanko, Mallia, Arteor, Mosaic, Synergy).'] },
  { key: 'usb', cat: 'ph-legrand-mallia-senses', test: (p) => WIRING.includes(p.categoryId) && notPlate(p) && /USB/i.test(p.name),
    ar: ['أفياش مع منفذ شحن USB', 'فيش كهرباء مدمج فيه منفذ شحن، أو لقمة شحن USB مستقلة، للجوال والتابلت بدون راس شاحن.'],
    en: ['Sockets with USB charging', 'Power sockets with built-in USB ports, or stand-alone USB charger modules, for phones and tablets without an adapter.'] },
  { key: 'outdoor', cat: 'ph-legrand-plexo', test: (p) => p.categoryId === 'ph-legrand-plexo' && /SOCKET|فيش/i.test(p.name),
    ar: ['أفياش خارجية مقاومة للماء', 'أفياش ليجراند بليكسو بدرجة حماية IP55 للأحواش والأسطح والمواقف والأماكن الرطبة.'],
    en: ['Outdoor weatherproof sockets', 'Legrand Plexo sockets rated IP55 for yards, roofs, car parks and damp areas.'] },
  { key: 'industrial', cat: 'ph-industrial-socket', test: (p) => p.categoryId === 'ph-industrial-socket',
    ar: ['أفياش صناعية', 'أفياش ليجراند P17 حسب مواصفة IEC 60309: الأزرق لفاز واحد 220-250 فولت، والأحمر لثلاثة فاز 380-415 فولت، من 16 إلى 125 أمبير.'],
    en: ['Industrial sockets', 'Legrand P17 sockets to IEC 60309: blue for single-phase 220-250 V and red for three-phase 380-415 V, from 16 A to 125 A.'] },
  { key: 'data', cat: 'ph-legrand-mosaic', test: (p) => WIRING.includes(p.categoryId) && notPlate(p) && /DATA|RJ45|RJ11|RJ12|TEL|TV|HDMI|CAT6/i.test(p.name),
    ar: ['أفياش داتا وتلفون وتلفزيون', 'مخارج شبكة RJ45 (CAT6 وCAT6A)، وتلفون RJ11، وتلفزيون، وHDMI.'],
    en: ['Data, telephone and TV outlets', 'RJ45 network outlets (CAT6 and CAT6A), RJ11 telephone, TV and HDMI outlets.'] },
  { key: 'floor', cat: 'ph-legrand-floor-boxs', test: (p) => p.categoryId === 'ph-legrand-floor-boxs' && /POP-UP|Desktop/i.test(p.name),
    ar: ['أفياش أرضية ومكتبية', 'علب أرضية بوب أب ومجاري ألمنيوم للطاولات، تجمع الأفياش ومخارج الداتا قريب من المستخدم.'],
    en: ['Floor and desk sockets', 'Pop-up floor boxes and aluminium desk tracks that bring power and data close to the user.'] },
];

const C = {
  ar: {
    title: 'أفياش كهرباء',
    h1: 'أفياش وفيش كهرباء في الرياض',
    seo: 'أفياش وفيش كهرباء في الرياض | فيش 13 أمبير، USB، خارجي، صناعي',
    meta: 'تشكيلة أفياش كهرباء ليجراند في الرياض: فيش 13 أمبير مفرد ومجوز، أفياش مع USB، أفياش خارجية مقاومة للماء، أفياش صناعية، ومخارج داتا وتلفون. اطلب عرض سعر مع توصيل مجاني داخل الرياض.',
    lead: 'كل أنواع الأفياش في مكان واحد: الفيش المنزلي 13 أمبير، والفيش مع منفذ شحن USB، والأفياش الخارجية والصناعية والأرضية، ومخارج الداتا والتلفون. كلها أصلية من ليجراند، مع توصيل سريع ومجاني داخل الرياض.',
    std: 'الفيش المنزلي المعتمد في السعودية هو فيش 13 أمبير بثلاث فتحات مستطيلة، لأن المواصفة السعودية SASO 2203 مبنية على المواصفة البريطانية BS 1363.',
    tipsTitle: 'كيف تختار الفيش المناسب',
    tips: [
      'الأفياش العادية في الغرف والمجالس: فيش 13 أمبير، ومجوز في الأماكن اللي فيها أجهزة كثيرة.',
      'جنب السرير والمكاتب: فيش مع منفذ USB يغنيك عن راس الشاحن.',
      'الأحواش والأسطح والمغاسل الخارجية: فيش خارجي بدرجة حماية IP55 أو أعلى.',
      'الورش ومواقع البناء والمولدات: فيش صناعي بالأمبير المناسب (أزرق لفاز واحد، أحمر لثلاثة فاز).',
      'المكيفات والسخانات ما تتوصل على فيش عادي، تحتاج مفتاح 20 أو 45 أمبير ثنائي القطب.',
    ],
    faqTitle: 'أسئلة شائعة',
    faq: [
      ['وش نوع الفيش المعتمد في السعودية؟', 'الفيش 13 أمبير بثلاث فتحات مستطيلة، حسب المواصفة السعودية SASO 2203 المبنية على المواصفة البريطانية BS 1363.'],
      ['وش الفرق بين الفيش المفرد والمجوز؟', 'المفرد فيه مخرج واحد، والمجوز فيه مخرجين في نفس الغطاء، ويحتاج علبة جدارية مجوزة.'],
      ['هل عندكم أفياش ملونة أو سوداء؟', 'إيه، سلاسل ماليا سينسز وبلانكو وأرتيور فيها أبيض وأسود، وماليا فيها شامبين ورمادي غامق، وأرتيور فيها أغطية ستانلس ستيل وقزاز.'],
      ['هل توصلون داخل الرياض؟', 'إيه، التوصيل سريع ومجاني داخل الرياض. وللمدن الثانية تواصل معنا ونرتب التوصيل.'],
    ],
    viewAll: 'عرض الكل',
    quote: 'اطلب عرض سعر',
    switches: 'مفاتيح الكهرباء',
  },
  en: {
    title: 'Electrical Sockets',
    seo: 'Electrical Sockets in Riyadh | 13A, USB, Outdoor, Industrial',
    meta: 'Legrand electrical sockets in Riyadh: 13A single and double sockets, USB sockets, weatherproof outdoor sockets, industrial sockets, and data and telephone outlets. Request a quote with free delivery within Riyadh.',
    lead: 'Every type of socket in one place: 13A household sockets, sockets with USB charging, outdoor, industrial and floor sockets, and data and telephone outlets. All genuine Legrand, with fast, free delivery within Riyadh.',
    std: 'The household socket used in Saudi Arabia is the 13A three-pin type, because the Saudi standard SASO 2203 is based on the British standard BS 1363.',
    tipsTitle: 'How to choose the right socket',
    tips: [
      'Rooms and living areas: 13A sockets, with doubles where there are many appliances.',
      'Bedsides and desks: a socket with USB ports saves a charger adapter.',
      'Yards, roofs and outdoor sinks: an outdoor socket rated IP55 or higher.',
      'Workshops, sites and generators: an industrial socket of the right rating (blue single-phase, red three-phase).',
      'Air conditioners and water heaters do not go on a normal socket; they need a 20 A or 45 A double-pole switch.',
    ],
    faqTitle: 'Frequently asked questions',
    faq: [
      ['Which socket type is used in Saudi Arabia?', 'The 13A three-pin socket, per the Saudi standard SASO 2203, which is based on the British standard BS 1363.'],
      ['What is the difference between single and double sockets?', 'A single socket has one outlet; a double has two in the same plate and needs a double back box.'],
      ['Do you have black or coloured sockets?', 'Yes. Mallia Senses, Belanko and Arteor come in white and black, Mallia also in champagne and dark grey, and Arteor has stainless steel and glass plates.'],
      ['Do you deliver in Riyadh?', 'Yes, delivery is fast and free within Riyadh. For other cities, contact us and we will arrange delivery.'],
    ],
    viewAll: 'View all',
    quote: 'Request a quote',
    switches: 'Electrical switches',
  },
};

export async function generateMetadata() {
  const lang = await getLang();
  const c = C[lang];
  return { title: { absolute: c.seo }, description: c.meta, alternates: await langAlternates(PATH) };
}

export default async function SocketsPage() {
  const [lang, products] = await Promise.all([getLang(), getProducts()]);
  const c = C[lang];
  const tr = t(lang);
  const en = lang === 'en';
  const pre = en ? '/en' : '';
  const groups = SECTIONS.map((s) => ({ ...s, items: products.filter(s.test) })).filter((g) => g.items.length);
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: c.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: tr.home, item: `${SITE_URL}${pre || '/'}` },
      { '@type': 'ListItem', position: 2, name: c.title, item: `${SITE_URL}${pre}${PATH}` },
    ] },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <div className="page-head">
        <div className="container">
          <div className="crumbs"><Link href={pre || '/'}>{tr.home}</Link> / {c.title}</div>
          <h1>{c.h1 || c.title}</h1>
          <p className="muted" style={{ maxWidth: 780, marginTop: 10, lineHeight: 1.9 }}>{c.lead}</p>
          <p className="muted" style={{ maxWidth: 780, marginTop: 6, lineHeight: 1.9 }}>{c.std}</p>
          <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
            {groups.map((g) => <a key={g.key} className="chip" href={`#${g.key}`}>{(en ? g.en : g.ar)[0]} ({g.items.length})</a>)}
          </nav>
        </div>
      </div>
      {groups.map((g) => {
        const [h, d] = en ? g.en : g.ar;
        return (
          <section className="section" key={g.key} id={g.key}>
            <div className="container">
              <div className="section-head">
                <h2>{h}</h2>
                <Link href={`${pre}/category/${g.cat}`}>{c.viewAll}</Link>
              </div>
              <p className="muted" style={{ margin: '-6px 0 18px', lineHeight: 1.8 }}>{d}</p>
              <div className="grid">
                {g.items.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} lang={lang} />)}
              </div>
            </div>
          </section>
        );
      })}
      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 12 }}>{c.tipsTitle}</h2>
          <ul style={{ lineHeight: 2, paddingInlineStart: 22 }}>{c.tips.map((x) => <li key={x}>{x}</li>)}</ul>
          <h2 style={{ fontSize: '1.5rem', margin: '30px 0 12px' }}>{c.faqTitle}</h2>
          {c.faq.map(([q, a]) => (
            <details key={q} className="panel" style={{ marginBottom: 10 }}>
              <summary style={{ fontWeight: 700, cursor: 'pointer' }}>{q}</summary>
              <p style={{ margin: '10px 0 0', lineHeight: 1.9 }}>{a}</p>
            </details>
          ))}
          <div className="panel" style={{ marginTop: 24, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <b>{c.title}</b>
            <Link className="btn" href="/quote">{c.quote}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
