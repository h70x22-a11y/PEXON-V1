import { requirePerm } from '@/lib/auth';
import { getUsers } from '@/lib/db';
import { PERMISSIONS } from '@/lib/permissions';
import { addUser, deleteUser, updateUser } from '@/app/actions';
import Flash from '@/components/Flash';
import ConfirmButton from '@/components/ConfirmButton';
import { adminT } from '@/lib/adminLang';

function PermBoxes({ t, selected = [] }) {
  return (
    <div className="perm-grid">
      {PERMISSIONS.map((p) => (
        <label className="check" key={p.key}>
          <input type="checkbox" name={`perm_${p.key}`} defaultChecked={selected.includes(p.key)} /> {t(p.ar)}
        </label>
      ))}
    </div>
  );
}

export default async function AdminUsers({ searchParams }) {
  const { t, lang, locale, dir } = await adminT();
  await requirePerm('users');
  const sp = await searchParams;
  const users = await getUsers();
  const label = (k) => t(PERMISSIONS.find((p) => p.key === k)?.ar || k);

  return (
    <>
      <h1>{t('المستخدمين والصلاحيات')}</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        {t('أضف حساب لكل موظف وحدد الأقسام اللي يقدر يدخلها. اللي ما عنده صلاحية على قسم ما يشوفه في القائمة.')}
      </p>
      <Flash params={sp} />

      <details className="row">
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
            <label style={{ marginTop: 6 }}>{t('الصلاحيات')}</label>
            <PermBoxes t={t} selected={['quotes', 'messages']} />
            <button className="btn" type="submit" style={{ marginTop: 14 }}>{t('إضافة المستخدم')}</button>
          </form>
        </div>
      </details>

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
              <span className="meta">{(u.perms || []).map(label).join(t('، ')) || t('بدون صلاحيات')} {t('· تعديل')}</span>
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
                <label style={{ marginTop: 6 }}>{t('الصلاحيات')}</label>
                <PermBoxes t={t} selected={u.perms || []} />
                <label className="check" style={{ marginTop: 12 }}>
                  <input type="checkbox" name="active" defaultChecked={u.active} /> {t('الحساب مفعّل')}
                </label>
                <small className="muted">{t('إيقاف الحساب أو تغيير كلمة المرور يسجّل خروج الموظف من كل أجهزته.')}</small>
                <div style={{ marginTop: 14 }}>
                  <button className="btn" type="submit">{t('حفظ التعديلات')}</button>
                </div>
              </form>
              <form action={deleteUser} style={{ marginTop: 12 }}>
                <input type="hidden" name="id" value={u.id} />
                <ConfirmButton message={t('حذف المستخدم {name}؟', { name: u.name })}>{t('حذف المستخدم')}</ConfirmButton>
              </form>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
