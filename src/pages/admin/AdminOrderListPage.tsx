import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminOrders } from '@/hooks/admin/useAdminOrders';
import type { OrderStatus } from '@/types/order.types';
import { Spinner, Input, Select, Button, Badge } from '@/components/ui';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

const STATUS_CONFIG: Record<string, { label: string; variant: 'warning' | 'info' | 'primary' | 'success' | 'error' | 'neutral' }> = {
  PENDING: { label: 'Chờ xác nhận', variant: 'warning' },
  PROCESSING: { label: 'Đang xử lý', variant: 'info' },
  SHIPPING: { label: 'Đang giao', variant: 'primary' },
  DELIVERED: { label: 'Đã giao', variant: 'success' },
  CANCELED: { label: 'Đã hủy', variant: 'error' },
  REFUNDED: { label: 'Hoàn tiền', variant: 'neutral' },
};

const ALL_STATUSES: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELED', 'REFUNDED'];

export default function AdminOrderListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const { orders, isLoading, totalElements, totalPages, updateOrderStatus } = useAdminOrders({ page, limit: 10, status: filterStatus || undefined });

  const filteredOrders = orders.filter((order) => {
    if (!search.trim()) return true;
    const term = search.trim().toLowerCase();
    return String(order.id).includes(term) || (order.phone ?? '').includes(term) || (order.location ?? '').toLowerCase().includes(term);
  });

  const handleStatusChange = async (id: number, value: string) => {
    setUpdatingId(id);
    await updateOrderStatus(id, value as OrderStatus);
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="admin-kicker">Commerce</div>
          <h1 className="admin-page-title mt-2">Đơn hàng</h1>
          <p className="admin-page-subtitle">Theo dõi trạng thái, thanh toán và tiến độ xử lý đơn.</p>
        </div>
        <div className="admin-surface flex items-center gap-3 px-4 py-2.5">
          <span className="text-xl font-semibold tracking-tight text-slate-900">{totalElements}</span>
          <span className="text-xs font-medium text-slate-500">đơn hàng</span>
        </div>
      </section>

      <section className="admin-surface overflow-hidden">
        <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-[1fr_240px]">
          <Input
            aria-label="Tìm kiếm đơn hàng"
            placeholder="Tìm theo mã đơn, số điện thoại hoặc địa chỉ..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>}
          />
          <Select
            label="Trạng thái"
            value={filterStatus}
            onChange={(event) => { setFilterStatus(event.target.value); setPage(1); }}
            options={ALL_STATUSES.map((status) => ({ value: status, label: STATUS_CONFIG[status].label }))}
          />
        </div>
      </section>

      <section className="admin-surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Danh sách đơn hàng</h2>
            <p className="mt-0.5 text-xs text-slate-500">{filteredOrders.length} kết quả trên trang hiện tại.</p>
          </div>
          <span className="text-xs font-medium text-slate-400">Trang {page} / {Math.max(totalPages, 1)}</span>
        </div>

        {isLoading ? (
          <div className="flex min-h-[420px] items-center justify-center"><Spinner size="lg" /></div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400"><span className="text-xs font-bold">ORD</span></div>
            <p className="mt-4 text-sm font-semibold text-slate-900">Không tìm thấy đơn hàng</p>
            <p className="mt-1 text-sm text-slate-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Đơn hàng</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Khách hàng</th>
                  <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Sản phẩm</th>
                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Tổng tiền</th>
                  <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Trạng thái</th>
                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Ngày tạo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const config = STATUS_CONFIG[order.status] ?? { label: order.status, variant: 'neutral' as const };
                  return (
                    <tr key={order.id} onClick={() => navigate(`/admin/orders/${order.id}`)} className="group cursor-pointer bg-white transition-colors hover:bg-slate-50/60">
                      <td className="px-5 py-4"><span className="text-sm font-semibold text-indigo-600">#{order.id}</span><p className="mt-0.5 text-[11px] text-slate-400">Chi tiết đơn hàng</p></td>
                      <td className="px-5 py-4"><p className="text-xs font-semibold text-slate-800">{order.phone || '—'}</p><p className="mt-0.5 max-w-[220px] truncate text-[11px] text-slate-400">{order.location || '—'}</p></td>
                      <td className="px-5 py-4 text-center"><span className="inline-flex min-w-8 items-center justify-center rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{order.countItem}</span></td>
                      <td className="px-5 py-4 text-right"><p className="text-xs font-semibold text-slate-900">{formatCurrency(order.finalTotal)}</p><p className={`mt-0.5 text-[10px] font-semibold ${order.paymentStatus === 1 ? 'text-emerald-600' : 'text-amber-600'}`}>{order.paymentStatus === 1 ? 'Đã thanh toán' : 'Chưa thanh toán'}</p></td>
                      <td className="px-5 py-4 text-center" onClick={(event) => event.stopPropagation()}>
                        <div className="flex flex-col items-center gap-1.5">
                          <Badge variant={config.variant}>{config.label}</Badge>
                          <select value={order.status} disabled={updatingId === order.id} onChange={(event) => void handleStatusChange(order.id, event.target.value)} className="h-8 rounded-md border border-slate-200 bg-white px-2 text-[11px] font-medium text-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10">
                            {ALL_STATUSES.map((status) => <option key={status} value={status}>{STATUS_CONFIG[status].label}</option>)}
                          </select>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right"><p className="text-xs font-medium text-slate-600">{formatDate(order.createdAt).split(' ')[0]}</p><p className="mt-0.5 text-[10px] text-slate-400">{formatDate(order.createdAt).split(' ')[1]}</p></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4"><p className="text-xs text-slate-500">Trang {page} / {totalPages}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Trước</Button><Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>Tiếp</Button></div></div>}
      </section>
    </div>
  );
}
