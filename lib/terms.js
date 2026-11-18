// شروط وأحكام استخدام لوحة التحكم للموظفين
// أي تعديل جوهري على النص: غيّر الإصدار عشان يطلب من الكل الموافقة من جديد
export const TERMS_VERSION = '2026-11-18';

export const TERMS = {
  ar: {
    title: 'شروط وأحكام استخدام لوحة التحكم',
    intro: 'لوحة التحكم أداة عمل داخلية لشركة بروفيشنال باور كور (PEXON). باستخدامك لها توافق على التالي:',
    sections: [
      {
        h: 'الحساب والدخول',
        items: [
          'الحساب شخصي، ولا يجوز مشاركة اسم المستخدم أو كلمة المرور مع أي شخص.',
          'أنت مسؤول عن كل ما يتم من حسابك، وتبلّغ الإدارة فوراً عند الاشتباه بأي دخول غير مصرح.',
          'الصلاحيات تحددها الإدارة حسب المنصب، ولا يجوز محاولة الوصول لأقسام غير مصرح بها.',
        ],
      },
      {
        h: 'سرية البيانات',
        items: [
          'بيانات العملاء والموردين والأسعار والطلبات سرية، وتُستخدم لأغراض العمل فقط.',
          'لا يجوز نسخ البيانات أو تصديرها أو مشاركتها خارج الشركة إلا بإذن من الإدارة.',
          'نلتزم بنظام حماية البيانات الشخصية في المملكة العربية السعودية في التعامل مع بيانات العملاء والموظفين.',
        ],
      },
      {
        h: 'تسجيل المحادثات والنشاط',
        items: [
          'المحادثات بين مستخدمي لوحة التحكم مسجّلة ومحفوظة، ويحق للإدارة مراجعتها.',
          'يتم التسجيل للأغراض التالية: تطوير الخدمة، وحماية الموظفين، ومرجع عند اتخاذ القرار، ومؤشرات الأداء.',
          'نشاطك في اللوحة (مثل تحديث حالات الطلبات والتعديلات) يُسجّل باسمك.',
          'الاطلاع على المحادثات يقتصر على الإدارة ومن تفوّضه بصلاحية رسمية.',
        ],
      },
      {
        h: 'السلوك المهني',
        items: [
          'التواصل داخل اللوحة يكون باحترام ولأغراض العمل.',
          'يُمنع أي محتوى مسيء أو مخالف للأنظمة أو لسياسات الشركة.',
        ],
      },
      {
        h: 'التعديل والإنهاء',
        items: [
          'يحق للإدارة إيقاف الحساب أو تعديل صلاحياته في أي وقت.',
          'قد تُحدَّث هذه الشروط، وعند تحديثها يُطلب منك الموافقة عليها من جديد.',
        ],
      },
    ],
    agree: 'قرأت الشروط والأحكام وأوافق عليها، بما فيها تسجيل المحادثات والنشاط للأغراض المذكورة.',
  },
  en: {
    title: 'Dashboard Terms & Conditions',
    intro: 'The dashboard is an internal work tool of Professional Power Core Company (PEXON). By using it you agree to the following:',
    sections: [
      {
        h: 'Account & sign-in',
        items: [
          'Your account is personal. Do not share your username or password with anyone.',
          'You are responsible for everything done from your account and must report any suspected unauthorized access immediately.',
          'Permissions are set by management according to your role. Do not try to access sections you are not authorized for.',
        ],
      },
      {
        h: 'Data confidentiality',
        items: [
          'Customer, vendor, pricing and order data is confidential and used for work purposes only.',
          'Do not copy, export or share data outside the company without management approval.',
          "We comply with Saudi Arabia's Personal Data Protection Law when handling customer and employee data.",
        ],
      },
      {
        h: 'Recording of chats and activity',
        items: [
          'Conversations between dashboard users are recorded and stored, and management may review them.',
          'Recording serves these purposes: improving the service, protecting employees, a reference for decision-making, and performance indicators.',
          'Your activity in the dashboard (such as quote status updates and edits) is logged under your name.',
          'Access to conversations is limited to management and those formally authorized by it.',
        ],
      },
      {
        h: 'Professional conduct',
        items: ['Communication in the dashboard must be respectful and work-related.', 'Offensive content or content that violates laws or company policy is prohibited.'],
      },
      {
        h: 'Changes & termination',
        items: [
          'Management may suspend the account or change its permissions at any time.',
          'These terms may be updated; when they are, you will be asked to accept them again.',
        ],
      },
    ],
    agree: 'I have read and agree to the Terms & Conditions, including the recording of chats and activity for the purposes stated.',
  },
};
