import { useState } from 'react';
import { useProducts } from '@/hooks/product/useProducts';
import { useProductFiltersData } from '@/hooks/product/useProductFiltersData';
import { ProductGrid } from '@/components/product';
import { Spinner, Button, Input, Select } from '@/components/ui';
import { Pagination, EmptyState } from '@/components/common';
import type { UserProductFilterRequest } from '@/types/product.types';

export default function ProductListPage() {
  const [filters, setFilters] = useState<UserProductFilterRequest>({ page: 1, limit: 12 });
  const { products, totalPages, isLoading } = useProducts(filters);
  const { categories, brands, isLoading: isFiltersLoading } = useProductFiltersData();

  function handlePageChange(page: number) {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleFilterChange(key: keyof UserProductFilterRequest, value: string) {
    const numVal = value === '' ? undefined : Number(value);
    setFilters((prev) => ({ ...prev, [key]: numVal, page: 1 }));
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-slate-800 mb-6">Tất cả sản phẩm</h1>

      {/* Filter bar */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 mb-8 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <Select
            id="filter-category"
            label="Danh mục"
            value={filters.categoryId ?? ''}
            onChange={(e) => handleFilterChange('categoryId', e.target.value)}
            options={categories.map(c => ({ value: c.id, label: c.name }))}
            disabled={isFiltersLoading}
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <Select
            id="filter-brand"
            label="Thương hiệu"
            value={filters.brandId ?? ''}
            onChange={(e) => handleFilterChange('brandId', e.target.value)}
            options={brands.map(b => ({ value: b.id, label: b.name }))}
            disabled={isFiltersLoading}
          />
        </div>

        <div className="flex items-end gap-2">
          <Input
            id="filter-min-price"
            label="Giá từ (₫)"
            type="number"
            placeholder="0"
            className="w-32"
            value={filters.minPrice ?? ''}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          />
          <Input
            id="filter-max-price"
            label="Đến (₫)"
            type="number"
            placeholder="Tối đa"
            className="w-32"
            value={filters.maxPrice ?? ''}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="h-[46px]"
          onClick={() => setFilters({ page: 1, limit: 12 })}
        >
          Xóa bộ lọc
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : products.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="Không tìm thấy sản phẩm"
          description="Hãy thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác."
        />
      ) : (
        <>
          <ProductGrid products={products} />
          <Pagination
            currentPage={filters.page ?? 1}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
