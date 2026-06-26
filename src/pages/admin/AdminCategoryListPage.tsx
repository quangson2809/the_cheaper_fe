import { useState } from 'react';
import { useAdminCategories } from '@/hooks/admin/useAdminCatalog';
import { Button, Input, Modal, Badge, Spinner } from '@/components/ui';
import type { AdminCategoryResponse } from '@/types/admin.types';

export default function AdminCategoryListPage() {
  const { categories, isLoading, addCategory, updateCategory, deleteCategory } = useAdminCategories();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<AdminCategoryResponse | null>(null);
  const [formData, setFormData] = useState({ name: '', status: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers for Add
  const handleOpenAdd = () => {
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

  // Handlers for Edit
  const handleOpenEdit = (category: AdminCategoryResponse) => {
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

  // Handlers for Delete
  const handleOpenDelete = (category: AdminCategoryResponse) => {
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
    <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Danh mục sản phẩm</h1>
          <p className="text-slate-500 mt-1">Quản lý cấu trúc phân loại sản phẩm</p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd} className="shadow-lg shadow-indigo-200">
          + Thêm danh mục
        </Button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <svg className="w-16 h-16 mb-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-lg font-medium">Chưa có danh mục nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl">ID</th>
                  <th className="px-6 py-4">Tên danh mục</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                  <th className="px-6 py-4 rounded-tr-xl text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-400">#{category.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{category.name}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={category.status === 1 ? 'success' : 'neutral'}>
                        {category.status === 1 ? 'Đang hoạt động' : 'Tạm ẩn'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => handleOpenEdit(category)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="Chỉnh sửa"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleOpenDelete(category)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Xóa"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => !isSubmitting && setIsAddModalOpen(false)} title="Thêm danh mục mới">
        <div className="space-y-4 pt-2">
          <Input 
            label="Tên danh mục" 
            placeholder="Ví dụ: Giày Nam, Áo Khoác..." 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isSubmitting}
            autoFocus
          />
          <div className="flex justify-end gap-3 mt-8">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>Hủy</Button>
            <Button variant="primary" onClick={handleAddSubmit} isLoading={isSubmitting}>Lưu lại</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => !isSubmitting && setIsEditModalOpen(false)} title="Chỉnh sửa danh mục">
        <div className="space-y-4 pt-2">
          <Input 
            label="Tên danh mục" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isSubmitting}
          />
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Trạng thái hiển thị</label>
            <select 
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-700 font-medium"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
              disabled={isSubmitting}
            >
              <option value={1}>Hiển thị (Active)</option>
              <option value={0}>Tạm ẩn (Inactive)</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>Hủy</Button>
            <Button variant="primary" onClick={handleEditSubmit} isLoading={isSubmitting}>Cập nhật</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => !isSubmitting && setIsDeleteModalOpen(false)} title="Xác nhận xóa">
        <div className="space-y-4 pt-2">
          <p className="text-slate-600 leading-relaxed">
            Bạn có chắc chắn muốn xóa danh mục <span className="font-bold text-slate-900">{selectedCategory?.name}</span>? 
            Việc xóa danh mục có thể ảnh hưởng đến các sản phẩm thuộc danh mục này.
          </p>
          <div className="flex justify-end gap-3 mt-8">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting}>Hủy</Button>
            <Button variant="danger" onClick={handleDeleteSubmit} isLoading={isSubmitting}>Xác nhận xóa</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
