import Link from 'next/link';
import { getLang, t } from '@/lib/i18n';
import { submitVendor } from '@/app/actions';

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
        <div className="container" style={{ maxWidth: 860 }}>
          {sp?.ok ? (
            <div className="panel">
              <div className="flash ok">{v.sent}</div>
              <Link href="/" className="btn">{tr.home}</Link>
            </div>
          ) : (
            <form action={submitVendor} className="panel">
              {sp?.error ? <div className="flash err">{v.error}</div> : null}
              <input className="hp" type="text" name="website_hp" tabIndex={-1} autoComplete="off" />

              <h2 style={{ fontSize: '1.15rem' }}>{v.companySection}</h2>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="company">{v.company} *</label>
                  <input id="company" type="text" name="company" required maxLength={150} />
                </div>
                <div className="field">
                  <label htmlFor="cr">{v.cr} *</label>
                  <input id="cr" type="text" name="cr" required maxLength={30} dir="ltr" />
                </div>
                <div className="field">
                  <label htmlFor="vat">{v.vat}</label>
                  <input id="vat" type="text" name="vat" maxLength={30} dir="ltr" />
                </div>
                <div className="field">
                  <label htmlFor="city">{v.city}</label>
                  <input id="city" type="text" name="city" maxLength={80} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="website">{v.website}</label>
                <input id="website" type="text" name="website" maxLength={200} dir="ltr" placeholder="https://" />
              </div>

              <h2 style={{ fontSize: '1.15rem' }}>{v.contactSection}</h2>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="name">{v.contactName} *</label>
                  <input id="name" type="text" name="name" required maxLength={100} />
                </div>
                <div className="field">
                  <label htmlFor="phone">{v.phone} *</label>
                  <input id="phone" type="tel" name="phone" required maxLength={30} dir="ltr" />
                </div>
                <div className="field">
                  <label htmlFor="email">{v.email} *</label>
                  <input id="email" type="email" name="email" required maxLength={120} dir="ltr" />
                </div>
              </div>

              <h2 style={{ fontSize: '1.15rem' }}>{v.supplySection}</h2>
              <div className="field">
                <label htmlFor="supplies">{v.supplies} *</label>
                <textarea id="supplies" name="supplies" required maxLength={2000} placeholder={v.suppliesPh} />
              </div>
              <div className="field">
                <label htmlFor="notes">{v.notes}</label>
                <textarea id="notes" name="notes" maxLength={2000} />
              </div>
              <button className="btn" type="submit">{v.submit}</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
