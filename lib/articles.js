// مقالات المدونة (أدلة فنية) — نصوص ثابتة تُعرض في /blog
// كل مقال يربط بأقسام المنتجات ذات العلاقة
export const ARTICLES = [
  {
    slug: 'disconnect-switch-guide',
    en: { title: "Outdoor and indoor disconnect switches: choosing between 30, 60, 100 and 200 A", description: "A practical guide to choosing a safety (disconnect) switch: indoor NEMA 1 vs outdoor NEMA 3R, fusible vs non-fusible, and the right ampere rating for each use.", sections: [["What is a disconnect switch?", ["A safety switch, or disconnect switch, is a manual switch that fully cuts power to a building or a piece of equipment. Technicians use it to isolate equipment safely before maintenance, and it serves as the main disconnect at the service entrance.", "Common uses: outdoor and central air-conditioning units, pumps and motors, sub-distribution boards, and the main supply of villas and buildings."]], ["Indoor or outdoor?", ["Indoor switches are rated NEMA 1 and are installed in electrical rooms and dry enclosed spaces.", "Outdoor switches are rated NEMA 3R; their enclosure is built to withstand rain, dust and sun, which makes them the right choice next to rooftop AC units and in exposed locations. In the hot, dusty Saudi climate, an outdoor-rated switch in open areas is a necessity, not a luxury."]], ["Fusible or non-fusible?", ["A fusible switch contains fuses that protect the circuit against overcurrent. A non-fusible switch only disconnects; protection comes from the circuit breaker upstream in the panel.", "The GE switches we supply are non-fusible, so make sure the circuit is protected by a suitable breaker in the distribution board."]], ["Heavy Duty or General Duty?", ["Heavy-duty switches (such as GE THN series) are designed for frequent operation and commercial or industrial loads, rated up to 600 V, 3-pole. General-duty switches (such as GE TGN series) suit residential and light-duty applications."]], ["How to choose the ampere rating", ["The basic rule: the switch rating must exceed the load current it disconnects, with a safety margin. As a general example: 30 A for small AC units and pumps, 60 A for larger units and sub-boards, 100 A and 200 A for the main supply of villas, buildings and large equipment.", "The final choice is made by the electrical engineer based on load calculations and the Saudi Building Code (SBC 401). If you have a load schedule or drawing, send it to us and we will help you select the models."]], ["Available models", ["We supply GE indoor and outdoor disconnect switches rated 30, 60, 100 and 200 A, such as THN3364R (outdoor, 200 A, 3-phase, heavy duty) and THN3361R (outdoor, 30 A). Browse the category and request a quote for the quantity you need."]]] },
    date: '2026-11-22',
    title: 'مفتاح الفصل الخارجي والداخلي: كيف تختار بين 30 و60 و100 و200 أمبير',
    description: 'دليل عملي لاختيار مفتاح الفصل (Safety Switch): الفرق بين الداخلي NEMA 1 والخارجي NEMA 3R، والمصهري وغير المصهري، والقدرة المناسبة بالأمبير لكل استخدام.',
    categories: ['ph-ge-general-electric', 'ph-schneider'],
    sections: [
      ['ما هو مفتاح الفصل؟', [
        'مفتاح الفصل (Safety Switch أو Disconnect Switch)، ويسميه البعض القاطع الرئيسي أو مفتاح السكين، هو مفتاح يدوي يقطع الكهرباء بالكامل عن مبنى أو جهاز. يستخدمه الفني لعزل المعدة بأمان قبل الصيانة، ويستخدم كنقطة فصل رئيسية عند مدخل التغذية.',
        'الاستخدامات الأكثر شيوعاً: فصل وحدات التكييف الخارجية والمركزية، المضخات والمحركات، لوحات التوزيع الفرعية، والتغذية الرئيسية للفلل والمباني.',
      ]],
      ['داخلي أم خارجي؟', [
        'المفاتيح الداخلية مصنفة NEMA 1، وتركب داخل غرف الكهرباء والأماكن المغلقة الجافة.',
        'المفاتيح الخارجية مصنفة NEMA 3R، وغلافها مصمم ليتحمل المطر والغبار والشمس، وهي الخيار الصحيح بجانب وحدات التكييف على الأسطح وفي الأماكن المكشوفة. في أجواء السعودية الحارة والمغبرة، اختيار المفتاح الخارجي للأماكن المفتوحة ضروري وليس رفاهية.',
      ]],
      ['مصهري أم غير مصهري؟', [
        'المفتاح المصهري (Fusible) فيه فيوزات تحمي الدائرة من زيادة التيار. أما غير المصهري (Non-Fusible) فهو للفصل فقط، والحماية تكون من القاطع (البريكر) الموجود قبله في اللوحة.',
        'مفاتيح GE المتوفرة لدينا من النوع غير المصهري، لذلك تأكد أن الدائرة محمية بقاطع مناسب في لوحة التوزيع.',
      ]],
      ['Heavy Duty أم General Duty؟', [
        'مفاتيح Heavy Duty (مثل سلسلة THN من GE) مصممة للاستخدام المتكرر والأحمال الصناعية والتجارية، وتتحمل جهداً حتى 600 فولت بثلاث أقطاب. مفاتيح General Duty (مثل سلسلة TGN) مناسبة للاستخدامات السكنية والخفيفة.',
      ]],
      ['كيف تختار القدرة بالأمبير؟', [
        'القاعدة الأساسية: يجب أن تكون قدرة المفتاح أكبر من تيار الحمل الذي سيفصله، مع هامش أمان. كمثال عام: 30 أمبير لوحدات التكييف الصغيرة والمضخات، 60 أمبير للوحدات الأكبر واللوحات الفرعية، 100 و200 أمبير للتغذية الرئيسية للفلل والمباني والمعدات الكبيرة.',
        'الاختيار النهائي يحدده المهندس الكهربائي حسب حسابات الأحمال ومتطلبات كود البناء السعودي (SBC 401). وإذا عندك جدول أحمال أو مخطط، أرسله لنا ونساعدك في تحديد الموديلات.',
      ]],
      ['الموديلات المتوفرة', [
        'نوفر مفاتيح فصل جنرال إلكتريك GE الداخلية والخارجية بقدرات 30 و60 و100 و200 أمبير، مثل THN3364R (خارجي 200 أمبير 3 فاز Heavy Duty) وTHN3361R (خارجي 30 أمبير). تصفح القسم واطلب عرض سعر للكمية التي تحتاجها.',
      ]],
    ],
  },
  {
    slug: 'earthing-system-guide',
    en: { title: "Earthing and lightning protection systems: components and how they work in buildings", description: "A simple explanation of earthing (grounding) and lightning protection: copper-bonded earth rods, earth bars, copper tape, clamps, earth pits and the standards used in Saudi Arabia.", sections: [["Why do we need earthing?", ["An earthing (grounding) system provides a safe path for fault current to flow into the ground instead of through a person or equipment. Without it, metal parts of appliances can become live during a fault, and protective devices may not operate correctly.", "Earthing is a basic requirement of the Saudi Building Code (SBC 401) for all facilities, from villas and apartments to factories and power stations."]], ["Main components", ["Earth rod: a copper-bonded steel rod driven into the ground; the heart of the system. It comes in different lengths and diameters, and rods can be joined with couplings to reach greater depth.", "Earth pit: a small concrete chamber above the rod that protects it and gives access for measuring earth resistance and maintenance.", "Copper earth bar: a copper bar in the electrical room where all earth conductors terminate; some include a test link to disconnect and measure the system.", "Copper tape and earth cable: copper tape (such as 25×3 mm) or green/yellow earth cable connects rods to the earth bar and equipment.", "Clamps and weld powder: copper clamps connect cable or tape to the rod, or exothermic welding with weld powder creates a permanent joint unaffected by corrosion."]], ["Lightning protection", ["A lightning protection system intercepts a strike before it hits the building and conducts it to ground. It consists of air terminals on the highest roof points, copper-tape down conductors on the facades, test clamps, and earth rods in the ground.", "Lightning protection design usually follows IEC 62305 and is specified by the engineer according to the building height, location and use."]], ["Installation tips", ["Use genuine copper components from a reliable source; poor joints corrode and raise the system resistance over time.", "Measure earth resistance after installation and periodically, and meet the value specified by the consultant in the project specification.", "Keep all joints accessible for inspection, and record the locations of rods and earth pits on the drawings."]], ["Available products", ["We supply complete earthing and lightning protection components, including Bahra products: copper-bonded rods, earth bars from 6 to 30 ways, copper tape, all types of clamps, earth pits, weld powder and air rods, plus earth cable and bare copper in all sizes."]]] },
    date: '2026-11-22',
    title: 'نظام التأريض ومانع الصواعق: المكونات وطريقة عملها في المباني',
    description: 'شرح مبسط لنظام التأريض (الأرضي) ومانع الصواعق: أسياخ التأريض النحاسية، البسبار، الشريط النحاسي، الكلامبات، غرف التفتيش، والمواصفات المعتمدة في السعودية.',
    categories: ['ph-earthing-ysystem', 'ph-cables-wires'],
    sections: [
      ['لماذا نحتاج التأريض؟', [
        'نظام التأريض (ويسمى الأرضي أو الإرث أو Grounding) يوفر مساراً آمناً لتيار الأعطال ليذهب إلى الأرض بدل أن يمر في جسم الإنسان أو يتلف الأجهزة. بدونه قد تصبح الأجزاء المعدنية للأجهزة مكهربة عند حدوث عطل، ولا تعمل أجهزة الحماية بالشكل الصحيح.',
        'التأريض مطلب أساسي في كود البناء السعودي (SBC 401) لكل المنشآت، من الفلل والشقق إلى المصانع ومحطات الكهرباء.',
      ]],
      ['المكونات الأساسية', [
        'سيخ التأريض (Earth Rod): قضيب فولاذي مغطى بالنحاس يدق في الأرض، وهو قلب النظام. يأتي بأطوال وأقطار مختلفة، ويمكن توصيل أكثر من سيخ بجلبة توصيل للوصول لعمق أكبر.',
        'غرفة التفتيش (Earth Pit): غرفة إسمنتية صغيرة فوق السيخ تحميه وتسمح بالوصول إليه لقياس مقاومة الأرضي وصيانته.',
        'البسبار النحاسي (Earth Bar): مسطرة نحاس تجمع عليها كل موصلات الأرضي في غرفة الكهرباء، وبعضها مزود بوصلة فصل (Test Link) لفصل النظام وقياسه.',
        'الشريط النحاسي والكيبل الأرضي: الشريط النحاسي (مثل 25×3 مم) أو الكيبل الأخضر والأصفر يربط الأسياخ بالبسبار والمعدات.',
        'الكلامبات وبودرة اللحام: كلامبات نحاس لربط الكيبل أو الشريط بالسيخ، أو لحام حراري (Exothermic) ببودرة اللحام لوصلة دائمة لا تتأثر بالتآكل.',
      ]],
      ['مانع الصواعق', [
        'مانع الصواعق (Lightning Protection) يلتقط الصاعقة قبل أن تضرب المبنى ويصرفها للأرض. يتكون من أسياخ هوائية (Air Terminals) على أعلى نقاط السطح، وموصلات نزول من الشريط النحاسي على الواجهات، ووصلات اختبار، ثم أسياخ التأريض في الأرض.',
        'تصميم مانع الصواعق يتبع عادة المواصفة الدولية IEC 62305، ويحدده المهندس حسب ارتفاع المبنى وموقعه واستخدامه.',
      ]],
      ['نصائح عند التنفيذ', [
        'استخدم مكونات نحاسية أصلية من مصدر موثوق، لأن الوصلات الرديئة تتآكل وترفع مقاومة النظام مع الوقت.',
        'قِس مقاومة الأرضي بعد التركيب وبشكل دوري، والتزم بالقيمة التي يحددها الاستشاري في مواصفات المشروع.',
        'اجعل كل الوصلات في أماكن يمكن فحصها، ووثّق مواقع الأسياخ وغرف التفتيش في المخططات.',
      ]],
      ['المنتجات المتوفرة', [
        'نوفر مكونات التأريض ومانعات الصواعق كاملة، ومنها منتجات بحرة (Bahra): أسياخ نحاسية، بسبار من 6 إلى 30 خط، شريط نحاس، كلامبات بأنواعها، غرف تفتيش، بودرة لحام وأسياخ هوائية، بالإضافة إلى الكيبل الأرضي والنحاس العاري بجميع المقاسات.',
      ]],
    ],
  },
  {
    slug: 'emt-rigid-flexible-conduit',
    en: { title: "EMT vs Rigid vs flexible metal conduit: which to use and when?", description: "A comparison of metal electrical conduit types: lightweight EMT, heavy Rigid, flexible and liquid-tight flexible conduit, with the fittings each type needs.", sections: [["Why metal conduit?", ["Metal conduit protects wiring from impact, heat and rodents, and in some systems acts as an additional earth path, which is why many commercial, industrial and government projects specify it instead of PVC conduit."]], ["EMT (lightweight)", ["EMT (Electrical Metallic Tubing) is a thin-wall galvanized steel tube, light and easy to cut and bend. It is used for exposed indoor runs: above false ceilings, in electrical rooms, warehouses and covered car parks.", "It is not threaded; it is installed with its own fittings: connectors and couplings of the set-screw or compression type."]], ["Rigid (heavy)", ["Rigid conduit (RMC) is a thick-wall steel conduit with threaded ends, stronger and more durable. It is used outdoors and in industrial areas, locations exposed to impact, and exposed runs on facades and roofs.", "Its fittings are threaded: heavy threaded couplings, heavy connectors, locknuts and bushings that protect wire insulation where it enters boxes."]], ["Flexible metal conduit", ["Flexible metal conduit is used for the final run between fixed conduit and equipment, especially equipment that vibrates or needs slight movement: motors, pumps, AC units and ceiling luminaires.", "The liquid-tight type has a PVC jacket and is used in wet and outdoor locations. It needs its own connectors (straight or 90°) to keep the seal."]], ["Essential fittings for any installation", ["Fixing clamps (one-hole or two-hole), clamps for hanging on Unistrut channel or from the ceiling, 90° elbows, and octagonal and square metal boxes with covers. Choose fittings of the same type (EMT or Rigid) and size as the conduit."]], ["Sizes and available products", ["We supply conduits and fittings from Saudi manufacturer ITCC, the first UL-listed conduit factory in Saudi Arabia, in 1/2, 3/4 and 1 inch: EMT and Rigid conduit, flexible and liquid-tight flexible conduit, connectors, couplings, elbows, clamps and boxes. For those who prefer plastic, we also supply PVC and UPVC conduits with their fittings."]]] },
    date: '2026-11-22',
    title: 'الفرق بين مواسير EMT وRigid والجرجور المعدني: أيها تستخدم ومتى؟',
    description: 'مقارنة بين أنواع مواسير الكهرباء المعدنية: EMT الخفيفة، Rigid الثقيلة، الجرجور المعدني المرن والمعزول ضد الماء، مع الملحقات المطلوبة لكل نوع.',
    categories: ['ph-itcc-1', 'ph-pvc-conduits'],
    sections: [
      ['لماذا المواسير المعدنية؟', [
        'المواسير المعدنية تحمي الأسلاك من الصدمات والحرارة والقوارض، وتعمل كمسار أرضي إضافي في بعض الأنظمة، لذلك تطلبها مواصفات كثير من المشاريع التجارية والصناعية والحكومية بدل مواسير PVC.',
      ]],
      ['مواسير EMT (الخفيفة)', [
        'EMT (Electrical Metallic Tubing) ماسورة فولاذية مجلفنة رقيقة الجدار وخفيفة الوزن، سهلة القص والتعريج. تستخدم في التمديدات المكشوفة داخل المباني: الأسقف المعلقة، غرف الكهرباء، المستودعات والمواقف المغطاة.',
        'لا تُسنّن، وتركب بملحقات خاصة: كونكتر (ملبوش) وجلبة (كوبلينج) بنوع البرغي (Set Screw) أو الكبس (Compression).',
      ]],
      ['مواسير Rigid (الثقيلة)', [
        'Rigid أو RMC ماسورة فولاذية سميكة الجدار ومسننة الأطراف، أقوى وأكثر تحملاً. تستخدم في الأماكن الخارجية والصناعية، والمواقع المعرضة للصدمات، والتمديدات المكشوفة على الواجهات والأسطح.',
        'ملحقاتها مسننة: جلب ثقيلة مسننة، ملبوش ثقيل، وردة (Locknut) وبوشينق لحماية عزل الأسلاك عند دخول العلب.',
      ]],
      ['الجرجور المعدني (Flexible)', [
        'الجرجور المعدني المرن (Flexible Metal Conduit) يستخدم للمسافة الأخيرة بين الماسورة الثابتة والمعدة، خاصة المعدات التي تهتز أو تحتاج حركة بسيطة: المحركات، المضخات، وحدات التكييف، وكشافات الأسقف.',
        'النوع المعزول ضد الماء (Liquid-Tight) مغطى بطبقة PVC، ويستخدم في الأماكن الرطبة والخارجية. ويحتاج كونكتر خاص به (مستقيم أو زاوية) ليحافظ على العزل.',
      ]],
      ['الملحقات الأساسية لأي تمديد', [
        'كلامبات تثبيت (فتحة واحدة أو فتحتين)، كلامبات تعليق على التشنل (Unistrut) أو السقف، أكواع 90 درجة، علب معدنية مثمنة ومربعة مع أغطيتها. اختر الملحقات من نفس نوع الماسورة (EMT أو Rigid) ونفس المقاس.',
      ]],
      ['المقاسات والمنتجات المتوفرة', [
        'نوفر مواسير وملحقات ITCC السعودية، وهي أول مصنع مواسير في السعودية حاصل على اعتماد UL، بمقاسات 1/2 و3/4 و1 إنش: مواسير EMT وRigid، جرجور مرن ومعزول، كونكتر وجلب وأكواع وكلامبات وعلب. ولمن يفضل البلاستيك، نوفر مواسير PVC وUPVC مع ملحقاتها.',
      ]],
    ],
  },
];

export const articleBySlug = (slug) => ARTICLES.find((a) => a.slug === slug);

// نسخة المقال حسب اللغة
export const localize = (a, lang) => (lang === 'en' && a.en ? { ...a, ...a.en, lang: 'en' } : { ...a, lang: 'ar' });
