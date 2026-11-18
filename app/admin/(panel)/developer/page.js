import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { BRANCH, REPO, githubReady } from '@/lib/github';
import DevEditor from '@/components/DevEditor';

export const metadata = { title: 'المطوّر' };

export default async function DeveloperPage() {
  const session = await requireAdmin();
  if (!session.owner) redirect('/admin?denied=1');
  return (
    <>
      <h1>المطوّر</h1>
      <p className="muted">
        تعديل كود الموقع مباشرة. كل حفظ يُسجَّل في GitHub ويُنشر تلقائياً على الموقع خلال دقيقة إلى دقيقتين. إذا فيه خطأ يمنع بناء الموقع،
        يبقى الموقع الحالي شغال وما ينشر التعديل.
      </p>
      {githubReady ? (
        <DevEditor repo={REPO} branch={BRANCH} />
      ) : (
        <div className="flash warn">
          لتفعيل المحرر: أنشئ مفتاح GitHub (Fine-grained token) بصلاحية <b>Contents: Read and write</b> على مستودع <bdi dir="ltr">{REPO}</bdi>، ثم أضفه في
          Vercel ← Settings ← Environment Variables باسم <code dir="ltr">GITHUB_TOKEN</code> وأعد النشر.
        </div>
      )}
      <div className="dev-links">
        <a className="btn ghost small" href={`https://github.com/${REPO}`} target="_blank" rel="noopener noreferrer">المستودع على GitHub ↗</a>
        <a className="btn ghost small" href={`https://github.dev/${REPO}`} target="_blank" rel="noopener noreferrer">فتح في محرر VS Code ↗</a>
        <a className="btn ghost small" href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">Vercel ↗</a>
      </div>
    </>
  );
}
