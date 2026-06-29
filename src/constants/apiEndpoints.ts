// ── Auth ──────────────────────────────────────────────
export const AUTH_REGISTER = '/api/auth/register';
export const AUTH_LOGIN = '/api/auth/login';
export const AUTH_LOGOUT = '/api/auth/logout';
export const AUTH_FORGOT_PASSWORD = '/api/auth/forgot-password';
export const AUTH_VERIFY_OTP = '/api/auth/verify-otp';
export const AUTH_RESET_PASSWORD = '/api/auth/reset-password';
export const AUTH_REFRESH = '/api/auth/refresh';

// ── User Account ──────────────────────────────────────
export const USER_ACCOUNT = '/api/user/account';
export const USER_ACCOUNT_PASSWORD = '/api/user/account/password';

// ── Addresses ─────────────────────────────────────────
export const ADDRESSES = '/api/addresses';
export const ADDRESS_BY_ID = (id: number) => `/api/addresses/${id}`;
export const ADDRESS_SET_DEFAULT = (id: number) => `/api/addresses/${id}/default`;

// ── Cart ──────────────────────────────────────────────
export const CART_ME = '/api/carts/me';
export const CART_ITEMS = '/api/carts/items';
export const CART_ITEM_BY_ID = (id: number) => `/api/carts/items/${id}`;
export const CART_MERGE = '/api/carts/merge';

// ── Orders ────────────────────────────────────────────
export const ORDERS = '/api/orders';
export const ORDER_BY_ID = (id: number) => `/api/orders/${id}`;
export const ORDER_CANCEL = (id: number) => `/api/orders/${id}/cancel`;

// ── Products (public) ─────────────────────────────────
export const PRODUCTS = '/api/products';
export const PRODUCT_BY_ID = (id: number) => `/api/products/${id}`;
export const PRODUCTS_SEARCH = '/api/products/search';
export const PRODUCT_REVIEWS = (productId: number) => `/api/products/${productId}/reviews`;
export const BRANDS = '/api/brands';
export const CATEGORIES = '/api/categories';

// ── Attributes & Payment Methods (public) ─────────────
export const ATTRIBUTES = '/api/attributes';
export const PAYMENT_METHODS = '/api/payment-methods';

// ── Admin — Accounts ──────────────────────────────────
export const ADMIN_ACCOUNTS = '/api/admin/accounts';
export const ADMIN_ACCOUNT_BY_ID = (id: number) => `/api/admin/accounts/${id}`;
export const ADMIN_ACCOUNT_STATUS = (id: number) => `/api/admin/accounts/${id}/status`;

// ── Admin — Brands ────────────────────────────────────
export const ADMIN_BRANDS = '/api/admin/brands';
export const ADMIN_BRAND_BY_ID = (id: number) => `/api/admin/brands/${id}`;

// ── Admin — Categories ────────────────────────────────
export const ADMIN_CATEGORIES = '/api/admin/categories';
export const ADMIN_CATEGORY_BY_ID = (id: number) => `/api/admin/categories/${id}`;

// ── Admin — Materials ─────────────────────────────────
export const ADMIN_MATERIALS = '/api/admin/materials';
export const ADMIN_MATERIAL_BY_ID = (id: number) => `/api/admin/materials/${id}`;

// ── Admin — Option Attributes ─────────────────────────
export const ADMIN_OPTION_ATTRIBUTES = '/api/admin/option-attributes';
export const ADMIN_OPTION_ATTRIBUTE_BY_ID = (id: number) => `/api/admin/option-attributes/${id}`;

// ── Admin — Products ──────────────────────────────────
export const ADMIN_PRODUCTS = '/api/admin/products';
export const ADMIN_PRODUCT_BY_ID = (id: number) => `/api/admin/products/${id}`;

// ── Admin — Orders ────────────────────────────────────
export const ADMIN_ORDERS = '/api/admin/orders';
export const ADMIN_ORDER_BY_ID = (id: number) => `/api/admin/orders/${id}`;
export const ADMIN_ORDER_STATUS = (id: number) => `/api/admin/orders/${id}/status`;

// ── Admin — Payment Methods ───────────────────────────
export const ADMIN_PAYMENT_METHODS = '/api/admin/payment-methods';
export const ADMIN_PAYMENT_METHOD_BY_ID = (id: number) => `/api/admin/payment-methods/${id}`;

// ── Admin — Dashboard ─────────────────────────────────
export const ADMIN_DASHBOARD_STATS = '/api/admin/stats';
export const ADMIN_DASHBOARD_MONTHLY_REVENUE = '/api/admin/monthly-revenue';
export const ADMIN_DASHBOARD_MONTHLY_QUANTITY = '/api/admin/monthly-quantity';
export const ADMIN_DASHBOARD_ORDER_STATUS = '/api/admin/order-status';
