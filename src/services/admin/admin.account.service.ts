import axiosClient from '@/api/axiosClient';
import * as EP from '@/constants/apiEndpoints';
import type { ApiResponse, Page } from '@/types/api.types';
import type {
  AdminAccountResponse,
  AdminCreateAdminRequest,
  AdminUserFilterRequest,
} from '@/types/admin.types';

export async function getAccounts(params?: AdminUserFilterRequest): Promise<ApiResponse<Page<AdminAccountResponse>>> {
  const res = await axiosClient.get<ApiResponse<Page<AdminAccountResponse>>>(EP.ADMIN_ACCOUNTS, { params });
  return res.data;
}

export async function getAccountById(id: number): Promise<ApiResponse<AdminAccountResponse>> {
  const res = await axiosClient.get<ApiResponse<AdminAccountResponse>>(EP.ADMIN_ACCOUNT_BY_ID(id));
  return res.data;
}

export async function createAdmin(data: AdminCreateAdminRequest): Promise<ApiResponse<AdminAccountResponse>> {
  const res = await axiosClient.post<ApiResponse<AdminAccountResponse>>(EP.ADMIN_ACCOUNTS, data);
  return res.data;
}

export async function updateAccountStatus(id: number, status: number): Promise<ApiResponse<AdminAccountResponse>> {
  const res = await axiosClient.put<ApiResponse<AdminAccountResponse>>(
    EP.ADMIN_ACCOUNT_STATUS(id),
    null,
    { params: { status } }
  );
  return res.data;
}
