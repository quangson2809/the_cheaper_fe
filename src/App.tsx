import { AuthProvider } from '@/store/AuthContext';
import { CartProvider } from '@/store/CartContext';
import { ToastProvider } from '@/store/ToastContext';
import { AppRouter } from '@/routes/AppRouter';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
