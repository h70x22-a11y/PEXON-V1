'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { onCartChange, readCart } from '@/lib/cart';

export default function CartButton({ label }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = (items) => setCount(items.length);
    update(readCart());
    return onCartChange(update);
  }, []);
  return (
    <Link href="/quote" className="cart-button" aria-label={`${label} (${count})`} title={label}>
      <FiShoppingCart size={18} aria-hidden="true" />
      {count ? <span className="cart-count">{count}</span> : null}
    </Link>
  );
}
