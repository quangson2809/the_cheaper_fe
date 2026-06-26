import axiosClient from '@/api/axiosClient';
import * as EP from '@/constants/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type {
  AdminDashboardResponse,
  MonthlyRevenueResponse,
  MonthlyQuantityResponse,
  OrderStatusRatioResponse,
} from '@/types/admin.types';

export async function getDashboard(): Promise<ApiResponse<AdminDashboardResponse>> {
  const res = await axiosClient.get<ApiResponse<AdminDashboardResponse>>(EP.ADMIN_DASHBOARD);
  return res.data;
}

export async function getMonthlyRevenue(year?: number): Promise<ApiResponse<MonthlyRevenueResponse[]>> {
  const res = await axiosClient.get<ApiResponse<MonthlyRevenueResponse[]>>(EP.ADMIN_DASHBOARD_MONTHLY_REVENUE, {
    params: year ? { year } : undefined,
  });
  return res.data;
}

export async function getMonthlyOrders(year?: number): Promise<ApiResponse<MonthlyQuantityResponse[]>> {
  const res = await axiosClient.get<ApiResponse<MonthlyQuantityResponse[]>>(EP.ADMIN_DASHBOARD_MONTHLY_ORDERS, {
    params: year ? { year } : undefined,
  });
  return res.data;
}

export async function getOrderStatusRatio(): Promise<ApiResponse<OrderStatusRatioResponse[]>> {
  const res = await axiosClient.get<ApiResponse<OrderStatusRatioResponse[]>>(EP.ADMIN_DASHBOARD_ORDER_RATIO);
  return res.data;
}
