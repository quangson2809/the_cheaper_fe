import type { OrderStatus } from '@/types/order.types';

export type OrderStatusBadgeVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral'
  | 'info';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Chờ xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao hàng',
  DELIVERED: 'Đã giao',
  CANCELED: 'Đã hủy',
  REFUNDED: 'Đã hoàn tiền',
};

export const ORDER_STATUS_BADGE: Record<OrderStatus, OrderStatusBadgeVariant> = {
  PENDING: 'warning',
  PROCESSING: 'info',
  SHIPPING: 'primary',
  DELIVERED: 'success',
  CANCELED: 'error',
  REFUNDED: 'neutral',
};

/** Statuses the user is allowed to cancel from */
export const CANCELABLE_STATUSES: OrderStatus[] = ['PENDING', 'PROCESSING'];
