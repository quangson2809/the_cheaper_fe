import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOtp } from '@/hooks/auth/useOtp';
import { Button, Input } from '@/components/ui';

export default function ForgotPasswordPage() {
  const { step, isLoading, error, otpPreview, sendOtp, verifyOtp } = useOtp();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <span className="text-4xl">🔐</span>
            <h1 className="text-2xl font-extrabold text-slate-800 mt-2">Đặt lại mật khẩu</h1>
          </div>

          {step === 'email' && (
            <form
              onSubmit={(e) => { e.preventDefault(); void sendOtp(email); }}
              className="space-y-4"
            >
              <Input
                id="forgot-email"
                label="Email tài khoản"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" isLoading={isLoading} className="w-full">
                Gửi mã OTP
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <form
              onSubmit={(e) => { e.preventDefault(); void verifyOtp(otp, newPassword); }}
              className="space-y-4"
            >
              {otpPreview && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl px-4 py-3">
                  <strong>Dev:</strong> Mã OTP của bạn là <strong>{otpPreview}</strong>
                </div>
              )}
              <Input
                id="forgot-otp"
                label="Mã OTP (6 ký tự)"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
              <Input
                id="forgot-new-password"
                label="Mật khẩu mới"
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
              />
              <Button type="submit" isLoading={isLoading} className="w-full">
                Xác nhận
              </Button>
            </form>
          )}

          {step === 'done' && (
            <div className="text-center space-y-4">
              <Link to="/login">
                <Button className="w-full">Đăng nhập ngay</Button>
              </Link>
            </div>
          )}

          <p className="text-center text-sm text-slate-500 mt-6">
            <Link to="/login" className="text-indigo-600 hover:underline">← Quay lại đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
