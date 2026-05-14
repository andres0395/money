import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, label, id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-2">
        {label && (
          <label htmlFor={id} className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] px-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-[var(--text-muted)]/50 ${error ? 'border-[var(--danger)] focus:ring-[var(--danger)]/10' : ''
            } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-[var(--danger)] px-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
