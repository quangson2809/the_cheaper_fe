import { useState } from 'react';
import { Button, Badge, Select, Modal, Spinner } from '@/components/ui';
import { EmptyState } from '@/components/common';
import { useAdminAccounts } from '@/hooks/admin/useAdminAccounts';
import { CreateAdminForm } from '@/components/admin/CreateAdminForm';
import type { AdminAccountResponse } from '@/types/admin.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isActive(status: number) {
  return Number(status) === 1;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AccountAvatar({ name }: { name: string }) {
  return (
    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

interface AccountRowProps {
  acc: AdminAccountResponse;
  onToggleStatus: (id: number, currentStatus: number) => void;
}

function AccountRow({ acc, onToggleStatus }: AccountRowProps) {
  const active = isActive(acc.status);

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      {/* User info */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <AccountAvatar name={acc.name} />
          <div>
            <p className="font-bold text-slate-800">{acc.name}</p>
            <p className="text-xs text-slate-400">#{acc.id}</p>
          </div>
        </div>
      </td>

      {/* Contact */}
      <td className="px-6 py-4">
        <div className="space-y-0.5">
          <p className="text-slate-700 font-medium">{acc.email}</p>
          <p className="text-xs text-slate-500">{acc.phone || 'Chưa có SĐT'}</p>
        </div>
      </td>

      {/* Role */}
      <td className="px-6 py-4 text-center">
        <Badge variant={acc.role === 'ADMIN' ? 'error' : 'primary'}>
          {acc.role === 'ADMIN' ? 'Quản trị' : 'Khách hàng'}
        </Badge>
      </td>

      {/* Status */}
      <td className="px-6 py-4 text-center">
        <Badge variant={active ? 'success' : 'neutral'}>
          {active ? 'Hoạt động' : 'Đã khóa'}
        </Badge>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <Button
          variant={active ? 'danger' : 'success'}
          className="px-3 py-1.5 rounded-xl text-xs font-bold"
          onClick={() => onToggleStatus(acc.id, acc.status)}
        >
          {active ? 'Khóa' : 'Mở khóa'}
        </Button>
      </td>
    </tr>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationBarProps {
  count: number;
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

function PaginationBar({ count, page, totalPages, onPrev, onNext }: PaginationBarProps) {
  if (count === 0) return null;

  return (
    <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
      <div>
        Hiển thị <span className="font-semibold text-slate-800">{count}</span> tài khoản
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Trang {page} / {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={page === 1}
              onClick={onPrev}
              className="rounded-xl border border-slate-200"
            >
              Trước
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={page >= totalPages}
              onClick={onNext}
              className="rounded-xl border border-slate-200"
            >
              Tiếp theo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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
    setSubmitError,
  } = useAdminAccounts();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleOpenModal() {
    setSubmitError(null);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    if (!isSubmitting) setIsModalOpen(false);
  }

  async function handleToggleStatus(id: number, currentStatus: number) {
    if (!confirm('Bạn có chắc chắn muốn thay đổi trạng thái tài khoản này?')) return;
    const newStatus = isActive(currentStatus) ? 0 : 1;
    await updateStatus(id, newStatus);
  }

  async function handleCreateAdmin(data: Parameters<typeof createAdmin>[0]) {
    const success = await createAdmin(data);
    if (success) setIsModalOpen(false);
    return success;
  }

  const currentPage = filters.page ?? 1;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Tài khoản người dùng
          </h1>
          <p className="text-slate-500 mt-1">Quản lý khách hàng và đội ngũ quản trị viên</p>
        </div>
        <Button variant="primary" onClick={handleOpenModal} className="shadow-lg shadow-indigo-200">
          + Thêm Quản trị viên
        </Button>
      </div>

      {/* ── Filters Bar ─────────────────────────────────────────────────────── */}
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
        <Button
          variant="ghost"
          onClick={resetFilters}
          className="text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
        >
          Xóa bộ lọc
        </Button>
      </div>

      {/* ── Data Table ──────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 min-h-[400px] overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : accounts.length === 0 ? (
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
                {accounts.map((acc) => (
                  <AccountRow
                    key={acc.id}
                    acc={acc}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && (
          <PaginationBar
            count={accounts.length}
            page={currentPage}
            totalPages={totalPages}
            onPrev={() => setFilters({ ...filters, page: currentPage - 1 })}
            onNext={() => setFilters({ ...filters, page: currentPage + 1 })}
          />
        )}
      </div>

      {/* ── Create Admin Modal ───────────────────────────────────────────────── */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Tạo tài khoản Quản trị">
        <CreateAdminForm
          onSubmit={handleCreateAdmin}
          onCancel={handleCloseModal}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      </Modal>
    </div>
  );
}
