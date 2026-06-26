import { useState, useEffect } from 'react';
import * as productService from '@/services/product.service';
import type { UserProductOverviewResponse, UserProductFilterRequest } from '@/types/product.types';
import type { Page } from '@/types/api.types';

export function useProducts(filters: UserProductFilterRequest = {}) {
  const [data, setData] = useState<Page<UserProductOverviewResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);
    productService
      .getProducts(filters)
      .then((res) => {
        if (cancelled) return;
        if (res.data) {
          setData(res.data);
        }
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('API failed:', error);
        setHasError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filtersKey]);

  return {
    products: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    isLoading,
    hasError,
  };
}

export function useSearchProducts(query: string, page = 1) {
  const trimmedQuery = query.trim();
  const [data, setData] = useState<Page<UserProductOverviewResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!trimmedQuery) {
      setData(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    productService
      .searchProducts(trimmedQuery, { page })
      .then((res) => {
        if (cancelled) return;
        if (res.data) {
          setData(res.data);
        }
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Search API failed:', error);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [trimmedQuery, page]);

  return { products: data?.content ?? [], totalPages: data?.totalPages ?? 0, isLoading };
}
