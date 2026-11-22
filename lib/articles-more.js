// أدلة فنية إضافية (نوفمبر 2026)
// الفقرة إما نص، أو جدول: { table: [[عناوين الأعمدة], [صف], ...] }
export const MORE_ARTICLES = [
  {
    slug: 'lszh-lsoh-cable-meaning',
    date: '2026-11-22',
    title: 'وش يعني LSZH وLSOH في الكيابل؟ ومتى تحتاجه في مشروعك',
    description: 'شرح مبسط لكيابل قليلة الدخان وخالية من الهالوجين (LSZH / LSOH)، والفرق بينها وبين الكيابل المقاومة للحريق (MICA وFP200)، والأماكن اللي تحتاجها فيها.',
    categories: ['ph-cables-wires', 'ph-belden-1', 'ph-rubber-cables'],
    sections: [
      ['معنى LSZH وLSOH', [
        'LSZH اختصار Low Smoke Zero Halogen، وLSOH اختصار Low Smoke Zero (0) Halogen، والاثنين بنفس المعنى: كيبل غلافه وعزله من مادة تطلع دخان قليل جداً لما تحترق، وما فيها هالوجين (كلور وفلور وبروم).',
        'الكيبل العادي غلافه PVC، وهذا لما يحترق يطلع دخان أسود كثيف وغاز حمضي (كلوريد الهيدروجين). الدخان يغطي مخارج الطوارئ، والغاز يضر الرئة ويأكل الأجهزة الإلكترونية حتى بعد ما ينطفي الحريق.',
      ]],
      ['الفرق بين PVC وLSZH والمقاوم للحريق', [
        { table: [
          ['النوع', 'وش يسوي في الحريق', 'المواصفات المرجعية'],
          ['PVC عادي', 'يحترق ويطلع دخان كثيف وغاز حمضي', 'IEC 60227 / BS 6004'],
          ['LSZH / LSOH', 'دخان قليل وبدون غاز حمضي، وما ينشر اللهب', 'IEC 60754 (الغازات)، IEC 61034 (كثافة الدخان)، IEC 60332 (انتشار اللهب)'],
          ['مقاوم للحريق (MICA، FP200)', 'يكمل يوصل الكهرباء وقت الحريق لفترة محددة، وغالباً يكون LSZH بعد', 'IEC 60331، BS 6387، BS 8434'],
        ] },
        'انتبه: LSZH ما يعني إن الكيبل يشتغل وقت الحريق. هو يقلل الدخان والغازات بس. إذا تبي الدائرة تكمل تشتغل وقت الحريق (مثل إنذار الحريق ومضخات الإطفاء وإنارة الطوارئ) تحتاج كيبل مقاوم للحريق مثل كيابل MICA وFP200.',
      ]],
      ['وين تحتاج LSZH؟', [
        'أي مكان فيه ناس كثير ومخارجه محدودة، أو فيه أجهزة غالية: المستشفيات، والمدارس والجامعات، والمولات والمطارات ومحطات القطار، والأنفاق، ومراكز البيانات وغرف السيرفرات، وممرات الهروب في الأبراج والفنادق.',
        'مواصفات المشروع وكود الحماية من الحريق (SBC 801) واشتراطات الدفاع المدني هي اللي تحدد وين يلزم. في الفلل والاستخدام العادي الكيبل PVC مقبول غالباً، لكن كثير من الملاك يختارون LSZH للأمان.',
      ]],
      ['كيف تعرف إن الكيبل LSZH؟', [
        'تلقى مكتوب على الغلاف LSZH أو LSOH أو LS0H أو Halogen Free، مع رقم المواصفة. لون الغلاف ما يدل على النوع، فاعتمد على الكتابة والشهادة من المصنع.',
      ]],
      ['المتوفر عندنا', [
        'نوفر كيابل MICA وLSOH المقاومة للحريق، وكيابل داتا Belden بغلاف LSZH (مثل CAT6A)، وأسلاك وكيابل القوى بالمقاسات المختلفة. أرسل لنا جدول الكميات ونرد عليك بعرض سعر.',
      ]],
    ],
    en: {
      title: 'What do LSZH and LSOH mean on a cable, and when do you need them?',
      description: 'A plain guide to low smoke zero halogen (LSZH / LSOH) cables, how they differ from fire-resistant cables (MICA, FP200), and where they are required.',
      sections: [
        ['What LSZH and LSOH mean', [
          'LSZH stands for Low Smoke Zero Halogen and LSOH for Low Smoke Zero (0) Halogen; both mean the same thing. The sheath and insulation give off very little smoke when burned and contain no halogens (chlorine, fluorine, bromine).',
          'Ordinary cables use PVC, which burns with thick black smoke and releases acid gas (hydrogen chloride). The smoke hides escape routes, and the gas harms lungs and corrodes electronics even after the fire is out.',
        ]],
        ['PVC vs LSZH vs fire-resistant', [
          { table: [
            ['Type', 'Behaviour in a fire', 'Reference standards'],
            ['Standard PVC', 'Burns with dense smoke and acid gas', 'IEC 60227 / BS 6004'],
            ['LSZH / LSOH', 'Little smoke, no acid gas, does not spread flame', 'IEC 60754 (gases), IEC 61034 (smoke density), IEC 60332 (flame spread)'],
            ['Fire-resistant (MICA, FP200)', 'Keeps the circuit working during a fire for a rated time; usually LSZH as well', 'IEC 60331, BS 6387, BS 8434'],
          ] },
          'Note: LSZH does not mean the cable keeps working in a fire. It only reduces smoke and gases. Circuits that must keep running during a fire (fire alarm, fire pumps, emergency lighting) need fire-resistant cable such as MICA or FP200.',
        ]],
        ['Where LSZH is needed', [
          'Anywhere with many people and limited exits, or with valuable equipment: hospitals, schools and universities, malls, airports and stations, tunnels, data centres and server rooms, and escape routes in towers and hotels.',
          'The project specification, the Saudi Fire Code (SBC 801) and Civil Defense requirements decide where it is mandatory. In villas, PVC cable is usually acceptable, though many owners choose LSZH for safety.',
        ]],
        ['How to tell a cable is LSZH', [
          'The sheath is printed with LSZH, LSOH, LS0H or Halogen Free, along with the standard number. Sheath colour does not indicate the type; rely on the printing and the manufacturer certificate.',
        ]],
        ['What we supply', [
          'We supply MICA and LSOH fire-resistant cables, Belden data cables with LSZH jackets (such as CAT6A), and power wires and cables in all common sizes. Send us your bill of quantities and we will reply with a quotation.',
        ]],
      ],
    },
  },
  {
    slug: 'how-many-wires-in-conduit',
    date: '2026-11-22',
    title: 'كم سلك يدخل في الماسورة؟ جدول جاهز لمواسير PVC وEMT',
    description: 'جدول بعدد الأسلاك المسموح في كل مقاس ماسورة: مواسير PVC بالمليمتر مع أسلاك NYA، ومواسير EMT بالإنش مع أسلاك THHN، وليش ما نعبي الماسورة لآخرها.',
    categories: ['ph-pvc-conduits', 'ph-itcc-1', 'ph-cables-wires'],
    sections: [
      ['ليش ما نعبي الماسورة لآخرها؟', [
        'الأسلاك داخل الماسورة تسخن مع الحمل، وكل ما زاد عددها قلّت قدرتها على التخلص من الحرارة. وكمان السحب في ماسورة مزحومة يجرح العزل، والجرح هذا يسبب تماس بعد فترة.',
        'عشان كذا المواصفات تحدد نسبة تعبئة قصوى: في المواصفة الأمريكية (NEC) المسموح 40% من مساحة الماسورة الداخلية إذا كانت الأسلاك ثلاثة أو أكثر. وفي المواصفة البريطانية (BS 7671) تُحسب بطريقة "معامل الكيبل ومعامل الماسورة".',
      ]],
      ['مواسير PVC بالمليمتر مع أسلاك NYA (النظام البريطاني)', [
        'العدد التقريبي لأسلاك NYA المجدولة في مسار مستقيم قصير (أقل من 3 متر بدون أكواع):',
        { table: [
          ['مقاس الماسورة', 'سلك 1.5 مم²', 'سلك 2.5 مم²', 'سلك 4 مم²', 'سلك 6 مم²'],
          ['16 مم', '9', '6', '5', '3'],
          ['20 مم', '14', '10', '7', '5'],
          ['25 مم', '25', '18', '13', '9'],
          ['32 مم', '45', '32', '24', '15'],
        ] },
        'إذا المسار أطول أو فيه أكواع، العدد يقل كثير (أحياناً للنص)، لأن السحب يصير أصعب. القاعدة العملية: كل ما طال المسار أو زادت الأكواع، كبّر الماسورة مقاس.',
      ]],
      ['مواسير EMT بالإنش مع أسلاك THHN (النظام الأمريكي)', [
        'العدد الأقصى حسب جداول NEC (الملحق C) لأسلاك THHN في ماسورة EMT:',
        { table: [
          ['مقاس الماسورة', 'سلك 14 AWG', 'سلك 12 AWG', 'سلك 10 AWG'],
          ['1/2 إنش', '12', '9', '5'],
          ['3/4 إنش', '22', '16', '10'],
          ['1 إنش', '35', '26', '16'],
        ] },
      ]],
      ['قواعد مهمة في الموقع', [
        'لا تحط أكثر من 4 أكواع 90 درجة (يعني 360 درجة) بين علبتين سحب. وإذا احتجت أكثر، حط علبة سحب في النص.',
        'كل ما زاد عدد الدوائر في نفس الماسورة، تقل قدرة السلك (الأمبير) ويحتاج تخفيض. فلا تجمع دوائر كثيرة في ماسورة وحدة حتى لو المساحة تكفي.',
        'الأرقام هنا للمساعدة في التقدير. الحساب النهائي على المهندس حسب المخططات وكود البناء السعودي (SBC 401).',
      ]],
      ['المتوفر عندنا', [
        'نوفر مواسير PVC بحرة بالمقاسات المختلفة مع ملحقاتها، ومواسير ITCC الحديد EMT وRigid بمقاسات 1/2 و3/4 و1 إنش، وأسلاك NYA وTHHN. أرسل الكميات ونرد عليك بعرض سعر.',
      ]],
    ],
    en: {
      title: 'How many wires fit in a conduit? Ready tables for PVC and EMT',
      description: 'Tables of how many wires each conduit size can take: metric PVC conduit with NYA wire, and EMT in inches with THHN wire, plus why a conduit is never filled to the top.',
      sections: [
        ['Why not fill the conduit to the top?', [
          'Wires in a conduit heat up under load, and the more wires there are, the harder it is for that heat to escape. Pulling through a crowded conduit also scrapes the insulation, which can cause a short circuit later.',
          'That is why standards set a maximum fill: the American NEC allows 40% of the conduit internal area for three or more wires, and the British BS 7671 uses the cable factor / conduit factor method.',
        ]],
        ['Metric PVC conduit with NYA wire (British practice)', [
          'Approximate number of stranded NYA wires for a short straight run (under 3 m, no bends):',
          { table: [
            ['Conduit size', '1.5 mm² wire', '2.5 mm² wire', '4 mm² wire', '6 mm² wire'],
            ['16 mm', '9', '6', '5', '3'],
            ['20 mm', '14', '10', '7', '5'],
            ['25 mm', '25', '18', '13', '9'],
            ['32 mm', '45', '32', '24', '15'],
          ] },
          'Longer runs or runs with bends take far fewer wires (sometimes half), because pulling gets harder. Rule of thumb: the longer the run or the more bends, the bigger the conduit.',
        ]],
        ['EMT in inches with THHN wire (American practice)', [
          'Maximum number of THHN wires in EMT per NEC Annex C tables:',
          { table: [
            ['Conduit size', '14 AWG wire', '12 AWG wire', '10 AWG wire'],
            ['1/2 inch', '12', '9', '5'],
            ['3/4 inch', '22', '16', '10'],
            ['1 inch', '35', '26', '16'],
          ] },
        ]],
        ['Site rules that matter', [
          'Do not exceed four 90-degree bends (360 degrees in total) between pull boxes; if you need more, add a pull box in between.',
          'The more circuits share a conduit, the lower each wire’s current rating and the more derating it needs. Do not group many circuits in one conduit even if there is room.',
          'These numbers are for estimating. Final sizing is the engineer’s, based on the drawings and the Saudi Building Code (SBC 401).',
        ]],
        ['What we supply', [
          'We supply Bahra PVC conduits in all common sizes with fittings, ITCC steel EMT and rigid conduit in 1/2, 3/4 and 1 inch, and NYA and THHN wires. Send us your quantities for a quotation.',
        ]],
      ],
    },
  },
  {
    slug: 'steel-vs-pvc-conduit',
    date: '2026-11-22',
    title: 'الماسورة الحديد ولا البلاستيك؟ متى تستخدم EMT ومتى تستخدم PVC',
    description: 'مقارنة عملية بين المواسير الحديد (EMT وRigid) والبلاستيك (PVC وUPVC): القوة، والتركيب، والتأريض، والسعر، ووين يناسب كل نوع.',
    categories: ['ph-itcc-1', 'ph-pvc-conduits'],
    sections: [
      ['الخلاصة بسرعة', [
        'البلاستيك (PVC) للتمديد المخفي داخل الجدران والأسقف الخرسانية وتحت الأرض. والحديد (EMT وRigid) للتمديد الظاهر وأماكن الصدمات والمصانع والمواقف وغرف الكهرباء والمكائن.',
      ]],
      ['مقارنة سريعة', [
        { table: [
          ['البند', 'حديد (EMT / Rigid)', 'بلاستيك (PVC / UPVC)'],
          ['القوة ضد الصدمات', 'عالية', 'متوسطة إلى ضعيفة'],
          ['الوزن والتركيب', 'أثقل، ويحتاج ثني بأداة وتثبيت بكونكترات', 'خفيف، ويتلصق بالغراء ويثنى بالسبرنق'],
          ['الحريق', 'ما يحترق', 'يلين مع الحرارة، والعادي منه يطلع دخان'],
          ['الصدأ والرطوبة', 'يحتاج جلفنة، وRigid أفضل في الخارج', 'ما يصدي، ممتاز للرطوبة وتحت الأرض'],
          ['التأريض', 'الماسورة نفسها ممكن تكون مسار أرضي إذا ركبت صح', 'لازم سلك أرضي مستقل'],
          ['السعر', 'أعلى', 'أقل'],
          ['أشهر الاستخدامات', 'تمديد ظاهر، مصانع، مواقف، غرف كهرباء، فوق الأسقف المستعارة', 'داخل الخرسانة والجدران، والفلل، وتحت الأرض (UPVC)'],
        ] },
      ]],
      ['أنواع المواسير الحديد', [
        'EMT: ماسورة خفيفة بدون سن، تتركب بكونكتر وجلبة بالبرغي، وهي الأكثر استخداماً في التمديد الظاهر داخل المباني.',
        'Rigid (RSC): ماسورة سميكة مسننة، للأماكن الخارجية والمعرضة للصدمات والمناطق الخطرة.',
        'المرنة (Flexible): جرجور حديد يوصل للمكائن والمعدات اللي تهتز مثل المكيفات والمضخات، والمعزولة منه (Liquid-tight) للأماكن الرطبة.',
      ]],
      ['أنواع المواسير البلاستيك', [
        'PVC الأسود: للتمديد المخفي داخل الجدران والأسقف، ويجي خفيف وثقيل (Light / Heavy Gauge). الثقيل أنسب داخل الخرسانة.',
        'UPVC الرمادي (Schedule 40): أقوى، للتمديدات تحت الأرض وبين المباني.',
      ]],
      ['أخطاء شائعة', [
        'استخدام PVC ظاهر في مكان معرض للشمس والصدمات، فيتكسر مع الوقت. أو تمديد EMT في مكان رطب بدون ملحقات مقاومة للماء. أو نسيان سلك الأرضي مع مواسير البلاستيك.',
        'نوع الماسورة يحدده المهندس حسب مواصفات المشروع وكود البناء السعودي (SBC 401).',
      ]],
      ['المتوفر عندنا', [
        'مواسير ITCC الحديد (EMT وRigid والمرن) مع الكونكترات والجلب والكلامبات، ومواسير PVC وUPVC بحرة مع الأكواع والعلب والغراء. اطلب عرض سعر بالكميات.',
      ]],
    ],
    en: {
      title: 'Steel or PVC conduit? When to use EMT and when to use PVC',
      description: 'A practical comparison of steel conduit (EMT, rigid) and plastic conduit (PVC, UPVC): strength, installation, earthing, cost and where each fits.',
      sections: [
        ['The short answer', [
          'PVC is for concealed runs inside walls, concrete slabs and underground. Steel (EMT and rigid) is for exposed runs, impact-prone areas, factories, car parks, electrical rooms and plant rooms.',
        ]],
        ['Quick comparison', [
          { table: [
            ['Item', 'Steel (EMT / Rigid)', 'Plastic (PVC / UPVC)'],
            ['Impact strength', 'High', 'Medium to low'],
            ['Weight and installation', 'Heavier; needs a bender and connectors', 'Light; solvent-cemented, bent with a spring'],
            ['Fire', 'Does not burn', 'Softens with heat; standard PVC gives off smoke'],
            ['Rust and moisture', 'Needs galvanising; rigid is better outdoors', 'Does not rust; ideal for damp and underground'],
            ['Earthing', 'Can serve as an earth path when installed correctly', 'Needs a separate earth wire'],
            ['Cost', 'Higher', 'Lower'],
            ['Typical use', 'Exposed runs, factories, car parks, electrical rooms, above false ceilings', 'Inside concrete and walls, villas, underground (UPVC)'],
          ] },
        ]],
        ['Types of steel conduit', [
          'EMT: thin-wall, unthreaded, joined with set-screw connectors and couplings; the most common choice for exposed runs inside buildings.',
          'Rigid (RSC): thick-wall, threaded; for outdoor, impact-prone and hazardous areas.',
          'Flexible: steel flex for connecting vibrating equipment such as AC units and pumps; the liquid-tight type is for damp locations.',
        ]],
        ['Types of plastic conduit', [
          'Black PVC: for concealed runs in walls and ceilings, in light and heavy gauge. Heavy gauge suits concrete.',
          'Grey UPVC (Schedule 40): stronger, for underground runs and runs between buildings.',
        ]],
        ['Common mistakes', [
          'Exposed PVC in sun or impact areas that cracks over time; EMT in damp areas without watertight fittings; forgetting the earth wire in PVC runs.',
          'The conduit type is decided by the engineer based on the project specification and the Saudi Building Code (SBC 401).',
        ]],
        ['What we supply', [
          'ITCC steel conduit (EMT, rigid and flexible) with connectors, couplings and clamps, and Bahra PVC and UPVC conduit with bends, boxes and cement. Request a quote for your quantities.',
        ]],
      ],
    },
  },
  {
    slug: 'cable-size-by-ampere',
    date: '2026-11-22',
    title: 'كيف تختار مقاس السلك حسب الأمبير؟ جدول للنحاس مع تصحيح حرارة السعودية',
    description: 'جدول تقريبي لقدرة أسلاك النحاس بالأمبير من 1.5 إلى 35 مم²، وتأثير الحرارة العالية في السعودية، والمقاسات الشائعة للإنارة والأفياش والمكيفات.',
    categories: ['ph-cables-wires', 'ph-schneider', 'ph-ge-general-electric'],
    sections: [
      ['ثلاث أشياء تحدد المقاس', [
        'أولاً: التيار اللي بيمر في السلك (الحمل). ثانياً: طريقة التمديد، لأن السلك داخل ماسورة في الجدار يبرد أقل من السلك المكشوف. ثالثاً: حرارة المكان وطول المسار، لأن الحرارة تقلل قدرة السلك، والطول يسبب هبوط في الجهد.',
        'والقاعدة الأساسية: قاطع الدائرة لازم يكون أقل من أو يساوي قدرة السلك، عشان القاطع يفصل قبل ما يسخن السلك.',
      ]],
      ['قدرة أسلاك النحاس بالأمبير (عزل PVC، دائرة أحادية)', [
        'قيم مرجعية حسب IEC 60364-5-52 على حرارة 30 درجة:',
        { table: [
          ['المقاس', 'داخل ماسورة على الجدار', 'مثبت مكشوف على الجدار'],
          ['1.5 مم²', '17.5 أمبير', '19.5 أمبير'],
          ['2.5 مم²', '24 أمبير', '27 أمبير'],
          ['4 مم²', '32 أمبير', '36 أمبير'],
          ['6 مم²', '41 أمبير', '46 أمبير'],
          ['10 مم²', '57 أمبير', '63 أمبير'],
          ['16 مم²', '76 أمبير', '85 أمبير'],
          ['25 مم²', '101 أمبير', '112 أمبير'],
          ['35 مم²', '125 أمبير', '138 أمبير'],
        ] },
      ]],
      ['الحرارة في السعودية تقلل القدرة', [
        'الجدول فوق محسوب على 30 درجة. في الأسطح والأسقف والغرف الحارة في السعودية الحرارة توصل 45 و50 درجة، وهنا لازم تضرب القدرة في معامل تصحيح (لعزل PVC):',
        { table: [
          ['حرارة المكان', 'المعامل', 'مثال: سلك 2.5 مم² في ماسورة'],
          ['30 درجة', '1.00', '24 أمبير'],
          ['40 درجة', '0.87', '21 أمبير'],
          ['45 درجة', '0.79', '19 أمبير'],
          ['50 درجة', '0.71', '17 أمبير'],
        ] },
        'وإذا فيه أكثر من دائرة في نفس الماسورة تحتاج تخفيض إضافي. عشان كذا كثير من المهندسين في السعودية يكبرون المقاس درجة عن المعتاد.',
      ]],
      ['المقاسات الشائعة في الفلل والشقق', [
        { table: [
          ['الاستخدام', 'المقاس الشائع', 'القاطع الشائع'],
          ['الإنارة', '1.5 أو 2.5 مم²', '10 أو 16 أمبير'],
          ['الأفياش العادية', '2.5 مم²', '16 أو 20 أمبير'],
          ['مكيف سبليت أو شباك', '4 مم²', '20 إلى 25 أمبير'],
          ['السخان والفرن', '4 أو 6 مم²', '25 إلى 32 أمبير'],
        ] },
        'هذي أمثلة شائعة للتوضيح بس. المقاس الصحيح يختلف حسب قدرة الجهاز وطول المسار، والحساب النهائي على المهندس حسب كود البناء السعودي (SBC 401).',
      ]],
      ['المسارات الطويلة', [
        'إذا المسار طويل (مثل تغذية ملحق أو سور أو مضخة بعيدة) الجهد ينزل على طول السلك، والجهاز يشتغل ضعيف أو يسخن. الحل تكبير المقاس حتى لو الأمبير يسمح بالمقاس الأصغر.',
      ]],
      ['المتوفر عندنا', [
        'أسلاك NYA وTHHN وكيابل القوى من 1.5 مم² للمقاسات الكبيرة، وقواطع شنايدر ومفاتيح فصل GE. أرسل جدول الأحمال أو الكميات ونرد عليك بعرض سعر.',
      ]],
    ],
    en: {
      title: 'How to choose wire size by amperage: a copper table with Saudi heat correction',
      description: 'An approximate table of copper wire current ratings from 1.5 to 35 mm², how high Saudi temperatures reduce them, and common sizes for lighting, sockets and AC.',
      sections: [
        ['Three things decide the size', [
          'First, the current the wire will carry (the load). Second, the installation method, since a wire in conduit inside a wall cools less than an exposed one. Third, the ambient temperature and run length: heat reduces the rating and length causes voltage drop.',
          'The basic rule: the circuit breaker rating must be less than or equal to the wire rating, so the breaker trips before the wire overheats.',
        ]],
        ['Copper wire current ratings (PVC insulation, single-phase)', [
          'Reference values per IEC 60364-5-52 at 30 °C:',
          { table: [
            ['Size', 'In conduit on a wall', 'Clipped direct on a wall'],
            ['1.5 mm²', '17.5 A', '19.5 A'],
            ['2.5 mm²', '24 A', '27 A'],
            ['4 mm²', '32 A', '36 A'],
            ['6 mm²', '41 A', '46 A'],
            ['10 mm²', '57 A', '63 A'],
            ['16 mm²', '76 A', '85 A'],
            ['25 mm²', '101 A', '112 A'],
            ['35 mm²', '125 A', '138 A'],
          ] },
        ]],
        ['Saudi heat reduces the rating', [
          'The table assumes 30 °C. On roofs, in ceiling voids and in hot rooms in Saudi Arabia, temperatures reach 45–50 °C, so multiply the rating by a correction factor (PVC insulation):',
          { table: [
            ['Ambient temperature', 'Factor', 'Example: 2.5 mm² in conduit'],
            ['30 °C', '1.00', '24 A'],
            ['40 °C', '0.87', '21 A'],
            ['45 °C', '0.79', '19 A'],
            ['50 °C', '0.71', '17 A'],
          ] },
          'More circuits in the same conduit need further derating, which is why many engineers in Saudi Arabia go one size up.',
        ]],
        ['Common sizes in villas and apartments', [
          { table: [
            ['Use', 'Common wire size', 'Common breaker'],
            ['Lighting', '1.5 or 2.5 mm²', '10 or 16 A'],
            ['General sockets', '2.5 mm²', '16 or 20 A'],
            ['Split or window AC', '4 mm²', '20–25 A'],
            ['Water heater and oven', '4 or 6 mm²', '25–32 A'],
          ] },
          'These are common examples for illustration only. The right size depends on the appliance rating and run length; final sizing is the engineer’s, per the Saudi Building Code (SBC 401).',
        ]],
        ['Long runs', [
          'On long runs (feeding an annex, a boundary wall or a distant pump) voltage drops along the wire and equipment runs weak or overheats. The fix is a larger size even when the current rating would allow a smaller one.',
        ]],
        ['What we supply', [
          'NYA and THHN wires and power cables from 1.5 mm² up to large sizes, Schneider breakers and GE disconnect switches. Send your load schedule or quantities for a quotation.',
        ]],
      ],
    },
  },
  {
    slug: 'nya-vs-thhn-wire',
    date: '2026-11-22',
    title: 'الفرق بين سلك NYA البريطاني وسلك THHN الأمريكي',
    description: 'مقارنة بين أسلاك NYA (المواصفة البريطانية والأوروبية) وأسلاك THHN (المواصفة الأمريكية): العزل، والجهد، والمقاسات بالمليمتر والـ AWG، ومتى تستخدم كل واحد.',
    categories: ['ph-cables-wires', 'ph-itcc-1', 'ph-pvc-conduits'],
    sections: [
      ['الفرق باختصار', [
        'الاثنين أسلاك نحاس مفردة للتمديد داخل المواسير، لكن كل واحد من نظام مختلف. NYA من النظام البريطاني والأوروبي ومقاساته بالمليمتر المربع. وTHHN من النظام الأمريكي ومقاساته بالـ AWG. وفي السعودية تلقى الاثنين حسب مواصفات المشروع.',
      ]],
      ['مقارنة سريعة', [
        { table: [
          ['البند', 'NYA', 'THHN'],
          ['المواصفة', 'IEC 60227 / BS 6004', 'UL 83'],
          ['العزل', 'PVC', 'PVC مع غلاف نايلون خارجي'],
          ['الجهد', '450/750 فولت', '600 فولت'],
          ['حرارة التشغيل', '70 درجة', '90 درجة (في المكان الجاف)'],
          ['المقاسات', 'بالمليمتر المربع: 1.5، 2.5، 4، 6...', 'بالـ AWG: 14، 12، 10، 8...'],
          ['يمشي غالباً مع', 'مواسير PVC بالمليمتر', 'مواسير EMT بالإنش'],
        ] },
        'غلاف النايلون في THHN يخليه أنعم وأسهل في السحب داخل المواسير الطويلة، ويحميه من الزيوت والخدوش.',
      ]],
      ['تحويل المقاسات بين النظامين', [
        { table: [
          ['AWG', 'المساحة بالمليمتر المربع', 'أقرب مقاس NYA'],
          ['14', '2.08 مم²', '2.5 مم²'],
          ['12', '3.31 مم²', '4 مم²'],
          ['10', '5.26 مم²', '6 مم²'],
          ['8', '8.37 مم²', '10 مم²'],
          ['6', '13.3 مم²', '16 مم²'],
        ] },
        'المقاسين مو متطابقين بالضبط. إذا بدلت من نظام لنظام، اختر المقاس الأكبر أو المساوي، ولا تنزل للأصغر.',
      ]],
      ['المجدول والمرن', [
        'NYA يجي مصمت أو مجدول (Stranded)، ونسخته المرنة (Flexible NYA) أسهل في الثني وتستخدم داخل اللوحات. وTHHN غالباً مجدول في المقاسات من 10 AWG وفوق.',
      ]],
      ['أي واحد أختار؟', [
        'اتبع مواصفات المشروع والمخططات. إذا المشروع على النظام الأمريكي (مواسير EMT وقواطع بالإنش) فالمعتاد THHN. وإذا على النظام البريطاني (مواسير PVC بالمليمتر ولوحات IEC) فالمعتاد NYA. والمهم ما تخلط النظامين في نفس الدائرة بدون موافقة المهندس.',
      ]],
      ['المتوفر عندنا', [
        'أسلاك NYA العادية والمرنة بمقاسات مختلفة، وأسلاك THHN مثل 12 AWG، وسلك الأرضي الأخضر والأصفر. ومعها مواسير PVC بحرة وEMT من ITCC. اطلب عرض سعر بالكميات.',
      ]],
    ],
    en: {
      title: 'NYA (British) vs THHN (American) wire: what is the difference?',
      description: 'A comparison of NYA wire (British/European standard) and THHN wire (American standard): insulation, voltage, mm² vs AWG sizes, and when to use each.',
      sections: [
        ['The short answer', [
          'Both are single copper wires for pulling through conduit, but they belong to different systems. NYA follows British and European practice and is sized in square millimetres. THHN follows American practice and is sized in AWG. In Saudi Arabia you will find both, depending on the project specification.',
        ]],
        ['Quick comparison', [
          { table: [
            ['Item', 'NYA', 'THHN'],
            ['Standard', 'IEC 60227 / BS 6004', 'UL 83'],
            ['Insulation', 'PVC', 'PVC with an outer nylon jacket'],
            ['Voltage', '450/750 V', '600 V'],
            ['Operating temperature', '70 °C', '90 °C (dry locations)'],
            ['Sizes', 'mm²: 1.5, 2.5, 4, 6...', 'AWG: 14, 12, 10, 8...'],
            ['Usually paired with', 'Metric PVC conduit', 'EMT in inches'],
          ] },
          'The nylon jacket on THHN makes it slicker and easier to pull through long conduit runs, and protects it from oil and abrasion.',
        ]],
        ['Converting sizes between the two systems', [
          { table: [
            ['AWG', 'Area in mm²', 'Nearest NYA size'],
            ['14', '2.08 mm²', '2.5 mm²'],
            ['12', '3.31 mm²', '4 mm²'],
            ['10', '5.26 mm²', '6 mm²'],
            ['8', '8.37 mm²', '10 mm²'],
            ['6', '13.3 mm²', '16 mm²'],
          ] },
          'The sizes do not match exactly. When switching systems, choose the equal or larger size, never the smaller one.',
        ]],
        ['Stranded and flexible', [
          'NYA comes solid or stranded, and its flexible version (Flexible NYA) bends easily and is used inside panels. THHN is usually stranded from 10 AWG upwards.',
        ]],
        ['Which one should I choose?', [
          'Follow the project specification and drawings. American-practice projects (EMT conduit, inch sizes) normally use THHN; British-practice projects (metric PVC conduit, IEC panels) normally use NYA. Do not mix the two systems in one circuit without the engineer’s approval.',
        ]],
        ['What we supply', [
          'Standard and flexible NYA wire in several sizes, THHN wire such as 12 AWG, and green/yellow earth wire, plus Bahra PVC conduit and ITCC EMT. Request a quote for your quantities.',
        ]],
      ],
    },
  },
];
