import { Link } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatCurrency';
import { getImageUrl } from '@/utils/getImageUrl';
import type { UserOrderItemResponse } from '@/types/order.types';

interface OrderItemRowProps {
  item: UserOrderItemResponse;
}

export function OrderItemRow({ item }: OrderItemRowProps) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 items-start hover:bg-slate-100/80 transition-colors duration-200">
      <img
        src={getImageUrl(item.thumbnailUrl)}
        alt={item.productName}
        className="w-16 h-16 rounded-xl object-cover bg-white border border-slate-100 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${item.productId}`}
          className="text-sm font-semibold text-slate-800 hover:text-indigo-600 line-clamp-2 transition-colors duration-200"
        >
          {item.productName}
        </Link>
        {item.optionValue && (
          <p className="text-xs text-slate-500 mt-0.5">{item.optionValue}</p>
        )}
        <div className="flex flex-wrap justify-between items-center gap-2 mt-2 text-sm">
          <p className="text-slate-600">
            <span className="text-xs text-slate-400">× {item.quantity}</span>
          </p>
          <p className="font-bold text-indigo-600">{formatCurrency(item.price)}</p>
        </div>
      </div>
    </div>
  );
}
