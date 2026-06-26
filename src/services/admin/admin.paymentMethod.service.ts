import axiosClient from '@/api/axiosClient';
import * as EP from '@/constants/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type { PaymentMethodResponse } from '@/types/paymentMethod.types';

export async function getPaymentMethods(): Promise<ApiResponse<PaymentMethodResponse[]>> {
  const res = await axiosClient.get<ApiResponse<PaymentMethodResponse[]>>(EP.ADMIN_PAYMENT_METHODS);
  return res.data;
}

export async function createPaymentMethod(data: { name: string; code: string }): Promise<ApiResponse<PaymentMethodResponse>> {
  const res = await axiosClient.post<ApiResponse<PaymentMethodResponse>>(EP.ADMIN_PAYMENT_METHODS, data);
  return res.data;
}

export async function updatePaymentMethod(id: number, data: { name: string; code: string; status: number }): Promise<ApiResponse<PaymentMethodResponse>> {
  const res = await axiosClient.put<ApiResponse<PaymentMethodResponse>>(EP.ADMIN_PAYMENT_METHOD_BY_ID(id), data);
  return res.data;
}

export async function deletePaymentMethod(id: number): Promise<ApiResponse<null>> {
  const res = await axiosClient.delete<ApiResponse<null>>(EP.ADMIN_PAYMENT_METHOD_BY_ID(id));
  return res.data;
}
