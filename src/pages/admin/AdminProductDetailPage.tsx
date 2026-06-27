import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { AdminProductImageResponse } from '@/types/admin.types';
import { Spinner } from '@/components/ui';
import { useAdminProductDetail } from '@/hooks/admin/useAdminProducts';
import { useAdminCategories, useAdminBrands, useAdminMaterials } from '@/hooks/admin/useAdminCatalog';
import { useAdminAttributes } from '@/hooks/admin/useAdminAttributes';

export default function AdminProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { categories } = useAdminCategories();
  const { brands } = useAdminBrands();
  const { materials } = useAdminMaterials();
  const { attributes } = useAdminAttributes();

  const {
    isNew,
    isLoading,
    isSaving,
    product: apiProduct,
    setProduct,
    previewImages,
    newVariants,
    handleFileChange,
    removePreviewImage,
    addVariantRow,
    updateVariantRow,
    removeVariantRow,
    editedVariants,
    updateExistingVariant,
    deleteExistingVariant,
    saveProduct,
  } = useAdminProductDetail(id);

  const product = apiProduct;

  const handleSave = () => {
    saveProduct(() => navigate('/admin/products'));
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            {isNew ? 'Thêm sản phẩm mới' : 'Chi tiết sản phẩm'}
          </h1>
          {!isNew && (
            <span className="bg-slate-200 text-slate-600 px-2.5 py-1 rounded-md text-xs font-semibold">
              #{product.id}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/products')}
            className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {isSaving && <Spinner size="sm" />}
            {isNew ? 'Tạo sản phẩm' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column ───────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Card: General Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Thông tin chung</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tên sản phẩm <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={product.name || ''}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="Nhập tên sản phẩm..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mô tả chi tiết</label>
              <textarea
                rows={5}
                value={product.description || ''}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                placeholder="Nhập mô tả sản phẩm..."
              />
            </div>
          </div>

          {/* Card: Media */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Hình ảnh</h2>
              <span className="text-xs text-slate-400">{previewImages.length + (product.images?.length ?? 0)} ảnh</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {/* Ảnh đã có (khi edit) */}
              {!isNew &&
                product.images?.map((img: AdminProductImageResponse) => (
                  <div
                    key={img.id}
                    className="aspect-square rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="text-white hover:text-red-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <span className="text-slate-400 font-medium text-xs text-center px-2">{img.alt || img.name}</span>
                  </div>
                ))}

              {/* Preview ảnh mới chọn */}
              {previewImages.map((p) => (
                <div key={p.key} className="aspect-square rounded-xl overflow-hidden border border-indigo-300 relative group">
                  <img src={p.previewUrl} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removePreviewImage(p.key)}
                      className="text-white hover:text-red-400 bg-black/30 rounded-full p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {/* Nút chọn file */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600"
              >
                <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs font-medium">Tải ảnh lên</span>
              </button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {previewImages.length > 0 && (
              <p className="text-xs text-indigo-600 font-medium">
                ✓ Đã chọn {previewImages.length} ảnh mới — sẽ được tải lên khi bạn lưu sản phẩm.
              </p>
            )}
          </div>

          {/* Card: Variants */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Biến thể (Variants)</h2>
              <button
                type="button"
                onClick={addVariantRow}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Thêm biến thể
              </button>
            </div>

            {/* Variants cũ (khi edit) */}
            {!isNew && product.variants && product.variants.length > 0 && (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3">Phân loại hàng</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3 text-right">Tồn kho</th>
                      <th className="px-4 py-3 text-right">Giá riêng (VNĐ)</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {product.variants.map((v) => {
                      const edited = editedVariants.get(v.id);
                      const currentStock = edited?.stock ?? v.stock;
                      const currentPrice = edited?.overrideSalePrice !== undefined
                        ? edited.overrideSalePrice
                        : v.overrideSalePrice;
                      return (
                        <tr key={v.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-700">
                            {v.optionValues.map((o) => o.value).join(' - ')}
                          </td>
                          <td className="px-4 py-3 text-slate-500">{v.sku}</td>
                          <td className="px-4 py-3 text-right">
                            <input
                              type="number"
                              value={currentStock ?? 0}
                              min={0}
                              onChange={(e) =>
                                updateExistingVariant(v.id, 'stock', Number(e.target.value))
                              }
                              className="w-20 text-right border border-slate-200 rounded px-2 py-1 focus:border-indigo-500 focus:outline-none"
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <input
                              type="number"
                              value={currentPrice ?? ''}
                              placeholder="Mặc định"
                              onChange={(e) =>
                                updateExistingVariant(
                                  v.id,
                                  'overrideSalePrice',
                                  e.target.value === '' ? null : Number(e.target.value)
                                )
                              }
                              className="w-28 text-right border border-slate-200 rounded px-2 py-1 focus:border-indigo-500 focus:outline-none"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => deleteExistingVariant(v.id)}
                              title="Xóa biến thể"
                              className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Variants mới thêm */}
            {newVariants.length > 0 && (
              <div className="border border-indigo-200 rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-indigo-50 text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                  Biến thể mới
                </div>
                <div className="divide-y divide-slate-100">
                  {newVariants.map((v) => (
                    <div key={v.key} className="p-4 flex flex-col gap-3 hover:bg-slate-50">
                      {/* Attribute selects — one per attribute */}
                      <div className="flex flex-wrap gap-3">
                        {attributes.map((attr) => {
                          const selectedId = v.optionValueIds.find((id) =>
                            attr.values.some((val) => val.id === id)
                          );
                          return (
                            <div key={attr.id} className="flex-1 min-w-[140px]">
                              <label className="block text-xs font-medium text-slate-500 mb-1">
                                {attr.name}
                              </label>
                              <select
                                value={selectedId ?? ''}
                                onChange={(e) => {
                                  const chosen = e.target.value ? Number(e.target.value) : null;
                                  // Replace the old value for this attribute (if any) with the new one
                                  const withoutThisAttr = v.optionValueIds.filter(
                                    (id) => !attr.values.some((val) => val.id === id)
                                  );
                                  updateVariantRow(
                                    v.key,
                                    'optionValueIds',
                                    chosen ? [...withoutThisAttr, chosen] : withoutThisAttr
                                  );
                                }}
                                className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none text-slate-700"
                              >
                                <option value="">-- Chọn {attr.name} --</option>
                                {attr.values.map((val) => (
                                  <option key={val.id} value={val.id}>
                                    {val.value}
                                  </option>
                                ))}
                              </select>
                            </div>
                          );
                        })}
                      </div>
                      {/* Stock & price */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Tồn kho</label>
                          <input
                            type="number"
                            value={v.stock}
                            min={0}
                            onChange={(e) => updateVariantRow(v.key, 'stock', Number(e.target.value))}
                            className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Giá riêng (VNĐ)</label>
                          <input
                            type="number"
                            value={v.overrideSalePrice ?? ''}
                            placeholder="Mặc định"
                            onChange={(e) =>
                              updateVariantRow(
                                v.key,
                                'overrideSalePrice',
                                e.target.value === '' ? null : Number(e.target.value)
                              )
                            }
                            className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div className="pt-5">
                          <button
                            type="button"
                            onClick={() => removeVariantRow(v.key)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {newVariants.length === 0 && (isNew || !product.variants?.length) && (
              <div className="text-center py-8 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                <p className="text-slate-500 text-sm mb-3">Chưa có biến thể nào. Nhấn "Thêm biến thể" để bắt đầu.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column ──────────────────────────────── */}
        <div className="space-y-6">
          {/* Card: Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Trạng thái</h2>
            <select
              value={product.status}
              onChange={(e) => setProduct({ ...product, status: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value={1}>Đang bán</option>
              <option value={0}>Ngừng bán</option>
            </select>
          </div>

          {/* Card: Pricing */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Định giá</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
              <input
                type="number"
                value={product.salePrice || ''}
                onChange={(e) => setProduct({ ...product, salePrice: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="0"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Giá gốc / So sánh (VNĐ)</label>
              <input
                type="number"
                value={product.comparePrice || ''}
                onChange={(e) => setProduct({ ...product, comparePrice: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="0"
                min={0}
              />
              <p className="text-xs text-slate-400 mt-1">Để trống nếu không có giảm giá.</p>
            </div>
          </div>

          {/* Card: Organization */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Phân loại</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Danh mục</label>
              <select
                value={product.category?.id || ''}
                onChange={(e) => {
                  const id = e.target.value ? Number(e.target.value) : null;
                  setProduct({
                    ...product,
                    category: id ? { id, name: categories.find((c) => c.id === id)?.name || '', status: 1 } : null,
                  });
                }}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Thương hiệu</label>
              <select
                value={product.brand?.id || ''}
                onChange={(e) => {
                  const id = e.target.value ? Number(e.target.value) : null;
                  setProduct({
                    ...product,
                    brand: id ? { id, name: brands.find((b) => b.id === id)?.name || '', status: 1 } : null,
                  });
                }}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700"
              >
                <option value="">-- Chọn thương hiệu --</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Chất liệu</label>
              <select
                value={product.material?.id || ''}
                onChange={(e) => {
                  const id = e.target.value ? Number(e.target.value) : null;
                  setProduct({
                    ...product,
                    material: id ? { id, name: materials.find((m) => m.id === id)?.name || '', status: 1 } : null,
                  });
                }}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700"
              >
                <option value="">-- Chọn chất liệu --</option>
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
