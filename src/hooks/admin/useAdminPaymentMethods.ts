import { useState, useEffect, useCallback } from 'react';
import * as paymentMethodService from '@/services/admin/admin.paymentMethod.service';
import type { PaymentMethodResponse } from '@/types/paymentMethod.types';

export function useAdminPaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPaymentMethods = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await paymentMethodService.getPaymentMethods();
      if (res.data) {
        setPaymentMethods(res.data);
      }
    } catch (err) {
      console.error('Payment Methods API failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  const addPaymentMethod = async (data: { name: string; code: string }) => {
    try {
      await paymentMethodService.createPaymentMethod(data);
      await fetchPaymentMethods();
    } catch (err) {
      console.error('Payment Method create API failed:', err);
    }
  };

  const updatePaymentMethod = async (id: number, data: { name: string; code: string; status: number }) => {
    try {
      await paymentMethodService.updatePaymentMethod(id, data);
      await fetchPaymentMethods();
    } catch (err) {
      console.error('Payment Method update API failed:', err);
    }
  };

  const deletePaymentMethod = async (id: number) => {
    try {
      await paymentMethodService.deletePaymentMethod(id);
      setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Payment Method delete API failed:', err);
    }
  };

  return { paymentMethods, isLoading, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, refetch: fetchPaymentMethods };
}
