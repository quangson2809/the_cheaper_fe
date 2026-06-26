import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminOrders } from '@/hooks/admin/useAdminOrders';
import type { OrderStatus } from '@/types/order.types';
import { Spinner, Input, Select, Badge } from '@/components/ui';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

const STATUS_CONFIG: Record<string, { label: string; variant: 'warning' | 'primary' | 'info' | 'success' | 'error' | 'neutral' }> = {
  PENDING:    { label: 'Chờ xác nhận', variant: 'warning' },
  PROCESSING: { label: 'Đang xử lý',   variant: 'info' },
  SHIPPING:   { label: 'Đang giao',    variant: 'primary' },
  DELIVERED:  { label: 'Đã giao',      variant: 'success' },
  CANCELED:   { label: 'Đã hủy',       variant: 'error' },
  REFUNDED:   { label: 'Hoàn tiền',    variant: 'neutral' },
};

const ALL_STATUSES: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELED', 'REFUNDED'];

export default function AdminOrderListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  const { orders, isLoading, totalElements, totalPages, updateOrderStatus } = useAdminOrders({
    page,
    limit: 10,
    status: filterStatus || undefined,
  });

  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>, id: number) => {
    e.stopPropagation();
    const newStatus = e.target.value as OrderStatus;
    setUpdatingId(id);
    await updateOrderStatus(id, newStatus);
    setUpdatingId(null);
  };

  const filteredOrders = orders.filter((o) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      String(o.id).includes(search) ||
      (o.phone ?? '').includes(search) ||
      (o.location ?? '').toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease] pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Danh sách Hóa đơn</h1>
          <p className="text-slate-500 mt-1 text-sm">Theo dõi và quản lý toàn bộ luồng đơn hàng trong hệ thống</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-2xl border border-indigo-100">
          <span className="text-indigo-700 font-bold text-lg">{totalElements}</span>
          <span className="text-indigo-600/70 text-xs font-bold uppercase tracking-wider">Tổng đơn</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <Input
            placeholder="Tìm mã đơn, SĐT hoặc địa chỉ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>
        <div className="w-full md:w-64">
          <Select
            label="Lọc theo trạng thái"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(0);
            }}
            options={[
              { value: '', label: 'Tất cả trạng thái' },
              ...ALL_STATUSES.map(s => ({ value: s, label: STATUS_CONFIG[s].label }))
            ]}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Spinner size="lg" />
            <p className="text-slate-400 font-medium animate-pulse">Đang tải danh sách...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 text-slate-400">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-lg font-bold">Không tìm thấy đơn hàng nào</p>
            <p className="text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/50 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5">Mã đơn</th>
                  <th className="px-6 py-5">Khách hàng / Địa chỉ</th>
                  <th className="px-6 py-5 text-center">SL</th>
                  <th className="px-6 py-5 text-right">Tổng thanh toán</th>
                  <th className="px-6 py-5 text-center">Trạng thái</th>
                  <th className="px-8 py-5 text-right">Ngày tạo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                  >
                    <td className="px-8 py-6">
                      <span className="font-black text-indigo-600 group-hover:text-indigo-700 transition-colors">#{order.id}</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800">{order.phone || '—'}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[200px]">{order.location || '—'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg bg-slate-100 text-slate-600 font-black text-[11px]">
                        {order.countItem}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="space-y-1">
                        <p className="font-black text-slate-800">{formatCurrency(order.finalTotal)}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-tight ${order.paymentStatus === 'PAID' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block min-w-[140px]">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(e, order.id)}
                          className={`w-full appearance-none font-bold text-[11px] uppercase tracking-wider rounded-xl px-4 py-2 border transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-500/10 ${
                            order.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            order.status === 'PROCESSING' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            order.status === 'SHIPPING' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                            order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            order.status === 'CANCELED' ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-slate-50 text-slate-500 border-slate-100'
                          }`}
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          {updatingId === order.id ? (
                            <Spinner size="sm" />
                          ) : (
                            <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-xs font-bold text-slate-400">{formatDate(order.createdAt).split(' ')[0]}</p>
                      <p className="text-[10px] text-slate-300 font-medium">{formatDate(order.createdAt).split(' ')[1]}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Trang {page + 1} / {totalPages}
            </p>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                disabled={page === 0} 
                onClick={() => setPage(p => p - 1)}
                className="rounded-xl border border-slate-200"
              >
                Trước
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                disabled={page >= totalPages - 1} 
                onClick={() => setPage(p => p + 1)}
                className="rounded-xl border border-slate-200"
              >
                Tiếp theo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
