// إعدادات صفحات الكلمات الأساسية (مفاتيح فصل، علب أرضية، مواسير كهرباء، ليجراند)
import { shopType } from '@/lib/catalog';

const LEGRAND_WIRING = ['ph-legrand-belanko-s', 'ph-legrand-mallia-senses', 'ph-legrand-arteor', 'ph-legrand-mosaic', 'ph-legrand-synergy', 'ph-legrand-antimicrobial', 'ph-legrand-plexo'];
const isDP = (p) => LEGRAND_WIRING.includes(p.categoryId) && /(20|45)\s*A\b[^-]*\bDP\b|\bDP\b[^-]*(20|45)\s*A|water heater/i.test(p.name) && !/PLATE|COVER|FRAME|BLANK/i.test(p.name);

export const ISOLATORS = {
  path: '/isolators',
  sections: [
    { key: 'outdoor', href: '/category/ph-ge-general-electric', test: (p) => p.categoryId === 'ph-ge-general-electric' && /3R|outdoor/i.test(p.name),
      ar: ['مفاتيح فصل خارجية (NEMA 3R)', 'مفاتيح فصل جنرال إلكتريك بصندوق خارجي مقاوم للمطر، من 30 إلى 200 أمبير، للعدادات والمكيفات المركزية والمضخات والأماكن المكشوفة.'],
      en: ['Outdoor safety switches (NEMA 3R)', 'GE safety switches in rain-proof outdoor enclosures, 30 A to 200 A, for meters, central AC units, pumps and exposed locations.'] },
    { key: 'indoor', href: '/category/ph-ge-general-electric', test: (p) => p.categoryId === 'ph-ge-general-electric' && !/3R|outdoor/i.test(p.name),
      ar: ['مفاتيح فصل داخلية (NEMA 1)', 'مفاتيح فصل جنرال إلكتريك للاستخدام الداخلي في غرف الكهرباء والمستودعات والمصانع، من 30 إلى 200 أمبير.'],
      en: ['Indoor safety switches (NEMA 1)', 'GE safety switches for indoor use in electrical rooms, warehouses and factories, 30 A to 200 A.'] },
    { key: 'rotary', href: '/category/ph-legrand-mix', test: (p) => /isolator|solator/i.test(p.name),
      ar: ['مفاتيح فصل سكين ليجراند (3 و4 قطب)', 'مفاتيح فصل دوارة بعلبة بلاستيك مقاومة للعوامل الجوية، 3 أو 4 قطب، من 20 إلى 63 أمبير، للمكيفات والمضخات والمعدات الخارجية.'],
      en: ['Legrand rotary isolators (3 and 4 pole)', 'Rotary isolators in weatherproof plastic enclosures, 3 or 4 pole, 20 A to 63 A, for AC units, pumps and outdoor equipment.'] },
    { key: 'dp', href: '/products?type=switches', test: isDP,
      ar: ['مفاتيح سخان ومكيف 20 و45 أمبير', 'مفاتيح ثنائية القطب (DP) تفصل الفاز والنيوترال معاً: 20 أمبير للسخانات والغسالات، و45 أمبير للمكيفات والأفران.'],
      en: ['20 A and 45 A water heater and AC switches', 'Double-pole (DP) switches that disconnect both live and neutral: 20 A for water heaters and washing machines, 45 A for air conditioners and cookers.'] },
  ],
  C: {
    ar: {
      title: 'مفاتيح فصل كهرباء',
      h1: 'مفاتيح فصل كهرباء في الرياض',
      seo: 'مفتاح فصل كهرباء في الرياض | 30، 60، 100، 200 أمبير داخلي وخارجي',
      meta: 'مفاتيح فصل كهرباء في الرياض: مفتاح فصل خارجي وداخلي جنرال إلكتريك من 30 إلى 200 أمبير، مفاتيح فصل سكين ليجراند 3 و4 قطب، ومفاتيح سخان ومكيف 20 و45 أمبير. اطلب عرض سعر مع توصيل مجاني داخل الرياض.',
      lead: [
        'مفتاح الفصل يقطع الكهرباء عن جهاز أو خط كامل عشان الصيانة والسلامة. عندنا مفاتيح فصل داخلية وخارجية من جنرال إلكتريك من 30 إلى 200 أمبير، ومفاتيح فصل سكين ليجراند، ومفاتيح السخانات والمكيفات.',
        'كلها منتجات أصلية، مع عرض سعر سريع وتوصيل مجاني داخل الرياض.',
      ],
      table: { title: 'أي مفتاح فصل يناسبك؟', rows: [
        ['الاستخدام', 'النوع المناسب', 'القوة'],
        ['سخان ماء، غسالة', 'مفتاح ثنائي القطب (DP)', '20 أمبير'],
        ['مكيف شباك أو سبليت، فرن كهربائي', 'مفتاح ثنائي القطب (DP)', '45 أمبير'],
        ['مكيف مركزي، مضخة، معدات خارجية', 'مفتاح فصل سكين أو مفتاح فصل خارجي', '20 إلى 63 أمبير حسب الحمل'],
        ['مدخل الخدمة بعد العداد، لوحة رئيسية', 'مفتاح فصل خارجي NEMA 3R', '100 إلى 200 أمبير'],
      ] },
      tipsTitle: 'كيف تختار مفتاح الفصل',
      tips: [
        'الأمبير: اختر مفتاح فصل قوته مساوية أو أكبر من قوة القاطع اللي يغذي الخط.',
        'المكان: في الأماكن المكشوفة للمطر والغبار استخدم صندوق خارجي (NEMA 3R أو درجة حماية IP مناسبة)، وفي غرف الكهرباء يكفي الداخلي (NEMA 1).',
        'عدد الأقطاب: فاز واحد يحتاج قطبين، وثلاثة فاز يحتاج 3 أقطاب، و4 أقطاب لو تبي تفصل النيوترال بعد.',
        'المفاتيح اللي ما فيها فيوز (Non-Fusible) تفصل بس، والحماية تكون من القاطع في اللوحة.',
        'التركيب لازم يكون بإشراف كهربائي مختص وحسب الكود الكهربائي السعودي SBC 401.',
      ],
      faq: [
        ['وش الفرق بين القاطع ومفتاح الفصل؟', 'القاطع يحمي الخط ويفصل تلقائياً عند زيادة الحمل أو القصر. مفتاح الفصل ما يحمي، وظيفته إنك تفصل الكهرباء يدوياً بأمان وقت الصيانة.'],
        ['وش يعني NEMA 1 وNEMA 3R؟', 'هذي درجات حماية الصندوق: NEMA 1 للاستخدام الداخلي، وNEMA 3R للخارج لأنه يحمي من المطر والثلج.'],
        ['كم أمبير مفتاح فصل المكيف؟', 'مكيفات الشباك والسبليت العادية غالباً على مفتاح 45 أمبير ثنائي القطب. المكيفات المركزية تحتاج مفتاح فصل حسب قوة الوحدة والقاطع المغذي، وارجع لبيانات المكيف.'],
        ['هل عندكم مفتاح فصل 200 أمبير خارجي؟', 'إيه، مفتاح فصل جنرال إلكتريك 200 أمبير 3 فاز بصندوق خارجي NEMA 3R، وفيه نسخة داخلية بعد.'],
        ['هل توصلون داخل الرياض؟', 'إيه، التوصيل سريع ومجاني داخل الرياض، وللمدن الثانية تواصل معنا.'],
      ],
      related: [['قواطع ولوحات توزيع', '/products?type=breakers'], ['أسلاك وكيابل كهرباء', '/cable-supplier-riyadh'], ['مقاس الكيبل حسب الأمبير', '/blog/cable-size-by-ampere']],
    },
    en: {
      title: 'Isolators & Safety Switches',
      h1: 'Isolators & safety switches in Riyadh',
      seo: 'Isolator & Safety Switches in Riyadh | 30–200 A Indoor & Outdoor',
      meta: 'Isolators and safety switches in Riyadh: GE indoor and outdoor safety switches from 30 A to 200 A, Legrand 3 and 4 pole rotary isolators, and 20 A and 45 A water heater and AC switches. Request a quote with free delivery in Riyadh.',
      lead: [
        'An isolator cuts power to a device or a whole circuit for maintenance and safety. We supply GE indoor and outdoor safety switches from 30 A to 200 A, Legrand rotary isolators, and water heater and AC switches.',
        'All genuine products, with quick quotations and free delivery within Riyadh.',
      ],
      table: { title: 'Which isolator do you need?', rows: [
        ['Use', 'Suitable type', 'Rating'],
        ['Water heater, washing machine', 'Double-pole (DP) switch', '20 A'],
        ['Window or split AC, electric cooker', 'Double-pole (DP) switch', '45 A'],
        ['Central AC, pump, outdoor equipment', 'Rotary isolator or outdoor safety switch', '20–63 A by load'],
        ['Service entrance after the meter, main board', 'Outdoor NEMA 3R safety switch', '100–200 A'],
      ] },
      tipsTitle: 'How to choose an isolator',
      tips: [
        'Rating: choose an isolator rated at least as high as the breaker feeding the circuit.',
        'Location: use an outdoor enclosure (NEMA 3R or a suitable IP rating) where exposed to rain and dust; indoor (NEMA 1) is fine in electrical rooms.',
        'Poles: single-phase needs 2 poles, three-phase needs 3, and 4 poles if you also want to switch the neutral.',
        'Non-fusible switches only disconnect; protection comes from the breaker in the board.',
        'Installation must be done by a qualified electrician in line with the Saudi Electrical Code SBC 401.',
      ],
      faq: [
        ['What is the difference between a breaker and an isolator?', 'A breaker protects the circuit and trips automatically on overload or short circuit. An isolator does not protect; it lets you switch power off manually and safely for maintenance.'],
        ['What do NEMA 1 and NEMA 3R mean?', 'They are enclosure ratings: NEMA 1 is for indoor use, NEMA 3R is for outdoor use and protects against rain and sleet.'],
        ['What rating does an AC isolator need?', 'Typical window and split units use a 45 A double-pole switch. Central units need an isolator matched to the unit and its supply breaker; check the unit data plate.'],
        ['Do you have a 200 A outdoor isolator?', 'Yes, a GE 200 A three-phase safety switch in an outdoor NEMA 3R enclosure, also available in an indoor version.'],
        ['Do you deliver in Riyadh?', 'Yes, fast and free delivery within Riyadh; contact us for other cities.'],
      ],
      related: [['Breakers & boards', '/products?type=breakers'], ['Cables & wires', '/cable-supplier-riyadh'], ['Cable size by ampere', '/blog/cable-size-by-ampere']],
    },
  },
};

