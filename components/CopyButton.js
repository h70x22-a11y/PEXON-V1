'use client';

import { useState } from 'react';

export default function CopyButton({ text, label = 'نسخ', done = 'تم النسخ' }) {
  const [ok, setOk] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const t = document.createElement('textarea');
      t.value = text;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      t.remove();
    }
    setOk(true);
    setTimeout(() => setOk(false), 1500);
  }
  return <button type="button" className="btn small" onClick={copy}>{ok ? done : label}</button>;
}
