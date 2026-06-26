import { useState, useEffect } from 'react';
import * as productService from '@/services/product.service';
import type { UserProductDetailResponse } from '@/types/product.types';

export function useProductDetail(productId: number) {
  const [product, setProduct] = useState<UserProductDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;
    setIsLoading(true);
    setNotFound(false);

    productService
      .getProductById(productId)
      .then((res) => {
        if (cancelled) return;
        if (res.data) {
          setProduct(res.data);
        } else {
          setNotFound(true);
        }
      })
      .catch((err) => {
        console.error('API error:', err);
        if (!cancelled) {
          setNotFound(true);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  return { product, isLoading, notFound };
}
