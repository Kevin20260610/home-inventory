import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, options, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-xl border border-border bg-surface
            text-text-primary
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
            transition-all duration-200 cursor-pointer
            ${error ? 'border-error focus:ring-error/30 focus:border-error' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
