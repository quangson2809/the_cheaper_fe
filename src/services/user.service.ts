import axiosClient from '@/api/axiosClient';
import * as EP from '@/constants/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type { UserAccountResponse, UserUpdateProfileRequest } from '@/types/user.types';
import type { ChangePasswordRequest } from '@/types/auth.types';

export async function getMyAccount(): Promise<ApiResponse<UserAccountResponse>> {
  const res = await axiosClient.get<ApiResponse<UserAccountResponse>>(EP.USER_ACCOUNT);
  console.log(res.data)
  console.log('------------')
  return res.data;
}

export async function updateProfile(data: UserUpdateProfileRequest): Promise<ApiResponse<UserAccountResponse>> {
  const res = await axiosClient.put<ApiResponse<UserAccountResponse>>(EP.USER_ACCOUNT, data);
  console.log(res.data)
  console.log('------------')
  return res.data;
}

export async function changePassword(data: ChangePasswordRequest): Promise<ApiResponse<null>> {
  const res = await axiosClient.put<ApiResponse<null>>(EP.USER_ACCOUNT_PASSWORD, data);
  return res.data;
}
