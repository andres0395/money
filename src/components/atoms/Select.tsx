import type { SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, label, id, options, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-2">
        {label && (
          <label htmlFor={id} className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] px-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${error ? 'border-[var(--danger)] focus:ring-[var(--danger)]/10' : ''
            } ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-[var(--bg-surface)]">
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-[var(--danger)] px-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
