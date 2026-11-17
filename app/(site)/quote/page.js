import Link from 'next/link';
import { getSettings } from '@/lib/db';
import { getLang, t } from '@/lib/i18n';
import { submitQuote } from '@/app/actions';
import QuoteCart from '@/components/QuoteCart';

export async function generateMetadata() {
  return { title: t(await getLang()).quoteTitle };
}

export default async function QuotePage() {
  const [s, lang] = await Promise.all([getSettings(), getLang()]);
  const tr = t(lang);
  const labels = {
    items: tr.quoteItems,
    empty: tr.quoteEmpty,
    browse: tr.browse,
    addMore: tr.addMore,
    clear: tr.clearCart,
    clearConfirm: tr.clearConfirm,
    remove: tr.remove,
    qty: tr.qty,
    details: tr.yourDetails,
    name: tr.name,
    phone: tr.phone,
    company: tr.company,
    email: tr.email,
    notes: tr.notes,
    sendSite: tr.sendSite,
    sendWhatsapp: tr.sendWhatsapp,
    requestSite: tr.requestSite,
    howToSend: tr.howToSend,
    back: tr.back,
    sent: tr.quoteSent,
    error: tr.quoteError,
    needDetails: tr.needDetails,
    waIntro: tr.waIntro,
  };
  return (
    <>
      <div className="page-head">
        <div className="container">
          <div className="crumbs"><Link href="/">{tr.home}</Link> / {tr.quoteTitle}</div>
          <h1>{tr.quoteTitle}</h1>
          <p className="muted">{tr.quoteIntro}</p>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <QuoteCart labels={labels} whatsapp={s.whatsapp} submitQuote={submitQuote} />
        </div>
      </section>
    </>
  );
}
