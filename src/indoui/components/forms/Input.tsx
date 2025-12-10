import React from 'react';
import { cn } from '@/lib/utils';
import { SizeKey, RadiusKey } from '../../theme/tokens';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'outline' | 'filled' | 'flushed';
  size?: SizeKey;
  borderRadius?: RadiusKey;
  isInvalid?: boolean;
  isRequired?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
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

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'outline',
      size = 'md',
      borderRadius = 'md',
      isInvalid,
      isRequired,
      leftElement,
      rightElement,
      fullWidth = true,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasLeftElement = !!leftElement;
    const hasRightElement = !!rightElement;

    const inputClasses = cn(
      'flex transition-colors duration-200 outline-none',
      'placeholder:text-muted-foreground',
      'disabled:cursor-not-allowed disabled:opacity-50',
      sizeStyles[size],
      variant !== 'flushed' && radiusStyles[borderRadius],
      variantStyles[variant],
      isInvalid && 'border-destructive focus:border-destructive focus:ring-destructive',
      fullWidth && 'w-full',
      hasLeftElement && 'pl-10',
      hasRightElement && 'pr-10',
      className
    );

    if (hasLeftElement || hasRightElement) {
      return (
        <div className={cn('relative', fullWidth && 'w-full')}>
          {leftElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            className={inputClasses}
            disabled={disabled}
            required={isRequired}
            aria-invalid={isInvalid}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightElement}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={inputClasses}
        disabled={disabled}
        required={isRequired}
        aria-invalid={isInvalid}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
