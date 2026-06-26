import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

// Global emitter for non-React files
export const toastEvent = {
  listeners: [] as ((msg: string, type: ToastType) => void)[],
  subscribe(callback: (msg: string, type: ToastType) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  },
  emit(msg: string, type: ToastType) {
    this.listeners.forEach(l => l(msg, type));
  }
};

export const toast = {
  success: (msg: string) => toastEvent.emit(msg, 'success'),
  error: (msg: string) => toastEvent.emit(msg, 'error'),
  info: (msg: string) => toastEvent.emit(msg, 'info'),
  warning: (msg: string) => toastEvent.emit(msg, 'warning'),
};

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 1000);
  }, []);


  // Listen to global emitter
  useEffect(() => {
    return toastEvent.subscribe((msg, type) => showToast(msg, type));
  }, [showToast]);

  const success = (msg: string) => showToast(msg, 'success');
  const error = (msg: string) => showToast(msg, 'error');

  return (
    <ToastContext.Provider value={{ showToast, success, error }}>
      {children}

      {/* Global Toast Container */}
      <div className="toast toast-top toast-end z-[100] p-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`alert ${toast.type === 'success' ? 'alert-success' :
              toast.type === 'error' ? 'alert-error' :
                toast.type === 'warning' ? 'alert-warning' : 'alert-info'
              } shadow-lg border-none animate-in slide-in-from-right duration-300 pointer-events-auto`}
          >
            <div className="flex items-center gap-2 text-white font-medium">
              {toast.type === 'success' && <span>✅</span>}
              {toast.type === 'error' && <span>❌</span>}
              {toast.type === 'warning' && <span>⚠️</span>}
              {toast.type === 'info' && <span>ℹ️</span>}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="btn btn-ghost btn-xs text-white/70 hover:text-white"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
