import axiosClient from '@/api/axiosClient';
import * as EP from '@/constants/apiEndpoints';
import type { ApiResponse, Page } from '@/types/api.types';
import type {
  AdminOrderOverviewResponse,
  AdminOrderDetailResponse,
  AdminOrderStatusUpdateRequest,
  AdminOrderFilterRequest,
} from '@/types/admin.types';

export async function getAdminOrders(params?: AdminOrderFilterRequest): Promise<ApiResponse<Page<AdminOrderOverviewResponse>>> {
  const res = await axiosClient.get<ApiResponse<Page<AdminOrderOverviewResponse>>>(EP.ADMIN_ORDERS, { params });
  return res.data;
}

export async function getAdminOrderById(id: number): Promise<ApiResponse<AdminOrderDetailResponse>> {
  const res = await axiosClient.get<ApiResponse<AdminOrderDetailResponse>>(EP.ADMIN_ORDER_BY_ID(id));
  return res.data;
}

export async function updateOrderStatus(id: number, data: AdminOrderStatusUpdateRequest): Promise<ApiResponse<AdminOrderDetailResponse>> {
  const res = await axiosClient.patch<ApiResponse<AdminOrderDetailResponse>>(EP.ADMIN_ORDER_STATUS(id), data);
  return res.data;
}
