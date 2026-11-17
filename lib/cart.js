'use client';

// سلة عرض السعر محفوظة في متصفح الزائر
const KEY = 'quote-cart';
const EVENT = 'quote-cart-change';

export function readCart() {
  try {
    const items = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(items) ? items.filter((i) => i && i.id && i.qty > 0) : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function addToCart(item, qty = 1) {
  const items = readCart();
  const found = items.find((i) => i.id === item.id);
  if (found) found.qty = Math.min(found.qty + qty, 100000);
  else items.push({ id: item.id, name: item.name, short: item.short || '', image: item.image || '', qty });
  writeCart(items);
}

export function setQty(id, qty) {
  const n = Math.max(1, Math.min(100000, Math.floor(Number(qty) || 1)));
  writeCart(readCart().map((i) => (i.id === id ? { ...i, qty: n } : i)));
}

export function removeFromCart(id) {
  writeCart(readCart().filter((i) => i.id !== id));
}

export function clearCart() {
  writeCart([]);
}

export function onCartChange(fn) {
  const handler = () => fn(readCart());
  window.addEventListener(EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
