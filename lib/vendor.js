// أنشطة الموردين في نموذج التسجيل، مقسمة على مجموعات
const ELECTRICAL = [
  { key: 'cables', ar: 'كابلات وأسلاك كهربائية', en: 'Electrical Cables & Wires' },
  { key: 'wiring', ar: 'مفاتيح وأفياش وملحقاتها', en: 'Switches, Sockets & Wiring Devices' },
  { key: 'breakers', ar: 'قواطع ولوحات توزيع', en: 'Breakers & Distribution Boards' },
  { key: 'lighting', ar: 'إنارة', en: 'Lighting' },
  { key: 'conduits', ar: 'مواسير ومجاري كابلات وملحقاتها', en: 'Conduits, Trunking & Accessories' },
  { key: 'earthing', ar: 'أنظمة التأريض والحماية من الصواعق', en: 'Earthing & Lightning Protection' },
  { key: 'low-current', ar: 'التيار الخفيف والشبكات', en: 'Low Current & Networking' },
  { key: 'solar', ar: 'الطاقة الشمسية', en: 'Solar Energy' },
  { key: 'industrial', ar: 'تحكم وأتمتة ومعدات صناعية', en: 'Control, Automation & Industrial Equipment' },
  { key: 'tools', ar: 'عدد وأجهزة قياس', en: 'Tools & Testing Equipment' },
  { key: 'logistics', ar: 'نقل وخدمات لوجستية', en: 'Transport & Logistics' },
];

const GENERAL = [
  ['General Contracting & Construction', 'المقاولات العامة والإنشاءات'],
  ['Specialized Contractors (MEP, Utilities & Finishes)', 'المقاولات المتخصصة (الكهروميكانيكية، المرافق والتشطيبات)'],
  ['Landscaping & Site Development', 'تنسيق المواقع وتطويرها'],
  ['Buildings & Facilities Operations & Maintenance (O&M)', 'تشغيل وصيانة المباني والمرافق'],
  ['Facilities Management & Soft Services', 'إدارة المرافق والخدمات المساندة'],
  ['IT Hardware Supply (Computers, Servers, Network Devices)', 'توريد الأجهزة التقنية (حواسيب، خوادم، أجهزة شبكات)'],
  ['Software & Systems Supply (ERP, CRM, HR, Cloud Solutions)', 'توريد البرمجيات والأنظمة (ERP، CRM، الموارد البشرية، الحلول السحابية)'],
  ['IT Consulting, Support & Cybersecurity Services', 'الاستشارات التقنية والدعم الفني والأمن السيبراني'],
  ['Manpower Supply & Recruitment Agencies', 'توريد العمالة ومكاتب الاستقدام'],
  ['Training & Development Providers', 'مقدمو خدمات التدريب والتطوير'],
  ['Management & Strategy Consulting', 'الاستشارات الإدارية والاستراتيجية'],
  ['Financial & Accounting Advisory & Feasibility Studies', 'الاستشارات المالية والمحاسبية ودراسات الجدوى'],
  ['Legal Advisory & Law Firms', 'الاستشارات القانونية ومكاتب المحاماة'],
  ['Engineering Consultancy (Design, Supervision & Project Management)', 'الاستشارات الهندسية (التصميم، الإشراف، إدارة المشاريع)'],
  ['Local Content, Sustainability, Quality & Governance Consulting', 'استشارات المحتوى المحلي والاستدامة والجودة والحوكمة'],
  ['Marketing, Advertising & Content Agencies', 'وكالات التسويق والإعلان وصناعة المحتوى'],
  ['Event & Exhibition Management', 'إدارة الفعاليات والمعارض'],
  ['Printing, Promotional Gifts & Branding Materials', 'الطباعة والهدايا الترويجية ومواد الهوية'],
  ['Office, Hospitality & Exhibition Furniture Supply', 'توريد أثاث المكاتب والضيافة والمعارض'],
  ['Office Equipment & Light Tools Supply', 'توريد المعدات المكتبية والأدوات الخفيفة'],
  ['Consumables Supply (Stationery, Cleaning & Pantry Items)', 'توريد المستهلكات (قرطاسية، مواد نظافة، مستلزمات ضيافة)'],
  ['Building & Finishing Materials Supply', 'توريد مواد البناء والتشطيبات'],
  ['Banks & Financial Services', 'البنوك والخدمات المالية'],
  ['Insurance Companies & Insurance Brokers', 'شركات التأمين ووسطاء التأمين'],
  ['Land Transport, Logistics & Warehousing', 'النقل البري والخدمات اللوجستية والتخزين'],
  ['Freight Forwarding, Customs Clearance & Cargo Handling', 'الشحن والتخليص الجمركي ومناولة البضائع'],
  ['Hotels & Serviced Apartments (Corporate Agreements)', 'الفنادق والشقق المخدومة (اتفاقيات الشركات)'],
  ['Travel Agencies, Ticketing & Conference Bookings', 'وكالات السفر والتذاكر وحجوزات المؤتمرات'],
  ['Security Guarding Services', 'خدمات الحراسات الأمنية'],
  ['Firefighting & Safety Systems & PPE Supply', 'أنظمة مكافحة الحريق والسلامة ومعدات الوقاية الشخصية'],
  ['Medical Equipment & Supplies', 'المعدات والمستلزمات الطبية'],
  ['Medical Services, Diagnostics & Employee Medical Programs', 'الخدمات الطبية والتشخيص وبرامج الرعاية الصحية للموظفين'],
  ['Asset & Real Estate Valuation Services', 'خدمات تقييم الأصول والعقارات'],
  ['Internal Audit, Risk Management & Compliance Consulting', 'استشارات المراجعة الداخلية وإدارة المخاطر والالتزام'],
  ['Project Management Consultancy (PMC)', 'استشارات إدارة المشاريع (PMC)'],
  ['Investment Advisory, Asset & Portfolio Management', 'الاستشارات الاستثمارية وإدارة الأصول والمحافظ'],
  ['Investment Banking & Transaction Advisory', 'المصرفية الاستثمارية واستشارات الصفقات'],
  ['Event Concept Design & Activation', 'تصميم مفاهيم الفعاليات وتفعيلها'],
].map(([en, ar]) => ({
  key: en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  ar,
  en,
}));

export const VENDOR_GROUPS = [
  { ar: 'الكهرباء والطاقة', en: 'Electrical & Energy', items: ELECTRICAL },
  { ar: 'أنشطة أخرى', en: 'Other Business Activities', items: GENERAL },
];

const OTHER = { key: 'other', ar: 'أخرى', en: 'Other' };

export const VENDOR_ACTIVITIES = [...ELECTRICAL, ...GENERAL, OTHER];
export const VENDOR_OTHER = OTHER;

export const activityLabel = (key, lang = 'ar') => VENDOR_ACTIVITIES.find((a) => a.key === key)?.[lang] || key;