export const FLOOR_BOXES = {
  path: '/floor-boxes',
  sections: [
    { key: 'popup', href: '/category/ph-legrand-floor-boxs', test: (p) => p.categoryId === 'ph-legrand-floor-boxs' && /pop-?up/i.test(p.name),
      ar: ['علب أرضية بوب أب (Pop-up)', 'علبة أرضية تنفتح بالضغط وتطلع منها الأفياش ومخارج الداتا، ولما تسكرها تصير مستوية مع الأرضية. بمقاسات 3 و4 و6 و8 موديول.'],
      en: ['Pop-up floor boxes', 'Press-to-open floor boxes that raise sockets and data outlets, then close flush with the floor. In 3, 4, 6 and 8 module sizes.'] },
    { key: 'floor', href: '/category/ph-legrand-floor-boxs', test: (p) => p.categoryId === 'ph-legrand-floor-boxs' && !/pop-?up/i.test(p.name),
      ar: ['علب أرضية وملحقاتها', 'العلبة الخلفية اللي تنصب في الأرضية قبل الصبة، والغطاء الأرضي، والبليتات والإطارات اللي تركب عليها الأفياش ومخارج الداتا.'],
      en: ['Floor boxes and accessories', 'Back boxes set into the floor before screeding, floor covers, and the plates and frames that hold sockets and data outlets.'] },
    { key: 'desk', href: '/category/ph-legrand-mix', test: (p) => /desktop/i.test(p.name),
      ar: ['مجاري أفياش مكتبية', 'مجرى ألمنيوم يركب على الطاولة أو تحتها ويجمع الأفياش ومخارج الشبكة والشحن، لطاولات الاجتماعات والمكاتب المفتوحة.'],
      en: ['Desktop power tracks', 'Aluminium tracks mounted on or under the desk combining sockets, network and charging outlets, for meeting tables and open offices.'] },
  ],
  C: {
    ar: {
      title: 'علب أرضية كهرباء',
      h1: 'علب أرضية للأفياش والداتا في الرياض',
      seo: 'علبة أرضية كهرباء في الرياض | علب أرضية ليجراند بوب أب للأفياش والداتا',
      meta: 'علب أرضية كهرباء ليجراند في الرياض: علبة أرضية بوب أب 3 و4 و6 و8 موديول، علب خلفية وأغطية أرضية، ومجاري أفياش مكتبية للمكاتب وقاعات الاجتماعات. اطلب عرض سعر مع توصيل مجاني داخل الرياض.',
      lead: [
        'العلبة الأرضية (Floor Box) توصل الكهرباء والشبكة لوسط المكان بدون أسلاك ممدودة على الأرض. تستخدم في المكاتب المفتوحة وقاعات الاجتماعات والمعارض والمجالس الكبيرة.',
        'عندنا علب أرضية ليجراند الأصلية: بوب أب، وعلب خلفية وأغطية، ومجاري أفياش مكتبية، مع توصيل مجاني داخل الرياض.',
      ],
      table: { title: 'وش تحتاج عشان تركب علبة أرضية؟', rows: [
        ['القطعة', 'وظيفتها'],
        ['العلبة الخلفية (Back Box)', 'تنصب في الأرضية قبل صبة التسوية وتوصل لها المواسير'],
        ['الغطاء أو البوب أب', 'الجزء الظاهر فوق الأرضية، ينفتح ويتسكر'],
        ['البليتات والإطارات', 'تركب عليها لقم الأفياش ومخارج الداتا'],
        ['لقم الأفياش والداتا', 'فيش 13 أمبير، USB، مخارج RJ45، حسب الحاجة'],
      ] },
      tipsTitle: 'نصايح قبل الطلب',
      tips: [
        'حدد عدد الموديولات اللي تحتاجها: كل فيش أو مخرج داتا ياخذ موديول أو أكثر.',
        'العلبة الخلفية لازم تنحط قبل صبة التسوية، فنسّق مع المقاول بدري.',
        'تأكد من سماكة الأرضية النهائية (بلاط، رخام، موكيت) عشان يكون الغطاء مستوي معها.',
        'افصل خط الكهرباء عن خط الداتا داخل العلبة.',
        'في الطاولات اللي تتحرك، مجرى الأفياش المكتبي أسهل من العلبة الأرضية.',
      ],
      faq: [
        ['وش الفرق بين العلبة الأرضية البوب أب والعادية؟', 'البوب أب تنفتح بالضغط وترتفع منها الأفياش، ولما تسكرها تصير مستوية مع الأرضية. العادية لها غطاء ينفتح ويطلع منه السلك.'],
        ['كم فيش يركب في العلبة الأرضية؟', 'حسب المقاس: 3 و4 و6 و8 موديول. تقدر تجمع أفياش كهرباء ومخارج داتا وUSB في نفس العلبة.'],
        ['هل العلبة الأرضية تتحمل المشي عليها؟', 'إيه، العلب الأرضية مصممة تنداس وهي مسكرة، لكن لا تحط عليها أحمال ثقيلة مركزة.'],
        ['هل توصلون داخل الرياض؟', 'إيه، التوصيل سريع ومجاني داخل الرياض، وللمدن الثانية تواصل معنا.'],
      ],
      related: [['أفياش كهرباء', '/sockets'], ['مخارج داتا وتلفون', '/products?type=data'], ['ليجراند', '/legrand']],
    },
    en: {
      title: 'Floor Boxes',
      h1: 'Floor boxes for power and data in Riyadh',
      seo: 'Floor Boxes in Riyadh | Legrand Pop-up Floor Boxes for Power & Data',
      meta: 'Legrand floor boxes in Riyadh: pop-up floor boxes in 3, 4, 6 and 8 modules, back boxes and floor covers, and desktop power tracks for offices and meeting rooms. Request a quote with free delivery in Riyadh.',
      lead: [
        'A floor box brings power and data to the middle of a room without cables across the floor. It is used in open offices, meeting rooms, showrooms and large majlis rooms.',
        'We supply genuine Legrand floor boxes: pop-up units, back boxes and covers, and desktop power tracks, with free delivery within Riyadh.',
      ],
      table: { title: 'What you need to install a floor box', rows: [
        ['Part', 'Purpose'],
        ['Back box', 'Set into the floor before screeding; conduits connect to it'],
        ['Cover or pop-up', 'The visible part at floor level that opens and closes'],
        ['Plates and frames', 'Hold the socket and data modules'],
        ['Socket and data modules', '13A sockets, USB, RJ45 outlets as needed'],
      ] },
      tipsTitle: 'Tips before ordering',
      tips: [
        'Decide how many modules you need: each socket or data outlet takes one or more modules.',
        'The back box must be placed before the floor screed, so coordinate with the contractor early.',
        'Check the final floor finish thickness (tiles, marble, carpet) so the cover sits flush.',
        'Keep power and data separated inside the box.',
        'For movable tables, a desktop power track is easier than a floor box.',
      ],
      faq: [
        ['What is the difference between a pop-up and a standard floor box?', 'A pop-up opens with a press and raises the outlets, then closes flush with the floor. A standard box has a hinged lid with a cable exit.'],
        ['How many sockets fit in a floor box?', 'It depends on size: 3, 4, 6 or 8 modules. You can combine power, data and USB in the same box.'],
        ['Can you walk on a floor box?', 'Yes, floor boxes are designed to be walked on when closed, but avoid heavy point loads.'],
        ['Do you deliver in Riyadh?', 'Yes, fast and free delivery within Riyadh; contact us for other cities.'],
      ],
      related: [['Electrical sockets', '/sockets'], ['Data & phone outlets', '/products?type=data'], ['Legrand', '/legrand']],
    },
  },
};

