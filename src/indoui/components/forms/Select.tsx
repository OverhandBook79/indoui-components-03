import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { SizeKey, RadiusKey } from '../../theme/tokens';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: 'outline' | 'filled' | 'flushed';
  size?: SizeKey;
  borderRadius?: RadiusKey;
  isInvalid?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  fullWidth?: boolean;
}

const sizeStyles: Record<SizeKey, string> = {
  xs: 'h-7 px-2 text-xs',
  sm: 'h-8 px-2.5 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-11 px-4 text-base',
  xl: 'h-12 px-4 text-lg',
  '2xl': 'h-14 px-5 text-xl',
};

const variantStyles = {
  outline: 'border border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary',
  filled: 'bg-muted border-transparent focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary',
  flushed: 'border-b border-input rounded-none px-0 bg-transparent focus:border-primary',
};

const radiusStyles: Record<RadiusKey, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      variant = 'outline',
      size = 'md',
      borderRadius = 'md',
      isInvalid,
      placeholder,
      options = [],
      fullWidth = true,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      'flex appearance-none cursor-pointer transition-colors duration-200 outline-none pr-10',
      'disabled:cursor-not-allowed disabled:opacity-50',
      sizeStyles[size],
      variant !== 'flushed' && radiusStyles[borderRadius],
      variantStyles[variant],
      isInvalid && 'border-destructive focus:border-destructive focus:ring-destructive',
      fullWidth && 'w-full',
      className
    );

    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        <select ref={ref} className={classes} disabled={disabled} aria-invalid={isInvalid} {...props}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
    );
  }
);

Select.displayName = 'Select';
