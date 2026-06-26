import { useState } from 'react';
import { useProfile } from '@/hooks/user/useProfile';
import { Button, Input, Spinner } from '@/components/ui';
import { formatDate } from '@/utils/formatDate';
import { useToast } from '@/store/ToastContext';

export default function ProfilePage() {
  const { profile, isLoading, updateProfile } = useProfile();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const { success } = useToast();

  if (isLoading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;
  if (!profile) return null;

  function startEdit() {
    setName(profile!.name);
    setPhone(profile!.phone ?? '');
    setEditMode(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const ok = await updateProfile({ name, phone: phone || null });
    setSaving(false);
    if (ok) {
      setEditMode(false);
      success('Cập nhật hồ sơ thành công!');
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-800">Hồ sơ cá nhân</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        {/* Avatar area */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 select-none">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-800 text-lg">{profile.name}</p>
            <p className="text-sm text-slate-500">{profile.email}</p>
            <span className="inline-block mt-1 text-xs bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full">
              {profile.role}
            </span>
          </div>
        </div>

        {editMode ? (
          <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
            <Input id="profile-name" label="Họ và tên" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input id="profile-phone" label="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <div className="flex gap-3">
              <Button type="submit" isLoading={saving}>Lưu</Button>
              <Button type="button" variant="outline" onClick={() => setEditMode(false)}>Hủy</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500">Số điện thoại</span>
              <span className="text-slate-800 font-medium">{profile.phone ?? '—'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500">Điểm tích lũy</span>
              <span className="text-indigo-600 font-bold">{profile.rewardPoint} điểm</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Ngày tham gia</span>
              <span className="text-slate-800">{formatDate(profile.createdAt)}</span>
            </div>
            <Button variant="outline" size="sm" className="mt-4" onClick={startEdit}>✏️ Chỉnh sửa</Button>
          </div>
        )}
      </div>
    </div>
  );
}
