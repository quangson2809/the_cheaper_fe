import { useState } from 'react';
import * as authService from '@/services/auth.service';

type OtpStep = 'email' | 'otp' | 'done';

export function useOtp() {
  const [step, setStep] = useState<OtpStep>('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpPreview, setOtpPreview] = useState<string | null>(null); // dev preview only

  async function sendOtp(emailValue: string) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.forgotPassword({ email: emailValue });
      setEmail(emailValue);
      setOtpPreview(res.data ?? null); // backend returns OTP in body for dev
      setStep('otp');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Không tìm thấy email.');
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyOtp(otp: string, newPassword: string) {
    setIsLoading(true);
    setError(null);
    try {
      await authService.verifyOtp({ email, otp, newPassword });
      setStep('done');
      return true;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'OTP không hợp lệ hoặc đã hết hạn.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { step, email, isLoading, error, otpPreview, sendOtp, verifyOtp };
}
