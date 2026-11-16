import Link from 'next/link';
import { getSettings } from '@/lib/db';
import { sendMessage } from '@/app/actions';
import Flash from '@/components/Flash';

export const metadata = { title: 'تواصل معنا' };

export default async function ContactPage({ searchParams }) {
  const sp = await searchParams;
  const s = await getSettings();
  const product = String(sp?.product || '').slice(0, 140);

  return (
    <>
      <div className="page-head">
        <div className="container">
          <div className="crumbs"><Link href="/">الرئيسية</Link> / تواصل معنا</div>
          <h1>تواصل معنا</h1>
          <p className="muted">اترك رسالتك وسنرد عليك في أقرب وقت.</p>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 36 }}>
        <div className="container contact-wrap">
          <div className="panel">
            <Flash params={sp} okText="وصلتنا رسالتك، شكراً لك. سنتواصل معك قريباً." />
            <form action={sendMessage}>
              <input className="hp" type="text" name="website" tabIndex={-1} autoComplete="off" />
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="name">الاسم</label>
                  <input id="name" type="text" name="name" required maxLength={100} />
                </div>
                <div className="field">
                  <label htmlFor="phone">رقم الجوال</label>
                  <input id="phone" type="tel" name="phone" required maxLength={30} dir="ltr" />
                </div>
              </div>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="email">البريد الإلكتروني (اختياري)</label>
                  <input id="email" type="email" name="email" maxLength={120} dir="ltr" />
                </div>
                <div className="field">
                  <label htmlFor="product">المنتج (اختياري)</label>
                  <input id="product" type="text" name="product" defaultValue={product} maxLength={140} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="message">الرسالة</label>
                <textarea id="message" name="message" required maxLength={2000} />
              </div>
              <button className="btn" type="submit">إرسال</button>
            </form>
          </div>

          <div className="panel">
            <h2 style={{ fontSize: '1.2rem' }}>بيانات التواصل</h2>
            <ul className="info-list">
              {s.phone ? <li><span>الهاتف</span><a href={`tel:${s.phone}`} dir="ltr">{s.phone}</a></li> : null}
              {s.whatsapp ? (
                <li><span>واتساب</span><a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer" dir="ltr">+{s.whatsapp}</a></li>
              ) : null}
              {s.email ? <li><span>البريد</span><a href={`mailto:${s.email}`} dir="ltr">{s.email}</a></li> : null}
              {s.address ? <li><span>العنوان</span>{s.address}</li> : null}
              {!s.phone && !s.whatsapp && !s.email && !s.address ? (
                <li className="muted">أضف بيانات التواصل من لوحة التحكم.</li>
              ) : null}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
