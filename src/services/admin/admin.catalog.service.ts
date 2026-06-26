import axiosClient from '@/api/axiosClient';
import * as EP from '@/constants/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type {
  AdminBrandResponse,
  AdminCategoryResponse,
  AdminMaterialResponse,
  AdminBrandRequest,
  AdminMaterialRequest,
  AdminCategoryRequest,
} from '@/types/admin.types';

// ── Brands ────────────────────────────────────────────

export async function getBrands(): Promise<ApiResponse<AdminBrandResponse[]>> {
  const res = await axiosClient.get<ApiResponse<AdminBrandResponse[]>>(EP.ADMIN_BRANDS);
  return res.data;
}

export async function createBrand(data: AdminBrandRequest): Promise<ApiResponse<AdminBrandResponse>> {
  const res = await axiosClient.post<ApiResponse<AdminBrandResponse>>(EP.ADMIN_BRANDS, data);
  return res.data;
}

export async function updateBrand(id: number, data: AdminBrandRequest): Promise<ApiResponse<AdminBrandResponse>> {
  const res = await axiosClient.put<ApiResponse<AdminBrandResponse>>(EP.ADMIN_BRAND_BY_ID(id), data);
  return res.data;
}

export async function deleteBrand(id: number): Promise<ApiResponse<null>> {
  const res = await axiosClient.delete<ApiResponse<null>>(EP.ADMIN_BRAND_BY_ID(id));
  return res.data;
}

// ── Categories ────────────────────────────────────────

export async function getCategories(): Promise<ApiResponse<AdminCategoryResponse[]>> {
  const res = await axiosClient.get<ApiResponse<AdminCategoryResponse[]>>(EP.ADMIN_CATEGORIES);
  return res.data;
}

export async function createCategory(data: AdminCategoryRequest): Promise<ApiResponse<AdminCategoryResponse>> {
  const res = await axiosClient.post<ApiResponse<AdminCategoryResponse>>(EP.ADMIN_CATEGORIES, data);
  return res.data;
}

export async function updateCategory(id: number, data: AdminCategoryRequest): Promise<ApiResponse<AdminCategoryResponse>> {
  const res = await axiosClient.put<ApiResponse<AdminCategoryResponse>>(EP.ADMIN_CATEGORY_BY_ID(id), data);
  return res.data;
}

export async function deleteCategory(id: number): Promise<ApiResponse<null>> {
  const res = await axiosClient.delete<ApiResponse<null>>(EP.ADMIN_CATEGORY_BY_ID(id));
  return res.data;
}

// ── Materials ─────────────────────────────────────────

export async function getMaterials(): Promise<ApiResponse<AdminMaterialResponse[]>> {
  const res = await axiosClient.get<ApiResponse<AdminMaterialResponse[]>>(EP.ADMIN_MATERIALS);
  return res.data;
}

export async function createMaterial(data: AdminMaterialRequest): Promise<ApiResponse<AdminMaterialResponse>> {
  const res = await axiosClient.post<ApiResponse<AdminMaterialResponse>>(EP.ADMIN_MATERIALS, data);
  return res.data;
}

export async function updateMaterial(id: number, data: AdminMaterialRequest): Promise<ApiResponse<AdminMaterialResponse>> {
  const res = await axiosClient.put<ApiResponse<AdminMaterialResponse>>(EP.ADMIN_MATERIAL_BY_ID(id), data);
  return res.data;
}

export async function deleteMaterial(id: number): Promise<ApiResponse<null>> {
  const res = await axiosClient.delete<ApiResponse<null>>(EP.ADMIN_MATERIAL_BY_ID(id));
  return res.data;
}

// ── Attributes ────────────────────────────────────────

export async function getAttributes(): Promise<ApiResponse<import('@/types/admin.types').AdminOptionAttributeResponse[]>> {
  const res = await axiosClient.get<ApiResponse<import('@/types/admin.types').AdminOptionAttributeResponse[]>>(EP.ADMIN_OPTION_ATTRIBUTES);
  return res.data;
}

export async function createAttribute(data: import('@/types/admin.types').AdminOptionAttributeRequest): Promise<ApiResponse<import('@/types/admin.types').AdminOptionAttributeResponse>> {
  const res = await axiosClient.post<ApiResponse<import('@/types/admin.types').AdminOptionAttributeResponse>>(EP.ADMIN_OPTION_ATTRIBUTES, data);
  return res.data;
}

export async function updateAttribute(id: number, data: import('@/types/admin.types').AdminOptionAttributeRequest): Promise<ApiResponse<import('@/types/admin.types').AdminOptionAttributeResponse>> {
  const res = await axiosClient.put<ApiResponse<import('@/types/admin.types').AdminOptionAttributeResponse>>(EP.ADMIN_OPTION_ATTRIBUTE_BY_ID(id), data);
  return res.data;
}

export async function deleteAttribute(id: number): Promise<ApiResponse<null>> {
  const res = await axiosClient.delete<ApiResponse<null>>(EP.ADMIN_OPTION_ATTRIBUTE_BY_ID(id));
  return res.data;
}
