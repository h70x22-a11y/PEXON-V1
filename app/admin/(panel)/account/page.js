import { requireAdmin } from '@/lib/auth';
import { PERMISSIONS } from '@/lib/permissions';
import { changeOwnPassword } from '@/app/actions';
import Flash from '@/components/Flash';

export default async function AdminAccount({ searchParams }) {
  const session = await requireAdmin();
  const sp = await searchParams;
  const perms = session.owner ? ['كل الصلاحيات'] : session.perms.map((k) => PERMISSIONS.find((p) => p.key === k)?.ar || k);

  return (
    <>
      <h1>حسابي</h1>
      <Flash params={sp} okText="تم تغيير كلمة المرور." />
      <div className="panel">
        <ul className="vendor-info" style={{ marginTop: 0 }}>
          <li><span>الاسم:</span> {session.name}</li>
          <li><span>اسم المستخدم:</span> <bdi>{session.username}</bdi></li>
          <li><span>الصلاحيات:</span> {perms.join('، ') || 'لا يوجد'}</li>
        </ul>
      </div>
      {session.owner ? (
        <p className="muted">كلمة مرور المالك تتغير من Vercel ← Settings ← Environment Variables ← ADMIN_PASSWORD.</p>
      ) : (
        <form action={changeOwnPassword} className="panel" style={{ marginTop: 18, maxWidth: 480 }}>
          <h2>تغيير كلمة المرور</h2>
          <div className="field">
            <label>كلمة المرور الحالية</label>
            <input type="password" name="current" required dir="ltr" autoComplete="current-password" />
          </div>
          <div className="field">
            <label>كلمة المرور الجديدة</label>
            <input type="password" name="next" required minLength={8} dir="ltr" autoComplete="new-password" />
            <small>8 أحرف على الأقل.</small>
          </div>
          <button className="btn" type="submit">تغيير كلمة المرور</button>
        </form>
      )}
    </>
  );
}
