'use client';

import { useAdminT } from '@/components/AdminLang';

export default function Flash({ params, okText = 'تم الحفظ بنجاح.' }) {
  const { t } = useAdminT();
  if (params?.error) return <div className="flash err">{t(String(params.error))}</div>;
  if (params?.ok) return <div className="flash ok">{t(okText)}</div>;
  return null;
}
