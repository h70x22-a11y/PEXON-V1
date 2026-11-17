import Link from 'next/link';
import { productPrice, productShort, t } from '@/lib/i18n';
import AddToQuote from '@/components/AddToQuote';

function Thumb({ image, name }) {
  return (
    <div className="thumb">
      {image ? <img src={image} alt={name} loading="lazy" /> : <span className="letter">{(name || '؟').trim().charAt(0)}</span>}
    </div>
  );
}

export function CategoryCard({ category, count, lang = 'ar' }) {
  const tr = t(lang);
  return (
    <Link href={`/category/${category.id}`} className="card">
      <Thumb image={category.image} name={category.name} />
      <div className="body">
        <h3>{category.name}</h3>
        {category.description ? <p>{category.description}</p> : null}
        <span className="more">{tr.productsCount(count)} {tr.arrow}</span>
      </div>
    </Link>
  );
}

export function ProductCard({ product, lang = 'ar' }) {
  const tr = t(lang);
  const short = productShort(product, lang);
  const price = productPrice(product, lang);
  return (
    <div className="card product-card">
      <Link href={`/product/${product.id}`} className="card-link">
        <Thumb image={product.image} name={product.name} />
        <div className="body">
          <h3>{product.name}</h3>
          {short ? <p>{short}</p> : null}
          {price ? <span className="price">{price}</span> : null}
          <span className="more">{tr.details} {tr.arrow}</span>
        </div>
      </Link>
      <div className="card-actions">
        <AddToQuote
          product={{ id: product.id, name: product.name, short, image: product.image }}
          labels={{ add: tr.addToQuote, added: tr.added, qty: tr.qty }}
        />
      </div>
    </div>
  );
}
