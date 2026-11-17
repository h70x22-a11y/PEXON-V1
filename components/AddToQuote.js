'use client';

import { useState } from 'react';
import { FiCheck, FiMinus, FiPlus } from 'react-icons/fi';
import { addToCart } from '@/lib/cart';

export default function AddToQuote({ product, labels, withQty = false }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function add() {
    addToCart(product, withQty ? qty : 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  if (!withQty) {
    return (
      <button type="button" className={`btn add${added ? ' done' : ''}`} onClick={add}>
        {added ? <FiCheck aria-hidden="true" /> : <FiPlus aria-hidden="true" />}
        {added ? labels.added : labels.add}
      </button>
    );
  }

  return (
    <div className="add-qty">
      <div className="qty" role="group" aria-label={labels.qty}>
        <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="-">
          <FiMinus aria-hidden="true" />
        </button>
        <input
          type="number"
          min={1}
          max={100000}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Math.min(100000, Math.floor(Number(e.target.value) || 1))))}
          aria-label={labels.qty}
        />
        <button type="button" onClick={() => setQty((q) => Math.min(100000, q + 1))} aria-label="+">
          <FiPlus aria-hidden="true" />
        </button>
      </div>
      <button type="button" className={`btn${added ? ' done' : ''}`} onClick={add}>
        {added ? <FiCheck aria-hidden="true" /> : null}
        {added ? labels.added : labels.add}
      </button>
    </div>
  );
}
