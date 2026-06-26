import { useState, useEffect } from 'react';
import * as dashboardService from '@/services/admin/admin.dashboard.service';
import type {
  AdminDashboardResponse,
  MonthlyRevenueResponse,
  MonthlyQuantityResponse,
  OrderStatusRatioResponse
} from '@/types/admin.types';
import { Spinner } from '@/components/ui';
import { formatCurrency } from '@/utils/formatCurrency';

export default function DashboardPage() {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [revenue, setRevenue] = useState<MonthlyRevenueResponse[]>([]);
  const [quantity, setQuantity] = useState<MonthlyQuantityResponse[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatusRatioResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      dashboardService.getDashboard(),
      dashboardService.getMonthlyRevenue(),
      dashboardService.getMonthlyOrders(),
      dashboardService.getOrderStatusRatio()
    ]).then(([dashRes, revRes, qtyRes, statusRes]) => {
      // Dashboard Stats
      if (dashRes.status === 'fulfilled' && dashRes.value.data) {
        setData(dashRes.value.data);
      }

      // Monthly Revenue
      if (revRes.status === 'fulfilled' && revRes.value.data) {
        setRevenue(revRes.value.data);
      }

      // Monthly Quantity
      if (qtyRes.status === 'fulfilled' && qtyRes.value.data) {
        setQuantity(qtyRes.value.data);
      }

      // Order Status
      if (statusRes.status === 'fulfilled' && statusRes.value.data) {
        setOrderStatus(statusRes.value.data);
      }
    }).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;
  if (!data) return (
    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
      <p className="text-slate-400">Không có dữ liệu tổng quan.</p>
    </div>
  );

  const maxRevenue = revenue.length > 0 ? Math.max(...revenue.map(r => r.revenue), 1) : 1;
  const maxQuantity = quantity.length > 0 ? Math.max(...quantity.map(q => q.quantity), 1) : 1;

  const statusColors: Record<string, string> = {
    'PENDING': 'bg-amber-400',
    'PROCESSING': 'bg-blue-400',
    'SHIPPED': 'bg-indigo-400',
    'DELIVERED': 'bg-emerald-400',
    'CANCELLED': 'bg-red-400'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Tổng quan hệ thống</h1>
          <p className="text-slate-500 mt-1">Theo dõi hoạt động kinh doanh và hiệu suất bán hàng.</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-indigo-50 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          <div>
            <p className="text-slate-500 font-medium mb-2 text-sm uppercase tracking-wider">Tổng doanh thu</p>
            <p className="text-4xl font-black text-indigo-600">{formatCurrency(data.totalRevenue)}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-50 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          <div>
            <p className="text-slate-500 font-medium mb-2 text-sm uppercase tracking-wider">Tổng đơn hàng</p>
            <p className="text-4xl font-black text-slate-800">{data.totalOrders.toLocaleString()}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-teal-50 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          <div>
            <p className="text-slate-500 font-medium mb-2 text-sm uppercase tracking-wider">Tổng người dùng</p>
            <p className="text-4xl font-black text-slate-800">{data.totalUsers.toLocaleString()}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-500">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doanh thu theo tháng */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Doanh thu theo tháng</h2>
          {revenue.length > 0 ? (
            <div className="h-64 flex items-end justify-between gap-2">
              {revenue.map(item => (
                <div key={item.month} className="relative flex flex-col items-center flex-1 group">
                  <div
                    className="w-full bg-indigo-200 rounded-t-md group-hover:bg-indigo-400 transition-colors cursor-pointer"
                    style={{ height: `${(item.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                    title={formatCurrency(item.revenue)}
                  ></div>
                  <span className="text-xs text-slate-400 mt-2 font-medium">T{item.month}</span>
                  <div className="absolute -top-10 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {formatCurrency(item.revenue)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm italic">
              Chưa có dữ liệu doanh thu tháng.
            </div>
          )}
        </div>

        {/* Số lượng bán ra theo tháng */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Số lượng bán ra theo tháng</h2>
          {quantity.length > 0 ? (
            <div className="h-64 flex items-end justify-between gap-2">
              {quantity.map(item => (
                <div key={item.month} className="relative flex flex-col items-center flex-1 group">
                  <div
                    className="w-full bg-teal-200 rounded-t-md group-hover:bg-teal-400 transition-colors cursor-pointer"
                    style={{ height: `${(item.quantity / maxQuantity) * 100}%`, minHeight: '4px' }}
                    title={`${item.quantity} sản phẩm`}
                  ></div>
                  <span className="text-xs text-slate-400 mt-2 font-medium">T{item.month}</span>
                  <div className="absolute -top-10 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {item.quantity.toLocaleString()} sp
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm italic">
              Chưa có dữ liệu đơn hàng tháng.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tỉ lệ trạng thái đơn hàng */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 col-span-1">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Trạng thái đơn hàng</h2>
          {orderStatus.length > 0 ? (
            <div className="space-y-4">
              {orderStatus.map((status) => (
                <div key={status.status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-600">{status.status}</span>
                    <span className="font-bold text-slate-800">{status.percentage.toFixed(1)}% ({status.count})</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${statusColors[status.status] || 'bg-slate-400'}`}
                      style={{ width: `${status.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-slate-400 text-sm">Chưa có dữ liệu trạng thái.</p>
            </div>
          )}
        </div>

        {/* Top Products Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden col-span-1 lg:col-span-2">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">Sản phẩm bán chạy nhất</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-slate-400 uppercase text-xs font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Sản phẩm</th>
                  <th className="px-6 py-4 text-center">Đã bán</th>
                  <th className="px-6 py-4 text-right">Doanh thu</th>
                  <th className="px-6 py-4 text-right">Tỉ trọng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.topProducts && data.topProducts.map((p, index) => {
                  const percentage = data.totalRevenue > 0 ? (p.totalRevenue / data.totalRevenue) * 100 : 0;
                  return (
                    <tr key={p.productId} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold shrink-0">
                            #{index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 line-clamp-1">{p.productName}</p>
                            <p className="text-xs text-slate-400">ID: {p.productId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium text-xs">
                          {p.totalSales}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-indigo-600">
                        {formatCurrency(p.totalRevenue)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs font-medium text-slate-500 w-8 text-right">{percentage.toFixed(1)}%</span>
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {(!data.topProducts || data.topProducts.length === 0) && (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-slate-500">
                      Chưa có dữ liệu sản phẩm bán chạy.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
