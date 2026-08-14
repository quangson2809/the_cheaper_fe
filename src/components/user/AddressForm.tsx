import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import type { UserAddressCreateRequest, UserAddressResponse } from '@/types/user.types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddressFormProps {
  initialData?: UserAddressResponse | null;
  onSubmit: (data: UserAddressCreateRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddressForm({ initialData, onSubmit, onCancel, isSubmitting }: AddressFormProps) {
  const [formData, setFormData] = useState<UserAddressCreateRequest>({
    homeNumber: initialData?.homeNumber ?? '',
    street:     initialData?.street     ?? '',
    district:   initialData?.district   ?? '',
    city:       initialData?.city       ?? '',
    isDefault:  initialData?.isDefault  ?? false,
  });

  // ── Helpers ────────────────────────────────────────────────────────────────

  function updateField<K extends keyof UserAddressCreateRequest>(
    key: K,
    value: UserAddressCreateRequest[K],
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(formData);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Số nhà"
        value={formData.homeNumber}
        onChange={(e) => updateField('homeNumber', e.target.value)}
        required
      />
      <Input
        label="Tên đường"
        value={formData.street}
        onChange={(e) => updateField('street', e.target.value)}
        required
      />
      <Input
        label="Quận/Huyện"
        value={formData.district}
        onChange={(e) => updateField('district', e.target.value)}
        required
      />
      <Input
        label="Tỉnh/Thành phố"
        value={formData.city}
        onChange={(e) => updateField('city', e.target.value)}
        required
      />

      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.isDefault}
          onChange={(e) => updateField('isDefault', e.target.checked)}
        />
        Đặt làm địa chỉ mặc định
      </label>

      <div className="flex gap-3 pt-4">
        <Button variant="ghost" type="button" onClick={onCancel} className="flex-1" disabled={isSubmitting}>
          Hủy
        </Button>
        <Button type="submit" className="flex-1" isLoading={isSubmitting}>
          Lưu địa chỉ
        </Button>
      </div>
    </form>
  );
}
