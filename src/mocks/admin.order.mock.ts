import type { Page } from '@/types/api.types';
import type {
  AdminOrderOverviewResponse,
  AdminOrderDetailResponse,
} from '@/types/admin.types';
import type { OrderStatus } from '@/types/order.types';

// ── Overview mock data ─────────────────────────────────
const MOCK_ORDER_OVERVIEWS: AdminOrderOverviewResponse[] = [
  {
    id: 1001,
    finalTotal: 750000,
    status: 'PENDING',
    createdAt: '2024-06-01T08:30:00Z',
    countItem: 3,
    location: '12 Nguyễn Văn Bảo, Gò Vấp, TP.HCM',
    phone: '0901234567',
    paymentMethodCode: 'COD',
    paymentStatus: 'UNPAID',
  },
  {
    id: 1002,
    finalTotal: 1200000,
    status: 'PROCESSING',
    createdAt: '2024-06-02T10:15:00Z',
    countItem: 2,
    location: '45 Lê Lợi, Q1, TP.HCM',
    phone: '0912345678',
    paymentMethodCode: 'MOMO',
    paymentStatus: 'PAID',
  },
  {
    id: 1003,
    finalTotal: 350000,
    status: 'SHIPPING',
    createdAt: '2024-06-03T14:00:00Z',
    countItem: 1,
    location: '88 Trần Hưng Đạo, Q5, TP.HCM',
    phone: '0923456789',
    paymentMethodCode: 'COD',
    paymentStatus: 'UNPAID',
  },
  {
    id: 1004,
    finalTotal: 2100000,
    status: 'DELIVERED',
    createdAt: '2024-06-04T09:00:00Z',
    countItem: 5,
    location: '20 Đinh Tiên Hoàng, Bình Thạnh, TP.HCM',
    phone: '0934567890',
    paymentMethodCode: 'VNPAY',
    paymentStatus: 'PAID',
  },
  {
    id: 1005,
    finalTotal: 480000,
    status: 'CANCELED',
    createdAt: '2024-06-05T16:45:00Z',
    countItem: 2,
    location: '5 Pasteur, Q3, TP.HCM',
    phone: '0945678901',
    paymentMethodCode: 'COD',
    paymentStatus: 'UNPAID',
  },
];

// ── Detail mock data ───────────────────────────────────
const MOCK_ORDER_DETAILS: AdminOrderDetailResponse[] = [
  {
    id: 1001,
    finalTotal: 750000,
    status: 'PENDING',
    createdAt: '2024-06-01T08:30:00Z',
    paymentMethodCode: 'COD',
    paymentStatus: 'UNPAID',
    receiver: 'Nguyễn Văn A',
    phone: '0901234567',
    location: '12 Nguyễn Văn Bảo, Gò Vấp, TP.HCM',
    items: [
      { productId: 1, productName: 'Áo Sơ Mi Nam Cổ Trụ', quantity: 2, price: 250000, thumbnail: null, optionNames: 'Trắng - M' },
      { productId: 2, productName: 'Quần Jeans Ống Suông', quantity: 1, price: 250000, thumbnail: null, optionNames: 'Size 32' },
    ],
  },
  {
    id: 1002,
    finalTotal: 1200000,
    status: 'PROCESSING',
    createdAt: '2024-06-02T10:15:00Z',
    paymentMethodCode: 'MOMO',
    paymentStatus: 'PAID',
    receiver: 'Trần Thị B',
    phone: '0912345678',
    location: '45 Lê Lợi, Q1, TP.HCM',
    items: [
      { productId: 3, productName: 'Giày Thể Thao Nike Air Max', quantity: 1, price: 1200000, thumbnail: null, optionNames: 'Size 42' },
    ],
  },
];

// ── Exported helpers ───────────────────────────────────
export function getMockAdminOrdersPage(
  page: number,
  limit: number,
  status?: string,
): Page<AdminOrderOverviewResponse> {
  const filtered = status
    ? MOCK_ORDER_OVERVIEWS.filter((o) => o.status === status)
    : [...MOCK_ORDER_OVERVIEWS];

  const sorted = filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const totalElements = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / limit));
  const safePage = Math.min(Math.max(page, 0), totalPages - 1);
  const start = safePage * limit;

  return {
    content: sorted.slice(start, start + limit),
    totalElements,
    totalPages,
    number: safePage,
    size: limit,
    first: safePage === 0,
    last: safePage >= totalPages - 1,
  };
}

export function getMockAdminOrderById(id: number): AdminOrderDetailResponse {
  const existing = MOCK_ORDER_DETAILS.find((o) => o.id === id);
  if (existing) return existing;

  // Generate dynamic mock for any ID to ensure "Đúng và Đủ" even for random IDs
  return {
    id,
    finalTotal: 980000,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    paymentMethodCode: 'BANK_TRANSFER',
    paymentStatus: 'UNPAID',
    receiver: 'Khách Hàng Thử Nghiệm',
    phone: '0988777666',
    location: 'Khu Công Nghệ Cao, Quận 9, TP. Thủ Đức',
    items: [
      { productId: 101, productName: 'Laptop Gaming Nitro 5', quantity: 1, price: 980000, thumbnail: null, optionNames: 'Core i5 - 16GB RAM' },
    ],
  };
}

export function applyMockStatusUpdate(
  order: AdminOrderDetailResponse,
  newStatus: OrderStatus,
): AdminOrderDetailResponse {
  return { ...order, status: newStatus };
}
