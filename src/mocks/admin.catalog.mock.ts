import type {
  AdminBrandResponse,
  AdminCategoryResponse,
  AdminMaterialResponse,
} from '@/types/admin.types';

// ── Mock Data ─────────────────────────────────────────

let mockBrands: AdminBrandResponse[] = [
  { id: 1, name: 'Nike', status: 1 },
  { id: 2, name: 'Adidas', status: 1 },
  { id: 3, name: 'Puma', status: 0 },
];

let mockCategories: AdminCategoryResponse[] = [
  { id: 1, name: 'Giày Thể Thao', status: 1 },
  { id: 2, name: 'Giày Chạy Bộ', status: 1 },
  { id: 3, name: 'Giày Lười', status: 1 },
];

let mockMaterials: AdminMaterialResponse[] = [
  { id: 1, name: 'Da Bò', status: 1 },
  { id: 2, name: 'Vải Canvas', status: 1 },
  { id: 3, name: 'Nhựa EVA', status: 1 },
];

// ── Mock Functions ────────────────────────────────────

// Brands
export const getMockBrands = () => [...mockBrands];
export const createMockBrand = (name: string): AdminBrandResponse => {
  const newBrand: AdminBrandResponse = {
    id: Math.max(...mockBrands.map((b) => b.id), 0) + 1,
    name,
    status: 1,
  };
  mockBrands.push(newBrand);
  return newBrand;
};
export const updateMockBrand = (id: number, name: string, status?: number): AdminBrandResponse | null => {
  const idx = mockBrands.findIndex((b) => b.id === id);
  if (idx > -1) {
    mockBrands[idx] = { ...mockBrands[idx], name, status: status ?? mockBrands[idx].status };
    return mockBrands[idx];
  }
  return null;
};
export const deleteMockBrand = (id: number) => {
  mockBrands = mockBrands.filter((b) => b.id !== id);
};

// Categories
export const getMockCategories = () => [...mockCategories];
export const createMockCategory = (name: string): AdminCategoryResponse => {
  const newCat: AdminCategoryResponse = {
    id: Math.max(...mockCategories.map((c) => c.id), 0) + 1,
    name,
    status: 1,
  };
  mockCategories.push(newCat);
  return newCat;
};
export const updateMockCategory = (id: number, name: string, status?: number): AdminCategoryResponse | null => {
  const idx = mockCategories.findIndex((c) => c.id === id);
  if (idx > -1) {
    mockCategories[idx] = { ...mockCategories[idx], name, status: status ?? mockCategories[idx].status };
    return mockCategories[idx];
  }
  return null;
};
export const deleteMockCategory = (id: number) => {
  mockCategories = mockCategories.filter((c) => c.id !== id);
};

// Materials
export const getMockMaterials = () => [...mockMaterials];
export const createMockMaterial = (name: string): AdminMaterialResponse => {
  const newMat: AdminMaterialResponse = {
    id: Math.max(...mockMaterials.map((m) => m.id), 0) + 1,
    name,
    status: 1,
  };
  mockMaterials.push(newMat);
  return newMat;
};
export const updateMockMaterial = (id: number, name: string, status?: number): AdminMaterialResponse | null => {
  const idx = mockMaterials.findIndex((m) => m.id === id);
  if (idx > -1) {
    mockMaterials[idx] = { ...mockMaterials[idx], name, status: status ?? mockMaterials[idx].status };
    return mockMaterials[idx];
  }
  return null;
};
export const deleteMockMaterial = (id: number) => {
  mockMaterials = mockMaterials.filter((m) => m.id !== id);
};
