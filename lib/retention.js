import { deleteMessage, getMessages, getSettings, logActivity } from '@/lib/db';

// الحذف التلقائي للبيانات اللي انتهت مدة الاحتفاظ بها (مبدأ الحد الأدنى من البيانات)
const months = (n) => Number(n) * 30.44 * 86400000;

export async function applyRetention() {
  const s = await getSettings();
  const rules = {
    contact: Number(s.retainMessages ?? 24),
    quote: Number(s.retainQuotes ?? 36),
    vendor: Number(s.retainVendors ?? 36),
    datarequest: Number(s.retainDataRequests ?? 60),
  };
  const now = Date.now();
  const removed = { contact: 0, quote: 0, vendor: 0, datarequest: 0 };
  for (const m of await getMessages()) {
    const kind = m.type === 'quote' || m.type === 'vendor' || m.type === 'datarequest' ? m.type : 'contact';
    const keep = rules[kind];
    if (!keep) continue;
    // طلب بيانات مفتوح ما ينحذف حتى لو قديم
    if (kind === 'datarequest' && !['done', 'rejected'].includes(m.status)) continue;
    const ref = new Date(m.handledAt || m.updated || m.date).getTime();
    if (now - ref > months(keep)) {
      await deleteMessage(m.id);
      removed[kind]++;
    }
  }
  const total = Object.values(removed).reduce((a, b) => a + b, 0);
  if (total) {
    await logActivity({
      userId: 'system',
      name: 'النظام',
      section: 'retention',
      action: 'delete',
      what: `حذف تلقائي لبيانات انتهت مدة الاحتفاظ بها: ${removed.contact} رسالة، ${removed.quote} طلب عرض سعر، ${removed.vendor} مورد، ${removed.datarequest} طلب بيانات`,
    });
  }
  return removed;
}
