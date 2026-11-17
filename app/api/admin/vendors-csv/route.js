import { isAdmin } from '@/lib/auth';
import { getMessages } from '@/lib/db';
import { activityLabel } from '@/lib/vendor';

// تصدير الموردين المسجلين كملف CSV يفتح في Excel
export async function GET() {
  if (!(await isAdmin())) return new Response('unauthorized', { status: 401 });
  const vendors = (await getMessages()).filter((m) => m.type === 'vendor');
  const cell = (v) => {
    let s = String(v ?? '');
    if (/^[=+\-@]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const rows = [
    ['التاريخ', 'اسم الشركة', 'رقم السجل التجاري', 'النشاط', 'اسم المسؤول', 'البريد الإلكتروني', 'الجوال'],
    ...vendors.map((v) => [
      new Date(v.date).toLocaleDateString('en-CA', { timeZone: 'Asia/Riyadh' }),
      v.company,
      v.vendor?.cr,
      activityLabel(v.vendor?.activity),
      v.name,
      v.email,
      v.phone,
    ]),
  ];
  const csv = '﻿' + rows.map((r) => r.map(cell).join(',')).join('\r\n');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="pexon-vendors-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
