import Link from 'next/link';
import { can, requirePerm } from '@/lib/auth';
import { getResetRequests, getRoles, getUsers } from '@/lib/db';
import { addUser, deleteUser, resolveResetAction, updateUser } from '@/app/actions';
import Flash from '@/components/Flash';
import TempPassword from '@/components/TempPassword';
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
  const [users, roles, resets] = await Promise.all([getUsers(), getRoles(), getResetRequests()]);
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
      {canW && resets.length ? (
        <div className="panel reset-panel">
          <h2>{t('طلبات إعادة تعيين كلمة المرور')} ({resets.length})</h2>
          {resets.map((r) => (
            <form key={r.id} action={resolveResetAction} className="reset-row">
              <input type="hidden" name="reqId" value={r.id} />
              <div className="reset-who">
                <strong>{r.name}</strong> <bdi className="muted">{r.username}</bdi>
                <div className="muted" style={{ fontSize: '0.85rem' }}>
                  {new Date(r.date).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Riyadh' })}
                  {r.note ? ` · ${r.note}` : ''}
                </div>
              </div>
              <TempPassword placeholder="كلمة مرور مؤقتة" label="كلمة مرور مؤقتة" autoSuggest />
              <button className="btn small" type="submit">{t('تعيين كلمة مؤقتة')}</button>
              <button className="btn ghost small" type="submit" name="ignore" value="1" formNoValidate>{t('تجاهل')}</button>
            </form>
          ))}
          <small className="muted">{t('بعد التعيين أرسل كلمة المرور المؤقتة للموظف، وأول ما يدخل بيطلب منه يختار كلمة مرور جديدة.')}</small>
        </div>
      ) : null}
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
                <label>{t('كلمة المرور المؤقتة')}</label>
                <TempPassword required autoSuggest />
                <small>{t('اقترحنا لك كلمة مؤقتة، تقدر تغيرها. انسخها وأرسلها للموظف، وأول ما يدخل بيطلب منه يختار كلمة مرور جديدة.')}</small>
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
              {u.active && u.mustChangePassword ? <span className="badge">{t('بانتظار أول دخول')}</span> : null}
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
                    <label>{t('كلمة مرور مؤقتة جديدة (اختياري)')}</label>
                    <TempPassword placeholder="اتركها فاضية لو ما تبي تغيرها" />
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
