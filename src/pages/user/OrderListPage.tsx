import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useOrders } from '@/hooks/order/useOrders';
import { Spinner } from '@/components/ui';
import { Pagination, EmptyState } from '@/components/common';
import { OrderCard } from '@/components/order';

export default function OrderListPage() {
  const [page, setPage] = useState(1);
  const { orders, totalPages, isLoading } = useOrders(page);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Lịch sử đơn hàng</h1>
        <p className="text-sm text-slate-500 mt-1">Theo dõi và quản lý các đơn hàng của bạn</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Spinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="Chưa có đơn hàng nào"
          description="Bạn chưa thực hiện đơn hàng nào trên hệ thống."
          action={
            <Link
              to="/products"
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors duration-200"
            >
              Khám phá sản phẩm
            </Link>
          }
        />
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
