import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchProducts } from '@/hooks/product/useProducts';
import { ProductGrid } from '@/components/product';
import { Spinner, Input, Button } from '@/components/ui';
import { EmptyState, Pagination } from '@/components/common';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get('q') ?? '');
  const [page, setPage] = useState(1);
  const query = searchParams.get('q') ?? '';

  const { products, totalPages, isLoading } = useSearchProducts(query, page);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchParams({ q: input });
    setPage(1);
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-800 mb-6">Tìm kiếm sản phẩm</h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <Input
          id="search-input"
          type="search"
          placeholder="Nhập tên sản phẩm, thương hiệu..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="md">Tìm kiếm</Button>
      </form>

      {query && (
        <p className="text-sm text-slate-500 mb-4">
          Kết quả tìm kiếm cho: <strong className="text-slate-700">"{query}"</strong>
        </p>
      )}

      {isLoading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : query && products.length === 0 ? (
        <EmptyState icon="🔍" title="Không tìm thấy kết quả" description="Hãy thử từ khóa khác." />
      ) : !query ? (
        <EmptyState icon="💡" title="Nhập từ khóa để tìm kiếm" />
      ) : (
        <>
          <ProductGrid products={products} />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
