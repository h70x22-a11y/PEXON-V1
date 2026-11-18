// روابط التتبع لكل منصة: powercore.sa/go/<key>
export const TRACK_LINKS = [
  { key: 'instagram', label: 'انستقرام', where: 'رابط البايو في انستقرام' },
  { key: 'tiktok', label: 'تيك توك', where: 'رابط البايو في تيك توك' },
  { key: 'x', label: 'إكس (تويتر)', where: 'رابط الموقع في حساب إكس' },
  { key: 'facebook', label: 'فيسبوك', where: 'رابط الموقع في صفحة فيسبوك' },
  { key: 'snapchat', label: 'سناب شات', where: 'رابط الموقع في سناب شات' },
  { key: 'linkedin', label: 'لينكدإن', where: 'رابط الموقع في صفحة لينكدإن' },
  { key: 'youtube', label: 'يوتيوب', where: 'وصف القناة والفيديوهات' },
  { key: 'whatsapp', label: 'واتساب', where: 'رسائل الواتساب وحالة الواتساب للأعمال' },
  { key: 'maps', label: 'قوقل ماب', where: 'ملف النشاط التجاري في قوقل ماب' },
  { key: 'email', label: 'البريد الإلكتروني', where: 'توقيع الإيميل والرسائل' },
  { key: 'qr', label: 'رمز QR والمطبوعات', where: 'الكروت والكتالوج المطبوع واللوحات' },
];
export const TRACK_KEYS = new Set(TRACK_LINKS.map((l) => l.key));
