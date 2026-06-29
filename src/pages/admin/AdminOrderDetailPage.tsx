import { useParams, useNavigate } from 'react-router-dom';
import { useAdminOrderDetail } from '@/hooks/admin/useAdminOrders';
import type { AdminOrderItemResponse } from '@/types/admin.types';
import type { OrderStatus } from '@/types/order.types';
import { Spinner, Button, Badge } from '@/components/ui';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

const STATUS_CONFIG: Record<string, { label: string; variant: 'warning' | 'primary' | 'info' | 'success' | 'error' | 'neutral' }> = {
  PENDING: { label: 'Chờ xác nhận', variant: 'warning' },
  PROCESSING: { label: 'Đang xử lý', variant: 'info' },
  SHIPPING: { label: 'Đang giao hàng', variant: 'primary' },
  DELIVERED: { label: 'Đã giao hàng', variant: 'success' },
  CANCELED: { label: 'Đã hủy', variant: 'error' },
  REFUNDED: { label: 'Hoàn tiền', variant: 'neutral' },
};

const STATUS_FLOW: Record<string, OrderStatus[]> = {
  PENDING: ['PROCESSING', 'CANCELED'],
  PROCESSING: ['SHIPPING', 'CANCELED'],
  SHIPPING: ['DELIVERED', 'REFUNDED'],
  DELIVERED: [],
  CANCELED: [],
  REFUNDED: [],
};

const TIMELINE_STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'PENDING', label: 'Đặt hàng' },
  { status: 'PROCESSING', label: 'Xử lý' },
  { status: 'SHIPPING', label: 'Vận chuyển' },
  { status: 'DELIVERED', label: 'Hoàn tất' },
];

function OrderTimeline({ currentStatus }: { currentStatus: string }) {
  const isCanceled = currentStatus === 'CANCELED';
  const isRefunded = currentStatus === 'REFUNDED';
  const currentIdx = TIMELINE_STEPS.findIndex((s) => s.status === currentStatus);

  if (isCanceled || isRefunded) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50/50 border border-red-100 rounded-2xl">
        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-red-700">{isCanceled ? 'Đơn hàng đã bị hủy' : 'Đơn hàng đã hoàn tiền'}</p>
          <p className="text-sm text-red-600/80">Đơn hàng này không còn hiệu lực trong hệ thống bán hàng.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-between items-start pt-4 pb-2 px-2">
      {/* Background Line */}
      <div className="absolute top-[34px] left-10 right-10 h-0.5 bg-slate-100" />

      {TIMELINE_STEPS.map((step, idx) => {
        const isDone = idx < currentIdx;
        const isActive = idx === currentIdx;
        const isLast = idx === TIMELINE_STEPS.length - 1;

        return (
          <div key={step.status} className="relative z-10 flex flex-col items-center group">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isDone
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : isActive
                  ? 'bg-white border-indigo-600 text-indigo-600 ring-4 ring-indigo-50 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-300'
                }`}
            >
              {isDone ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-sm font-bold">{idx + 1}</span>
              )}
            </div>
            <p className={`mt-3 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-indigo-600' : isDone ? 'text-emerald-600' : 'text-slate-400'
              }`}>
              {step.label}
            </p>

            {/* Connection Line Progress */}
            {!isLast && idx < currentIdx && (
              <div className="absolute top-[20px] left-[50%] w-full h-0.5 bg-emerald-500 -z-10 translate-y-[14px]" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { order, isLoading, isUpdating, successMsg, updateStatus } = useAdminOrderDetail(Number(id));

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Spinner size="lg" />
      <p className="text-slate-400 font-medium animate-pulse">Đang tải chi tiết hóa đơn...</p>
    </div>
  );

  if (!order) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl border border-dashed border-slate-200">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-slate-500 font-bold">Không tìm thấy đơn hàng</p>
      <Button variant="ghost" onClick={() => navigate('/admin/orders')} className="mt-4">Quay lại danh sách</Button>
    </div>
  );

  const nextStatuses = STATUS_FLOW[order.status] ?? [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-[fadeIn_0.3s_ease] pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/orders')}
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Hóa đơn #{order.id}</h1>
              <Badge variant={STATUS_CONFIG[order.status]?.variant || 'neutral'}>
                {STATUS_CONFIG[order.status]?.label || order.status}
              </Badge>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">Ngày đặt hàng: <span className="font-semibold text-slate-700">{formatDate(order.createdAt)}</span></p>
          </div>
        </div>

        {nextStatuses.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {nextStatuses.map((status) => (
              <Button
                key={status}
                variant={status === 'CANCELED' || status === 'REFUNDED' ? 'danger' : 'primary'}
                size="sm"
                onClick={() => updateStatus(status)}
                isLoading={isUpdating}
                className="shadow-md shadow-indigo-100"
              >
                Chuyển sang {STATUS_CONFIG[status]?.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-[slideIn_0.3s_ease]">
          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          {successMsg}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Products & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Progress Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              Tiến trình đơn hàng
            </h2>
            <OrderTimeline currentStatus={order.status} />
          </div>

          {/* Items Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-800">Sản phẩm đã chọn</h2>
              <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500">{order.items.length} mặt hàng</span>
            </div>
            <div className="divide-y divide-slate-50">
              {order.items.map((item: AdminOrderItemResponse) => (
                <div key={item.productId} className="flex items-center gap-6 p-8 hover:bg-slate-50/50 transition-colors">
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-10 h-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-bold text-slate-800 text-base leading-tight">{item.productName}</p>
                    {item.optionNames && (
                      <p className="text-xs font-bold text-indigo-600/70">{item.optionNames}</p>
                    )}
                    <p className="text-sm text-slate-400 font-medium">Đơn giá: {formatCurrency(item.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs font-bold mb-1">Số lượng: x{item.quantity}</p>
                    <p className="font-black text-slate-800 text-lg">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-8 py-6 bg-slate-50/50 flex justify-between items-center">
              <div className="space-y-0.5">
                <p className="text-slate-500 text-sm font-medium">Tổng số tiền cần thanh toán</p>
                <p className="text-xs text-slate-400">(Bao gồm thuế và phí vận chuyển nếu có)</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-indigo-600">{formatCurrency(order.finalTotal)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Payment Info */}
        <div className="space-y-6">
          {/* Customer Info Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-6">Thông tin nhận hàng</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Người nhận</p>
                  <p className="font-bold text-slate-800">{order.receiver || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Điện thoại</p>
                  <p className="font-bold text-slate-800">{order.phone || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <circle cx="12" cy="11" r="3" strokeWidth={2} />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Địa chỉ giao hàng</p>
                  <p className="font-bold text-slate-800 leading-snug">{order.location || 'Chưa cập nhật'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl" />

            <h2 className="text-lg font-black mb-6 flex justify-between items-center">
              Thanh toán
              <div className={`w-3 h-3 rounded-full ${order.paymentStatus === 'PAID' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]'}`} />
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-slate-400 text-sm">Phương thức</p>
                <p className="font-bold tracking-wider">{order.paymentMethodCode || '—'}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-slate-400 text-sm">Trạng thái</p>
                <p className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </p>
              </div>

              <div className="h-px bg-white/10 my-4" />

              <div className="flex justify-between items-end">
                <p className="text-slate-400 text-sm mb-1">Thành tiền</p>
                <p className="text-3xl font-black text-white">{formatCurrency(order.finalTotal)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
