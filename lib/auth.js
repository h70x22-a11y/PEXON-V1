import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { getRoles, getUsers } from '@/lib/db';
import { ALL_PERMS, normalizePerms } from '@/lib/permissions';

const PASS = (process.env.ADMIN_PASSWORD || '').trim();
const COOKIE = 'admin';
const MAX_AGE = 60 * 60 * 24 * 7;

export const passwordConfigured = Boolean(PASS);
export const OWNER_USERNAME = 'admin';

function safeEqual(a, b) {
  const x = createHash('sha256').update(String(a)).digest();
  const y = createHash('sha256').update(String(b)).digest();
  return timingSafeEqual(x, y);
}

// ---------- كلمات المرور ----------
export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(String(password), salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password, stored) {
  const [algo, salt, hash] = String(stored || '').split('$');
  if (algo !== 'scrypt' || !salt || !hash) return false;
  const test = scryptSync(String(password), salt, 64);
  const real = Buffer.from(hash, 'hex');
  return real.length === test.length && timingSafeEqual(real, test);
}

export function checkOwnerPassword(input) {
  if (!PASS) return false;
  return safeEqual(String(input).trim(), PASS);
}

// ---------- الجلسة ----------
function sign(payload) {
  return createHmac('sha256', PASS || 'no-secret').update(payload).digest('hex');
}

export function sessionValue(userId, version) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `${userId}.${version}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export async function setSession(userId, version) {
  const store = await cookies();
  store.set(COOKIE, sessionValue(userId, version), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSession() {
  if (!PASS) return null;
  const store = await cookies();
  const raw = store.get(COOKIE)?.value || '';
  const parts = raw.split('.');
  if (parts.length !== 4) return null;
  const [id, version, exp, sig] = parts;
  if (!safeEqual(sig, sign(`${id}.${version}.${exp}`))) return null;
  if (Number(exp) < Date.now() / 1000) return null;
  if (id === 'owner') {
    return { id: 'owner', name: 'المالك', username: OWNER_USERNAME, perms: ALL_PERMS, owner: true };
  }
  const user = (await getUsers()).find((u) => u.id === id);
  if (!user || !user.active || String(user.sessionVersion) !== version) return null;
  let perms = normalizePerms(user.perms || []);
  let roleName = '';
  if (user.roleId) {
    const role = (await getRoles()).find((r) => r.id === user.roleId);
    perms = role ? normalizePerms(role.perms || []) : [];
    roleName = role?.name || '';
  }
  return { id: user.id, name: user.name, username: user.username, perms, roleName, owner: false, mustChange: Boolean(user.mustChangePassword) };
}

// perm: "quotes" (= عرض) أو "quotes:delete"
export const can = (session, perm) => {
  if (!session) return false;
  if (session.owner) return true;
  return session.perms.includes(perm.includes(':') ? perm : `${perm}:read`);
};

export async function isAdmin() {
  return Boolean(await getSession());
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

export async function requirePerm(perm) {
  const session = await requireAdmin();
  if (session.mustChange) redirect('/admin/set-password');
  if (!can(session, perm)) redirect('/admin?denied=1');
  return session;
}

export async function clientIp() {
  const h = await headers();
  return (h.get('x-forwarded-for') || h.get('x-real-ip') || 'unknown').split(',')[0].trim();
}
