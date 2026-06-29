import { useState } from 'react';
import { useAdminPaymentMethods } from '@/hooks/admin/useAdminPaymentMethods';
import { Button, Input, Modal, Badge, Spinner } from '@/components/ui';
import type { PaymentMethodResponse } from '@/types/paymentMethod.types';

export default function AdminPaymentMethodListPage() {
  const { paymentMethods, isLoading, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = useAdminPaymentMethods();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodResponse | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', status: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers for Add
  const handleOpenAdd = () => {
    setFormData({ name: '', code: '', status: 1 });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async () => {
    if (!formData.name.trim() || !formData.code.trim()) return;
    setIsSubmitting(true);
    await addPaymentMethod({ name: formData.name, code: formData.code });
    setIsSubmitting(false);
    setIsAddModalOpen(false);
  };

  // Handlers for Edit
  const handleOpenEdit = (method: PaymentMethodResponse) => {
    setSelectedMethod(method);
    setFormData({ name: method.name, code: method.code, status: method.status });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedMethod || !formData.name.trim() || !formData.code.trim()) return;
    setIsSubmitting(true);
    await updatePaymentMethod(selectedMethod.id, { name: formData.name, code: formData.code, status: formData.status });
    setIsSubmitting(false);
    setIsEditModalOpen(false);
  };

  // Handlers for Delete
  const handleOpenDelete = (method: PaymentMethodResponse) => {
    setSelectedMethod(method);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedMethod) return;
    setIsSubmitting(true);
    await deletePaymentMethod(selectedMethod.id);
    setIsSubmitting(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Phương thức thanh toán</h1>
          <p className="text-slate-500 mt-1">Cấu hình các phương thức thanh toán khả dụng trong hệ thống</p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd}>
          + Thêm phương thức
        </Button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <p className="text-lg font-medium">Chưa có phương thức thanh toán nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl">Mã (Code)</th>
                  <th className="px-6 py-4">Tên hiển thị</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 rounded-tr-xl text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paymentMethods.map((method) => (
                  <tr key={method.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-indigo-600">{method.code}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{method.name}</td>
                    <td className="px-6 py-4">
                      <Badge variant={method.status === 1 ? 'success' : 'neutral'}>
                        {method.status === 1 ? 'Đang hoạt động' : 'Tạm ẩn'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(method)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleOpenDelete(method)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => !isSubmitting && setIsAddModalOpen(false)} title="Thêm phương thức mới">
        <div className="space-y-4">
          <Input
            label="Mã phương thức (VNPAY, MOMO...)"
            placeholder="Nhập mã..."
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            disabled={isSubmitting}
          />
          <Input
            label="Tên hiển thị"
            placeholder="Nhập tên hiển thị..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isSubmitting}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>Hủy</Button>
            <Button variant="primary" onClick={handleAddSubmit} isLoading={isSubmitting}>Lưu lại</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => !isSubmitting && setIsEditModalOpen(false)} title="Chỉnh sửa phương thức">
        <div className="space-y-4">
          <Input
            label="Mã phương thức"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            disabled={isSubmitting}
          />
          <Input
            label="Tên hiển thị"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isSubmitting}
          />
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Trạng thái</label>
            <select
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-600"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
              disabled={isSubmitting}
            >
              <option value={1}>Đang hoạt động</option>
              <option value={0}>Tạm ẩn</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>Hủy</Button>
            <Button variant="primary" onClick={handleEditSubmit} isLoading={isSubmitting}>Cập nhật</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => !isSubmitting && setIsDeleteModalOpen(false)} title="Xóa phương thức">
        <div className="space-y-4">
          <p className="text-slate-600">
            Bạn có chắc chắn muốn xóa phương thức <span className="font-bold text-slate-800">{selectedMethod?.name}</span>?
            Hành động này không thể hoàn tác.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting}>Hủy</Button>
            <Button variant="danger" onClick={handleDeleteSubmit} isLoading={isSubmitting}>Xóa phương thức</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
