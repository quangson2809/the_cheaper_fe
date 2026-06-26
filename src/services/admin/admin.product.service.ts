import axiosClient from '@/api/axiosClient';
import * as EP from '@/constants/apiEndpoints';
import type { ApiResponse, Page } from '@/types/api.types';
import type {
  AdminProductOverviewResponse,
  AdminProductResponse,
  AdminProductCreateRequest,
  AdminProductUpdateRequest,
  AdminProductFilterRequest,
} from '@/types/admin.types';

export async function getAdminProducts(params?: AdminProductFilterRequest): Promise<ApiResponse<Page<AdminProductOverviewResponse>>> {
  const res = await axiosClient.get<ApiResponse<Page<AdminProductOverviewResponse>>>(EP.ADMIN_PRODUCTS, { params });
  return res.data;
}

export async function getAdminProductById(id: number): Promise<ApiResponse<AdminProductResponse>> {
  const res = await axiosClient.get<ApiResponse<AdminProductResponse>>(EP.ADMIN_PRODUCT_BY_ID(id));
  return res.data;
}

export async function createAdminProduct(
  data: AdminProductCreateRequest,
  files?: File[],
): Promise<ApiResponse<AdminProductResponse>> {
  const formData = new FormData();
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  files?.forEach((file) => formData.append('files', file));
  const res = await axiosClient.post<ApiResponse<AdminProductResponse>>(EP.ADMIN_PRODUCTS, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function updateAdminProduct(
  id: number,
  data: AdminProductUpdateRequest,
  files?: File[],
): Promise<ApiResponse<AdminProductResponse>> {
  const formData = new FormData();
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  files?.forEach((file) => formData.append('files', file));
  const res = await axiosClient.put<ApiResponse<AdminProductResponse>>(EP.ADMIN_PRODUCT_BY_ID(id), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function deleteAdminProduct(id: number): Promise<ApiResponse<null>> {
  const res = await axiosClient.delete<ApiResponse<null>>(EP.ADMIN_PRODUCT_BY_ID(id));
  return res.data;
}
