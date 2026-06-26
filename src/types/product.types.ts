// ── Image ─────────────────────────────────────────────

export interface UserImageResponse {
  name: string;
  alt: string | null;
}

// ── Variant ───────────────────────────────────────────

export interface UserVariantInfoResponse {
  id: number;
  sku: string | null;
  price: number | null;   // override price; null → use product price
  stock: number;
  inStock: boolean;
  attributes: Record<string, string>;
}

// ── Product overview (list page) ──────────────────────

export interface UserProductOverviewResponse {
  id: number;
  name: string;
  brand: string | null;
  category: string | null;
  price: number;
  originalPrice: number | null;
  discountPercentage: number | null;
  thumbnailUrl: string | null;
}

// ── Product detail ────────────────────────────────────

export interface UserProductDetailResponse {
  id: number;
  name: string;
  description: string | null;
  brand: string | null;
  category: string | null;
  material: string | null;
  price: number;
  originalPrice: number | null;
  discountPercentage: number | null;
  images: UserImageResponse[];
  variants: UserVariantInfoResponse[];
  available: boolean;
}

// ── Query params ──────────────────────────────────────

export interface UserProductFilterRequest {
  brandId?: number;
  categoryId?: number;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}
