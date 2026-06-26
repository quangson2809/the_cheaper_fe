import { useState } from 'react';
import { useCart } from '@/hooks/user/useCart';
import { Link } from 'react-router-dom';
import { Button, Spinner } from '@/components/ui';
import { EmptyState } from '@/components/common';
import { formatCurrency } from '@/utils/formatCurrency';
import { getImageUrl } from '@/utils/getImageUrl';

export default function CartPage() {
  const { cart, isLoading, updateItem, removeItem } = useCart();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  if (isLoading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="Giỏ hàng trống"
        description="Hãy khám phá sản phẩm và thêm vào giỏ hàng!"
        action={<Link to="/products"><Button>Mua sắm ngay</Button></Link>}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-800">Giỏ hàng ({items.length})</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 divide-y divide-slate-50">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 p-4 items-start">
            <img
              src={getImageUrl(item.thumbnail)}
              alt={item.productName}
              className="w-20 h-20 rounded-2xl object-cover bg-slate-100 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <Link to={`/products/${item.productId}`} className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-2 text-sm">
                {item.productName}
              </Link>
              {item.optionNames && item.optionNames.length > 0 && (
                <p className="text-xs text-slate-400 mt-0.5">{item.optionNames.join(' / ')}</p>
              )}
              <p className="text-indigo-600 font-bold mt-1 text-sm">{formatCurrency(item.price)}</p>

              {/* Quantity */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center text-lg leading-none"
                  disabled={loadingId === item.id}
                  onClick={async () => {
                    if (item.quantity <= 1) return;
                    setLoadingId(item.id);
                    await updateItem(item.id, item.quantity - 1);
                    setLoadingId(null);
                  }}
                >−</button>
                <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center text-lg leading-none"
                  disabled={loadingId === item.id}
                  onClick={async () => {
                    setLoadingId(item.id);
                    await updateItem(item.id, item.quantity + 1);
                    setLoadingId(null);
                  }}
                >+</button>
              </div>
            </div>

            <button
              onClick={() => void removeItem(item.id)}
              className="text-red-400 hover:text-red-600 transition-colors text-sm font-medium mt-1 shrink-0"
              aria-label="Xóa"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between text-slate-600 text-sm mb-4">
          <span>Tạm tính</span>
          <span>{formatCurrency(cart?.totalPrice ?? 0)}</span>
        </div>
        <div className="flex justify-between font-extrabold text-slate-800 text-lg mb-6">
          <span>Tổng cộng</span>
          <span className="text-indigo-600">{formatCurrency(cart?.totalPrice ?? 0)}</span>
        </div>
        <Link to="/checkout">
          <Button size="lg" className="w-full">Tiến hành đặt hàng →</Button>
        </Link>
      </div>
    </div>
  );
}
