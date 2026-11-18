// ربط لوحة المطوّر بمستودع الكود على GitHub (التعديل يُحفظ كـ commit و Vercel ينشره تلقائياً)
const TOKEN = process.env.GITHUB_TOKEN || '';
export const REPO = process.env.GITHUB_REPO || 'h70x22-a11y/PEXON-V1';
export const BRANCH = process.env.GITHUB_BRANCH || 'main';
export const githubReady = Boolean(TOKEN);

const EDITABLE = /\.(js|jsx|mjs|cjs|ts|tsx|css|json|md|txt|svg|html|yml|yaml)$/i;
const BLOCKED = /(^|\/)(\.env[^/]*|node_modules\/|\.next\/|\.git\/)|(^|\/)package-lock\.json$/i;
export const isEditable = (path) => EDITABLE.test(path) && !BLOCKED.test(path) && !path.includes('..');

async function gh(path, init = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
    cache: 'no-store',
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || `GitHub ${res.status}`);
  return json;
}

const enc = (p) => p.split('/').map(encodeURIComponent).join('/');

export async function listFiles() {
  const t = await gh(`/repos/${REPO}/git/trees/${BRANCH}?recursive=1`);
  return (t.tree || []).filter((x) => x.type === 'blob' && isEditable(x.path)).map((x) => ({ path: x.path, size: x.size }));
}

export async function readFile(path) {
  const f = await gh(`/repos/${REPO}/contents/${enc(path)}?ref=${BRANCH}`);
  return { path, sha: f.sha, content: Buffer.from(f.content || '', 'base64').toString('utf8') };
}

export async function writeFile(path, content, sha, message) {
  const r = await gh(`/repos/${REPO}/contents/${enc(path)}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content: Buffer.from(content, 'utf8').toString('base64'), sha: sha || undefined, branch: BRANCH }),
  });
  return { sha: r.content?.sha, commit: r.commit?.sha, url: r.commit?.html_url };
}

export async function recentCommits() {
  const list = await gh(`/repos/${REPO}/commits?sha=${BRANCH}&per_page=8`);
  return list.map((c) => ({
    sha: c.sha.slice(0, 7),
    message: String(c.commit?.message || '').split('\n')[0],
    date: c.commit?.author?.date,
    url: c.html_url,
  }));
}
