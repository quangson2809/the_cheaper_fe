import { useNavigate } from 'react-router-dom';

interface PaginationProps {
  currentPage: number;   // 1-based
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Phân trang">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-xl text-sm font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          aria-current={p === currentPage ? 'page' : undefined}
          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${p === currentPage
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-indigo-50'
            }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-xl text-sm font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ›
      </button>
    </nav>
  );
}

// ── EmptyState ────────────────────────────────────────

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon = '📭', action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <span className="text-5xl">{icon}</span>
      <h3 className="text-xl font-bold text-slate-700">{title}</h3>
      {description && <p className="text-slate-500 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}

// ── ErrorBoundary ─────────────────────────────────────

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryState { hasError: boolean; }

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <EmptyState
          title="Đã có lỗi xảy ra"
          description="Vui lòng tải lại trang."
          icon="⚠️"
        />
      );
    }
    return this.props.children;
  }
}

// ── PageHeader ────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackBtn?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, showBackBtn = false, onBack, actions }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        {showBackBtn && (
          <button
            type="button"
            onClick={handleBack}
            className="p-2.5 -ml-2 rounded-full hover:bg-slate-100/80 text-slate-500 hover:text-indigo-600 transition-all active:scale-95 group border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            title="Quay lại trang trước"
            aria-label="Quay lại"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        )}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">{title}</h1>
          {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
}
