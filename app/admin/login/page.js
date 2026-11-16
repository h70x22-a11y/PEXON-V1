import { redirect } from 'next/navigation';
import { login } from '@/app/actions';
import { isAdmin, passwordConfigured } from '@/lib/auth';

export const metadata = { title: 'دخول لوحة التحكم', robots: { index: false } };

export default async function LoginPage({ searchParams }) {
  const sp = await searchParams;
  if (await isAdmin()) redirect('/admin');

  return (
    <div className="login-box panel">
      <h1 style={{ fontSize: '1.4rem' }}>لوحة التحكم</h1>
      {!passwordConfigured ? (
        <div className="flash warn">
          لم تُضبط كلمة المرور بعد. أضف المتغير ADMIN_PASSWORD من إعدادات المشروع في Vercel ثم أعد النشر.
        </div>
      ) : null}
      {sp?.error ? <div className="flash err">كلمة المرور غير صحيحة.</div> : null}
      <form action={login}>
        <div className="field">
          <label htmlFor="password">كلمة المرور</label>
          <input id="password" type="password" name="password" required autoFocus dir="ltr" />
        </div>
        <button className="btn" type="submit" style={{ width: '100%' }}>دخول</button>
      </form>
    </div>
  );
}
