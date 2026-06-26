import { Link } from 'react-router-dom';
import { getImageUrl } from '@/utils/getImageUrl';
import { formatCurrency } from '@/utils/formatCurrency';
import type { UserProductOverviewResponse } from '@/types/product.types';

interface ProductCardProps {
  product: UserProductOverviewResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-indigo-200 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={getImageUrl(product.thumbnailUrl)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.discountPercentage != null && product.discountPercentage > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{product.discountPercentage}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {(product.brand || product.category) && (
          <p className="text-xs text-indigo-400 font-medium uppercase tracking-wide mb-1">
            {product.brand ?? product.category}
          </p>
        )}
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-2 group-hover:text-indigo-700 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-indigo-600">{formatCurrency(product.price)}</span>
          {product.originalPrice != null && product.originalPrice > product.price && (
            <span className="text-xs text-slate-400 line-through">{formatCurrency(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── ProductGrid ───────────────────────────────────────

interface ProductGridProps {
  products: UserProductOverviewResponse[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
