import React from 'react';
import { cn } from '@/lib/utils';
import { SizeKey, RadiusKey } from '../../theme/tokens';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'outline' | 'filled' | 'flushed';
  size?: SizeKey;
  borderRadius?: RadiusKey;
  isInvalid?: boolean;
  isRequired?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  fullWidth?: boolean;
}

const sizeStyles: Record<SizeKey, string> = {
  xs: 'px-2 py-1.5 text-xs min-h-[60px]',
  sm: 'px-2.5 py-2 text-sm min-h-[80px]',
  md: 'px-3 py-2.5 text-sm min-h-[100px]',
  lg: 'px-4 py-3 text-base min-h-[120px]',
  xl: 'px-4 py-3.5 text-lg min-h-[140px]',
  '2xl': 'px-5 py-4 text-xl min-h-[160px]',
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
  full: 'rounded-3xl',
};

const resizeStyles = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = 'outline',
      size = 'md',
      borderRadius = 'md',
      isInvalid,
      isRequired,
      resize = 'vertical',
      fullWidth = true,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      'flex transition-colors duration-200 outline-none',
      'placeholder:text-muted-foreground',
      'disabled:cursor-not-allowed disabled:opacity-50',
      sizeStyles[size],
      variant !== 'flushed' && radiusStyles[borderRadius],
      variantStyles[variant],
      resizeStyles[resize],
      isInvalid && 'border-destructive focus:border-destructive focus:ring-destructive',
      fullWidth && 'w-full',
      className
    );

    return (
      <textarea
        ref={ref}
        className={classes}
        disabled={disabled}
        required={isRequired}
        aria-invalid={isInvalid}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
