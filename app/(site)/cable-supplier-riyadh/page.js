import Link from 'next/link';
import { getLang, t, langAlternates } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';

// صفحة هبوط: مورد كيابل كهرباء في الرياض (عربي على /cable-supplier-riyadh وإنجليزي على /en/cable-supplier-riyadh)
const PATH = '/cable-supplier-riyadh';

const C = {
  ar: {
    title: 'أسلاك وكيابل كهرباء في الرياض',
    meta: 'أسلاك وكيابل كهرباء في الرياض: سلك كهرباء NYA وTHHN، كيبل كهرباء نحاس XLPE، كيابل XLPE ومسلحة، كيابل مقاومة للحريق، كيابل داتا بلدن. توصيل سريع ومجاني داخل الرياض وعرض سعر سريع.',
    crumb: 'أسلاك وكيابل كهرباء',
    lead: 'PEXON مورد أسلاك وكيابل كهرباء في الرياض: نوفر سلك الكهرباء للمباني من 1.5 إلى 16 مم²، وكيبل الكهرباء النحاس للقوى، والكيابل المسلحة والمقاومة للحريق وكيابل الداتا والتحكم، للمقاولين والمصانع والمشاريع والمنازل في الرياض، مع توصيل سريع ومجاني داخل الرياض.',
    tableTitle: 'الكيابل اللي نوفرها',
    cols: ['النوع', 'المواصفات', 'الاستخدام'],
    rows: [
      ['أسلاك NYA (بريطاني)', '450/750 فولت، من 1.5 إلى 16 مم²، عشرة ألوان (بحرة)', 'تمديدات المباني داخل المواسير'],
      ['أسلاك THHN (أمريكي)', '600 فولت، من 16 إلى 8 AWG، لفة 152 متر (بحرة)', 'مشاريع النظام الأمريكي مع مواسير EMT'],
      ['كيبل شعري مرن', '300/500 فولت، من 2 إلى 5 أطراف، من 1.5 إلى 16 مم²', 'توصيل الأجهزة والمعدات'],
      ['كيابل قوى XLPE', 'أربع خطوط من 4×1.5 إلى 4×300 مم²، وثلاثة ونص خط من 3×10+6 إلى 3×300+150 مم²، 0.6/1 ك.ف', 'تغذية اللوحات والمباني'],
      ['كيابل مسلحة SWA وSTA', 'نحاس XLPE، 0.6/1 ك.ف', 'الدفن تحت الأرض والأماكن المعرضة للضرر'],
      ['كيابل مقاومة للحريق', 'MICA مع غلاف LSOH قليل الدخان', 'إنذار الحريق، مضخات الإطفاء، إنارة الطوارئ'],
      ['كيابل ضغط متوسط', '15 ك.ف، نحاس بشريط نحاسي، مفرد أو ثلاث خطوط', 'شبكات التوزيع والمحطات'],
      ['كيابل ألمنيوم', 'AL/XLPE/PVC بجميع المقاسات', 'التغذيات الكبيرة بتكلفة أقل'],
      ['كيبل أرضي ونحاس عاري', 'أخضر وأصفر من 10 إلى 300 مم²، ونحاس عاري', 'أنظمة التأريض ومانعات الصواعق'],
      ['كيابل داتا بلدن', 'CAT6 وCAT6A بغلاف LSZH، لفة 305 متر', 'الشبكات والمكاتب ومراكز البيانات'],
      ['كيابل إنذار وتحكم بلدن', 'إنذار حريق، تحكم 600 فولت، تلفزيون RG6، تلفون CAT3', 'أنظمة الأمان والتحكم والاتصالات'],
      ['كيابل ربل ولحام', 'شعرية مرنة مقاومة للزيت والماء', 'الغطاسات والمعدات المتحركة وماكينات اللحام'],
    ],
    whyTitle: 'ليش PEXON',
    why: [
      'علامات موثوقة: الكابلات العربية (بحرة) وبلدن وTop Cable.',
      'كميات المشاريع والطلبات الصغيرة، وبعض الكيابل تنباع بالمتر.',
      'توصيل سريع ومجاني داخل الرياض.',
      'تطلب عرض السعر أونلاين، وفريقنا يرد عليك بالأسعار والتوفر.',
    ],
    guidesTitle: 'أدلة تساعدك تختار',
    guides: [
      ['cable-size-by-ampere', 'كيف تختار مقاس السلك حسب الأمبير'],
      ['nya-vs-thhn-wire', 'الفرق بين سلك NYA وTHHN'],
      ['lszh-lsoh-cable-meaning', 'وش يعني LSZH وLSOH في الكيابل'],
    ],
    faqTitle: 'أسئلة شائعة',
    faq: [
      ['هل توصلون داخل الرياض؟', 'إيه، التوصيل سريع ومجاني داخل الرياض. وللمدن الثانية تواصل معنا ونرتب التوصيل حسب الطلب.'],
      ['هل تبيعون الكيابل بالمتر؟', 'كيابل القوى والكيبل الأرضي والنحاس العاري تنباع بالمتر، والأسلاك واللفات تنباع باللفة. اكتب الكمية اللي تحتاجها في طلب عرض السعر.'],
      ['وش العلامات التجارية المتوفرة؟', 'الكابلات العربية (بحرة) لكيابل القوى والأسلاك، وبلدن لكيابل الداتا والإنذار والتحكم، وTop Cable.'],
      ['كيف أعرف السعر؟', 'أضف المنتجات لسلة عرض السعر أو أرسل جدول الكميات من صفحة طلب عرض السعر، ونرد عليك بالأسعار والتوفر.'],
    ],
    browse: 'تصفح الكيابل',
    data: 'كيابل الداتا بلدن',
    quote: 'اطلب عرض سعر',
  },
  en: {
    title: 'Electrical Cable Supplier in Riyadh',
    meta: 'Electrical cable supplier in Riyadh: NYA and THHN building wires, XLPE and armoured power cables, fire-resistant cables and Belden data cables. Fast, free delivery within Riyadh and quick quotations.',
    crumb: 'Cable supplier in Riyadh',
    lead: 'PEXON supplies power cables, building wires, armoured, fire-resistant, data and control cables to contractors, factories, projects and homes in Riyadh, with fast, free delivery within Riyadh.',
    tableTitle: 'Cables we supply',
    cols: ['Type', 'Specification', 'Typical use'],
    rows: [
      ['NYA building wire (British)', '450/750 V, 1.5 to 16 mm², ten colours (Bahra)', 'Building wiring in conduit'],
      ['THHN wire (American)', '600 V, 16 to 8 AWG, 152 m coils (Bahra)', 'American-standard projects with EMT conduit'],
      ['Flexible cable', '300/500 V, 2 to 5 cores, 1.5 to 16 mm²', 'Appliances and equipment connections'],
      ['XLPE power cables', '4-core 4×1.5 to 4×300 mm², 3.5-core 3×10+6 to 3×300+150 mm², 0.6/1 kV', 'Feeders for panels and buildings'],
      ['Armoured SWA and STA cables', 'Copper XLPE, 0.6/1 kV', 'Direct burial and exposed locations'],
      ['Fire-resistant cables', 'MICA with low-smoke LSOH sheath', 'Fire alarm, fire pumps, emergency lighting'],
      ['Medium-voltage cables', '15 kV, copper tape screen, single or three core', 'Distribution networks and substations'],
      ['Aluminium cables', 'AL/XLPE/PVC, all sizes', 'Large feeders at lower cost'],
      ['Earth and bare copper', 'Green/yellow 10 to 300 mm², bare copper', 'Earthing and lightning protection'],
      ['Belden data cables', 'CAT6 and CAT6A with LSZH jacket, 305 m reels', 'Networks, offices and data centres'],
      ['Belden alarm and control cables', 'Fire alarm, 600 V control, RG6 TV, CAT3 telephone', 'Safety, control and communication systems'],
      ['Rubber and welding cables', 'Highly flexible, oil and water resistant', 'Submersible pumps, mobile equipment, welding'],
    ],
    whyTitle: 'Why PEXON',
    why: [
      'Trusted brands: Arab Cables (Bahra), Belden and Top Cable.',
      'Project quantities and small orders, with some cables sold by the metre.',
      'Fast, free delivery within Riyadh.',
      'Request a quote online and our team replies with pricing and availability.',
    ],
    guidesTitle: 'Guides to help you choose',
    guides: [
      ['cable-size-by-ampere', 'How to choose wire size by amperage'],
      ['nya-vs-thhn-wire', 'NYA vs THHN wire'],
      ['lszh-lsoh-cable-meaning', 'What LSZH and LSOH mean on a cable'],
    ],
    faqTitle: 'Frequently asked questions',
    faq: [
      ['Do you deliver in Riyadh?', 'Yes, delivery is fast and free within Riyadh. For other cities, contact us and we will arrange delivery per order.'],
      ['Do you sell cable by the metre?', 'Power cables, earth cable and bare copper are sold by the metre; building wires are sold by the coil. Add the quantity you need to your quote request.'],
      ['Which brands do you carry?', 'Arab Cables (Bahra) for power cables and wires, Belden for data, alarm and control cables, and Top Cable.'],
      ['How do I get a price?', 'Add products to your quote cart or send your bill of quantities from the quote page, and we will reply with pricing and availability.'],
    ],
    browse: 'Browse cables',
    data: 'Belden data cables',
    quote: 'Request a quote',
  },
};

