import { notFound } from 'next/navigation';
import { getMessages, getSettings } from '@/lib/db';
import { skuOf, shortWithoutSku } from '@/lib/quotes';
import PrintButton from '@/components/PrintButton';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'طلب عرض سعر | PEXON', robots: { index: false, follow: false } };

// مستند طلب عرض السعر (يفتح من رابط الواتساب ويتحفظ PDF)
export default async function QuoteDoc({ params }) {
  const { token } = await params;
  if (!/^[\w-]{16,40}$/.test(token || '')) notFound();
  const [all, s] = await Promise.all([getMessages(), getSettings()]);
  const q = all.find((m) => m.type === 'quote' && m.token === token);
  if (!q) notFound();
  const date = new Date(q.date).toLocaleDateString('ar-SA-u-ca-gregory-nu-latn', { dateStyle: 'long', timeZone: 'Asia/Riyadh' });
  const totalQty = (q.items || []).reduce((n, i) => n + (Number(i.qty) || 0), 0);

  return (
    <main className="qdoc-page" dir="rtl" lang="ar">
      <div className="qdoc-actions no-print">
        <PrintButton label="تحميل PDF / طباعة" />
      </div>
      <article className="qdoc">
        <header className="qdoc-head">
          <img src="/logo.png" alt="PEXON" className="qdoc-logo" />
          <div className="qdoc-title">
            <h1>طلب عرض سعر</h1>
            <div className="qdoc-meta">
              <span>رقم الطلب: <b dir="ltr">{q.number || '—'}</b></span>
              <span>التاريخ: <b>{date}</b></span>
              <span>المصدر: <b>{q.source === 'whatsapp' ? 'واتساب' : 'الموقع'}</b></span>
            </div>
          </div>
        </header>

        {q.name || q.company || q.phone ? (
          <section className="qdoc-cust">
            {q.name ? <span>العميل: <b>{q.name}</b></span> : null}
            {q.company ? <span>الشركة: <b>{q.company}</b></span> : null}
            {q.phone ? <span>الجوال: <b dir="ltr">{q.phone}</b></span> : null}
          </section>
        ) : null}

        <table className="qdoc-table">
          <thead>
            <tr>
              <th>#</th>
              <th className="qdoc-img-col">صورة</th>
              <th>المنتج</th>
              <th>رمز الصنف</th>
              <th>الوصف والمواصفات</th>
              <th>الوحدة</th>
              <th>الكمية</th>
            </tr>
          </thead>
          <tbody>
            {(q.items || []).map((it, n) => {
              const sku = it.sku || skuOf(it.short);
              const desc = [shortWithoutSku(it.short), it.desc].filter((x, i, a) => x && a.indexOf(x) === i).join(' — ');
              return (
                <tr key={(it.id || '') + n}>
                  <td>{n + 1}</td>
                  <td className="qdoc-img-col">{it.image ? <img src={it.image} alt="" /> : null}</td>
                  <td><b>{it.name}</b></td>
                  <td dir="ltr" className="qdoc-sku">{sku || '—'}</td>
                  <td className="qdoc-desc">{desc || '—'}</td>
                  <td>{it.unit || 'حبة'}</td>
                  <td className="qdoc-qty">{it.qty}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6}>عدد الأصناف: {q.items?.length || 0} · إجمالي الكميات</td>
              <td className="qdoc-qty">{totalQty}</td>
            </tr>
          </tfoot>
        </table>

        {q.message ? <p className="qdoc-note">ملاحظات العميل: {q.message}</p> : null}

        <footer className="qdoc-foot">
          <span>{s.siteName || 'PEXON'}</span>
          <span dir="ltr">powercore.sa</span>
          {s.phone ? <span dir="ltr">{s.phone}</span> : null}
          {s.email ? <span dir="ltr">{s.email}</span> : null}
        </footer>
      </article>
    </main>
  );
}
