import { useState, useEffect } from 'react';
import * as paymentMethodService from '@/services/paymentMethod.service';
import type { PaymentMethodResponse } from '@/types/paymentMethod.types';

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    paymentMethodService
      .getPaymentMethods()
      .then((res) => {
        if (cancelled) return;
        if (res.data) {
          setPaymentMethods(res.data);
        }
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Payment Methods API failed:', error);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { paymentMethods, isLoading };
}
