# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# 🚀 Dự Án Frontend - [Tên Dự Án Của Bạn]

Ứng dụng Frontend được xây dựng bằng **React & TypeScript**, kết nối tới hệ thống **Java Backend API** có sẵn. 

Dự án áp dụng mô hình kiến trúc tối giản **Service - Hook - Component** giúp mã nguồn tường minh, dễ đọc, dễ viết unit test và dễ bảo trì.

---

## 🛠️ Công Nghệ Sử Dụng

*   **Framework/Library:** React (v18+)
*   **Ngôn ngữ:** TypeScript
*   **Build Tool:** Vite (hoặc tương đương)
*   **HTTP Client:** Axios
*   **Quản lý State:** React Hooks (useState, useEffect, useMemo)

---

## 📋 Yêu Cầu Hệ Thống

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:
*   **Node.js**: Phiên bản `>= 18.x` (Khuyến nghị dùng bản LTS mới nhất, ví dụ: `v20.x`)
*   **Trình quản lý gói**: `npm` (đi kèm Node.js) hoặc `yarn` / `pnpm`.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Bước 1: Tải mã nguồn về máy
Mở terminal và chạy lệnh sau để clone dự án:
```bash
git clone https://github.com/username/ten-du-an-fe.git
cd ten-du-an-fe

# permiss
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Nếu dùng npm
npm install


npm run dev
# hoặc yarn dev / pnpm dev