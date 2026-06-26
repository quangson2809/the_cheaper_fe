import { useState, useEffect, useCallback } from 'react';
import * as orderService from '@/services/order.service';
import type { UserOrderResponse, UserOrderOverviewResponse, UserCreateOrderRequest } from '@/types/order.types';
import type { Page } from '@/types/api.types';
import {
  cancelMockOrder,
  createMockOrder,
  getMockOrderById,
  getMockOrdersPage,
} from '@/mocks/order.mock';

export function useOrders(page = 1, limit = 10) {
  const [data, setData] = useState<Page<UserOrderOverviewResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await orderService.getOrders({ page, limit });
      if (res.data?.content?.length) {
        setData(res.data);
      } else {
        setData(getMockOrdersPage(page, limit));
      }
    } catch {
      console.warn('Orders API failed, using mock data');
      setData(getMockOrdersPage(page, limit));
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  return {
    orders: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    isLoading,
    refetch: fetchOrders,
  };
}

export function useOrderDetail(id: number | undefined) {
  const [order, setOrder] = useState<UserOrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setNotFound(false);
    try {
      const res = await orderService.getOrderById(id);
      if (res.data) {
        setOrder(res.data);
      } else {
        const mock = getMockOrderById(id);
        setOrder(mock);
        setNotFound(!mock);
      }
    } catch {
      console.warn('Order detail API failed, using mock data');
      const mock = getMockOrderById(id);
      setOrder(mock);
      setNotFound(!mock);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchOrder();
  }, [fetchOrder]);

  return { order, setOrder, isLoading, notFound, refetch: fetchOrder };
}

export function useCreateOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createOrder(data: UserCreateOrderRequest): Promise<UserOrderResponse | null> {
    setIsLoading(true);
    setError(null);
    try {
      const res = await orderService.createOrder(data);
      return res.data;
    } catch {
      console.warn('Create order API failed, using mock success response');
      return createMockOrder(data);
    } finally {
      setIsLoading(false);
    }
  }

  return { createOrder, isLoading, error };
}

export function useCancelOrder() {
  const [isLoading, setIsLoading] = useState(false);

  async function cancelOrder(id: number): Promise<UserOrderResponse | null> {
    setIsLoading(true);
    try {
      const res = await orderService.cancelOrder(id);
      return res.data;
    } catch {
      console.warn('Cancel order API failed, updating mock data locally');
      return cancelMockOrder(id);
    } finally {
      setIsLoading(false);
    }
  }

  return { cancelOrder, isLoading };
}
