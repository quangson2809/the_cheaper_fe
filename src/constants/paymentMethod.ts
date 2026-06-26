export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  COD: 'Thanh toán khi nhận hàng (COD)',
  VNPAY: 'Thanh toán qua VNPAY',
  MOMO: 'Thanh toán qua Ví MoMo',
};

export function getPaymentMethodLabel(code: string | null | undefined): string {
  if (!code) return '—';
  return PAYMENT_METHOD_LABEL[code] ?? code;
}
