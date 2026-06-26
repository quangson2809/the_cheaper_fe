import { useState, useEffect, useCallback } from 'react';
import * as accountService from '@/services/admin/admin.account.service';
import type { AdminAccountResponse, AdminUserFilterRequest, AdminCreateAdminRequest } from '@/types/admin.types';

const DEFAULT_FILTERS: AdminUserFilterRequest = {
  page: 1,
  limit: 10,
  status: undefined,
  role: '',
};

export function useAdminAccounts(initialFilters: AdminUserFilterRequest = DEFAULT_FILTERS) {
  const [accounts, setAccounts] = useState<AdminAccountResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<AdminUserFilterRequest>(initialFilters);
  
  // Creation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await accountService.getAccounts(filters);
      if (res.data) {
        setAccounts(res.data.content);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error('Accounts API failed:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchAccounts();
  }, [fetchAccounts]);

  const toggleStatus = async (id: number) => {
    try {
      await accountService.toggleAccountStatus(id);
      await fetchAccounts();
      return true;
    } catch (error) {
      console.error('Toggle status API failed:', error);
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
    accounts,
    loading,
    totalPages,
    filters,
    setFilters,
    resetFilters,
    refresh: fetchAccounts,
    toggleStatus,
    createAdmin,
    isSubmitting,
    submitError,
    setSubmitError
  };
}
