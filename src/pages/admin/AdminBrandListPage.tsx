import { useState } from 'react';
import { useAdminBrands } from '@/hooks/admin/useAdminCatalog';
import { Button, Input, Modal, Badge, Spinner } from '@/components/ui';
import type { AdminBrandResponse } from '@/types/admin.types';

export default function AdminBrandListPage() {
  const { brands, isLoading, addBrand, updateBrand, deleteBrand } = useAdminBrands();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedBrand, setSelectedBrand] = useState<AdminBrandResponse | null>(null);
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
    await addBrand(formData);
    setIsSubmitting(false);
    setIsAddModalOpen(false);
  };

  // Handlers for Edit
  const handleOpenEdit = (brand: AdminBrandResponse) => {
    setSelectedBrand(brand);
    setFormData({ name: brand.name, status: brand.status });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedBrand || !formData.name.trim()) return;
    setIsSubmitting(true);
    await updateBrand(selectedBrand.id, formData);
    setIsSubmitting(false);
    setIsEditModalOpen(false);
  };

  // Handlers for Delete
  const handleOpenDelete = (brand: AdminBrandResponse) => {
    setSelectedBrand(brand);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedBrand) return;
    setIsSubmitting(true);
    await deleteBrand(selectedBrand.id);
    setIsSubmitting(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Thương hiệu</h1>
          <p className="text-slate-500 mt-1">Danh sách các thương hiệu sản phẩm trong hệ thống</p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd} className="shadow-lg shadow-indigo-200">
          + Thêm thương hiệu
        </Button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : brands.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <svg className="w-16 h-16 mb-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </svg>
            <p className="text-lg font-medium">Chưa có thương hiệu nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl">ID</th>
                  <th className="px-6 py-4">Tên thương hiệu</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                  <th className="px-6 py-4 rounded-tr-xl text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-400">#{brand.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{brand.name}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={brand.status === 1 ? 'success' : 'neutral'}>
                        {brand.status === 1 ? 'Đang hoạt động' : 'Tạm ẩn'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => handleOpenEdit(brand)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="Chỉnh sửa"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleOpenDelete(brand)}
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
      <Modal isOpen={isAddModalOpen} onClose={() => !isSubmitting && setIsAddModalOpen(false)} title="Thêm thương hiệu mới">
        <div className="space-y-4 pt-2">
          <Input 
            label="Tên thương hiệu" 
            placeholder="Ví dụ: Nike, Adidas..." 
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
      <Modal isOpen={isEditModalOpen} onClose={() => !isSubmitting && setIsEditModalOpen(false)} title="Chỉnh sửa thương hiệu">
        <div className="space-y-4 pt-2">
          <Input 
            label="Tên thương hiệu" 
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
            Bạn có chắc chắn muốn xóa thương hiệu <span className="font-bold text-slate-900">{selectedBrand?.name}</span>? 
            Hành động này sẽ gỡ bỏ thương hiệu khỏi hệ thống và không thể hoàn tác.
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
