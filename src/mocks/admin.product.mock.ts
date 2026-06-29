import type { AdminProductOverviewResponse, AdminProductResponse } from "@/types/admin.types"

export const mockProducts: AdminProductOverviewResponse[] = [
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

// ── Mock data ─────────────────────────────────────────
export const mockProductDetail: AdminProductResponse = {
    id: 1,
    name: 'Áo Sơ Mi Nam Cổ Trụ Phối Nút Vạt Bầu',
    description:
        'Áo sơ mi nam chất liệu cotton cao cấp, thấm hút mồ hôi tốt. Kiểu dáng thời trang, phom ôm vừa phải (regular fit), dễ dàng phối đồ đi làm hoặc dạo phố.',
    brand: { id: 1, name: 'Zara', status: 1 },
    category: { id: 1, name: 'Áo Sơ Mi', status: 1 },
    material: { id: 1, name: 'Cotton 100%', status: 1 },
    salePrice: 250000,
    comparePrice: 350000,
    status: 'ACTIVE',
    images: [
        { id: 1, name: 'img1.jpg', alt: 'Mặt trước áo' },
        { id: 2, name: 'img2.jpg', alt: 'Mặt sau áo' },
    ],
    variants: [
        {
            id: 1, sku: 'SM-Z-01-M', stock: 50, countSold: 10, overrideSalePrice: null,
            optionValues: [{ id: 1, attributeName: 'Màu sắc', value: 'Trắng' }, { id: 2, attributeName: 'Kích cỡ', value: 'M' }],
        },
        {
            id: 2, sku: 'SM-Z-01-L', stock: 30, countSold: 20, overrideSalePrice: null,
            optionValues: [{ id: 1, attributeName: 'Màu sắc', value: 'Trắng' }, { id: 3, attributeName: 'Kích cỡ', value: 'L' }],
        },
        {
            id: 3, sku: 'SM-Z-02-M', stock: 70, countSold: 15, overrideSalePrice: null,
            optionValues: [{ id: 4, attributeName: 'Màu sắc', value: 'Đen' }, { id: 2, attributeName: 'Kích cỡ', value: 'M' }],
        },
    ],
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2023-12-10T15:00:00Z',
};
