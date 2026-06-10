import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-xl border border-border bg-surface
            text-text-primary placeholder:text-text-secondary/50
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
            transition-all duration-200
            ${error ? 'border-error focus:ring-error/30 focus:border-error' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
