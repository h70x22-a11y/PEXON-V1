// قراءة رابط الكتالوج للـ middleware فقط (بدون كاش Next اللي ما يشتغل في الـ Edge)
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export async function getCatalogUrl() {
  if (!URL_ || !TOKEN) return '';
  try {
    const res = await fetch(URL_, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['GET', 'settings']),
      next: { revalidate: 3600 },
    });
    const j = await res.json();
    return j.result ? JSON.parse(j.result).catalogUrl || '' : '';
  } catch {
    return '';
  }
}
