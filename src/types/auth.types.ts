// ── Request DTOs ──────────────────────────────────────

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// ── Response DTOs ─────────────────────────────────────

export interface AuthResponse {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  accessToken: string;
  refreshToken: string | null;
}
