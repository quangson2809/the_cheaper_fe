import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const spinnerSize = { sm: 'h-3.5 w-3.5', md: 'h-5 w-5', lg: 'h-8 w-8' };

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 ${spinnerSize[size]} ${className}`}
      role="status"
      aria-label="Đang tải..."
    />
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'success' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const buttonVariant = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm shadow-indigo-900/10',
  outline: 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm shadow-red-900/10',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm shadow-emerald-900/10',
  neutral: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
};

const buttonSize = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50 ${buttonVariant[variant]} ${buttonSize[size]} ${className}`}
    >
      {isLoading && <Spinner size="sm" className="border-white/40 border-t-white" />}
      {children}
    </button>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({ label, error, id, className = '', icon, ...props }: InputProps) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-600">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={id}
          {...props}
          className={`h-10 w-full rounded-lg border bg-white text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 ${icon ? 'pl-10 pr-3.5' : 'px-3.5'} ${error ? 'border-red-400 bg-red-50/40' : 'border-slate-200 hover:border-slate-300'} ${className}`}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'info';
  className?: string;
}

const badgeVariant = {
  primary: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/10',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10',
  error: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10',
  neutral: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/10',
  info: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/10',
};

export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold ${badgeVariant[variant]} ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export function Select({ label, error, id, options, className = '', ...props }: SelectProps) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-xs font-semibold text-slate-600">{label}</label>}
      <select
        id={id}
        {...props}
        className={`h-10 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 ${error ? 'border-red-400 bg-red-50/40' : 'border-slate-200 hover:border-slate-300'} ${className}`}
      >
        <option value="">Tất cả</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="mb-5 flex items-center gap-4">
          <div className="min-w-0 flex-1">
            {title && <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Đóng"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
