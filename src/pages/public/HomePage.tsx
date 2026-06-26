import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/product/useProducts';
import { ProductGrid } from '@/components/product';
import { Spinner } from '@/components/ui';

const HOME_PRODUCT_FILTERS = { limit: 8, sortBy: 'price' as const };

export default function HomePage() {
  const filters = useMemo(() => HOME_PRODUCT_FILTERS, []);
  const { products, isLoading } = useProducts(filters);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 text-white px-8 py-20 text-center shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white,transparent)]" />
        <h1 className="relative text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
          Mua sắm thông minh,<br />
          <span className="text-yellow-300">tiết kiệm thật sự.</span>
        </h1>
        <p className="relative text-indigo-100 text-lg max-w-xl mx-auto mb-8">
          Khám phá hàng nghìn sản phẩm chất lượng với mức giá tốt nhất.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl"
        >
          Khám phá ngay →
        </Link>
      </section>

      {/* Featured products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-slate-800">🔥 Sản phẩm nổi bật</h2>
          <Link to="/products" className="text-sm font-semibold text-indigo-600 hover:underline">
            Xem tất cả →
          </Link>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>

      {/* Value props */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: '🚀', title: 'Giao hàng nhanh', desc: 'Giao trong ngày cho đơn hàng nội thành' },
          { icon: '🔒', title: 'Thanh toán an toàn', desc: 'Nhiều phương thức thanh toán bảo mật' },
          { icon: '↩️', title: 'Đổi trả dễ dàng', desc: 'Hỗ trợ đổi trả trong vòng 7 ngày' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
            <span className="text-4xl block mb-3">{icon}</span>
            <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
            <p className="text-sm text-slate-500">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