export async function generateMetadata() {
  const lang = await getLang();
  const c = C[lang];
  const url = lang === 'en' ? `/en${PATH}` : PATH;
  return {
    title: c.title,
    description: c.meta,
    alternates: await langAlternates(PATH),
    openGraph: { title: `${c.title} | PEXON`, description: c.meta, url: `${SITE_URL}${url}`, locale: lang === 'en' ? 'en_US' : 'ar_SA' },
  };
}

export default async function CableSupplierPage() {
  const lang = await getLang();
  const c = C[lang];
  const tr = t(lang);
  const en = lang === 'en';
  const pre = en ? '/en' : '';
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: c.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: tr.home, item: `${SITE_URL}${pre || '/'}` },
        { '@type': 'ListItem', position: 2, name: c.crumb, item: `${SITE_URL}${pre}${PATH}` },
      ],
    },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <div className="page-head">
        <div className="container">
          <div className="crumbs"><Link href={pre || '/'}>{tr.home}</Link> / {c.crumb}</div>
          <h1>{c.title}</h1>
          <p className="muted" style={{ maxWidth: 760, marginTop: 10, lineHeight: 1.9 }}>{c.lead}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
            <Link className="btn" href="/quote">{c.quote}</Link>
            <Link className="btn ghost" href={`${pre}/category/ph-cables-wires`}>{c.browse}</Link>
            <Link className="btn ghost" href={`${pre}/category/ph-belden-1`}>{c.data}</Link>
          </div>
        </div>
      </div>
      <section className="section">
        <div className="container" style={{ maxWidth: 980 }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: 14 }}>{c.tableTitle}</h2>
          <div className="table-wrap">
            <table className="art-table">
              <thead><tr>{c.cols.map((x) => <th key={x}>{x}</th>)}</tr></thead>
              <tbody>{c.rows.map((r) => <tr key={r[0]}>{r.map((x, i) => <td key={i}>{i === 0 ? <b>{x}</b> : x}</td>)}</tr>)}</tbody>
            </table>
          </div>

          <h2 style={{ fontSize: '1.5rem', margin: '34px 0 12px' }}>{c.whyTitle}</h2>
          <ul style={{ lineHeight: 2, paddingInlineStart: 22 }}>{c.why.map((x) => <li key={x}>{x}</li>)}</ul>

          <h2 style={{ fontSize: '1.5rem', margin: '34px 0 12px' }}>{c.guidesTitle}</h2>
          <ul style={{ lineHeight: 2, paddingInlineStart: 22 }}>
            {c.guides.map(([slug, label]) => <li key={slug}><Link href={`${pre}/blog/${slug}`}>{label}</Link></li>)}
          </ul>

          <h2 style={{ fontSize: '1.5rem', margin: '34px 0 12px' }}>{c.faqTitle}</h2>
          {c.faq.map(([q, a]) => (
            <details key={q} className="panel" style={{ marginBottom: 10 }}>
              <summary style={{ fontWeight: 700, cursor: 'pointer' }}>{q}</summary>
              <p style={{ margin: '10px 0 0', lineHeight: 1.9 }}>{a}</p>
            </details>
          ))}

          <div className="panel" style={{ marginTop: 28, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <b>{c.title}</b>
            <Link className="btn" href="/quote">{c.quote}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
