import axiosClient from '@/api/axiosClient';
import * as EP from '@/constants/apiEndpoints';
import type { ApiResponse, Page } from '@/types/api.types';
import type {
  UserOrderResponse,
  UserOrderOverviewResponse,
  UserCreateOrderRequest,
  UserOrderFilterParams,
} from '@/types/order.types';

export async function createOrder(
  data: UserCreateOrderRequest,
): Promise<ApiResponse<UserOrderResponse>> {
  const res = await axiosClient.post<ApiResponse<UserOrderResponse>>(EP.ORDERS, data);
  return res.data;
}

export async function getOrders(
  params?: UserOrderFilterParams,
): Promise<ApiResponse<Page<UserOrderOverviewResponse>>> {
  const res = await axiosClient.get<ApiResponse<Page<UserOrderOverviewResponse>>>(EP.ORDERS, { params });
  return res.data;
}

export async function getOrderById(id: number): Promise<ApiResponse<UserOrderResponse>> {
  const res = await axiosClient.get<ApiResponse<UserOrderResponse>>(EP.ORDER_BY_ID(id));
  return res.data;
}

export async function cancelOrder(id: number): Promise<ApiResponse<UserOrderResponse>> {
  const res = await axiosClient.post<ApiResponse<UserOrderResponse>>(EP.ORDER_CANCEL(id));
  return res.data;
}
