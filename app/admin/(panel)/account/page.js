import { requireAdmin } from '@/lib/auth';
import { PERMISSIONS } from '@/lib/permissions';
import { changeOwnPassword } from '@/app/actions';
import Flash from '@/components/Flash';
import { adminT } from '@/lib/adminLang';

export default async function AdminAccount({ searchParams }) {
  const { t, lang, locale, dir } = await adminT();
  const session = await requireAdmin();
  const sp = await searchParams;
  const perms = session.owner
    ? [t('كل الصلاحيات')]
    : PERMISSIONS.filter((p) => session.perms.includes(`${p.key}:read`)).map((p) => t(p.ar));

  return (
    <>
      <h1>{t('حسابي')}</h1>
      <Flash params={sp} okText={t('تم تغيير كلمة المرور.')} />
      <div className="panel">
        <ul className="vendor-info" style={{ marginTop: 0 }}>
          <li><span>{t('الاسم:')}</span> {t(session.name)}</li>
          <li><span>{t('اسم المستخدم:')}</span> <bdi>{session.username}</bdi></li>
          {!session.owner ? <li><span>{t('المنصب:')}</span> {session.roleName || t('بدون منصب')}</li> : null}
          <li><span>{t('الشروط والأحكام:')}</span> <a href="/admin/terms?view=1">{t('عرض')}</a></li>
          <li><span>{t('الصلاحيات:')}</span> {perms.join(t('، ')) || t('لا يوجد')}</li>
        </ul>
      </div>
      {session.owner ? (
        <p className="muted">{t('كلمة مرور المالك تتغير من Vercel ← Settings ← Environment Variables ← ADMIN_PASSWORD.')}</p>
      ) : (
        <form action={changeOwnPassword} className="panel" style={{ marginTop: 18, maxWidth: 480 }}>
          <h2>{t('تغيير كلمة المرور')}</h2>
          <div className="field">
            <label>{t('كلمة المرور الحالية')}</label>
            <input type="password" name="current" required dir="ltr" autoComplete="current-password" />
          </div>
          <div className="field">
            <label>{t('كلمة المرور الجديدة')}</label>
            <input type="password" name="next" required minLength={8} dir="ltr" autoComplete="new-password" />
            <small>{t('8 أحرف على الأقل.')}</small>
          </div>
          <div className="field">
            <label>{t('تأكيد كلمة المرور الجديدة')}</label>
            <input type="password" name="confirm" required minLength={8} dir="ltr" autoComplete="new-password" />
          </div>
          <button className="btn" type="submit">{t('تغيير كلمة المرور')}</button>
        </form>
      )}
    </>
  );
}
