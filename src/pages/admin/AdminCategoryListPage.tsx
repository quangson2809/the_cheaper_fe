import { useMemo, useState } from 'react';
import { useAdminCategories } from '@/hooks/admin/useAdminCatalog';
import { Badge, Button, Input, Modal, Spinner } from '@/components/ui';
import type { AdminCategoryResponse } from '@/types/admin.types';

function SearchIcon() {
  return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>;
}

function MoreIcon() {
  return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></svg>;
}

export default function AdminCategoryListPage() {
  const { categories, isLoading, addCategory, updateCategory, deleteCategory } = useAdminCategories();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AdminCategoryResponse | null>(null);
  const [formData, setFormData] = useState({ name: '', status: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCategories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return categories.filter((category) => {
      const matchesQuery = !normalized || category.name.toLowerCase().includes(normalized) || String(category.id).includes(normalized);
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? category.status === 1 : category.status === 0);
      return matchesQuery && matchesStatus;
    });
  }, [categories, query, statusFilter]);

  const activeCount = categories.filter((category) => category.status === 1).length;
  const inactiveCount = categories.length - activeCount;

  const handleOpenAdd = () => {
    setOpenMenuId(null);
    setFormData({ name: '', status: 1 });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async () => {
    if (!formData.name.trim()) return;
    setIsSubmitting(true);
    await addCategory(formData);
    setIsSubmitting(false);
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (category: AdminCategoryResponse) => {
    setOpenMenuId(null);
    setSelectedCategory(category);
    setFormData({ name: category.name, status: category.status });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedCategory || !formData.name.trim()) return;
    setIsSubmitting(true);
    await updateCategory(selectedCategory.id, formData);
    setIsSubmitting(false);
    setIsEditModalOpen(false);
  };

  const handleOpenDelete = (category: AdminCategoryResponse) => {
    setOpenMenuId(null);
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedCategory) return;
    setIsSubmitting(true);
    await deleteCategory(selectedCategory.id);
    setIsSubmitting(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="admin-kicker">Catalog</div>
          <h1 className="admin-page-title mt-2">Danh mục</h1>
          <p className="admin-page-subtitle">Tổ chức sản phẩm thành các nhóm dễ quản lý và tìm kiếm.</p>
        </div>
        <Button size="md" onClick={handleOpenAdd} className="shrink-0">
          <span className="text-base leading-none">+</span>
          Tạo danh mục
        </Button>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="admin-surface p-4">
          <p className="text-xs font-medium text-slate-500">Tổng danh mục</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{categories.length}</p>
        </div>
        <div className="admin-surface p-4">
          <p className="text-xs font-medium text-slate-500">Đang hoạt động</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{activeCount}</p>
        </div>
        <div className="admin-surface p-4">
          <p className="text-xs font-medium text-slate-500">Đang ẩn</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{inactiveCount}</p>
        </div>
      </section>

      <section className="admin-surface overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200/80 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Tất cả danh mục</h2>
            <p className="mt-0.5 text-xs text-slate-500">{filteredCategories.length} kết quả phù hợp</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative sm:w-64">
              <Input
                aria-label="Tìm kiếm danh mục"
                placeholder="Tìm theo tên hoặc ID..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                icon={<SearchIcon />}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              aria-label="Lọc trạng thái"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Đang ẩn</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M4 6.5A2.5 2.5 0 0 1 6.5 4H10l2 2h5.5A2.5 2.5 0 0 1 20 8.5V17a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6.5Z" /></svg>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-900">Không tìm thấy danh mục</p>
            <p className="mt-1 max-w-sm text-sm text-slate-500">Thử đổi từ khóa hoặc bộ lọc trạng thái.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Danh mục</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">ID</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Trạng thái</th>
                  <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="group bg-white transition-colors hover:bg-slate-50/60">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                          {category.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{category.name}</p>
                          <p className="mt-0.5 text-xs text-slate-500">Danh mục sản phẩm</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-500">#{category.id}</td>
                    <td className="px-5 py-4">
                      <Badge variant={category.status === 1 ? 'success' : 'neutral'}>
                        {category.status === 1 ? 'Đang hoạt động' : 'Đang ẩn'}
                      </Badge>
                    </td>
                    <td className="relative px-5 py-4 text-right">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === category.id ? null : category.id)}
                        className="rounded-md p-2 text-slate-400 opacity-0 transition-all hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100 focus:opacity-100"
                        aria-label={`Thao tác ${category.name}`}
                      >
                        <MoreIcon />
                      </button>
                      {openMenuId === category.id && (
                        <div className="absolute right-5 top-12 z-20 w-36 rounded-lg border border-slate-200 bg-white p-1 text-left shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
                          <button onClick={() => handleOpenEdit(category)} className="w-full rounded-md px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50">Chỉnh sửa</button>
                          <button onClick={() => handleOpenDelete(category)} className="w-full rounded-md px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50">Xóa danh mục</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal isOpen={isAddModalOpen} onClose={() => !isSubmitting && setIsAddModalOpen(false)} title="Tạo danh mục">
        <div className="space-y-5">
          <p className="text-sm text-slate-500">Tạo một nhóm mới để tổ chức các sản phẩm trong cửa hàng.</p>
          <Input
            label="Tên danh mục"
            placeholder="Ví dụ: Giày nam"
            value={formData.name}
            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
            disabled={isSubmitting}
            autoFocus
          />
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>Hủy</Button>
            <Button onClick={handleAddSubmit} isLoading={isSubmitting}>Tạo danh mục</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => !isSubmitting && setIsEditModalOpen(false)} title="Chỉnh sửa danh mục">
        <div className="space-y-5">
          <Input
            label="Tên danh mục"
            value={formData.name}
            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
            disabled={isSubmitting}
          />
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Trạng thái</label>
            <select
              value={formData.status}
              onChange={(event) => setFormData({ ...formData, status: Number(event.target.value) })}
              disabled={isSubmitting}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            >
              <option value={1}>Đang hoạt động</option>
              <option value={0}>Đang ẩn</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>Hủy</Button>
            <Button onClick={handleEditSubmit} isLoading={isSubmitting}>Lưu thay đổi</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => !isSubmitting && setIsDeleteModalOpen(false)} title="Xóa danh mục">
        <div className="space-y-5">
          <div className="rounded-lg border border-red-100 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-900">Bạn sắp xóa “{selectedCategory?.name}”.</p>
            <p className="mt-1 text-xs leading-5 text-red-700">Hành động này có thể ảnh hưởng tới các sản phẩm đang sử dụng danh mục.</p>
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting}>Hủy</Button>
            <Button variant="danger" onClick={handleDeleteSubmit} isLoading={isSubmitting}>Xóa danh mục</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
