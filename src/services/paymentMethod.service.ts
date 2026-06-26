import axiosClient from '@/api/axiosClient';
import * as EP from '@/constants/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type { PaymentMethodResponse } from '@/types/paymentMethod.types';

export async function getPaymentMethods(): Promise<ApiResponse<PaymentMethodResponse[]>> {
  const res = await axiosClient.get<ApiResponse<PaymentMethodResponse[]>>(EP.PAYMENT_METHODS);
  return res.data;
}
