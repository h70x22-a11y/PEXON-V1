import Link from 'next/link';
import { getLang, t } from '@/lib/i18n';
import { VENDOR_ACTIVITIES } from '@/lib/vendor';
import { submitVendor } from '@/app/actions';
import Consent from '@/components/Consent';

export async function generateMetadata() {
  return { title: t(await getLang()).vendorTitle };
}

export default async function VendorPage({ searchParams }) {
  const sp = await searchParams;
  const lang = await getLang();
  const tr = t(lang);
  const v = tr.vendor;

  return (
    <>
      <div className="page-head">
        <div className="container">
          <div className="crumbs"><Link href="/">{tr.home}</Link> / {tr.vendorTitle}</div>
          <h1>{tr.vendorTitle}</h1>
          <p className="muted">{v.intro}</p>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container" style={{ maxWidth: 760 }}>
          {sp?.ok ? (
            <div className="panel">
              <div className="flash ok">{v.sent}</div>
              <Link href="/" className="btn">{tr.home}</Link>
            </div>
          ) : (
            <form action={submitVendor} className="panel">
              {sp?.error ? <div className="flash err">{v.error}</div> : null}
              <input className="hp" type="text" name="website_hp" tabIndex={-1} autoComplete="off" />
              <div className="field">
                <label htmlFor="company">{v.company} *</label>
                <input id="company" type="text" name="company" required maxLength={150} />
              </div>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="firstName">{v.firstName} *</label>
                  <input id="firstName" type="text" name="firstName" required maxLength={60} />
                </div>
                <div className="field">
                  <label htmlFor="lastName">{v.lastName} *</label>
                  <input id="lastName" type="text" name="lastName" required maxLength={60} />
                </div>
              </div>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="email">{v.email} *</label>
                  <input id="email" type="email" name="email" required maxLength={120} dir="ltr" />
                </div>
                <div className="field">
                  <label htmlFor="phone">{v.phone}</label>
                  <input id="phone" type="tel" name="phone" maxLength={30} dir="ltr" />
                </div>
              </div>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="cr">{v.cr} *</label>
                  <input id="cr" type="text" name="cr" required maxLength={30} dir="ltr" inputMode="numeric" />
                </div>
                <div className="field">
                  <label htmlFor="activity">{v.activity} *</label>
                  <select id="activity" name="activity" required defaultValue="">
                    <option value="" disabled>{v.activityPh}</option>
                    {VENDOR_ACTIVITIES.map((a) => (
                      <option key={a.key} value={a.key}>{a[lang]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Consent label={tr.consent} linkText={tr.consentLink} />
              <button className="btn" type="submit">{v.submit}</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
