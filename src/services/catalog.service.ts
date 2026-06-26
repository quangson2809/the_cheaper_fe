import axiosClient from '@/api/axiosClient';
import * as EP from '@/constants/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type {
  brandResponse,
  categoryResponse
} from '@/types/catalog.types';

// ── Brands ────────────────────────────────────────────
export async function getBrands(): Promise<ApiResponse<brandResponse[]>> {
  console.log('CATEGORIES =', EP.BRANDS);

  const res = await axiosClient.get<ApiResponse<brandResponse[]>>(EP.BRANDS);
  return res.data;
}


// ── Categories ────────────────────────────────────────
export async function getCategories(): Promise<ApiResponse<categoryResponse[]>> {
  console.log('CATEGORIES =', EP.CATEGORIES);

  const res = await axiosClient.get<ApiResponse<categoryResponse[]>>(EP.CATEGORIES);
  return res.data;
}

