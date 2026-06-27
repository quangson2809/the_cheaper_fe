import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner, Button } from '@/components/ui';
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

  const { products: apiProducts, isLoading, totalPages, totalElements } = useAdminProducts({
    page,
    limit: 10,
    categoryId: filterCategory,
    brandId: filterBrand,
    materialId: filterMaterial,
    status: filterStatus,
  });

  const products = apiProducts.length > 0 ? apiProducts : [];

  const totalDisplayElements = apiProducts.length > 0 ? totalElements : 0;
  const displayTotalPages = apiProducts.length > 0 ? totalPages : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Quản lý Sản phẩm</h1>
          <p className="text-slate-500 mt-1">Quản lý danh mục sản phẩm, biến thể và tồn kho.</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm shadow-indigo-600/20 transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Thêm sản phẩm mới
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterCategory ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                setFilterCategory(val ? Number(val) : undefined);
                setPage(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-slate-700"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={filterBrand ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                setFilterBrand(val ? Number(val) : undefined);
                setPage(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-slate-700"
            >
              <option value="">Tất cả thương hiệu</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <select
              value={filterMaterial ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                setFilterMaterial(val ? Number(val) : undefined);
                setPage(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-slate-700"
            >
              <option value="">Tất cả chất liệu</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <select
              value={filterStatus ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                setFilterStatus(val ? Number(val) : undefined);
                setPage(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-slate-700"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="1">Đang bán</option>
              <option value="0">Ngừng bán</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-slate-400 uppercase text-xs font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Sản phẩm</th>
                  <th className="px-6 py-4">Phân loại</th>
                  <th className="px-6 py-4 text-right">Giá bán</th>
                  <th className="px-6 py-4 text-center">Tồn kho</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/admin/products/${p.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                          {p.thumbnailUrl ? (
                            <img src={p.thumbnailUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{p.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Mã SP: #{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-600 font-medium">{p.categoryName || '---'}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{p.brandName || '---'}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-indigo-600">{formatCurrency(p.salePrice)}</div>
                      {p.comparePrice && (
                        <div className="text-xs text-slate-400 line-through mt-0.5">{formatCurrency(p.comparePrice)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`font-semibold ${p.totalStock > 0 ? 'text-slate-700' : 'text-red-500'}`}>
                        {p.totalStock}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">Đã bán: {p.totalSold}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === 1
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                        }`}>
                        {p.status === 1 ? 'Đang bán' : 'Ngừng bán'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/products/${p.id}`); }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500">Chưa có sản phẩm nào.</p>
              </div>
            )}
          </div>
        )}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>
            Hiển thị <span className="font-semibold text-slate-800">{products.length}</span> /{' '}
            <span className="font-semibold text-slate-800">{totalDisplayElements}</span> sản phẩm
          </div>
          {displayTotalPages > 1 && (
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Trang {page + 1} / {displayTotalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-xl border border-slate-200"
                >
                  Trước
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page >= displayTotalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-xl border border-slate-200"
                >
                  Tiếp theo
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
