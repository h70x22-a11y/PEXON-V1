import Link from 'next/link';
import { notFound } from 'next/navigation';
import { can, requirePerm } from '@/lib/auth';
import { getRoles } from '@/lib/db';
import { saveRoleAction } from '@/app/actions';
import Flash from '@/components/Flash';
import PermMatrix from '@/components/PermMatrix';
import { adminT } from '@/lib/adminLang';

export default async function AdminRole({ params, searchParams }) {
  const { t } = await adminT();
  const session = await requirePerm('users');
  const { id } = await params;
  const sp = await searchParams;
  const isNew = id === 'new';
  const role = isNew ? null : (await getRoles()).find((r) => r.id === id);
  if (!isNew && !role) notFound();
  const canW = can(session, 'users:write');
  if (isNew && !canW) notFound();

  return (
    <>
      <div className="crumbs">
        <Link href="/admin/users/roles">{t('المناصب والصلاحيات')}</Link> / {isNew ? t('منصب جديد') : role.name}
      </div>
      <h1>{isNew ? t('إنشاء منصب') : role.name}</h1>
      <Flash params={sp} />
      <form action={saveRoleAction} className="panel">
        {role ? <input type="hidden" name="id" value={role.id} /> : null}
        <div className="field" style={{ maxWidth: 420 }}>
          <label htmlFor="name">{t('اسم المنصب')}</label>
          <input id="name" type="text" name="name" defaultValue={role?.name || ''} required maxLength={60} placeholder={t('مثال: مبيعات')} disabled={!canW} />
        </div>
        <PermMatrix selected={role?.perms || []} readOnly={!canW} />
        <p className="muted" style={{ fontSize: '0.88rem' }}>{t('تحديد الإضافة أو الحذف يفعّل العرض تلقائياً. وتحديد صف القسم الرئيسي يحدد كل اللي تحته.')}</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          {canW ? <button className="btn" type="submit">{isNew ? t('إنشاء المنصب') : t('حفظ التعديلات')}</button> : null}
          <Link className="btn ghost" href="/admin/users/roles">{t('رجوع')}</Link>
        </div>
      </form>
    </>
  );
}
