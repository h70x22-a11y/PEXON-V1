import { requireAdmin } from '@/lib/auth';
import { PERMISSIONS } from '@/lib/permissions';
import { changeOwnPassword, confirm2faAction, disable2faAction, removePasskeyAction, start2faAction } from '@/app/actions';
import PasskeyManager from '@/components/PasskeyManager';
import { get2fa, getPasskeys, getTemp, setTemp } from '@/lib/db';
import { otpauthUrl } from '@/lib/totp';
import QRCode from 'qrcode';
import Flash from '@/components/Flash';
import { adminT } from '@/lib/adminLang';

export default async function AdminAccount({ searchParams }) {
  const { t, lang, locale, dir } = await adminT();
  const session = await requireAdmin();
  const sp = await searchParams;
  const perms = session.owner
    ? [t('كل الصلاحيات')]
    : PERMISSIONS.filter((p) => session.perms.includes(`${p.key}:read`)).map((p) => t(p.ar));

  // التحقق بخطوتين
  const tf = await get2fa(session.id);
  const passkeys = await getPasskeys(session.id);
  const setup = sp?.setup2fa ? await getTemp(`2fa-setup:${session.id}`) : null;
  const qr = setup ? await QRCode.toDataURL(otpauthUrl(setup.secret, session.username), { margin: 1, width: 220 }) : '';
  let shownCodes = null;
  if (sp?.codes) {
    shownCodes = await getTemp(`2fa-show:${session.id}`);
    if (shownCodes) await setTemp(`2fa-show:${session.id}`, null);
  }

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
      <section className="panel twofa" style={{ marginTop: 18, maxWidth: 640 }}>
        <h2>{t('الدخول بالبصمة أو الوجه')}</h2>
        <p className="muted">{t('سجّل جهازك مرة وحدة، وبعدها تدخل لوحة التحكم بـ Face ID أو Touch ID أو البصمة بدون كتابة كلمة المرور. البصمة ما تطلع من جهازك أبداً.')}</p>
        {passkeys.length ? (
          <ul className="pk-list">
            {passkeys.map((k) => (
              <li key={k.id}>
                <span className="pk-ico" aria-hidden="true">🔑</span>
                <span className="pk-name">
                  <strong>{t(k.name)}</strong>
                  <small className="muted">
                    {t('أُضيف')} {new Date(k.created).toLocaleDateString(locale, { timeZone: 'Asia/Riyadh' })}
                    {k.lastUsed ? ` · ${t('آخر استخدام')} ${new Date(k.lastUsed).toLocaleDateString(locale, { timeZone: 'Asia/Riyadh' })}` : ''}
                  </small>
                </span>
                <form action={removePasskeyAction}>
                  <input type="hidden" name="id" value={k.id} />
                  <button className="link-btn" type="submit">{t('حذف')}</button>
                </form>
              </li>
            ))}
          </ul>
        ) : null}
        <PasskeyManager />
      </section>
      <section className="panel twofa" style={{ marginTop: 18, maxWidth: 640 }}>
        <h2>{t('التحقق بخطوتين')}</h2>
        {shownCodes ? (
          <>
            <div className="flash ok">{t('تم تفعيل التحقق بخطوتين ✓')}</div>
            <p><strong>{t('رموز الاسترداد')}</strong> — {t('احفظها في مكان آمن. كل رمز يُستخدم مرة وحدة إذا ضاع جوالك. ما راح تظهر مرة ثانية.')}</p>
            <div className="codes" dir="ltr">{shownCodes.map((c) => <code key={c}>{c}</code>)}</div>
          </>
        ) : tf?.enabled ? (
          <>
            <p className="twofa-on">✓ {t('مفعّل')} <span className="muted">· {t('رموز الاسترداد المتبقية: {n}', { n: tf.recovery?.length || 0 })}</span></p>
            <form action={disable2faAction} className="twofa-form">
              <input type="text" name="code" inputMode="numeric" maxLength={6} required placeholder={t('رمز التطبيق')} aria-label={t('رمز التطبيق')} dir="ltr" />
              <button className="btn ghost small" type="submit">{t('إيقاف التحقق بخطوتين')}</button>
            </form>
          </>
        ) : setup ? (
          <>
            <ol className="twofa-steps">
              <li>{t('حمّل تطبيق Google Authenticator أو Microsoft Authenticator على جوالك.')}</li>
              <li>{t('امسح الرمز بالتطبيق، أو اكتب المفتاح يدوياً.')}</li>
              <li>{t('اكتب الرمز اللي يطلع لك في التطبيق.')}</li>
            </ol>
            <div className="twofa-qr">
              <img src={qr} alt={t('رمز QR لتطبيق التحقق')} width={220} height={220} />
              <code dir="ltr" className="secret">{setup.secret.replace(/(.{4})/g, '$1 ').trim()}</code>
            </div>
            <form action={confirm2faAction} className="twofa-form">
              <input type="text" name="code" inputMode="numeric" maxLength={6} required placeholder="123456" aria-label={t('رمز التطبيق')} dir="ltr" autoFocus />
              <button className="btn" type="submit">{t('تفعيل')}</button>
            </form>
          </>
        ) : (
          <>
            <p className="muted">{t('طبقة حماية إضافية: بعد كلمة المرور يُطلب رمز من تطبيق في جوالك. حتى لو تسرّبت كلمة المرور ما يقدر أحد يدخل بدون جوالك.')}</p>
            <form action={start2faAction}>
              <button className="btn" type="submit">{t('تفعيل التحقق بخطوتين')}</button>
            </form>
          </>
        )}
      </section>
    </>
  );
}
