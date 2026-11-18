'use client';

import { useState } from 'react';
import { useAdminT } from '@/components/AdminLang';

// حروف وأرقام سهلة القراءة (بدون 0/O و 1/l/I)
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

function suggest(len = 10) {
  const bytes = new Uint32Array(len);
  crypto.getRandomValues(bytes);
  let s = '';
  for (const b of bytes) s += CHARS[b % CHARS.length];
  // نضمن حرف كبير وصغير ورقم
  if (!/[A-Z]/.test(s) || !/[a-z]/.test(s) || !/\d/.test(s)) return suggest(len);
  return s;
}

// حقل كلمة مرور مؤقتة مع زر "اقتراح" وزر "نسخ"
export default function TempPassword({ name = 'password', required = false, placeholder = '', label = '' }) {
  const { t } = useAdminT();
  const [value, setValue] = useState('');
  const [copied, setCopied] = useState(false);

  function gen() {
    setValue(suggest());
    setCopied(false);
  }
  async function copy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  return (
    <div className="temp-pass">
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required={required}
        minLength={8}
        maxLength={100}
        dir="ltr"
        autoComplete="new-password"
        spellCheck={false}
        placeholder={placeholder ? t(placeholder) : ''}
        aria-label={label ? t(label) : undefined}
      />
      <button type="button" className="btn ghost small" onClick={gen}>{t('اقتراح')}</button>
      <button type="button" className="btn ghost small" onClick={copy} disabled={!value}>{copied ? t('تم النسخ ✓') : t('نسخ')}</button>
    </div>
  );
}