const isPvcPipe = (p) => p.categoryId === 'ph-pvc-conduits' && /conduit (black|upvc|sch)|pvc conduit black|conduit upvc/i.test(p.name.split(' - ').slice(1).join(' ') || p.name);
const isSteelPipe = (p) => p.categoryId === 'ph-itcc-1' && /emt conduit|rigid\b/i.test(p.name) && !/coupling|connector|clamp|bushing|locknut/i.test(p.name);

export const CONDUITS = {
  path: '/conduits',
  sections: [
    { key: 'pvc', href: '/category/ph-pvc-conduits', test: isPvcPipe,
      ar: ['مواسير كهرباء PVC', 'مواسير PVC سوداء للتمديد داخل الجدران والأسقف، ومواسير UPVC رصاصية سكيدول 40 للتمديدات الأقوى والمدفونة.'],
      en: ['PVC electrical conduits', 'Black PVC conduit for concealed wiring in walls and ceilings, and grey UPVC Schedule 40 conduit for heavier and buried runs.'] },
    { key: 'pvc-fit', href: '/category/ph-pvc-conduits', test: (p) => p.categoryId === 'ph-pvc-conduits' && !isPvcPipe(p),
      ar: ['ملحقات مواسير PVC', 'جلب ووصلات، أكواع وانحناءات، علب توزيع، سرج وفواصل، أدبتر ذكر وأنثى، غراء PVC وسوستة ثني.'],
      en: ['PVC conduit fittings', 'Couplings, bends and elbows, junction boxes, saddles and spacers, male and female adaptors, PVC cement and bending springs.'] },
    { key: 'steel', href: '/category/ph-itcc-1', test: isSteelPipe,
      ar: ['مواسير حديد EMT وريجد', 'مواسير حديد مجلفن EMT خفيفة للتمديد الظاهر في المستودعات والمصانع والمواقف، ومواسير ريجد للحماية العالية.'],
      en: ['EMT and rigid steel conduits', 'Light galvanised EMT steel conduit for exposed runs in warehouses, factories and car parks, and rigid conduit for heavy protection.'] },
    { key: 'steel-fit', href: '/category/ph-itcc-1', test: (p) => p.categoryId === 'ph-itcc-1' && !isSteelPipe(p),
      ar: ['ملحقات مواسير الحديد', 'كونكتر وكبلنق EMT، كلامبات تثبيت، بوشنق ولوك نت.'],
      en: ['Steel conduit fittings', 'EMT connectors and couplings, fixing clamps, bushings and locknuts.'] },
  ],
  C: {
    ar: {
      title: 'مواسير كهرباء',
      h1: 'مواسير كهرباء PVC وحديد في الرياض',
      seo: 'مواسير كهرباء في الرياض | مواسير PVC وUPVC وحديد EMT وملحقاتها',
      meta: 'مواسير كهرباء في الرياض: مواسير PVC سوداء، مواسير UPVC سكيدول 40، مواسير حديد EMT وريجد، وكل الملحقات من جلب وأكواع وعلب وكونكترات. اطلب عرض سعر بالكمية مع توصيل مجاني داخل الرياض.',
      lead: [
        'المواسير تحمي أسلاك الكهرباء داخل الجدران والأسقف والأرضيات، وتسهل سحب الأسلاك وتغييرها بعدين. عندنا مواسير PVC وUPVC للتمديد المخفي، ومواسير حديد EMT وريجد للتمديد الظاهر والأماكن اللي تحتاج حماية أعلى.',
        'ومعها كل الملحقات، مع توريد بالكميات للمشاريع وتوصيل مجاني داخل الرياض.',
      ],
      table: { title: 'PVC ولا حديد؟', rows: [
        ['', 'مواسير PVC', 'مواسير حديد EMT'],
        ['الاستخدام', 'داخل الجدران والأسقف والصبات', 'التمديد الظاهر في المستودعات والمصانع والمواقف'],
        ['الحماية من الصدمات', 'متوسطة', 'عالية'],
        ['الوزن والتركيب', 'خفيفة وسريعة التركيب', 'أثقل وتحتاج أدوات ثني'],
        ['التأريض', 'ما توصل كهرباء', 'معدنية، فلازم تكون مؤرضة'],
        ['التكلفة', 'أقل', 'أعلى'],
      ] },
      tipsTitle: 'نصايح قبل الطلب',
      tips: [
        'مقاس الماسورة يعتمد على عدد ومقاس الأسلاك: لا تعبي الماسورة لآخرها، اترك مساحة لسحب الأسلاك والتهوية.',
        'المقاسات الشائعة في البيوت 20 و25 مم، وللخطوط الرئيسية 32 مم وأكبر.',
        'خل بين كل علبتي سحب مسافة معقولة وعدد انحناءات قليل عشان يسهل سحب السلك.',
        'استخدم غراء PVC في وصلات المواسير المدفونة عشان ما يدخل الماء والأسمنت.',
        'اطلب الملحقات من نفس النوع والمقاس عشان تركب صح.',
      ],
      faq: [
        ['وش مقاسات مواسير الكهرباء المتوفرة؟', 'مواسير PVC بمقاسات 20 و25 و32 مم وأكبر، ومواسير EMT بالإنش (1/2 و3/4 و1 إنش). تواصل معنا بالمقاسات والكميات.'],
        ['كم سلك يدخل في الماسورة؟', 'يعتمد على مقاس الماسورة والسلك. سوينا جدول جاهز في دليل "كم سلك يدخل في الماسورة؟".'],
        ['وش الفرق بين PVC وUPVC؟', 'UPVC أصلب وأقوى ومناسبة للتمديدات المدفونة والأحمال الأعلى، وPVC العادية أخف ومناسبة للجدران والأسقف.'],
        ['هل توفرون بالكميات للمشاريع؟', 'إيه، نورد بالحبة وبالكميات، مع عرض سعر سريع وتوصيل مجاني داخل الرياض.'],
      ],
      related: [['كم سلك يدخل في الماسورة؟', '/blog/how-many-wires-in-conduit'], ['مواسير حديد ولا PVC؟', '/blog/steel-vs-pvc-conduit'], ['أسلاك وكيابل كهرباء', '/cable-supplier-riyadh']],
    },
    en: {
      title: 'Electrical Conduits',
      h1: 'PVC and steel electrical conduits in Riyadh',
      seo: 'Electrical Conduits in Riyadh | PVC, UPVC & EMT Steel Conduits and Fittings',
      meta: 'Electrical conduits in Riyadh: black PVC conduit, UPVC Schedule 40, EMT and rigid steel conduits, and all fittings including couplings, bends, boxes and connectors. Request a bulk quote with free delivery in Riyadh.',
      lead: [
        'Conduits protect electrical wires inside walls, ceilings and floors, and make it easy to pull and replace wires later. We supply PVC and UPVC conduit for concealed wiring, and EMT and rigid steel conduit for exposed runs and areas needing more protection.',
        'All fittings are available too, with bulk supply for projects and free delivery within Riyadh.',
      ],
      table: { title: 'PVC or steel?', rows: [
        ['', 'PVC conduit', 'EMT steel conduit'],
        ['Use', 'Inside walls, ceilings and slabs', 'Exposed runs in warehouses, factories and car parks'],
        ['Impact protection', 'Medium', 'High'],
        ['Weight and installation', 'Light and quick to install', 'Heavier, needs bending tools'],
        ['Earthing', 'Non-conductive', 'Metallic, so it must be earthed'],
        ['Cost', 'Lower', 'Higher'],
      ] },
      tipsTitle: 'Tips before ordering',
      tips: [
        'Conduit size depends on the number and size of wires: do not fill it completely; leave room for pulling and heat.',
        'Common home sizes are 20 and 25 mm; main runs use 32 mm and larger.',
        'Keep reasonable distances and few bends between pull boxes so wires pull easily.',
        'Use PVC cement on buried joints to keep water and concrete out.',
        'Order fittings of the same type and size so they fit correctly.',
      ],
      faq: [
        ['What conduit sizes do you have?', 'PVC conduit in 20, 25, 32 mm and larger, and EMT in inches (1/2, 3/4 and 1 inch). Contact us with sizes and quantities.'],
        ['How many wires fit in a conduit?', 'It depends on conduit and wire size. See our ready table in the guide "How many wires fit in a conduit?".'],
        ['What is the difference between PVC and UPVC?', 'UPVC is more rigid and stronger, suited to buried runs and heavier duty; standard PVC is lighter and suited to walls and ceilings.'],
        ['Do you supply in bulk for projects?', 'Yes, single pieces or bulk quantities, with quick quotes and free delivery within Riyadh.'],
      ],
      related: [['How many wires in a conduit?', '/blog/how-many-wires-in-conduit'], ['Steel vs PVC conduit', '/blog/steel-vs-pvc-conduit'], ['Cables & wires', '/cable-supplier-riyadh']],
    },
  },
};

