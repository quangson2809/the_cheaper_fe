import { useState, useEffect, useCallback } from 'react';
import * as accountService from '@/services/admin/admin.account.service';
import type { AdminAccountResponse, AdminUserFilterRequest, AdminCreateAdminRequest } from '@/types/admin.types';
import type { Page } from '@/types/api.types';

const DEFAULT_FILTERS: AdminUserFilterRequest = {
  page: 1,
  limit: 10,
  status: undefined,
  role: '',
};

export function useAdminAccounts(initialFilters: AdminUserFilterRequest = DEFAULT_FILTERS) {
  const [data, setData] = useState<Page<AdminAccountResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AdminUserFilterRequest>(initialFilters);

  // Creation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await accountService.getAccounts(filters);
      setData(res.data);
    } catch (error) {
      console.error('Accounts API failed:', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchAccounts();
  }, [fetchAccounts]);

  const updateStatus = async (id: number, status: number): Promise<boolean> => {
    try {
      await accountService.updateAccountStatus(id, status);
      await fetchAccounts();
      return true;
    } catch (error) {
      console.error('Update status API failed:', error);
      return false;
    }
  };

  const createAdmin = async (data: AdminCreateAdminRequest) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await accountService.createAdmin(data);
      await fetchAccounts();
      setIsSubmitting(false);
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Không thể tạo tài khoản admin. Vui lòng thử lại.';
      setSubmitError(msg);
      setIsSubmitting(false);
      return false;
    }
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return {
    accounts: data?.content || [],
    totalPages: data?.totalPages || 1,
    loading,
    filters,
    setFilters,
    resetFilters,
    refresh: fetchAccounts,
    updateStatus,
    createAdmin,
    isSubmitting,
    submitError,
    setSubmitError
  };
}
