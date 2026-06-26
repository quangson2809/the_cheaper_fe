import type { Page } from '@/types/api.types';
import type {
  UserCreateOrderRequest,
  UserOrderItemResponse,
  UserOrderResponse,
  UserOrderOverviewResponse,
} from '@/types/order.types';

const IMG_JACKET =
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop';
const IMG_HEADPHONE =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop';
const IMG_SHOES =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop';

const PAYMENT_CODE_BY_ID: Record<number, string> = {
  1: 'COD',
  2: 'VNPAY',
  3: 'MOMO',
};

const INITIAL_MOCK_ORDERS: UserOrderResponse[] = [
  {
    id: 1001,
    status: 'DELIVERED',
    finalAmount: 3_200_000,
    createdAt: '2025-05-28T10:30:00.000Z',
    receiver: 'Nguyễn Văn An',
    location: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    paymentMethodCode: 'COD',
    items: [
      {
        productName: 'Áo Khoác Nam Thể Thao Mùa Đông',
        productId: 101,
        optionValue: 'Màu đen · Size L',
        quantity: 1,
        price: 850_000,
        thumbnailUrl: IMG_JACKET,
        unitPrice: 850_000,
      },
      {
        productName: 'Tai Nghe Bluetooth Chống Ồn',
        productId: 102,
        optionValue: null,
        quantity: 1,
        price: 1_500_000,
        thumbnailUrl: IMG_HEADPHONE,
        unitPrice: 1_500_000,
      },
      {
        productName: 'Giày Thể Thao Nam Running Pro',
        productId: 103,
        optionValue: 'Size 42',
        quantity: 1,
        price: 850_000,
        thumbnailUrl: IMG_SHOES,
        unitPrice: 850_000,
      },
    ],
  },
  {
    id: 1002,
    status: 'SHIPPING',
    finalAmount: 1_500_000,
    createdAt: '2025-06-01T14:15:00.000Z',
    receiver: 'Trần Thị Bình',
    location: '45 Lê Lợi, Quận Hai Bà Trưng, Hà Nội',
    paymentMethodCode: 'VNPAY',
    items: [
      {
        productName: 'Tai Nghe Bluetooth Chống Ồn',
        productId: 102,
        optionValue: 'Màu trắng',
        quantity: 1,
        price: 1_500_000,
        thumbnailUrl: IMG_HEADPHONE,
        unitPrice: 1_500_000,
      },
    ],
  },
  {
    id: 1003,
    status: 'PENDING',
    finalAmount: 850_000,
    createdAt: '2025-06-04T09:00:00.000Z',
    receiver: 'Lê Minh Cường',
    location: '78 Trần Phú, Quận Hải Châu, Đà Nẵng',
    paymentMethodCode: 'MOMO',
    items: [
      {
        productName: 'Áo Khoác Nam Thể Thao Mùa Đông',
        productId: 101,
        optionValue: 'Màu xám · Size M',
        quantity: 1,
        price: 850_000,
        thumbnailUrl: IMG_JACKET,
        unitPrice: 850_000,
      },
    ],
  },
  {
    id: 1004,
    status: 'PROCESSING',
    finalAmount: 1_700_000,
    createdAt: '2025-06-03T16:45:00.000Z',
    receiver: 'Phạm Thu Dung',
    location: '12 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh',
    paymentMethodCode: 'COD',
    items: [
      {
        productName: 'Giày Thể Thao Nam Running Pro',
        productId: 103,
        optionValue: 'Size 41',
        quantity: 2,
        price: 1_700_000,
        thumbnailUrl: IMG_SHOES,
        unitPrice: 850_000,
      },
    ],
  },
  {
    id: 1005,
    status: 'CANCELED',
    finalAmount: 850_000,
    createdAt: '2025-05-20T11:20:00.000Z',
    receiver: 'Hoàng Văn Em',
    location: '56 Nguyễn Trãi, Quận Thanh Xuân, Hà Nội',
    paymentMethodCode: 'COD',
    items: [
      {
        productName: 'Áo Khoác Nam Thể Thao Mùa Đông',
        productId: 101,
        optionValue: 'Màu đen · Size XL',
        quantity: 1,
        price: 850_000,
        thumbnailUrl: IMG_JACKET,
        unitPrice: 850_000,
      },
    ],
  },
];

let mockOrders: UserOrderResponse[] = [...INITIAL_MOCK_ORDERS];
let nextMockOrderId = 2001;

export function getMockOrdersPage(page: number, limit: number): Page<UserOrderOverviewResponse> {
  const sorted = [...mockOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const totalElements = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * limit;

  const content: UserOrderOverviewResponse[] = sorted.slice(start, start + limit).map(order => ({
    id: order.id,
    status: order.status,
    finalAmount: order.finalAmount,
    createdAt: order.createdAt,
    paymentMethodCode: order.paymentMethodCode,
  }));

  return {
    content,
    totalElements,
    totalPages,
    number: safePage - 1,
    size: limit,
    first: safePage === 1,
    last: safePage >= totalPages,
  };
}

export function getMockOrderById(id: number): UserOrderResponse | null {
  return mockOrders.find((o) => o.id === id) ?? null;
}

export function cancelMockOrder(id: number): UserOrderResponse | null {
  const index = mockOrders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  mockOrders[index] = { ...mockOrders[index], status: 'CANCELED' };
  return mockOrders[index];
}

export function createMockOrder(
  request: UserCreateOrderRequest,
  items?: UserOrderItemResponse[],
): UserOrderResponse {
  const orderItems: UserOrderItemResponse[] = items ?? [
    {
      productName: 'Áo Khoác Nam Thể Thao Mùa Đông',
      productId: 101,
      optionValue: 'Màu đen · Size L',
      quantity: 1,
      price: 850_000,
      thumbnailUrl: IMG_JACKET,
      unitPrice: 850_000,
    },
    {
      productName: 'Tai Nghe Bluetooth Chống Ồn',
      productId: 102,
      optionValue: null,
      quantity: 1,
      price: 1_500_000,
      thumbnailUrl: IMG_HEADPHONE,
      unitPrice: 1_500_000,
    },
  ];

  const order: UserOrderResponse = {
    id: nextMockOrderId++,
    status: 'PENDING',
    finalAmount: orderItems.reduce((sum, item) => sum + item.price, 0),
    createdAt: new Date().toISOString(),
    receiver: request.receiver ?? null,
    location: request.location ?? null,
    paymentMethodCode: PAYMENT_CODE_BY_ID[request.paymentMethodId] ?? 'COD',
    items: orderItems,
  };

  mockOrders = [order, ...mockOrders];
  return order;
}
