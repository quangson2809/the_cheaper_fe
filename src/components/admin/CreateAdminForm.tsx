import React, { useState } from 'react';
import { Button, Input } from '@/components/ui';
import type { AdminCreateAdminRequest } from '@/types/admin.types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CreateAdminFormProps {
  onSubmit: (data: AdminCreateAdminRequest) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateAdminForm({ onSubmit, onCancel, isSubmitting, submitError }: CreateAdminFormProps) {
  const [formData, setFormData] = useState<AdminCreateAdminRequest>({
    name:     '',
    email:    '',
    phone:    '',
    password: '',
  });

  // ── Helpers ────────────────────────────────────────────────────────────────

  function updateField<K extends keyof AdminCreateAdminRequest>(
    key: K,
    value: AdminCreateAdminRequest[K],
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(formData);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <Input
        label="Họ tên"
        required
        value={formData.name}
        onChange={(e) => updateField('name', e.target.value)}
        placeholder="VD: Nguyễn Văn A"
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="email@example.com"
          disabled={isSubmitting}
        />
        <Input
          label="Số điện thoại"
          required
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="09..."
          disabled={isSubmitting}
        />
      </div>

      <Input
        label="Mật khẩu"
        type="password"
        required
        value={formData.password}
        onChange={(e) => updateField('password', e.target.value)}
        placeholder="Tối thiểu 6 ký tự"
        disabled={isSubmitting}
      />

      {submitError && <ErrorAlert message={submitError} />}

      <div className="flex gap-3 pt-4">
        <Button
          variant="ghost"
          type="button"
          onClick={onCancel}
          className="flex-1"
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <Button type="submit" className="flex-1" isLoading={isSubmitting}>
          Tạo tài khoản
        </Button>
      </div>
    </form>
  );
}

// ─── ErrorAlert ───────────────────────────────────────────────────────────────

function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
      <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-sm text-red-600 font-medium">{message}</p>
    </div>
  );
}
