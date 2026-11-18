import Link from 'next/link';
import { can, requirePerm } from '@/lib/auth';
import { getRoles, getUsers } from '@/lib/db';
import { deleteRoleAction } from '@/app/actions';
import Flash from '@/components/Flash';
import ConfirmButton from '@/components/ConfirmButton';
import { adminT } from '@/lib/adminLang';
import { ALL_PERMS } from '@/lib/permissions';

export default async function AdminRoles({ searchParams }) {
  const { t } = await adminT();
  const session = await requirePerm('users');
  const sp = await searchParams;
  const [roles, users] = await Promise.all([getRoles(), getUsers()]);
  const canW = can(session, 'users:write');
  const canD = can(session, 'users:delete');

  return (
    <>
      <div className="section-head" style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>{t('المناصب والصلاحيات')}</h1>
        {canW ? <Link className="btn small" href="/admin/users/roles/new">{t('+ إنشاء منصب')}</Link> : null}
      </div>
      <div className="status-tabs">
        <Link href="/admin/users">{t('المستخدمين')}</Link>
        <Link href="/admin/users/roles" className="active">{t('المناصب')}</Link>
      </div>
      <p className="muted">{t('حدد لكل منصب الأقسام والعمليات المسموحة، وبعدها اربط كل موظف بمنصبه من صفحة المستخدمين.')}</p>
      <Flash params={sp} />

      {roles.length ? (
        <div className="table-wrap">
          <table className="quote-table">
            <thead>
              <tr>
                <th>{t('اسم المنصب')}</th>
                <th>{t('عدد المستخدمين')}</th>
                <th>{t('الصلاحيات')}</th>
                <th>{t('الخيارات')}</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => {
                const n = users.filter((u) => u.roleId === r.id).length;
                return (
                  <tr key={r.id}>
                    <td><Link href={`/admin/users/roles/${r.id}`}><strong>{r.name}</strong></Link></td>
                    <td>{n}</td>
                    <td className="muted">{(r.perms || []).length} / {ALL_PERMS.length}</td>
                    <td>
                      <div className="row-actions">
                        <Link className="btn ghost small" href={`/admin/users/roles/${r.id}`}>{canW ? t('عرض وتعديل') : t('عرض')}</Link>
                        {canD ? (
                          <form action={deleteRoleAction}>
                            <input type="hidden" name="id" value={r.id} />
                            <ConfirmButton message={t('حذف المنصب «{name}»؟', { name: r.name })}>{t('حذف')}</ConfirmButton>
                          </form>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted">{t('ما فيه مناصب بعد. أنشئ منصب مثل "مبيعات" أو "مدخل بيانات" وحدد صلاحياته.')}</p>
      )}
    </>
  );
}
