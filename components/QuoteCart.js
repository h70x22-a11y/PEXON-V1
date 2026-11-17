'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { clearCart, onCartChange, readCart, removeFromCart, setQty } from '@/lib/cart';

export default function QuoteCart({ labels, whatsapp, submitQuote }) {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', company: '', notes: '', website: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setItems(readCart());
    return onCartChange(setItems);
  }, []);

  const field = (key) => ({ value: form[key], onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })) });

  function validate() {
    if (!form.name.trim() || !form.phone.trim()) {
      setStatus({ type: 'err', text: labels.needDetails });
      return false;
    }
    return true;
  }

  async function sendSite(e) {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);
    setStatus({ type: '', text: '' });
    try {
      const res = await submitQuote({ ...form, items: items.map((i) => ({ id: i.id, qty: i.qty })) });
      if (!res?.ok) throw new Error();
      clearCart();
      setForm({ name: '', phone: '', email: '', company: '', notes: '', website: '' });
      setStatus({ type: 'ok', text: labels.sent });
    } catch {
      setStatus({ type: 'err', text: labels.error });
    } finally {
      setBusy(false);
    }
  }

  function sendWhatsapp() {
    if (!validate()) return;
    const lines = [labels.waIntro, ''];
    items.forEach((i, n) => {
      lines.push(`${n + 1}. ${i.name}${i.short ? ` (${i.short})` : ''} × ${i.qty}`);
    });
    lines.push('');
    lines.push(`${labels.name}: ${form.name.trim()}`);
    lines.push(`${labels.phone}: ${form.phone.trim()}`);
    if (form.company.trim()) lines.push(`${labels.company}: ${form.company.trim()}`);
    if (form.email.trim()) lines.push(`${labels.email}: ${form.email.trim()}`);
    if (form.notes.trim()) lines.push(`${labels.notes}: ${form.notes.trim()}`);
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  }

  if (items === null) return null;

  if (!items.length) {
    return (
      <div className="panel">
        {status.text ? <div className={`flash ${status.type}`}>{status.text}</div> : null}
        <p className="muted">{labels.empty}</p>
        <Link href="/products" className="btn">{labels.browse}</Link>
      </div>
    );
  }

  return (
    <div className="quote-wrap">
      <div className="panel">
        <div className="section-head" style={{ marginBottom: 12 }}>
          <h2 style={{ fontSize: '1.2rem' }}>{labels.items} ({items.length})</h2>
          <button type="button" className="btn danger small" onClick={() => window.confirm(labels.clearConfirm) && clearCart()}>
            {labels.clear}
          </button>
        </div>
        <ul className="quote-items">
          {items.map((i) => (
            <li key={i.id}>
              <Link href={`/product/${i.id}`} className="qi-thumb">
                {i.image ? <img src={i.image} alt="" /> : null}
              </Link>
              <div className="qi-info">
                <Link href={`/product/${i.id}`} className="qi-name">{i.name}</Link>
                {i.short ? <span className="muted">{i.short}</span> : null}
              </div>
              <div className="qty" role="group" aria-label={labels.qty}>
                <button type="button" onClick={() => setQty(i.id, i.qty - 1)} aria-label="-"><FiMinus aria-hidden="true" /></button>
                <input type="number" min={1} max={100000} value={i.qty} onChange={(e) => setQty(i.id, e.target.value)} aria-label={labels.qty} />
                <button type="button" onClick={() => setQty(i.id, i.qty + 1)} aria-label="+"><FiPlus aria-hidden="true" /></button>
              </div>
              <button type="button" className="qi-remove" onClick={() => removeFromCart(i.id)} aria-label={labels.remove} title={labels.remove}>
                <FiTrash2 aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        <Link href="/products" style={{ color: 'var(--primary)', fontWeight: 600 }}>+ {labels.addMore}</Link>
      </div>

      <form className="panel" onSubmit={sendSite}>
        <h2 style={{ fontSize: '1.2rem' }}>{labels.details}</h2>
        {status.text ? <div className={`flash ${status.type}`}>{status.text}</div> : null}
        <input className="hp" type="text" tabIndex={-1} autoComplete="off" {...field('website')} />
        <div className="field">
          <label htmlFor="q-name">{labels.name}</label>
          <input id="q-name" type="text" required maxLength={100} {...field('name')} />
        </div>
        <div className="field">
          <label htmlFor="q-phone">{labels.phone}</label>
          <input id="q-phone" type="tel" required maxLength={30} dir="ltr" {...field('phone')} />
        </div>
        <div className="field">
          <label htmlFor="q-company">{labels.company}</label>
          <input id="q-company" type="text" maxLength={120} {...field('company')} />
        </div>
        <div className="field">
          <label htmlFor="q-email">{labels.email}</label>
          <input id="q-email" type="email" maxLength={120} dir="ltr" {...field('email')} />
        </div>
        <div className="field">
          <label htmlFor="q-notes">{labels.notes}</label>
          <textarea id="q-notes" maxLength={2000} {...field('notes')} />
        </div>
        <div className="quote-actions">
          <button type="submit" className="btn" disabled={busy}>{busy ? '...' : labels.sendSite}</button>
          {whatsapp ? (
            <button type="button" className="btn wa" onClick={sendWhatsapp}>
              <FaWhatsapp aria-hidden="true" /> {labels.sendWhatsapp}
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
