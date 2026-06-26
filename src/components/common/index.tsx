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
          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
            p === currentPage
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
