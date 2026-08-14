import { useEffect, useState } from 'react';
import * as dashboardService from '@/services/admin/admin.dashboard.service';
import type {
  AdminDashboardResponse,
  MonthlyRevenueResponse,
  MonthlyQuantityResponse,
  OrderStatusRatioResponse,
} from '@/types/admin.types';
import { Spinner } from '@/components/ui';
import { formatCurrency } from '@/utils/formatCurrency';

function MetricIcon({ type }: { type: 'revenue' | 'orders' | 'users' }) {
  const paths = {
    revenue: <><path d="M12 3v18M16 7.5c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.5 2.5 4 3 4 1.3 4 3-1.8 3-4 3-4-1.3-4-3" /></>,
    orders: <><path d="M6 4h12v16H6z" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M15 6a3 3 0 0 1 0 5.8M16 14.5a5 5 0 0 1 4.5 5" /></>,
  };

  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">{paths[type]}</svg>;
}

function formatCompact(value: number) {
  return new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export default function DashboardPage() {
  const [year, setYear] = useState(2026);
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [revenue, setRevenue] = useState<MonthlyRevenueResponse[]>([]);
  const [quantity, setQuantity] = useState<MonthlyQuantityResponse[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatusRatioResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    void Promise.all([
      dashboardService.getDashboardStats(year),
      dashboardService.getMonthlyRevenue(year),
      dashboardService.getMonthlyQuantity(year),
      dashboardService.getOrderStatus(),
    ])
      .then(([dashRes, revenueRes, quantityRes, statusRes]) => {
        setData(dashRes.data ?? null);
        setRevenue(revenueRes.data ?? []);
        setQuantity(quantityRes.data ?? []);
        setOrderStatus(statusRes.data ?? []);
      })
      .catch((error: unknown) => {
        console.error('Dashboard API failed:', error);
      })
      .finally(() => setIsLoading(false));
  }, [year]);

  const maxRevenue = Math.max(...revenue.map((item) => item.revenue), 1);
  const maxQuantity = Math.max(...quantity.map((item) => item.quantity), 1);

  if (isLoading && !data) {
    return (
      <div className="admin-surface flex min-h-[520px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const metrics = [
    {
      label: 'Doanh thu',
      value: formatCurrency(data?.totalRevenue ?? 0),
      helper: `${year}`,
      type: 'revenue' as const,
    },
    {
      label: 'Đơn hàng',
      value: formatCompact(data?.totalOrders ?? 0),
      helper: 'Tổng đơn đã ghi nhận',
      type: 'orders' as const,
    },
    {
      label: 'Người dùng',
      value: formatCompact(data?.totalUsers ?? 0),
      helper: 'Tài khoản trong hệ thống',
      type: 'users' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="admin-kicker">Overview</div>
          <h1 className="admin-page-title mt-2">Tổng quan</h1>
          <p className="admin-page-subtitle">Một cái nhìn nhanh về hoạt động bán hàng và vận hành.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Năm</span>
          <select
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          >
            {[2024, 2025, 2026, 2027].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="admin-surface flex min-h-[140px] flex-col justify-between p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{metric.value}</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-indigo-600 ring-1 ring-inset ring-slate-200">
                <MetricIcon type={metric.type} />
              </span>
            </div>
            <p className="text-xs text-slate-400">{metric.helper}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.65fr_1fr]">
        <div className="admin-surface overflow-hidden">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Doanh thu theo tháng</h2>
              <p className="mt-0.5 text-xs text-slate-500">Hiệu suất theo từng tháng của {year}.</p>
            </div>
            <span className="rounded-md bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-500">VNĐ</span>
          </div>
          <div className="px-5 pb-5 pt-7">
            {revenue.length > 0 ? (
              <div className="flex h-64 items-end gap-2 sm:gap-3">
                {revenue.map((item) => {
                  const height = Math.max((item.revenue / maxRevenue) * 100, 2);
                  return (
                    <div key={item.month} className="group relative flex h-full flex-1 flex-col justify-end">
                      <div className="mb-2 text-center text-[10px] font-semibold text-slate-400 opacity-0 transition group-hover:opacity-100">{formatCurrency(item.revenue)}</div>
                      <div className="relative flex h-full items-end">
                        <div className="w-full rounded-md bg-slate-100" style={{ height: `${height}%` }} />
                        <div className="absolute bottom-0 left-0 w-full rounded-md bg-indigo-600 opacity-90 transition-all duration-200 group-hover:bg-indigo-700" style={{ height: `${height}%` }} />
                      </div>
                      <span className="mt-2 text-center text-[10px] font-medium text-slate-400">T{item.month}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-slate-400">Chưa có dữ liệu doanh thu.</div>
            )}
          </div>
        </div>

        <div className="admin-surface overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Trạng thái đơn hàng</h2>
            <p className="mt-0.5 text-xs text-slate-500">Phân bổ trạng thái hiện tại.</p>
          </div>
          <div className="space-y-4 p-5">
            {orderStatus.length > 0 ? orderStatus.map((status) => (
              <div key={status.status}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-slate-600">{status.status}</span>
                  <span className="text-xs font-semibold text-slate-900">{status.percentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${Math.min(status.percentage, 100)}%` }} />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">{status.count} đơn</p>
              </div>
            )) : <p className="py-10 text-center text-sm text-slate-400">Chưa có dữ liệu.</p>}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.65fr_1fr]">
        <div className="admin-surface overflow-hidden">
          <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Sản phẩm bán chạy</h2>
              <p className="mt-0.5 text-xs text-slate-500">Những sản phẩm tạo doanh thu nhiều nhất.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Sản phẩm</th>
                  <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Đã bán</th>
                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Doanh thu</th>
                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Tỷ trọng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.topProducts?.map((product, index) => {
                  const percentage = (data.totalRevenue ?? 0) > 0 ? (product.totalRevenue / data.totalRevenue) * 100 : 0;
                  return (
                    <tr key={product.productId} className="hover:bg-slate-50/60">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[11px] font-bold text-slate-500">{String(index + 1).padStart(2, '0')}</span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">{product.productName}</p>
                            <p className="mt-0.5 text-[11px] text-slate-400">#{product.productId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center text-xs font-semibold text-slate-700">{product.totalSales}</td>
                      <td className="px-5 py-4 text-right text-xs font-semibold text-slate-900">{formatCurrency(product.totalRevenue)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-[11px] font-semibold text-slate-500">{percentage.toFixed(1)}%</span>
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600" style={{ width: `${Math.min(percentage, 100)}%` }} /></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-surface overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Số lượng bán ra</h2>
            <p className="mt-0.5 text-xs text-slate-500">Sản lượng theo tháng.</p>
          </div>
          <div className="px-5 pb-5 pt-7">
            {quantity.length > 0 ? (
              <div className="space-y-3">
                {quantity.map((item) => (
                  <div key={item.month} className="flex items-center gap-3">
                    <span className="w-6 text-[10px] font-semibold text-slate-400">T{item.month}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-slate-800" style={{ width: `${Math.max((item.quantity / maxQuantity) * 100, 1)}%` }} />
                    </div>
                    <span className="w-12 text-right text-[11px] font-semibold text-slate-600">{item.quantity.toLocaleString('vi-VN')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[240px] items-center justify-center text-sm text-slate-400">Chưa có dữ liệu sản lượng.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
