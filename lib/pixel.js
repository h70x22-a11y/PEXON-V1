// أحداث Meta Pixel: ما ترسل شي إلا إذا الزائر وافق ونحمّل البكسل
export function track(event, params) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  try {
    window.fbq('track', event, params || {});
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