const LEGRAND_SERIES = [
  ['ph-legrand-belanko-s', ['ليجراند بلانكو إس', 'سلسلة عملية واقتصادية للفلل والشقق، أبيض وأسود، والقطعة تجي متكاملة مع غطائها.'], ['Legrand Belanko S', 'A practical, economical range for villas and apartments, in white and black, supplied complete with plate.']],
  ['ph-legrand-mallia-senses', ['ليجراند ماليا سينسز', 'تصميم حديث بألوان مطفية: أبيض، أسود، شامبين، رمادي غامق.'], ['Legrand Mallia Senses', 'Modern design in matt colours: white, black, champagne and dark grey.']],
  ['ph-legrand-arteor', ['ليجراند أرتيور', 'تصميم فخم بحواف نحيفة وأغطية ستانلس ستيل وقزاز، بنظام اللقم المعيارية.'], ['Legrand Arteor', 'Premium slim design with stainless steel and glass plates, on a modular system.']],
  ['ph-legrand-mosaic', ['ليجراند موزايك', 'نظام لقم معيارية منتشر في المشاريع، تجمع فيه المفاتيح والأفياش والداتا في غطاء واحد.'], ['Legrand Mosaic', 'A widely used modular system combining switches, sockets and data in one plate.']],
  ['ph-legrand-synergy', ['ليجراند سينرجي', 'مواصفة بريطانية بأغطية فخمة ستانلس ستيل وذهبي للفلل والفنادق.'], ['Legrand Synergy', 'British-standard range with premium stainless steel and gold plates for villas and hotels.']],
  ['ph-legrand-plexo', ['ليجراند بليكسو', 'مفاتيح وأفياش خارجية مقاومة للماء والغبار IP55.'], ['Legrand Plexo', 'Weatherproof IP55 outdoor switches and sockets.']],
  ['ph-legrand-floor-boxs', ['علب أرضية ليجراند', 'علب أرضية بوب أب وعلب خلفية وأغطية للأفياش والداتا.'], ['Legrand floor boxes', 'Pop-up floor boxes, back boxes and covers for power and data.']],
  ['ph-industrial-socket', ['أفياش صناعية ليجراند', 'أفياش وقوابس P17 حسب IEC 60309 من 16 إلى 125 أمبير.'], ['Legrand industrial sockets', 'P17 sockets and plugs to IEC 60309 from 16 A to 125 A.']],
  ['ph-legrand-antimicrobial', ['ليجراند المضادة للميكروبات', 'نسخة من موزايك بسطح يحد من نمو البكتيريا للمستشفيات والعيادات.'], ['Legrand antimicrobial', 'A Mosaic version with a surface that limits bacterial growth, for hospitals and clinics.']],
  ['ph-legrand-mix', ['منتجات ليجراند متنوعة', 'مفاتيح فصل سكين، ترمينال بلوك، مجاري مكتبية، ووصلات.'], ['Other Legrand products', 'Rotary isolators, terminal blocks, desktop tracks and connectors.']],
];

