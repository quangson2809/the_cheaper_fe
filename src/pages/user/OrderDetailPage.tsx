import { useParams, Link } from 'react-router-dom';
import { useOrderDetail, useCancelOrder } from '@/hooks/order/useOrders';
import { Spinner, Badge, Button } from '@/components/ui';
import { EmptyState } from '@/components/common';
import { OrderStatusStepper, OrderItemRow } from '@/components/order';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import { ORDER_STATUS_LABEL, ORDER_STATUS_BADGE, CANCELABLE_STATUSES } from '@/constants/orderStatus';
import { getPaymentMethodLabel } from '@/constants/paymentMethod';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? Number(id) : undefined;
  const { order, setOrder, isLoading, notFound } = useOrderDetail(orderId);
  const { cancelOrder, isLoading: isCanceling } = useCancelOrder();

  async function handleCancel() {
    if (!order) return;
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;

    const updated = await cancelOrder(order.id);
    if (updated) {
      setOrder(updated);
    } else {
      alert('Hủy đơn hàng thất bại.');
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <EmptyState
        icon="😕"
        title="Không tìm thấy đơn hàng"
        description="Đơn hàng không tồn tại hoặc bạn không có quyền xem."
        action={
          <Link
            to="/orders"
            className="text-indigo-600 font-semibold hover:underline text-sm"
          >
            ← Quay lại danh sách
          </Link>
        }
      />
    );
  }

  const canCancel = CANCELABLE_STATUSES.includes(order.status);
  const subtotal = order.items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/orders"
        className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200"
      >
        ← Danh sách đơn hàng
      </Link>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-slate-100 space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Đơn hàng #{order.id}</h1>
            <p className="text-sm text-slate-500 mt-1">
              Ngày đặt: {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={ORDER_STATUS_BADGE[order.status]} className="text-sm px-3 py-1">
              {ORDER_STATUS_LABEL[order.status]}
            </Badge>
            {canCancel && (
              <Button
                variant="danger"
                size="sm"
                isLoading={isCanceling}
                onClick={() => void handleCancel()}
              >
                Hủy đơn
              </Button>
            )}
          </div>
        </div>

        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Trạng thái đơn hàng</h2>
          <OrderStatusStepper status={order.status} />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-800 mb-3">Thông tin giao hàng</h3>
            <dl className="text-sm space-y-2">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500 shrink-0">Người nhận</dt>
                <dd className="font-medium text-slate-800 text-right">{order.receiver ?? '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500 shrink-0">Địa chỉ</dt>
                <dd className="font-medium text-slate-800 text-right">{order.location ?? '—'}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-800 mb-3">Thanh toán</h3>
            <dl className="text-sm space-y-2">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500 shrink-0">Phương thức</dt>
                <dd className="font-medium text-slate-800 text-right">
                  {getPaymentMethodLabel(order.paymentMethodCode)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500 shrink-0">Tổng thanh toán</dt>
                <dd className="font-bold text-indigo-600 text-right">
                  {formatCurrency(order.finalAmount)}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <section>
          <h3 className="font-semibold text-slate-800 mb-4">
            Sản phẩm ({order.items.length})
          </h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <OrderItemRow
                key={`${item.productId}-${item.optionValue ?? ''}-${item.quantity}`}
                item={item}
              />
            ))}
          </div>
        </section>

        <div className="border-t border-slate-100 pt-6 flex justify-end">
          <div className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Tạm tính</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-slate-900 pt-2 border-t border-slate-100">
              <span>Tổng cộng</span>
              <span className="text-indigo-600">{formatCurrency(order.finalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
