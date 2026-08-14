import { useState, useEffect, useCallback } from 'react';
import * as catalogService from '@/services/admin/admin.catalog.service';
import type { AdminOptionAttributeResponse, AdminOptionAttributeRequest } from '@/types/admin.types';
import type { AxiosError } from 'axios';

type ApiErrorBody = {
  message?: string;
};

export function useAdminAttributes() {
  const [attributes, setAttributes] = useState<AdminOptionAttributeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttributes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await catalogService.getAttributes();
      if (res.data) {
        setAttributes(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch attributes:', err);
      setError('Không thể tải danh sách thuộc tính.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAttributes();
  }, [fetchAttributes]);

  const createAttribute = async (data: AdminOptionAttributeRequest) => {
    try {
      await catalogService.createAttribute(data);
      await fetchAttributes();
      return { success: true };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorBody>;
      return { success: false, message: axiosError.response?.data?.message || 'Không thể tạo thuộc tính' };
    }
  };

  const updateAttribute = async (id: number, data: AdminOptionAttributeRequest) => {
    try {
      await catalogService.updateAttribute(id, data);
      await fetchAttributes();
      return { success: true };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorBody>;
      return { success: false, message: axiosError.response?.data?.message || 'Không thể cập nhật thuộc tính' };
    }
  };

  const deleteAttribute = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa thuộc tính này? Tất cả giá trị liên quan sẽ bị xóa.')) return;
    try {
      await catalogService.deleteAttribute(id);
      await fetchAttributes();
      return true;
    } catch {
      alert('Không thể xóa thuộc tính.');
      return false;
    }
  };

  return {
    attributes,
    loading,
    error,
    refresh: fetchAttributes,
    createAttribute,
    updateAttribute,
    deleteAttribute,
  };
}
