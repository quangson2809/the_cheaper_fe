import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as productService from '@/services/admin/admin.product.service';
import type { AdminProductOverviewResponse } from '@/types/admin.types';
import { Spinner } from '@/components/ui';
import { formatCurrency } from '@/utils/formatCurrency';

const mockProducts: AdminProductOverviewResponse[] = [
  {
    id: 1,
    name: 'Áo Sơ Mi Nam Cổ Trụ Phối Nút Vạt Bầu',
    brandName: 'Zara',
    categoryName: 'Áo Sơ Mi',
    salePrice: 250000,
    comparePrice: 350000,
    status: 'ACTIVE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=100&h=100&fit=crop',
    createdAt: '2023-12-01T10:00:00Z',
    totalStock: 150,
    totalSold: 45,
  },
  {
    id: 2,
    name: 'Quần Jeans Ống Suông Phong Cách Hàn Quốc',
    brandName: 'Levi\'s',
    categoryName: 'Quần Jeans',
    salePrice: 450000,
    comparePrice: null,
    status: 'ACTIVE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop',
    createdAt: '2023-12-05T14:30:00Z',
    totalStock: 80,
    totalSold: 120,
  },
  {
    id: 3,
    name: 'Giày Thể Thao Nam Chạy Bộ Nhẹ Nhàng',
    brandName: 'Nike',
    categoryName: 'Giày',
    salePrice: 1200000,
    comparePrice: 1500000,
    status: 'INACTIVE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
    createdAt: '2023-12-10T09:15:00Z',
    totalStock: 0,
    totalSold: 300,
  },
];

export default function AdminProductListPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<AdminProductOverviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productService.getAdminProducts({ page: 0, limit: 20 })
      .then((res) => {
        if (res.data && res.data.content && res.data.content.length > 0) {
          setProducts(res.data.content);
        } else {
          setProducts(mockProducts);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải danh sách sản phẩm:', err);
        setProducts(mockProducts);
      })
      .finally(() => setIsLoading(false));
  }, []);

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
            <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
              <option value="">Tất cả danh mục</option>
              <option value="ao-so-mi">Áo Sơ Mi</option>
              <option value="quan-jeans">Quần Jeans</option>
            </select>
            <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang bán</option>
              <option value="INACTIVE">Ngừng bán</option>
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
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        p.status === 'ACTIVE' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {p.status === 'ACTIVE' ? 'Đang bán' : 'Ngừng bán'}
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
          <div>Hiển thị <span className="font-semibold text-slate-800">{products.length}</span> sản phẩm</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-md border border-slate-200 hover:bg-slate-50" disabled>Trước</button>
            <button className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-600 font-medium">1</button>
            <button className="px-3 py-1 rounded-md border border-slate-200 hover:bg-slate-50">Tiếp</button>
          </div>
        </div>
      </div>
    </div>
  );
}
