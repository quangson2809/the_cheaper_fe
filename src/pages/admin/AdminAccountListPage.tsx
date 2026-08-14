import { useState } from 'react';
import { Button, Badge, Select, Modal, Spinner } from '@/components/ui';
import { EmptyState } from '@/components/common';
import { useAdminAccounts } from '@/hooks/admin/useAdminAccounts';
import { CreateAdminForm } from '@/components/admin/CreateAdminForm';
import type { AdminAccountResponse } from '@/types/admin.types';

function isActive(status: number) {
  return Number(status) === 1;
}

function AccountAvatar({ name }: { name: string }) {
  return <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-700 ring-1 ring-inset ring-indigo-600/10">{name.charAt(0).toUpperCase()}</div>;
}

function AccountRow({ acc, onToggleStatus }: { acc: AdminAccountResponse; onToggleStatus: (id: number, currentStatus: number) => void }) {
  const active = isActive(acc.status);
  return (
    <tr className="group bg-white transition-colors hover:bg-slate-50/60">
      <td className="px-5 py-4"><div className="flex items-center gap-3"><AccountAvatar name={acc.name} /><div><p className="text-sm font-semibold text-slate-900">{acc.name}</p><p className="mt-0.5 text-[11px] text-slate-400">#{acc.id}</p></div></div></td>
      <td className="px-5 py-4"><p className="text-xs font-medium text-slate-700">{acc.email}</p><p className="mt-0.5 text-[11px] text-slate-400">{acc.phone || 'Chưa có SĐT'}</p></td>
      <td className="px-5 py-4 text-center"><Badge variant={acc.role === 'ADMIN' ? 'error' : 'primary'}>{acc.role === 'ADMIN' ? 'Quản trị' : 'Khách hàng'}</Badge></td>
      <td className="px-5 py-4 text-center"><Badge variant={active ? 'success' : 'neutral'}>{active ? 'Hoạt động' : 'Đã khóa'}</Badge></td>
      <td className="px-5 py-4 text-right"><Button size="sm" variant={active ? 'danger' : 'success'} onClick={() => onToggleStatus(acc.id, acc.status)}>{active ? 'Khóa' : 'Mở khóa'}</Button></td>
    </tr>
  );
}

export default function AdminAccountListPage() {
  const { accounts, loading, totalPages, filters, setFilters, resetFilters, updateStatus, createAdmin, isSubmitting, submitError, setSubmitError } = useAdminAccounts();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentPage = filters.page ?? 1;

  async function handleToggleStatus(id: number, currentStatus: number) {
    if (!confirm('Bạn có chắc chắn muốn thay đổi trạng thái tài khoản này?')) return;
    await updateStatus(id, isActive(currentStatus) ? 0 : 1);
  }

  async function handleCreateAdmin(data: Parameters<typeof createAdmin>[0]) {
    const success = await createAdmin(data);
    if (success) setIsModalOpen(false);
    return success;
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="admin-kicker">People</div>
          <h1 className="admin-page-title mt-2">Tài khoản</h1>
          <p className="admin-page-subtitle">Quản lý khách hàng, vai trò và quyền truy cập hệ thống.</p>
        </div>
        <Button onClick={() => { setSubmitError(null); setIsModalOpen(true); }}><span className="text-base leading-none">+</span>Tạo quản trị viên</Button>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="admin-surface p-4"><p className="text-xs font-medium text-slate-500">Tài khoản trên trang</p><p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{accounts.length}</p></div>
        <div className="admin-surface p-4"><p className="text-xs font-medium text-slate-500">Trang hiện tại</p><p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{currentPage}</p></div>
        <div className="admin-surface p-4"><p className="text-xs font-medium text-slate-500">Tổng số trang</p><p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{totalPages}</p></div>
      </section>

      <section className="admin-surface overflow-hidden">
        <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-[220px_220px_1fr] md:items-end">
          <Select label="Trạng thái" options={[{ value: 1, label: 'Đang hoạt động' }, { value: 0, label: 'Đã khóa' }]} value={filters.status ?? ''} onChange={(event) => setFilters({ ...filters, status: Number(event.target.value), page: 1 })} />
          <Select label="Vai trò" options={[{ value: 'USER', label: 'Khách hàng' }, { value: 'ADMIN', label: 'Quản trị viên' }]} value={filters.role ?? ''} onChange={(event) => setFilters({ ...filters, role: event.target.value, page: 1 })} />
          <button onClick={resetFilters} className="h-10 w-fit rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">Xóa bộ lọc</button>
        </div>
      </section>

      <section className="admin-surface min-h-[400px] overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="text-sm font-semibold text-slate-900">Danh sách tài khoản</h2><p className="mt-0.5 text-xs text-slate-500">Kiểm soát trạng thái và quyền truy cập.</p></div><span className="text-xs font-medium text-slate-400">Trang {currentPage} / {Math.max(totalPages, 1)}</span></div>
        {loading ? <div className="flex min-h-[360px] items-center justify-center"><Spinner size="lg" /></div> : accounts.length === 0 ? <div className="py-20"><EmptyState title="Không tìm thấy tài khoản" description="Thử thay đổi bộ lọc hoặc tạo tài khoản quản trị mới." /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead><tr className="border-b border-slate-100 bg-slate-50/70"><th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Người dùng</th><th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Liên hệ</th><th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Vai trò</th><th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Trạng thái</th><th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Thao tác</th></tr></thead>
              <tbody className="divide-y divide-slate-100">{accounts.map((account) => <AccountRow key={account.id} acc={account} onToggleStatus={handleToggleStatus} />)}</tbody>
            </table>
          </div>
        )}
        {!loading && accounts.length > 0 && <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4"><p className="text-xs text-slate-500">Hiển thị {accounts.length} tài khoản</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setFilters({ ...filters, page: currentPage - 1 })}>Trước</Button><Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setFilters({ ...filters, page: currentPage + 1 })}>Tiếp</Button></div></div>}
      </section>

      <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)} title="Tạo tài khoản quản trị">
        <CreateAdminForm onSubmit={handleCreateAdmin} onCancel={() => !isSubmitting && setIsModalOpen(false)} isSubmitting={isSubmitting} submitError={submitError} />
      </Modal>
    </div>
  );
}