export const LEGRAND = {
  path: '/legrand',
  sections: LEGRAND_SERIES.map(([cat, ar, en]) => ({ key: cat.replace('ph-', ''), href: `/category/${cat}`, test: (p) => p.categoryId === cat, ar, en, limit: 4 })),
  C: {
    ar: {
      title: 'ليجراند Legrand',
      h1: 'منتجات ليجراند Legrand في الرياض',
      seo: 'ليجراند Legrand في الرياض | مفاتيح وأفياش ليجراند الأصلية',
      meta: 'منتجات ليجراند الأصلية في الرياض: مفاتيح وأفياش بلانكو وماليا وأرتيور وموزايك وسينرجي، أفياش خارجية بليكسو، علب أرضية، وأفياش صناعية. عرض سعر سريع وتوصيل مجاني داخل الرياض.',
      lead: [
        'ليجراند (Legrand) شركة فرنسية متخصصة في المفاتيح والأفياش والبنية الكهربائية، ومنتجاتها من أكثر الماركات انتشاراً في المشاريع السكنية والتجارية في السعودية.',
        'نوفر منتجات ليجراند الأصلية بكل سلاسلها: من الخيارات الاقتصادية للشقق إلى الأغطية الفخمة للفلل والفنادق، مع الأفياش الخارجية والصناعية والعلب الأرضية.',
      ],
      table: { title: 'أي سلسلة ليجراند تناسبك؟', rows: [
        ['السلسلة', 'تناسب', 'الألوان والخامات'],
        ['بلانكو إس', 'الشقق والفلل بميزانية اقتصادية', 'أبيض، أسود'],
        ['ماليا سينسز', 'التصاميم الحديثة', 'أبيض، أسود، شامبين، رمادي غامق (مطفي)'],
        ['موزايك', 'المكاتب والمشاريع التجارية', 'لقم معيارية بأغطية متعددة'],
        ['أرتيور', 'الفلل والمشاريع الراقية', 'ستانلس ستيل، قزاز، ألوان متعددة'],
        ['سينرجي', 'الفلل والفنادق', 'ستانلس ستيل، أبيض، ذهبي'],
        ['بليكسو', 'الأحواش والأسطح والأماكن الرطبة', 'رمادي وأبيض، IP55'],
      ] },
      tipsTitle: 'كيف تختار',
      tips: [
        'لو تبي القطعة جاهزة مع غطائها: بلانكو أو ماليا أو سينرجي.',
        'لو تبي تجمع مفتاح وفيش وداتا في غطاء واحد: موزايك أو أرتيور (نظام لقم معيارية).',
        'للأماكن الخارجية: بليكسو، وللورش والمعدات: الأفياش الصناعية.',
        'كل الأفياش المنزلية عندنا 13 أمبير بالنظام البريطاني المعتمد في السعودية.',
      ],
      faq: [
        ['هل منتجات ليجراند عندكم أصلية؟', 'إيه، كل منتجات ليجراند عندنا أصلية.'],
        ['وش أرخص سلسلة ليجراند؟', 'بلانكو إس هي الخيار الاقتصادي، وتناسب الشقق والفلل.'],
        ['هل عندكم مفاتيح ليجراند سوداء؟', 'إيه، بلانكو إس وماليا سينسز فيها أسود، وأرتيور فيها أغطية سوداء.'],
        ['هل توصلون داخل الرياض؟', 'إيه، التوصيل سريع ومجاني داخل الرياض، وللمدن الثانية تواصل معنا.'],
      ],
      related: [['أفياش كهرباء', '/sockets'], ['مفاتيح إنارة', '/products?type=switches'], ['علب أرضية', '/floor-boxes'], ['مفاتيح فصل', '/isolators']],
    },
    en: {
      title: 'Legrand',
      h1: 'Legrand products in Riyadh',
      seo: 'Legrand in Riyadh | Genuine Legrand Switches & Sockets',
      meta: 'Genuine Legrand products in Riyadh: Belanko, Mallia, Arteor, Mosaic and Synergy switches and sockets, Plexo outdoor sockets, floor boxes and industrial sockets. Quick quotations and free delivery in Riyadh.',
      lead: [
        'Legrand is a French specialist in switches, sockets and electrical infrastructure, and one of the most widely used brands in residential and commercial projects in Saudi Arabia.',
        'We supply genuine Legrand products across its ranges: from economical options for apartments to premium plates for villas and hotels, plus outdoor and industrial sockets and floor boxes.',
      ],
      table: { title: 'Which Legrand range suits you?', rows: [
        ['Range', 'Best for', 'Colours and finishes'],
        ['Belanko S', 'Apartments and villas on a budget', 'White, black'],
        ['Mallia Senses', 'Modern interiors', 'Matt white, black, champagne, dark grey'],
        ['Mosaic', 'Offices and commercial projects', 'Modular with many plates'],
        ['Arteor', 'Premium villas and projects', 'Stainless steel, glass, many colours'],
        ['Synergy', 'Villas and hotels', 'Stainless steel, white, gold'],
        ['Plexo', 'Yards, roofs and damp areas', 'Grey and white, IP55'],
      ] },
      tipsTitle: 'How to choose',
      tips: [
        'For complete pieces with their own plate: Belanko, Mallia or Synergy.',
        'To combine a switch, socket and data in one plate: Mosaic or Arteor (modular).',
        'Outdoors: Plexo; for workshops and equipment: industrial sockets.',
        'All our household sockets are 13A British-standard, as used in Saudi Arabia.',
      ],
      faq: [
        ['Are your Legrand products genuine?', 'Yes, all our Legrand products are genuine.'],
        ['Which is the most affordable Legrand range?', 'Belanko S is the economical choice, suited to apartments and villas.'],
        ['Do you have black Legrand switches?', 'Yes, Belanko S and Mallia Senses come in black, and Arteor has black plates.'],
        ['Do you deliver in Riyadh?', 'Yes, fast and free delivery within Riyadh; contact us for other cities.'],
      ],
      related: [['Electrical sockets', '/sockets'], ['Light switches', '/products?type=switches'], ['Floor boxes', '/floor-boxes'], ['Isolators', '/isolators']],
    },
  },
};

// صفحة التجميع لكل نوع (للروابط الداخلية من صفحات المنتجات)
export const HUB_FOR_TYPE = {
  sockets: '/sockets', industrial: '/sockets', usb: '/sockets', data: '/sockets',
  cables: '/cable-supplier-riyadh', accessories: '/cable-supplier-riyadh',
  isolators: '/isolators', floorboxes: '/floor-boxes', conduits: '/conduits',
};
export const hubForProduct = (p) => {
  if (p.categoryId === 'ph-legrand-floor-boxs') return '/floor-boxes';
  if (isDP(p)) return '/isolators';
  return HUB_FOR_TYPE[shopType(p)] || '';
};
