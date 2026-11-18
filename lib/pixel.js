// أحداث Meta Pixel: ما ترسل شي إلا إذا الزائر وافق ونحمّل البكسل
// أسماء الأحداث المقابلة في Google Analytics
const GA_EVENTS = { AddToCart: 'add_to_cart', Lead: 'generate_lead', Contact: 'contact' };

export function track(event, params) {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.fbq === 'function') window.fbq('track', event, params || {});
  } catch {}
  try {
    if (typeof window.gtag === 'function') {
      const p = params || {};
      window.gtag('event', GA_EVENTS[event] || event, {
        ...(p.content_name ? { method: p.content_name } : {}),
        ...(p.num_items ? { items_count: p.num_items } : {}),
        ...(p.content_ids ? { items: p.content_ids.map((id) => ({ item_id: id, item_name: p.content_name })) } : {}),
      });
    }
  } catch {}
}

export const CONSENT_KEY = 'pexon-consent';

export function readConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

export function openConsent() {
  window.dispatchEvent(new Event('pexon-consent-open'));
}
