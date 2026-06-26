import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import { ORDER_STATUS_LABEL, ORDER_STATUS_BADGE } from '@/constants/orderStatus';
import { getPaymentMethodLabel } from '@/constants/paymentMethod';
import type { UserOrderOverviewResponse } from '@/types/order.types';

interface OrderCardProps {
  order: UserOrderOverviewResponse;
}

export function OrderCard({ order }: OrderCardProps) {

  return (
    <article className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Đơn hàng #{order.id}</p>
          <p className="text-sm text-slate-500 mt-1">{formatDate(order.createdAt)}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {getPaymentMethodLabel(order.paymentMethodCode)}
          </p>
        </div>
        <Badge variant={ORDER_STATUS_BADGE[order.status]}>
          {ORDER_STATUS_LABEL[order.status]}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-4 pt-4 border-t border-slate-50">
        <div className="flex items-center gap-6">
          <p className="font-bold text-lg text-indigo-600">{formatCurrency(order.finalAmount)}</p>
          <Link
            to={`/orders/${order.id}`}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
          >
            Chi tiết →
          </Link>
        </div>
      </div>
    </article>
  );
}
