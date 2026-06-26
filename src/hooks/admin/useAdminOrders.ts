import { useState, useEffect, useCallback } from 'react';
import * as adminOrderService from '@/services/admin/admin.order.service';
import type {
  AdminOrderOverviewResponse,
  AdminOrderDetailResponse,
  AdminOrderFilterRequest,
} from '@/types/admin.types';
import type { Page } from '@/types/api.types';
import type { OrderStatus } from '@/types/order.types';

export function useAdminOrders(filters: AdminOrderFilterRequest) {
  const [data, setData] = useState<Page<AdminOrderOverviewResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const filtersKey = JSON.stringify(filters);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const res = await adminOrderService.getAdminOrders(filters);
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Admin orders API failed:', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [filtersKey]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (id: number, newStatus: OrderStatus) => {
    try {
      await adminOrderService.updateOrderStatus(id, { status: newStatus });
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          content: prev.content.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
        };
      });
      return true;
    } catch (err) {
      console.error('Admin order update API failed:', err);
      return false;
    }
  };

  return {
    orders: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    isLoading,
    hasError,
    updateOrderStatus,
    refetch: fetchOrders,
  };
}

export function useAdminOrderDetail(id: number | undefined) {
  const [order, setOrder] = useState<AdminOrderDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await adminOrderService.getAdminOrderById(id);
      if (res.data) {
        setOrder(res.data);
      }
    } catch (err) {
      console.error(`Admin order detail API failed for #${id}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchOrder();
  }, [fetchOrder]);

  const updateStatus = async (newStatus: OrderStatus) => {
    if (!order) return;
    setIsUpdating(true);
    try {
      await adminOrderService.updateOrderStatus(order.id, { status: newStatus });
      setOrder((prev) => prev ? { ...prev, status: newStatus } : null);
      setSuccessMsg(`Cập nhật trạng thái đơn hàng #${order.id} thành công.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Admin order update API failed:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    order,
    isLoading,
    isUpdating,
    successMsg,
    updateStatus,
    refetch: fetchOrder,
  };
}
