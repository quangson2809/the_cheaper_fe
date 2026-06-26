import axiosClient from '@/api/axiosClient';
import * as EP from '@/constants/apiEndpoints';
import type { ApiResponse } from '@/types/api.types';
import type {
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ChangePasswordRequest,
} from '@/types/auth.types';

export async function register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
  const res = await axiosClient.post<ApiResponse<AuthResponse>>(EP.AUTH_REGISTER, data);
  return res.data;
}

export async function login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
  const res = await axiosClient.post<ApiResponse<AuthResponse>>(EP.AUTH_LOGIN, data);
  return res.data;
}

export async function logout(): Promise<ApiResponse<null>> {
  const res = await axiosClient.post<ApiResponse<null>>(EP.AUTH_LOGOUT);
  return res.data;
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<string>> {
  const res = await axiosClient.post<ApiResponse<string>>(EP.AUTH_FORGOT_PASSWORD, data);
  return res.data;
}

export async function verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse<AuthResponse>> {
  const res = await axiosClient.post<ApiResponse<AuthResponse>>(EP.AUTH_VERIFY_OTP, data);
  return res.data;
}

export async function resetPassword(data: ChangePasswordRequest): Promise<ApiResponse<null>> {
  const res = await axiosClient.post<ApiResponse<null>>(EP.AUTH_RESET_PASSWORD, data);
  return res.data;
}
