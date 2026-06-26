export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELED'
  | 'REFUNDED';

// ── Order Item ────────────────────────────────────────

export interface UserOrderItemResponse {
  productName: string;
  productId: number;
  optionValue: string | null;
  quantity: number;
  price: number;
  thumbnailUrl: string | null;
  unitPrice: number;
}

// ── Order ─────────────────────────────────────────────

//dùng cho detail order trong trang user
export interface UserOrderResponse {
  id: number;
  status: OrderStatus;
  finalAmount: number;
  createdAt: string;
  receiver: string | null;
  location: string | null;
  paymentMethodCode: string | null;
  items: UserOrderItemResponse[];
}

//dùng cho list order trong trang user
export interface UserOrderOverviewResponse {
  id: number;
  status: OrderStatus;
  finalAmount: number;
  createdAt: string;
  paymentMethodCode: string | null;
}

// ── Requests ──────────────────────────────────────────

export interface UserCreateOrderRequest {
  paymentMethodId: number;
  receiver?: string | null;
  location?: string | null;
  phone?: string | null;
}

// ── Query params ──────────────────────────────────────

export interface UserOrderFilterParams {
  page?: number;
  limit?: number;
}
