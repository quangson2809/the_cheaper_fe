import React, { useState } from 'react';
import { useAdminAttributes } from '@/hooks/admin/useAdminAttributes';
import { Button, Input, Modal, Spinner, Badge } from '@/components/ui';
import { EmptyState } from '@/components/common';
import type { AdminOptionAttributeRequest, AdminOptionAttributeResponse } from '@/types/admin.types';

export default function AdminAttributeListPage() {
  const { attributes, loading, createAttribute, updateAttribute, deleteAttribute } = useAdminAttributes();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttr, setEditingAttr] = useState<AdminOptionAttributeResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [values, setValues] = useState<string[]>(['']);
  const [formError, setFormError] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingAttr(null);
    setName('');
    setValues(['']);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (attr: AdminOptionAttributeResponse) => {
    setEditingAttr(attr);
    setName(attr.name);
    setValues(attr.values.map(v => v.value));
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleValueChange = (index: number, val: string) => {
    const newValues = [...values];
    newValues[index] = val;
    setValues(newValues);
  };

  const addValueField = () => setValues([...values, '']);
  const removeValueField = (index: number) => {
    if (values.length <= 1) return;
    setValues(values.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const filteredValues = values.filter(v => v.trim() !== '').map(v => ({ value: v.trim() }));
    if (filteredValues.length === 0) {
      setFormError('Phải có ít nhất một giá trị cho thuộc tính.');
      setSubmitting(false);
      return;
    }

    const payload: AdminOptionAttributeRequest = {
      name: name.trim(),
      values: filteredValues,
    };

    let res;
    if (editingAttr) {
      res = await updateAttribute(editingAttr.id, payload);
    } else {
      res = await createAttribute(payload);
    }

    if (res.success) {
      setIsModalOpen(false);
    } else {
      setFormError(res.message || 'Đã có lỗi xảy ra.');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa thuộc tính "${name}"?`)) return;
    await deleteAttribute(id);
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Thuộc tính sản phẩm</h1>
          <p className="text-slate-500 mt-1 text-sm">Quản lý các thuộc tính biến thể như Kích thước, Màu sắc...</p>
        </div>
        <Button variant="primary" onClick={openAddModal} className="shadow-lg shadow-indigo-200">
          + Thêm thuộc tính
        </Button>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-20 shadow-sm border border-slate-100 flex items-center justify-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      ) : attributes.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 shadow-sm border border-slate-100 min-h-[400px]">
          <EmptyState title="Chưa có thuộc tính nào" description="Hãy tạo thuộc tính đầu tiên để bắt đầu cấu hình sản phẩm." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {attributes.map((attr) => (
            <div key={attr.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col h-full group">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">{attr.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">ID: #{attr.id}</p>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => openEditModal(attr)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    title="Chỉnh sửa"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(attr.id, attr.name)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Xóa"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 flex-1 items-start content-start py-2">
                {attr.values.map((v) => (
                  <Badge key={v.id} variant="neutral" className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-100 font-medium hover:bg-slate-100 transition-colors">
                    {v.value}
                  </Badge>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Tổng cộng {attr.values.length} giá trị</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-lg">Cấu hình</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !submitting && setIsModalOpen(false)} 
        title={editingAttr ? 'Chỉnh sửa thuộc tính' : 'Thêm thuộc tính mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            label="Tên thuộc tính"
            placeholder="VD: Kích thước, Màu sắc..."
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
          />

          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-semibold text-slate-700">Giá trị thuộc tính</label>
              <button 
                type="button" 
                onClick={addValueField}
                className="text-indigo-600 hover:text-indigo-700 text-xs font-bold py-1 px-2 hover:bg-indigo-50 rounded-lg transition-all"
                disabled={submitting}
              >
                + Thêm giá trị
              </button>
            </div>
            
            <div className="max-h-60 overflow-y-auto pr-2 space-y-3 custom-scrollbar px-1 py-1">
              {values.map((val, idx) => (
                <div key={idx} className="flex gap-2 animate-[fadeIn_0.2s_ease]">
                  <div className="flex-1">
                    <Input
                      placeholder={`Giá trị ${idx + 1}`}
                      value={val}
                      onChange={(e) => handleValueChange(idx, e.target.value)}
                      disabled={submitting}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeValueField(idx)}
                    className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all self-end"
                    disabled={values.length <= 1 || submitting}
                    title="Xóa giá trị"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {formError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-[shake_0.4s_ease]">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-600 font-medium">{formError}</p>
            </div>
          )}

          <div className="flex gap-3 pt-6">
            <Button variant="ghost" className="flex-1" type="button" onClick={() => setIsModalOpen(false)} disabled={submitting}>
              Hủy
            </Button>
            <Button className="flex-1" type="submit" isLoading={submitting}>
              {editingAttr ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
