'use client';

// تحويلات بين صيغة المتصفح (ArrayBuffer) وصيغة النص (base64url)
export const toBuf = (s) => {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer;
};
export const toB64 = (buf) => {
  let s = '';
  for (const b of new Uint8Array(buf)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const passkeysSupported = () => typeof window !== 'undefined' && Boolean(window.PublicKeyCredential && navigator.credentials);

export async function registerPasskey(name) {
  const o = await (await fetch('/api/admin/passkey', { cache: 'no-store' })).json();
  if (o.error) throw new Error(o.error);
  const cred = await navigator.credentials.create({
    publicKey: {
      ...o,
      challenge: toBuf(o.challenge),
      user: { ...o.user, id: toBuf(o.user.id) },
      excludeCredentials: (o.excludeCredentials || []).map((c) => ({ ...c, id: toBuf(c.id) })),
    },
  });
  const r = await fetch('/api/admin/passkey', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      id: cred.id,
      response: { clientDataJSON: toB64(cred.response.clientDataJSON), attestationObject: toB64(cred.response.attestationObject) },
    }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || 'تعذر التسجيل.');
}

export async function loginWithPasskey() {
  const o = await (await fetch('/api/auth/passkey', { cache: 'no-store' })).json();
  if (o.error) throw new Error(o.error);
  const cred = await navigator.credentials.get({
    publicKey: { challenge: toBuf(o.challenge), rpId: o.rpId, userVerification: 'required', timeout: o.timeout },
  });
  const r = await fetch('/api/auth/passkey', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: cred.id,
      response: {
        clientDataJSON: toB64(cred.response.clientDataJSON),
        authenticatorData: toB64(cred.response.authenticatorData),
        signature: toB64(cred.response.signature),
        userHandle: cred.response.userHandle ? toB64(cred.response.userHandle) : '',
      },
    }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || 'تعذر التحقق.');
  return j.redirect || '/admin';
}
