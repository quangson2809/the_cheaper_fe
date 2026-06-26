import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductDetail } from '@/hooks/product/useProductDetail';
import { useCart } from '@/hooks/user/useCart';
import { useAuthContext } from '@/store/AuthContext';
import { Button, Spinner } from '@/components/ui';
import { EmptyState } from '@/components/common';
import { formatCurrency } from '@/utils/formatCurrency';
import { getImageUrl } from '@/utils/getImageUrl';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, notFound } = useProductDetail(Number(id));
  const { addItem } = useCart();
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState('');
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Variant selections
  // Maps Attribute Name -> Selected Value (e.g. "Màu sắc" -> "Đỏ")
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0].name);
    }

    // Auto-select initial variant if available
    if (product && product.variants.length > 0) {
      const defaultVariant = product.variants.find(v => v.inStock) || product.variants[0];
      setSelectedAttributes(defaultVariant.attributes);
    }
  }, [product]);

  // Extract all unique attributes from all variants
  // { "Màu sắc": ["Đỏ", "Xanh"], "Kích cỡ": ["S", "M", "L"] }
  const availableAttributes = useMemo(() => {
    if (!product) return {};
    const attrs: Record<string, Set<string>> = {};
    product.variants.forEach((v) => {
      Object.entries(v.attributes).forEach(([key, val]) => {
        if (!attrs[key]) attrs[key] = new Set();
        attrs[key].add(val);
      });
    });

    const result: Record<string, string[]> = {};
    Object.keys(attrs).forEach((key) => {
      result[key] = Array.from(attrs[key]);
    });
    return result;
  }, [product]);

  // Find the exact matched variant
  const activeVariant = useMemo(() => {
    if (!product) return null;
    return product.variants.find((v) => {
      const variantAttrs = Object.entries(v.attributes);
      const selectedAttrs = Object.entries(selectedAttributes);

      // If the number of attributes doesn't match, it's not the one
      if (variantAttrs.length !== selectedAttrs.length) return false;

      return variantAttrs.every(([key, val]) => selectedAttributes[key] === val);
    }) || null;
  }, [product, selectedAttributes]);

  const displayPrice = activeVariant?.price ?? product?.price ?? 0;

  // Check if a specific attribute value can be selected with current other selections
  const canSelectAttribute = (attrKey: string, attrVal: string) => {
    if (!product) return false;

    // Create a prospective selection
    const prospectiveSelection = { ...selectedAttributes, [attrKey]: attrVal };

    // Check if ANY variant matches all *currently defined* prospective attributes
    return product.variants.some((v) => {
      return Object.entries(prospectiveSelection).every(([pKey, pVal]) => v.attributes[pKey] === pVal);
    });
  };

  const handleSelectAttribute = (attrKey: string, attrVal: string) => {
    const isCompatible = canSelectAttribute(attrKey, attrVal);

    if (isCompatible) {
      setSelectedAttributes(prev => ({ ...prev, [attrKey]: attrVal }));
    } else {
      // Find the first variant (preferably in stock) that has this attribute value
      const fallbackVariant = product!.variants.find(v => v.attributes[attrKey] === attrVal && v.inStock)
        || product!.variants.find(v => v.attributes[attrKey] === attrVal);

      if (fallbackVariant) {
        setSelectedAttributes(fallbackVariant.attributes);
      }
    }
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-[60vh]"><Spinner size="lg" className="text-indigo-600" /></div>;
  if (notFound || !product) return <div className="min-h-[60vh] flex items-center justify-center"><EmptyState icon="😕" title="Không tìm thấy sản phẩm" description="Sản phẩm này không tồn tại hoặc đã bị xoá." /></div>;

  async function handleAddToCart() {
    //if (!isAuthenticated) { navigate('/login'); return; }
    if (!activeVariant) return;
    const ok = await addItem(activeVariant.id, quantity);
    if (ok) {
      setAddedMsg('✨ Đã thêm vào giỏ hàng thành công!');
      setTimeout(() => setAddedMsg(''), 2500);
    }
  }

  // Generate safe images array
  const galleryImages = product.images.length > 0 ? product.images : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

          {/* Left: Images Gallery */}
          <div className="lg:col-span-6 p-6 lg:p-10 lg:border-r border-slate-100 bg-slate-50/50">
            <div className="flex flex-col gap-6">
              {/* Main Image */}
              <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-white shadow-sm ring-1 ring-slate-100 relative group">
                <img
                  src={getImageUrl(activeImage ?? galleryImages[0]?.name)}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                />
                {product.discountPercentage != null && product.discountPercentage > 0 && (
                  <span className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-black px-4 py-1.5 rounded-full shadow-lg shadow-red-500/30">
                    -{product.discountPercentage}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {galleryImages.map((img) => (
                    <button
                      key={img.name}
                      onClick={() => setActiveImage(img.name)}
                      className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden bg-white object-cover transition-all duration-300 ${activeImage === img.name
                        ? 'ring-2 ring-indigo-600 ring-offset-2 scale-100'
                        : 'ring-1 ring-slate-200 hover:ring-indigo-300 opacity-70 hover:opacity-100 scale-95 hover:scale-100'
                        }`}
                    >
                      <img
                        src={getImageUrl(img.name)}
                        alt={img.alt ?? product.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-6 p-6 lg:p-12 flex flex-col justify-between">
            <div className="space-y-8">
              {/* Header Info */}
              <div className="space-y-2">
                {product.brand && (
                  <p className="text-sm text-indigo-500 font-bold uppercase tracking-widest">{product.brand}</p>
                )}
                <h1 className="text-3xl lg:text-4xl font-black text-slate-800 leading-tight">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-4xl font-black text-indigo-600">
                    {formatCurrency(displayPrice)}
                  </span>
                  {product.originalPrice != null && product.originalPrice > displayPrice && (
                    <span className="text-xl text-slate-400 font-semibold line-through decoration-slate-300">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Attributes Selectors */}
              {Object.keys(availableAttributes).length > 0 && (
                <div className="space-y-6 py-6 border-y border-slate-100">
                  {Object.entries(availableAttributes).map(([attrKey, attrValues]) => (
                    <div key={attrKey} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">{attrKey}</span>
                        <span className="text-sm font-medium text-slate-500">{selectedAttributes[attrKey] || 'Chưa chọn'}</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {attrValues.map(val => {
                          const isSelected = selectedAttributes[attrKey] === val;

                          return (
                            <button
                              key={val}
                              onClick={() => handleSelectAttribute(attrKey, val)}
                              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isSelected
                                ? 'bg-slate-800 text-white shadow-md scale-105 ring-2 ring-slate-800 ring-offset-1'
                                : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50'
                                }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Stock Info */}
                  <div className="flex items-center gap-2 text-sm font-medium pt-2">
                    {activeVariant ? (
                      activeVariant.inStock ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-emerald-600">Còn {activeVariant.stock} sản phẩm</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                          <span className="text-red-500">Hết hàng</span>
                        </>
                      )
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                        <span className="text-amber-600">Vui lòng chọn đầy đủ thuộc tính</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Số lượng</span>
                <div className="flex items-center w-max bg-slate-50 border-2 border-slate-100 rounded-2xl p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-xl font-medium">−</span>
                  </button>
                  <span className="w-14 text-center font-bold text-slate-800 text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(activeVariant?.stock ?? 99, q + 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-xl font-medium">+</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 space-y-4">
              {addedMsg && (
                <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 border border-emerald-100 animate-in fade-in slide-in-from-bottom-2">
                  {addedMsg}
                </div>
              )}

              <Button
                size="lg"
                className="w-full h-14 text-lg font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-1"
                onClick={() => void handleAddToCart()}
                disabled={!product.available || !activeVariant || !activeVariant.inStock}
              >
                {!product.available
                  ? 'Sản phẩm ngừng kinh doanh'
                  : (!activeVariant
                    ? 'Vui lòng chọn phân loại'
                    : (!activeVariant.inStock ? 'Hết hàng' : '🛒 Thêm vào giỏ hàng'))}
              </Button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-10 pt-8 border-t border-slate-100">
                <h3 className="text-lg font-black text-slate-800 mb-4">Chi tiết sản phẩm</h3>
                <div className="prose prose-slate prose-sm sm:prose-base prose-indigo text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
