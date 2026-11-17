import Link from 'next/link';
import { getCategories, getMessages, getProducts } from '@/lib/db';

export default async function AdminHome() {
  const [categories, products, messages] = await Promise.all([getCategories(), getProducts(), getMessages()]);
  return (
    <>
      <h1>نظرة عامة</h1>
      <div className="stats">
        <div className="stat"><b>{products.length}</b>منتج</div>
        <div className="stat"><b>{categories.length}</b>قسم</div>
        <div className="stat"><b>{messages.filter((m) => m.type === 'quote' && (m.status || 'new') === 'new').length}</b>طلب عرض سعر جديد</div>
        <div className="stat"><b>{messages.filter((m) => m.type !== 'vendor' && m.type !== 'quote').length}</b>رسالة</div>
        <div className="stat"><b>{messages.filter((m) => m.type === 'vendor').length}</b>مورد مسجل</div>
      </div>
      <div className="panel">
        <h2>اختصارات</h2>
        <div className="row-actions">
          <Link className="btn" href="/admin/products">إضافة منتج</Link>
          <Link className="btn ghost" href="/admin/categories">إدارة الأقسام</Link>
          <Link className="btn ghost" href="/admin/quotes">طلبات عروض الأسعار</Link>
          <Link className="btn ghost" href="/admin/messages">قراءة الرسائل</Link>
          <Link className="btn ghost" href="/admin/vendors">الموردين المسجلين</Link>
          <Link className="btn ghost" href="/admin/settings">تعديل بيانات الموقع</Link>
        </div>
      </div>
    </>
  );
}
