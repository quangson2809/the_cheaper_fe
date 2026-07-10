import { useState, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import type { UserAddressCreateRequest, UserAddressResponse } from '@/types/user.types';

interface AddressFormProps {
  initialData?: UserAddressResponse | null;
  onSubmit: (data: UserAddressCreateRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function AddressForm({ initialData, onSubmit, onCancel, isSubmitting }: AddressFormProps) {
  const [formData, setFormData] = useState<UserAddressCreateRequest>({
    homeNumber: initialData?.homeNumber ?? '',
    street: initialData?.street ?? '',
    district: initialData?.district ?? '',
    city: initialData?.city ?? '',
    isDefault: initialData?.isDefault ?? false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        homeNumber: initialData.homeNumber ?? '',
        street: initialData.street,
        district: initialData.district,
        city: initialData.city,
        isDefault: initialData.isDefault,
      });
    } else {
      setFormData({ homeNumber: '', street: '', district: '', city: '', isDefault: false });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Số nhà" value={formData.homeNumber} onChange={(e) => setFormData({ ...formData, homeNumber: e.target.value })} required />
      <Input label="Tên đường" value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })} required />
      <Input label="Quận/Huyện" value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} required />
      <Input label="Tỉnh/Thành phố" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
      
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={formData.isDefault} onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} />
        Đặt làm địa chỉ mặc định
      </label>

      <div className="flex gap-3 pt-4">
        <Button variant="ghost" type="button" onClick={onCancel} className="flex-1" disabled={isSubmitting}>Hủy</Button>
        <Button type="submit" className="flex-1" isLoading={isSubmitting}>Lưu</Button>
      </div>
    </form>
  );
}
