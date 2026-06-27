import type { OrderStatus } from '@/types/order.types';

// ── Account ───────────────────────────────────────────

export interface AdminAccountResponse {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
}

export interface AdminCreateAdminRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AdminUserFilterRequest {
  status?: number;
  role?: string;
  page?: number;
  limit?: number;
}

// ── Catalog ───────────────────────────────────────────

export interface AdminBrandResponse {
  id: number;
  name: string;
  status: number;
}

export interface AdminCategoryResponse {
  id: number;
  name: string;
  status: number;
}

export interface AdminMaterialResponse {
  id: number;
  name: string;
  status: number;
}

export interface AdminBrandRequest {
  name: string;
  status: number;
}
export type AdminCategoryRequest = AdminBrandRequest;
export type AdminMaterialRequest = AdminBrandRequest;

// ── Option Attributes ─────────────────────────────────

export interface AdminOptionValueResponse {
  id: number;
  attributeName: string;
  value: string;
}

export interface AdminOptionAttributeResponse {
  id: number;
  name: string;
  values: AdminOptionValueResponse[];
}

export interface AdminOptionValueRequest {
  id?: number;
  value: string;
}

export interface AdminOptionAttributeRequest {
  name: string;
  values: AdminOptionValueRequest[];
}

// ── Products ──────────────────────────────────────────

export interface AdminProductImageResponse {
  id: number;
  name: string;
  alt: string | null;
}

export interface AdminVariantResponse {
  id: number;
  sku: string;
  stock: number;
  countSold: number;
  overrideSalePrice: number | null;
  optionValues: AdminOptionValueResponse[];
}

export interface AdminProductOverviewResponse {
  id: number;
  name: string;
  brandName: string | null;
  categoryName: string | null;
  salePrice: number;
  comparePrice: number | null;
  status: number;
  thumbnailUrl: string | null;
  createdAt: string;
  totalStock: number;
  totalSold: number;
}

export interface AdminProductResponse {
  id: number;
  name: string;
  description: string | null;
  brand: AdminBrandResponse | null;
  category: AdminCategoryResponse | null;
  material: AdminMaterialResponse | null;
  salePrice: number;
  comparePrice: number | null;
  status: number;
  images: AdminProductImageResponse[];
  variants: AdminVariantResponse[];
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminVariantCreateRequest {
  stock: number;
  overrideSalePrice?: number | null;
  optionValueIds: number[];
}

export interface AdminVariantUpdateRequest {
  id: number;
  overrideSalePrice?: number | null;
  stock?: number | null;
  optionValueAdds?: number[];
  optionValueSubs?: number[];
}

export interface AdminProductCreateRequest {
  name: string;
  description?: string | null;
  materialId?: number | null;
  salePrice: number;
  comparePrice: number;
  brandId?: number | null;
  categoryId?: number | null;
  variants: AdminVariantCreateRequest[];
}

export interface AdminProductUpdateRequest {
  name: string;
  description?: string | null;
  materialId?: number | null;
  salePrice: number;
  comparePrice: number;
  brandId?: number | null;
  categoryId?: number | null;
  variantCreates?: AdminVariantCreateRequest[];
  variantUpdates?: AdminVariantUpdateRequest[];
  variantDeletes?: number[];
  imageDeletes?: number[];
}

export interface AdminProductFilterRequest {
  brandId?: number;
  categoryId?: number;
  materialId?: number;
  status?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
}

// ── Orders ────────────────────────────────────────────

export interface AdminOrderItemResponse {
  productId: number;
  quantity: number;
  price: number;
  productName: string;
  thumbnail: string | null;
  optionNames: string | null;
}

export interface AdminOrderOverviewResponse {
  id: number;
  finalTotal: number;
  status: OrderStatus;
  createdAt: string;
  countItem: number;
  location: string | null;
  phone: string | null;
  paymentMethodCode: string | null;
  paymentStatus: string | null;
}

export interface AdminOrderDetailResponse {
  id: number;
  finalTotal: number;
  status: OrderStatus;
  createdAt: string;
  paymentMethodCode: string | null;
  paymentStatus: string | null;
  receiver: string | null;
  phone: string | null;
  location: string | null;
  items: AdminOrderItemResponse[];
}

export interface AdminOrderStatusUpdateRequest {
  status: OrderStatus;
}

export interface AdminOrderFilterRequest {
  status?: string;
  page?: number;
  limit?: number;
}

// ── Payment Methods ───────────────────────────────────

export interface AdminCreatePaymentMethodRequest {
  code: string;
  name: string;
}

export interface AdminUpdatePaymentMethodRequest {
  name?: string;
  status?: number;
  code?: string;
}

// ── Dashboard ─────────────────────────────────────────

export interface AdminProductSales {
  productId: number;
  productName: string;
  totalSales: number;
  totalRevenue: number;
}

export interface AdminDashboardResponse {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  topProducts: AdminProductSales[];
}

export interface MonthlyRevenueResponse {
  month: number;
  revenue: number;
}

export interface MonthlyQuantityResponse {
  month: number;
  quantity: number;
}

export interface OrderStatusRatioResponse {
  status: string;
  count: number;
  percentage: number;
}
