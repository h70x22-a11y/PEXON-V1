// مفاتيح الدول لحقل الجوال (السعودية أولاً وهي الافتراضية)
const LIST = [
  ['SA', '966', 'السعودية', 'Saudi Arabia'],
  ['AE', '971', 'الإمارات', 'UAE'],
  ['KW', '965', 'الكويت', 'Kuwait'],
  ['QA', '974', 'قطر', 'Qatar'],
  ['BH', '973', 'البحرين', 'Bahrain'],
  ['OM', '968', 'عُمان', 'Oman'],
  ['EG', '20', 'مصر', 'Egypt'],
  ['JO', '962', 'الأردن', 'Jordan'],
  ['LB', '961', 'لبنان', 'Lebanon'],
  ['IQ', '964', 'العراق', 'Iraq'],
  ['SY', '963', 'سوريا', 'Syria'],
  ['YE', '967', 'اليمن', 'Yemen'],
  ['PS', '970', 'فلسطين', 'Palestine'],
  ['SD', '249', 'السودان', 'Sudan'],
  ['MA', '212', 'المغرب', 'Morocco'],
  ['DZ', '213', 'الجزائر', 'Algeria'],
  ['TN', '216', 'تونس', 'Tunisia'],
  ['LY', '218', 'ليبيا', 'Libya'],
  ['TR', '90', 'تركيا', 'Türkiye'],
  ['IN', '91', 'الهند', 'India'],
  ['PK', '92', 'باكستان', 'Pakistan'],
  ['BD', '880', 'بنغلاديش', 'Bangladesh'],
  ['CN', '86', 'الصين', 'China'],
  ['US', '1', 'أمريكا / كندا', 'USA / Canada'],
  ['GB', '44', 'بريطانيا', 'United Kingdom'],
  ['DE', '49', 'ألمانيا', 'Germany'],
  ['FR', '33', 'فرنسا', 'France'],
  ['IT', '39', 'إيطاليا', 'Italy'],
  ['ES', '34', 'إسبانيا', 'Spain'],
];

const flag = (iso) => String.fromCodePoint(...[...iso].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

export const COUNTRIES = LIST.map(([iso, code, ar, en]) => ({ iso, code, ar, en, flag: flag(iso) }));
export const DEFAULT_COUNTRY = 'SA';
export const findCountry = (iso) => COUNTRIES.find((c) => c.iso === iso);
