import axiosClient from '@/api/axiosClient';
import * as EP from '@/constants/apiEndpoints';
import type { ApiResponse, Page } from '@/types/api.types';
import type {
  UserProductOverviewResponse,
  UserProductDetailResponse,
  UserProductFilterRequest,
} from '@/types/product.types';

export async function getProducts(params?: UserProductFilterRequest): Promise<ApiResponse<Page<UserProductOverviewResponse>>> {
  const res = await axiosClient.get<ApiResponse<Page<UserProductOverviewResponse>>>(EP.PRODUCTS, { params });
  return res.data;
}

export async function getProductById(id: number): Promise<ApiResponse<UserProductDetailResponse>> {
  const res = await axiosClient.get<ApiResponse<UserProductDetailResponse>>(EP.PRODUCT_BY_ID(id));
  return res.data;
}

export async function searchProducts(
  q: string,
  params?: { page?: number; limit?: number },
): Promise<ApiResponse<Page<UserProductOverviewResponse>>> {
  const res = await axiosClient.get<ApiResponse<Page<UserProductOverviewResponse>>>(EP.PRODUCTS_SEARCH, {
    params: { q, ...params },
  });
  return res.data;
}
