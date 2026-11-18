import Link from 'next/link';
import { can, requirePerm } from '@/lib/auth';
import { getRoles, getUsers } from '@/lib/db';
import { addUser, deleteUser, updateUser } from '@/app/actions';
import Flash from '@/components/Flash';
import ConfirmButton from '@/components/ConfirmButton';
import { adminT } from '@/lib/adminLang';

function RoleSelect({ t, roles, value = '' }) {
  return (
    <div className="field" style={{ maxWidth: 360 }}>
      <label>{t('المنصب')}</label>
      <select name="roleId" defaultValue={value} required>
        <option value="" disabled>{t('اختر المنصب')}</option>
        {roles.map((r) => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>
    </div>
  );
}

export default async function AdminUsers({ searchParams }) {
  const { t, lang, locale, dir } = await adminT();
  const session = await requirePerm('users');
  const sp = await searchParams;
  const [users, roles] = await Promise.all([getUsers(), getRoles()]);
  const roleName = (u) => roles.find((r) => r.id === u.roleId)?.name || t('بدون منصب');
  const canW = can(session, 'users:write');
  const canD = can(session, 'users:delete');

  return (
    <>
      <h1>{t('المستخدمين والصلاحيات')}</h1>
      <div className="status-tabs">
        <Link href="/admin/users" className="active">{t('المستخدمين')}</Link>
        <Link href="/admin/users/roles">{t('المناصب')}</Link>
      </div>
      <p className="muted" style={{ marginTop: 0 }}>
        {t('أضف حساب لكل موظف واختر منصبه. صلاحيات كل منصب تحددها من تبويب المناصب.')}
      </p>
      <Flash params={sp} />
      {canW && !roles.length ? (
        <div className="flash warn">
          {t('أنشئ منصب واحد على الأقل قبل إضافة المستخدمين.')} <Link href="/admin/users/roles/new">{t('+ إنشاء منصب')}</Link>
        </div>
      ) : null}

      {canW && roles.length ? <details className="row">
        <summary>{t('+ إضافة مستخدم جديد')}</summary>
        <div className="inner">
          <form action={addUser}>
            <div className="form-grid">
              <div className="field">
                <label>{t('اسم الموظف')}</label>
                <input type="text" name="name" required maxLength={80} placeholder={t('مثال: محمد - المبيعات')} />
              </div>
              <div className="field">
                <label>{t('اسم المستخدم (للدخول)')}</label>
                <input type="text" name="username" required maxLength={30} dir="ltr" autoCapitalize="none" placeholder="mohammed" />
                <small>{t('حروف إنجليزية صغيرة وأرقام فقط.')}</small>
              </div>
              <div className="field">
                <label>{t('كلمة المرور')}</label>
                <input type="text" name="password" required minLength={8} maxLength={100} dir="ltr" autoComplete="new-password" />
                <small>{t('8 أحرف على الأقل. أرسلها للموظف وهو يقدر يغيرها من "حسابي".')}</small>
              </div>
            </div>
            <RoleSelect t={t} roles={roles} />
            <button className="btn" type="submit" style={{ marginTop: 14 }}>{t('إضافة المستخدم')}</button>
          </form>
        </div>
      </details> : null}

      <div className="rows">
        <div className="row">
          <div className="inner" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <strong>{t('المالك')}</strong>
            <span className="muted" dir="ltr">admin</span>
            <span className="badge">{t('كل الصلاحيات')}</span>
            <span className="muted" style={{ fontSize: '0.88rem' }}>{t('كلمة المرور من إعدادات Vercel (ADMIN_PASSWORD)')}</span>
          </div>
        </div>

        {users.map((u) => (
          <details className="row" key={u.id}>
            <summary>
              {u.name}
              <span className="muted" dir="ltr" style={{ fontWeight: 400 }}>{u.username}</span>
              {!u.active ? <span className="badge" style={{ background: '#9aa3af', color: '#fff' }}>{t('موقوف')}</span> : null}
              <span className="meta">{roleName(u)}{canW ? ` ${t('· تعديل')}` : ''}</span>
            </summary>
            <div className="inner">
              <form action={updateUser}>
                <input type="hidden" name="id" value={u.id} />
                <div className="form-grid">
                  <div className="field">
                    <label>{t('اسم الموظف')}</label>
                    <input type="text" name="name" defaultValue={u.name} required maxLength={80} />
                  </div>
                  <div className="field">
                    <label>{t('كلمة مرور جديدة (اختياري)')}</label>
                    <input type="text" name="password" minLength={8} maxLength={100} dir="ltr" autoComplete="new-password" placeholder={t('اتركها فاضية لو ما تبي تغيرها')} />
                  </div>
                </div>
                <RoleSelect t={t} roles={roles} value={u.roleId || ''} />
                <label className="check" style={{ marginTop: 12 }}>
                  <input type="checkbox" name="active" defaultChecked={u.active} /> {t('الحساب مفعّل')}
                </label>
                <small className="muted">{t('إيقاف الحساب أو تغيير كلمة المرور يسجّل خروج الموظف من كل أجهزته.')}</small>
                {canW ? (
                  <div style={{ marginTop: 14 }}>
                    <button className="btn" type="submit">{t('حفظ التعديلات')}</button>
                  </div>
                ) : null}
              </form>
              {canD ? (
                <form action={deleteUser} style={{ marginTop: 12 }}>
                  <input type="hidden" name="id" value={u.id} />
                  <ConfirmButton message={t('حذف المستخدم {name}؟', { name: u.name })}>{t('حذف المستخدم')}</ConfirmButton>
                </form>
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
