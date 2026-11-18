'use client';

import { openConsent } from '@/lib/pixel';

export default function ConsentLink({ label }) {
  return <button type="button" className="link-btn" onClick={openConsent}>{label}</button>;
}
