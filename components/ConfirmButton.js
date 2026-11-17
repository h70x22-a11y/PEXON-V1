'use client';

import { useEffect, useState } from 'react';

// زر حذف بتأكيد من خطوتين داخل الصفحة (بدون نافذة منبثقة):
// الضغطة الأولى تحوّله لـ "تأكيد الحذف"، والثانية تنفّذ.
export default function ConfirmButton({ children, message, confirmText = 'تأكيد الحذف', className = 'btn danger small' }) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);

  return (
    <button
      type="submit"
      className={`${className}${armed ? ' armed' : ''}`}
      title={armed ? message : undefined}
      onClick={(e) => {
        if (!armed) {
          e.preventDefault();
          setArmed(true);
        }
      }}
    >
      {armed ? confirmText : children}
    </button>
  );
}
