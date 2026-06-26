// ── Address ───────────────────────────────────────────

export interface UserAddressResponse {
  id: number;
  homeNumber: string | null;
  street: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export interface UserAddressCreateRequest {
  fullName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

// Alias — same fields
export type UserAddressUpdateRequest = UserAddressCreateRequest;

// ── Account ───────────────────────────────────────────

export interface UserAccountResponse {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'USER' | 'ADMIN';
  rewardPoint: number;
  createdAt: string;
  addresses: UserAddressResponse[];
}

export interface UserUpdateProfileRequest {
  name: string;
  phone?: string | null;
}
