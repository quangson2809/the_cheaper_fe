import { useState, useEffect } from 'react';
import * as catalogservice from '@/services/catalog.service';
import type {
  brandResponse,
  categoryResponse
} from '@/types/catalog.types';

export function useProductFiltersData() {
  const [categories, setCategories] = useState<categoryResponse[]>([]);
  const [brands, setBrands] = useState<brandResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      catalogservice.getCategories(),
      catalogservice.getBrands(),
    ])
      .then(([catRes, brandRes]) => {
        if (cancelled) return;
        if (catRes.status === 'fulfilled' && catRes.value.data) {
          setCategories(catRes.value.data);
        }

        if (brandRes.status === 'fulfilled' && brandRes.value.data) {
          setBrands(brandRes.value.data);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to fetch filters data:', err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, brands, isLoading };
}
