import Link from 'next/link';
import { getSettings } from '@/lib/db';
import { sendMessage } from '@/app/actions';
import { getLang, pick, t } from '@/lib/i18n';
import Consent from '@/components/Consent';

export async function generateMetadata() {
  return { title: t(await getLang()).contact };
}

export default async function ContactPage({ searchParams }) {
  const sp = await searchParams;
  const [s, lang] = await Promise.all([getSettings(), getLang()]);
  const tr = t(lang);
  const product = String(sp?.product || '').slice(0, 140);

  return (
    <>
      <div className="page-head">
        <div className="container">
          <div className="crumbs"><Link href="/">{tr.home}</Link> / {tr.contact}</div>
          <h1>{tr.contact}</h1>
          <p className="muted">{tr.contactIntro}</p>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 36 }}>
        <div className="container contact-wrap">
          <div className="panel">
            {sp?.error ? <div className="flash err">{tr.sendError || String(sp.error)}</div> : sp?.ok ? <div className="flash ok">{tr.sent}</div> : null}
            <form action={sendMessage}>
              <input className="hp" type="text" name="website" tabIndex={-1} autoComplete="off" />
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="name">{tr.name}</label>
                  <input id="name" type="text" name="name" required maxLength={100} />
                </div>
                <div className="field">
                  <label htmlFor="phone">{tr.phone}</label>
                  <input id="phone" type="tel" name="phone" required maxLength={30} dir="ltr" />
                </div>
              </div>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="email">{tr.email}</label>
                  <input id="email" type="email" name="email" maxLength={120} dir="ltr" />
                </div>
                <div className="field">
                  <label htmlFor="product">{tr.product}</label>
                  <input id="product" type="text" name="product" defaultValue={product} maxLength={140} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="message">{tr.message}</label>
                <textarea id="message" name="message" required maxLength={2000} />
              </div>
              <Consent label={tr.consent} linkText={tr.consentLink} />
              <button className="btn" type="submit">{tr.send}</button>
            </form>
          </div>

          <div className="panel">
            <h2 style={{ fontSize: '1.2rem' }}>{tr.contactDetails}</h2>
            <ul className="info-list">
              {s.phone ? <li><span>{tr.phoneLabel}</span><a href={`tel:${s.phone}`} dir="ltr">{s.phone}</a></li> : null}
              {s.whatsapp ? (
                <li><span>{tr.whatsapp}</span><a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer" dir="ltr">+{s.whatsapp}</a></li>
              ) : null}
              {s.email ? <li><span>{tr.emailLabel}</span><a href={`mailto:${s.email}`} dir="ltr">{s.email}</a></li> : null}
              {s.address ? <li><span>{tr.address}</span>{pick(s, 'address', lang)}</li> : null}
              {!s.phone && !s.whatsapp && !s.email && !s.address ? (
                <li className="muted">{tr.noContact}</li>
              ) : null}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
