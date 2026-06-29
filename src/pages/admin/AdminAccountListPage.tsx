import React, { useState } from 'react';
import { Button, Input, Badge, Select, Modal, Spinner } from '@/components/ui';
import { EmptyState } from '@/components/common';
import { useAdminAccounts } from '@/hooks/admin/useAdminAccounts';
import type { AdminAccountResponse } from '@/types/admin.types';

export default function AdminAccountListPage() {
  const {
    accounts,
    loading,
    totalPages,
    filters,
    setFilters,
    resetFilters,
    updateStatus,
    createAdmin,
    isSubmitting,
    submitError,
    setSubmitError
  } = useAdminAccounts();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleOpenAdd = () => {
    setFormData({ name: '', email: '', phone: '', password: '' });
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (id: number, currentStatus: number) => {
    if (!confirm('Bạn có chắc chắn muốn thay đổi trạng thái tài khoản này?')) return;
    const newStatus = Number(currentStatus) === 1 ? 0 : 1;
    await updateStatus(id, newStatus);
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createAdmin(formData);
    if (success && !submitError) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Tài khoản người dùng</h1>
          <p className="text-slate-500 mt-1">Quản lý khách hàng và đội ngũ quản trị viên</p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd} className="shadow-lg shadow-indigo-200">
          + Thêm Quản trị viên
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-end">
        <div className="w-full sm:w-48">
          <Select
            label="Trạng thái"
            options={[
              { value: 1, label: 'Đang hoạt động' },
              { value: 0, label: 'Đã khóa' },
            ]}
            value={filters.status ?? ''}
            onChange={(e) => setFilters({ ...filters, status: Number(e.target.value), page: 1 })}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            label="Vai trò"
            options={[
              { value: 'USER', label: 'Khách hàng' },
              { value: 'ADMIN', label: 'Quản trị viên' },
            ]}
            value={filters.role ?? ''}
            onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
          />
        </div>
        <Button variant="ghost" onClick={resetFilters} className="text-slate-500 hover:bg-slate-50">
          Xóa lọc
        </Button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 min-h-[400px] overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : !accounts || accounts.length === 0 ? (
          <div className="py-20">
            <EmptyState
              title="Không tìm thấy tài khoản nào"
              description="Thử thay đổi bộ lọc hoặc thêm tài khoản mới."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Người dùng</th>
                  <th className="px-6 py-4">Liên hệ</th>
                  <th className="px-6 py-4 text-center">Vai trò</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(accounts || []).map((acc: AdminAccountResponse) => (
                  <tr key={acc.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                          {acc.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{acc.name}</p>
                          <p className="text-xs text-slate-400">#{acc.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="text-slate-700 font-medium">{acc.email}</p>
                        <p className="text-xs text-slate-500">{acc.phone || 'Chưa có SĐT'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={acc.role === 'ADMIN' ? 'error' : 'primary'}>
                        {acc.role === 'ADMIN' ? 'Quản trị' : 'Khách hàng'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={Number(acc.status) === 1 ? 'success' : 'neutral'}>
                        {Number(acc.status) === 1 ? 'Hoạt động' : 'Đã khóa'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        onClick={() => handleUpdateStatus(acc.id, Number(acc.status))}
                        variant={Number(acc.status) === 1 ? 'danger' : 'success'}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all`}
                      >
                        {Number(acc.status) === 1 ? 'Khóa' : 'Mở khóa'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && accounts && accounts.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
            <div>
              Hiển thị <span className="font-semibold text-slate-800">{accounts.length}</span> tài khoản
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Trang {filters.page ?? 1} / {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={(filters.page ?? 1) === 1}
                    onClick={() => setFilters({ ...filters, page: (filters.page ?? 1) - 1 })}
                    className="rounded-xl border border-slate-200"
                  >
                    Trước
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={(filters.page ?? 1) >= totalPages}
                    onClick={() => setFilters({ ...filters, page: (filters.page ?? 1) + 1 })}
                    className="rounded-xl border border-slate-200"
                  >
                    Tiếp theo
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Admin Modal */}
      <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)} title="Tạo tài khoản Quản trị">
        <form onSubmit={handleSubmitCreate} className="space-y-4 pt-2">
          <Input
            label="Họ tên"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="VD: Nguyễn Văn A"
            disabled={isSubmitting}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              disabled={isSubmitting}
            />
            <Input
              label="Số điện thoại"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="09..."
              disabled={isSubmitting}
            />
          </div>
          <Input
            label="Mật khẩu"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Tối thiểu 6 ký tự"
            disabled={isSubmitting}
          />

          {submitError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-600 font-medium">{submitError}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="ghost" className="flex-1" type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button className="flex-1" type="submit" isLoading={isSubmitting}>
              Tạo tài khoản
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
