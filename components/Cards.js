import Link from 'next/link';

function Thumb({ image, name }) {
  return (
    <div className="thumb">
      {image ? <img src={image} alt={name} loading="lazy" /> : <span className="letter">{(name || '؟').trim().charAt(0)}</span>}
    </div>
  );
}

export function CategoryCard({ category, count }) {
  return (
    <Link href={`/category/${category.id}`} className="card">
      <Thumb image={category.image} name={category.name} />
      <div className="body">
        <h3>{category.name}</h3>
        {category.description ? <p>{category.description}</p> : null}
        <span className="more">{count} منتج ←</span>
      </div>
    </Link>
  );
}

export function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`} className="card">
      <Thumb image={product.image} name={product.name} />
      <div className="body">
        <h3>{product.name}</h3>
        {product.short ? <p>{product.short}</p> : null}
        {product.price ? <span className="price">{product.price}</span> : null}
        <span className="more">التفاصيل ←</span>
      </div>
    </Link>
  );
}
