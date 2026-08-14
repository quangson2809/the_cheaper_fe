import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getImageUrl } from '@/utils/getImageUrl';
import { Spinner, Button, Badge } from '@/components/ui';
import { formatCurrency } from '@/utils/formatCurrency';
import { useAdminProducts } from '@/hooks/admin/useAdminProducts';
import { useAdminCategories, useAdminBrands, useAdminMaterials } from '@/hooks/admin/useAdminCatalog';

export default function AdminProductListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState<number | undefined>(undefined);
  const [filterBrand, setFilterBrand] = useState<number | undefined>(undefined);
  const [filterMaterial, setFilterMaterial] = useState<number | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);

  const { categories } = useAdminCategories();
  const { brands } = useAdminBrands();
  const { materials } = useAdminMaterials();
  const { products, isLoading, totalPages, totalElements } = useAdminProducts({
    page,
    limit: 10,
    categoryId: filterCategory,
    brandId: filterBrand,
    materialId: filterMaterial,
    status: filterStatus,
  });

  const clearFilters = () => {
    setFilterCategory(undefined);
    setFilterBrand(undefined);
    setFilterMaterial(undefined);
    setFilterStatus(undefined);
    setPage(1);
  };

  const selectClass = 'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10';

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="admin-kicker">Commerce</div>
          <h1 className="admin-page-title mt-2">Sản phẩm</h1>
          <p className="admin-page-subtitle">Quản lý catalog, giá bán, tồn kho và trạng thái sản phẩm.</p>
        </div>
        <Link to="/admin/products/new">
          <Button><span className="text-base leading-none">+</span>Tạo sản phẩm</Button>
        </Link>
      </section>

      <section className="admin-surface overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Bộ lọc sản phẩm</h2>
              <p className="mt-0.5 text-xs text-slate-500">Thu hẹp danh sách theo thuộc tính catalog.</p>
            </div>
            <button onClick={clearFilters} className="self-start text-xs font-semibold text-indigo-600 hover:text-indigo-700 sm:self-auto">Đặt lại bộ lọc</button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
          <select value={filterCategory ?? ''} onChange={(e) => { setFilterCategory(e.target.value ? Number(e.target.value) : undefined); setPage(1); }} className={selectClass}>
            <option value="">Tất cả danh mục</option>
            {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select value={filterBrand ?? ''} onChange={(e) => { setFilterBrand(e.target.value ? Number(e.target.value) : undefined); setPage(1); }} className={selectClass}>
            <option value="">Tất cả thương hiệu</option>
            {brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select value={filterMaterial ?? ''} onChange={(e) => { setFilterMaterial(e.target.value ? Number(e.target.value) : undefined); setPage(1); }} className={selectClass}>
            <option value="">Tất cả chất liệu</option>
            {materials.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select value={filterStatus ?? ''} onChange={(e) => { setFilterStatus(e.target.value ? Number(e.target.value) : undefined); setPage(1); }} className={selectClass}>
            <option value="">Tất cả trạng thái</option>
            <option value="1">Đang bán</option>
            <option value="0">Ngừng bán</option>
          </select>
        </div>
      </section>

      <section className="admin-surface overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Tất cả sản phẩm</h2>
            <p className="mt-0.5 text-xs text-slate-500">{totalElements} sản phẩm trong catalog.</p>
          </div>
          <div className="text-xs font-medium text-slate-400">Trang {page} / {Math.max(totalPages, 1)}</div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[420px] items-center justify-center"><Spinner size="lg" /></div>
        ) : products.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="m4 7 8-4 8 4-8 4-8-4Zm0 5 8 4 8-4M4 17l8 4 8-4" /></svg>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-900">Chưa có sản phẩm phù hợp</p>
            <p className="mt-1 max-w-sm text-sm text-slate-500">Thử thay đổi bộ lọc hoặc tạo sản phẩm mới.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Sản phẩm</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Phân loại</th>
                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Giá bán</th>
                  <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Tồn kho</th>
                  <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Trạng thái</th>
                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Mở</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="group cursor-pointer bg-white transition-colors hover:bg-slate-50/60" onClick={() => navigate(`/admin/products/${product.id}`)}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                          {product.thumbnailUrl ? <img src={getImageUrl(product.thumbnailUrl)} alt={product.name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-slate-300"><span className="text-xs">IMG</span></div>}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-indigo-600">{product.name}</p>
                          <p className="mt-0.5 text-[11px] text-slate-400">#{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-medium text-slate-700">{product.categoryName || '—'}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{product.brandName || '—'}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <p className="text-xs font-semibold text-slate-900">{formatCurrency(product.salePrice)}</p>
                      {product.comparePrice && <p className="mt-0.5 text-[11px] text-slate-400 line-through">{formatCurrency(product.comparePrice)}</p>}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <p className={`text-xs font-semibold ${product.totalStock > 0 ? 'text-slate-700' : 'text-red-600'}`}>{product.totalStock}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">bán {product.totalSold}</p>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Badge variant={product.status === 1 ? 'success' : 'neutral'}>{product.status === 1 ? 'Đang bán' : 'Ngừng bán'}</Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={(event) => { event.stopPropagation(); navigate(`/admin/products/${product.id}`); }} className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label={`Mở ${product.name}`}>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 5h11v11M19 5 6 18" /><path strokeLinecap="round" strokeWidth="1.8" d="M16 19H5a2 2 0 0 1-2-2V6" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">Hiển thị {products.length} / {totalElements} sản phẩm</p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Trước</Button>
              <span className="min-w-16 text-center text-xs font-semibold text-slate-600">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>Tiếp</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
