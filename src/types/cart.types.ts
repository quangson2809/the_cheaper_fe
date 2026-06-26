// ── Cart Item ─────────────────────────────────────────
export interface UserCartItemResponse {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  productName: string;
  thumbnail: string | null;
  optionNames: string[] | null;
}

// ── Cart ──────────────────────────────────────────────
export interface UserCartResponse {
  items: UserCartItemResponse[];
  totalPrice: number;
}

/** Returned after adding an item — just the badge count */
export interface UserCartOverviewResponse {
  countItems: number;
}

// ── Requests ──────────────────────────────────────────
export interface UserAddCartItemRequest {
  variantId: number;
  quantity: number;
}

export interface UserUpdateCartItemRequest {
  quantity: number;
}

export interface UserMergeCartRequest {
  items: {
    variantId: number;
    quantity: number;
  }[];
}
