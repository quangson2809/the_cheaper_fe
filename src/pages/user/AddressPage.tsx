import { useState } from 'react';
import { useAddress } from '@/hooks/user/useAddress';
import type { UserAddressResponse } from '@/types/user.types';
import { Button, Input, Spinner } from '@/components/ui';

export default function AddressPage() {
  const { addresses, isLoading, createAddress, updateAddress, deleteAddress, setDefault } = useAddress();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fullName: '', phone: '', street: '', district: '', city: '', ward: '', isDefault: false
  });
  const [saving, setSaving] = useState(false);

  if (isLoading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;

  function handleAdd() {
    setEditId(null);
    setFormData({ fullName: '', phone: '', street: '', district: '', city: '', ward: '', isDefault: false });
    setShowForm(true);
  }

  function handleEdit(addr: UserAddressResponse) {
    setEditId(addr.id);
    setFormData({
      fullName: '',
      phone: '',
      street: addr.street || '',
      district: addr.district || '',
      city: addr.city || '',
      ward: '',
      isDefault: addr.isDefault,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const ok = editId
      ? await updateAddress(editId, formData)
      : await createAddress(formData);
    setSaving(false);
    if (ok) setShowForm(false);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-800">Sổ địa chỉ</h1>
        <Button onClick={handleAdd}>+ Thêm địa chỉ mới</Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
          <h2 className="text-lg font-bold mb-4">{editId ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}</h2>
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Họ tên người nhận" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} required />
              <Input label="Số điện thoại" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
            </div>
            <Input label="Địa chỉ cụ thể (Số nhà, đường)" value={formData.street} onChange={e => setFormData({ ...formData, street: e.target.value })} required />
            <div className="grid grid-cols-3 gap-4">
              <Input label="Phường/Xã" value={formData.ward} onChange={e => setFormData({ ...formData, ward: e.target.value })} required />
              <Input label="Quận/Huyện" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} required />
              <Input label="Tỉnh/Thành phố" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} required />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700 font-medium">
              <input type="checkbox" checked={formData.isDefault} onChange={e => setFormData({ ...formData, isDefault: e.target.checked })} />
              Đặt làm địa chỉ mặc định
            </label>
            <div className="flex gap-3 pt-2">
              <Button type="submit" isLoading={saving}>Lưu địa chỉ</Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Hủy</Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {addresses.map((addr) => (
          <div key={addr.id} className={`bg-white rounded-2xl p-5 border ${addr.isDefault ? 'border-indigo-400 shadow-md' : 'border-slate-100 shadow-sm'}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-slate-800 flex items-center gap-2">
                  {addr.street}
                  {addr.isDefault && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Mặc định</span>}
                </p>
                <p className="text-sm text-slate-500 mt-1">{addr.district}, {addr.city}</p>
                {addr.homeNumber && <p className="text-sm text-slate-500 mt-0.5">Số nhà: {addr.homeNumber}</p>}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                {!addr.isDefault && (
                  <button onClick={() => void setDefault(addr.id)} className="text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded">Đặt mặc định</button>
                )}
                <button onClick={() => handleEdit(addr)} className="text-slate-500 hover:bg-slate-50 px-2 py-1 rounded">Sửa</button>
                <button onClick={() => { if(confirm('Xóa?')) void deleteAddress(addr.id); }} className="text-red-500 hover:bg-red-50 px-2 py-1 rounded">Xóa</button>
              </div>
            </div>
          </div>
        ))}
        {addresses.length === 0 && !showForm && (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-slate-500">Bạn chưa có địa chỉ nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}
