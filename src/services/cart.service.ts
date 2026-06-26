import axiosClient from '@/api/axiosClient';
import * as EP from '@/constants/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type {
  UserCartResponse,
  UserCartOverviewResponse,
  UserAddCartItemRequest,
  UserUpdateCartItemRequest,
  UserMergeCartRequest,
} from '@/types/cart.types';

export async function getCart(): Promise<ApiResponse<UserCartResponse>> {
  const res = await axiosClient.get<ApiResponse<UserCartResponse>>(EP.CART_ME);
  return res.data;
}

export async function addCartItem(data: UserAddCartItemRequest): Promise<ApiResponse<UserCartOverviewResponse>> {
  const res = await axiosClient.post<ApiResponse<UserCartOverviewResponse>>(EP.CART_ITEMS, data);
  return res.data;
}

export async function mergeCart(data: UserMergeCartRequest): Promise<ApiResponse<UserCartResponse>> {
  const res = await axiosClient.post<ApiResponse<UserCartResponse>>(EP.CART_MERGE, data);
  return res.data;
}

export async function updateCartItem(id: number, data: UserUpdateCartItemRequest): Promise<ApiResponse<UserCartResponse>> {
  const res = await axiosClient.patch<ApiResponse<UserCartResponse>>(EP.CART_ITEM_BY_ID(id), data);
  return res.data;
}

export async function removeCartItem(id: number): Promise<ApiResponse<UserCartResponse>> {
  const res = await axiosClient.delete<ApiResponse<UserCartResponse>>(EP.CART_ITEM_BY_ID(id));
  return res.data;
}
