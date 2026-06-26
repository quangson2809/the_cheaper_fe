import { useState, useEffect, useCallback } from 'react';
import * as catalogService from '@/services/admin/admin.catalog.service';
import type {
  AdminBrandResponse,
  AdminCategoryResponse,
  AdminMaterialResponse,
  AdminBrandRequest,
} from '@/types/admin.types';

// ── Brands ────────────────────────────────────────────

export function useAdminBrands() {
  const [brands, setBrands] = useState<AdminBrandResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBrands = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await catalogService.getBrands();
      if (res.data) {
        setBrands(res.data);
      }
    } catch (err) {
      console.error('Brands API failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBrands();
  }, [fetchBrands]);

  const addBrand = async (data: AdminBrandRequest) => {
    try {
      const res = await catalogService.createBrand(data);
      if (res.data) setBrands((prev) => [...prev, res.data!]);
    } catch (err) {
      console.error('Brand create API failed:', err);
    }
  };

  const updateBrand = async (id: number, data: AdminBrandRequest) => {
    try {
      const res = await catalogService.updateBrand(id, data);
      if (res.data) setBrands((prev) => prev.map((b) => (b.id === id ? res.data! : b)));
    } catch (err) {
      console.error('Brand update API failed:', err);
    }
  };

  const deleteBrand = async (id: number) => {
    try {
      await catalogService.deleteBrand(id);
      setBrands((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Brand delete API failed:', err);
    }
  };

  return { brands, isLoading, addBrand, updateBrand, deleteBrand, refetch: fetchBrands };
}

// ── Categories ────────────────────────────────────────

export function useAdminCategories() {
  const [categories, setCategories] = useState<AdminCategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await catalogService.getCategories();
      if (res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Categories API failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (data: AdminBrandRequest) => {
    try {
      const res = await catalogService.createCategory(data);
      if (res.data) setCategories((prev) => [...prev, res.data!]);
    } catch (err) {
      console.error('Category create API failed:', err);
    }
  };

  const updateCategory = async (id: number, data: AdminBrandRequest) => {
    try {
      const res = await catalogService.updateCategory(id, data);
      if (res.data) setCategories((prev) => prev.map((c) => (c.id === id ? res.data! : c)));
    } catch (err) {
      console.error('Category update API failed:', err);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await catalogService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Category delete API failed:', err);
    }
  };

  return { categories, isLoading, addCategory, updateCategory, deleteCategory, refetch: fetchCategories };
}

// ── Materials ─────────────────────────────────────────

export function useAdminMaterials() {
  const [materials, setMaterials] = useState<AdminMaterialResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMaterials = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await catalogService.getMaterials();
      if (res.data) {
        setMaterials(res.data);
      }
    } catch (err) {
      console.error('Materials API failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMaterials();
  }, [fetchMaterials]);

  const addMaterial = async (data: AdminBrandRequest) => {
    try {
      const res = await catalogService.createMaterial(data);
      if (res.data) setMaterials((prev) => [...prev, res.data!]);
    } catch (err) {
      console.error('Material create API failed:', err);
    }
  };

  const updateMaterial = async (id: number, data: AdminBrandRequest) => {
    try {
      const res = await catalogService.updateMaterial(id, data);
      if (res.data) setMaterials((prev) => prev.map((m) => (m.id === id ? res.data! : m)));
    } catch (err) {
      console.error('Material update API failed:', err);
    }
  };

  const deleteMaterial = async (id: number) => {
    try {
      await catalogService.deleteMaterial(id);
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Material delete API failed:', err);
    }
  };

  return { materials, isLoading, addMaterial, updateMaterial, deleteMaterial, refetch: fetchMaterials };
}
