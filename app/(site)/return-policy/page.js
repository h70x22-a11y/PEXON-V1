import Link from 'next/link';
import { getSettings } from '@/lib/db';
import { getLang, t } from '@/lib/i18n';

export async function generateMetadata() {
  return { title: t(await getLang()).returnTitle };
}

function content(lang, name) {
  if (lang === 'en') {
    return [
      ['Return policy', [
        `Returned items are not considered the property of ${name} until they arrive at our fulfillment center.`,
        `You may return new, unopened products purchased from ${name}.`,
        `When submitting a return request, you must state the reason for the return, and ${name} reserves the right to assess this reason.`,
      ]],
      ['Products that cannot be returned', [
        '1. Return requests submitted after the set period of 7 days from the date of receipt.',
        '2. Products that have been used or damaged, or are not in the same condition in which you received them.',
        '3. Defective products covered by the manufacturer\'s warranty.',
        '4. Consumable products that have been used or installed.',
        '5. Products that have been tampered with or whose serial numbers have been removed.',
        '6. Products without their price tags, labels or original packaging, or missing any of their accessories.',
        '7. Cables cut to length at the customer\'s request, unless there is a manufacturing defect.',
        '8. Single-core wire coils and flexible cables: only color exchanges are allowed, provided they are in their original condition.',
      ]],
      ['Refunds without return', [
        `We may, at our discretion, refund the amount without requiring the product to be returned; in this case, the product is not considered the property of ${name}.`,
        'Return terms may vary according to the agreement with each customer.',
      ]],
      ['Product specifications', [
        `${name} strives to be fully accurate. However, ${name} does not guarantee that the specifications of any product or the content of any of its services are accurate, complete, reliable, current or error-free.`,
        `If a product supplied by ${name} does not match its description, the sole remedy is to return the product in its unused condition.`,
      ]],
    ];
  }
  return [
    ['سياسة الاسترجاع', [
      `لا تُعتبر العناصر المُعادة ملكاً لـ${name} حتى وصولها إلى مركز الاستيفاء الخاص بنا.`,
      `يمكنك إعادة المنتجات الجديدة غير المفتوحة المُشتراة من ${name}.`,
      `عند تقديم طلب الإرجاع يجب تحديد سبب الإرجاع، ويحق لـ${name} تقييم هذا السبب.`,
    ]],
    ['المنتجات التي لا يمكن إرجاعها', [
      '١. عند تقديم طلب الإرجاع بعد المدة المحددة، وهي ٧ أيام من تاريخ الاستلام.',
      '٢. عند استخدام المنتج، أو تلفه، أو عندما لا يكون بنفس الحالة التي استلمته بها.',
      '٣. المنتجات التالفة التي يغطيها ضمان الشركة المصنعة.',
      '٤. المنتجات الاستهلاكية التي تم استخدامها أو تركيبها.',
      '٥. المنتجات التي تم العبث بها أو إزالة أرقامها التسلسلية.',
      '٦. المنتجات بدون بطاقات الأسعار أو الملصقات أو الغلاف الأصلي، أو التي ينقصها أي من ملحقاتها.',
      '٧. الكابلات التي قُصّت بناءً على طلب العميل، إلا في حال وجود عيب مصنعي.',
      '٨. لفات الأسلاك المفردة والفليكسبل: يُسمح فقط بتبديل الألوان، على أن تكون بحالتها الأصلية.',
    ]],
    ['الاسترداد دون إعادة المنتج', [
      `لنا حرية التصرف في رد المبلغ دون الحاجة إلى إعادة المنتج، وفي هذه الحالة لا يُعتبر المنتج ملكاً لـ${name}.`,
      'قد تختلف شروط الإرجاع وفقاً للاتفاق مع كل عميل على حدة.',
    ]],
    ['مواصفات المنتج', [
      `تحرص ${name} على توخّي الدقة الكاملة، ومع ذلك لا تضمن ${name} أن تكون مواصفات أي منتج أو محتوى أي من خدماتها دقيقة أو كاملة أو موثوقة أو حديثة أو خالية من الأخطاء.`,
      `وإذا لم يتطابق المنتج المقدّم من ${name} مع وصفه، فإن الحل الوحيد هو إعادة المنتج بحالته غير المستخدمة.`,
    ]],
  ];
}

export default async function ReturnPolicyPage() {
  const [s, lang] = await Promise.all([getSettings(), getLang()]);
  const tr = t(lang);
  const name = lang === 'en' ? s.siteName || 'PEXON' : 'بيكسون';
  return (
    <>
      <div className="page-head">
        <div className="container">
          <div className="crumbs"><Link href="/">{tr.home}</Link> / {tr.returnTitle}</div>
          <h1>{tr.returnTitle}</h1>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container policy" style={{ maxWidth: 860 }}>
          {content(lang, name).map(([title, paras]) => (
            <div className="panel" key={title} style={{ marginBottom: 16 }}>
              <h2 style={{ marginTop: 0 }}>{title}</h2>
              {paras.map((p) => (
                <p key={p} style={{ margin: '0 0 8px' }}>{p}</p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
