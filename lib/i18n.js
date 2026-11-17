import { cookies } from 'next/headers';

export async function getLang() {
  const store = await cookies();
  return store.get('lang')?.value === 'en' ? 'en' : 'ar';
}

const AR = /[؀-ۿ]/;

// حقل الإعدادات حسب اللغة: النسخة الإنجليزية (xxxEn) إن وجدت، وإلا العربية
export function pick(settings, key, lang) {
  if (lang === 'en' && String(settings[`${key}En`] || '').trim()) return settings[`${key}En`];
  return settings[key];
}

// الوصف المختصر: "رقم الصنف" تصير SKU بالإنجليزي، و"ريال" تصير SAR
export function productShort(product, lang) {
  const text = String(product.short || '');
  return lang === 'en' ? text.replace(/رقم الصنف/g, 'SKU') : text;
}

export function productPrice(product, lang) {
  const text = String(product.price || '');
  return lang === 'en' ? text.replace(/ريال/g, 'SAR') : text;
}

// الوصف ثنائي اللغة: بالإنجليزي تظهر الأسطر الإنجليزية فقط (إن وُجدت)
export function productDescription(product, lang) {
  const text = String(product.description || '');
  if (lang !== 'en') return text;
  const lines = text.split('\n').filter((l) => l.trim() && !AR.test(l));
  return lines.length ? lines.join('\n') : text;
}

const dict = {
  ar: {
    home: 'الرئيسية',
    allProducts: 'جميع المنتجات',
    about: 'من نحن',
    contact: 'تواصل معنا',
    links: 'روابط',
    contactInfo: 'التواصل',
    catalog: 'تحميل كتالوج المنتجات (PDF)',
    rights: 'جميع الحقوق محفوظة.',
    payments: 'وسائل الدفع',
    menuOpen: 'فتح القائمة',
    menuClose: 'إغلاق القائمة',
    toDark: 'التبديل إلى الوضع الداكن',
    toLight: 'التبديل إلى الوضع الفاتح',
    dark: 'الوضع الداكن',
    light: 'الوضع الفاتح',
    browse: 'تصفح المنتجات',
    quote: 'اطلب عرض سعر',
    categories: 'أقسام المنتجات',
    allCategories: (n) => `عرض كل الأقسام (${n})`,
    featured: 'منتجات مميزة',
    services: 'خدمات تميزنا',
    brands: 'العلامات التجارية',
    values: 'قيمنا',
    partners: 'شركاء النجاح',
    productsCount: (n) => `${n} منتج`,
    details: 'التفاصيل',
    arrow: '←',
    productsIntro: 'ابحث باسم المنتج أو رقم الصنف، أو تصفح حسب التصنيف أو العلامة التجارية.',
    search: 'بحث',
    searchPh: 'اسم المنتج أو رقم الصنف...',
    category: 'التصنيف',
    allCats: 'كل التصنيفات',
    brand: 'العلامة التجارية',
    allBrands: 'كل العلامات',
    showResults: 'عرض النتائج',
    results: (n) => `النتائج (${n})`,
    clear: 'مسح الفلاتر',
    firstN: (n) => `يظهر أول ${n} منتج. ضيّق البحث باختيار تصنيف أو علامة تجارية.`,
    noMatch: 'لا توجد منتجات مطابقة. جرّب تغيير الفلاتر.',
    byBrand: 'تصفح حسب العلامة التجارية',
    viewAll: (n) => `عرض الكل (${n})`,
    emptyCategory: 'لا توجد منتجات في هذا القسم حالياً.',
    noImage: 'لا توجد صورة',
    orderWhatsapp: 'اطلب عبر واتساب',
    waMessage: (name) => `السلام عليكم، أرغب بالاستفسار عن: ${name}`,
    contactIntro: 'اترك رسالتك وسنرد عليك في أقرب وقت.',
    sent: 'وصلتنا رسالتك، شكراً لك. سنتواصل معك قريباً.',
    sendError: null,
    name: 'الاسم',
    phone: 'رقم الجوال',
    email: 'البريد الإلكتروني (اختياري)',
    product: 'المنتج (اختياري)',
    message: 'الرسالة',
    send: 'إرسال',
    contactDetails: 'بيانات التواصل',
    phoneLabel: 'الهاتف',
    whatsapp: 'واتساب',
    emailLabel: 'البريد',
    address: 'العنوان',
    noContact: 'أضف بيانات التواصل من لوحة التحكم.',
    switchLang: 'English',
    switchLangLabel: 'Switch to English',
  },
  en: {
    home: 'Home',
    allProducts: 'All Products',
    about: 'About Us',
    contact: 'Contact Us',
    links: 'Links',
    contactInfo: 'Contact',
    catalog: 'Download Product Catalog (PDF)',
    rights: 'All rights reserved.',
    payments: 'Payment methods',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    toDark: 'Switch to dark mode',
    toLight: 'Switch to light mode',
    dark: 'Dark mode',
    light: 'Light mode',
    browse: 'Browse Products',
    quote: 'Request a Quote',
    categories: 'Product Categories',
    allCategories: (n) => `View All Categories (${n})`,
    featured: 'Featured Products',
    services: 'Our Distinctive Services',
    brands: 'Brands',
    values: 'Our Values',
    partners: 'Success Partners',
    productsCount: (n) => `${n} products`,
    details: 'Details',
    arrow: '→',
    productsIntro: 'Search by product name or SKU, or browse by category or brand.',
    search: 'Search',
    searchPh: 'Product name or SKU...',
    category: 'Category',
    allCats: 'All categories',
    brand: 'Brand',
    allBrands: 'All brands',
    showResults: 'Show Results',
    results: (n) => `Results (${n})`,
    clear: 'Clear filters',
    firstN: (n) => `Showing the first ${n} products. Narrow your search by choosing a category or brand.`,
    noMatch: 'No matching products. Try changing the filters.',
    byBrand: 'Browse by Brand',
    viewAll: (n) => `View all (${n})`,
    emptyCategory: 'There are no products in this category yet.',
    noImage: 'No image',
    orderWhatsapp: 'Order via WhatsApp',
    waMessage: (name) => `Hello, I would like to inquire about: ${name}`,
    contactIntro: 'Leave us a message and we will get back to you soon.',
    sent: 'Thank you, we received your message and will contact you soon.',
    sendError: 'Your message could not be sent. Please fill in your name, phone and message, then try again.',
    name: 'Name',
    phone: 'Mobile number',
    email: 'Email (optional)',
    product: 'Product (optional)',
    message: 'Message',
    send: 'Send',
    contactDetails: 'Contact Details',
    phoneLabel: 'Phone',
    whatsapp: 'WhatsApp',
    emailLabel: 'Email',
    address: 'Address',
    noContact: 'Add contact details from the dashboard.',
    switchLang: 'العربية',
    switchLangLabel: 'التبديل إلى العربية',
  },
};

export function t(lang) {
  return dict[lang] || dict.ar;
}
