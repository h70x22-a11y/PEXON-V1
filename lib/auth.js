import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHash, createHmac, timingSafeEqual } from 'crypto';

const PASS = process.env.ADMIN_PASSWORD || '';

export const passwordConfigured = Boolean(PASS);

function safeEqual(a, b) {
  const x = createHash('sha256').update(String(a)).digest();
  const y = createHash('sha256').update(String(b)).digest();
  return timingSafeEqual(x, y);
}

export function sessionToken() {
  return createHmac('sha256', PASS).update('admin-session-v1').digest('hex');
}

export function checkPassword(input) {
  if (!PASS) return false;
  return safeEqual(input, PASS);
}

export async function isAdmin() {
  if (!PASS) return false;
  const store = await cookies();
  const value = store.get('admin')?.value;
  if (!value) return false;
  return safeEqual(value, sessionToken());
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin/login');
}
