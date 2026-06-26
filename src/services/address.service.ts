import axiosClient from '@/api/axiosClient';
import * as EP from '@/constants/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type { UserAddressResponse, UserAddressCreateRequest } from '@/types/user.types';

export async function getAddresses(): Promise<ApiResponse<UserAddressResponse[]>> {
  const res = await axiosClient.get<ApiResponse<UserAddressResponse[]>>(EP.ADDRESSES);
  return res.data;
}

export async function getAddressById(id: number): Promise<ApiResponse<UserAddressResponse>> {
  const res = await axiosClient.get<ApiResponse<UserAddressResponse>>(EP.ADDRESS_BY_ID(id));
  return res.data;
}

export async function createAddress(data: UserAddressCreateRequest): Promise<ApiResponse<UserAddressResponse>> {
  const res = await axiosClient.post<ApiResponse<UserAddressResponse>>(EP.ADDRESSES, data);
  return res.data;
}

export async function updateAddress(id: number, data: UserAddressCreateRequest): Promise<ApiResponse<UserAddressResponse>> {
  const res = await axiosClient.put<ApiResponse<UserAddressResponse>>(EP.ADDRESS_BY_ID(id), data);
  return res.data;
}

export async function deleteAddress(id: number): Promise<ApiResponse<null>> {
  const res = await axiosClient.delete<ApiResponse<null>>(EP.ADDRESS_BY_ID(id));
  return res.data;
}

export async function setDefaultAddress(id: number): Promise<ApiResponse<null>> {
  const res = await axiosClient.patch<ApiResponse<null>>(EP.ADDRESS_SET_DEFAULT(id));
  return res.data;
}
