// أنشطة الموردين في نموذج التسجيل
export const VENDOR_ACTIVITIES = [
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
  { key: 'other', ar: 'أخرى', en: 'Other' },
];

export const activityLabel = (key, lang = 'ar') => VENDOR_ACTIVITIES.find((a) => a.key === key)?.[lang] || key;
