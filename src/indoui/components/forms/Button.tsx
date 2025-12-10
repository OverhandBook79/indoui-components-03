import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { Variant } from '../../theme/variants';
import { SizeKey, RadiusKey, ColorScheme } from '../../theme/tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: SizeKey;
  colorScheme?: ColorScheme;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  borderRadius?: RadiusKey;
  fullWidth?: boolean;
  iconSpacing?: number;
}

const sizeStyles: Record<SizeKey, string> = {
  xs: 'h-7 px-2 text-xs gap-1',
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-base gap-2',
  xl: 'h-12 px-6 text-lg gap-2.5',
  '2xl': 'h-14 px-8 text-xl gap-3',
};

const getColorClasses = (colorScheme: ColorScheme, variant: Variant): string => {
  const colorMap: Record<string, { solid: string; subtle: string; surface: string; outline: string; ghost: string; plain: string }> = {
    primary: {
      solid: 'bg-primary text-primary-foreground hover:bg-primary/90',
      subtle: 'bg-primary/10 text-primary hover:bg-primary/20',
      surface: 'bg-muted text-foreground border border-border hover:bg-accent',
      outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary/10',
      ghost: 'text-primary hover:bg-primary/10',
      plain: 'text-primary hover:text-primary/80',
    },
    secondary: {
      solid: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      subtle: 'bg-secondary/50 text-secondary-foreground hover:bg-secondary/70',
      surface: 'bg-muted text-foreground border border-border hover:bg-accent',
      outline: 'border-2 border-secondary text-secondary-foreground bg-transparent hover:bg-secondary/10',
      ghost: 'text-secondary-foreground hover:bg-secondary/50',
      plain: 'text-secondary-foreground hover:text-muted-foreground',
    },
    success: {
      solid: 'bg-green-600 text-white hover:bg-green-700',
      subtle: 'bg-green-500/10 text-green-600 hover:bg-green-500/20',
      surface: 'bg-muted text-green-600 border border-green-200 hover:bg-green-50 dark:hover:bg-green-950',
      outline: 'border-2 border-green-600 text-green-600 bg-transparent hover:bg-green-500/10',
      ghost: 'text-green-600 hover:bg-green-500/10',
      plain: 'text-green-600 hover:text-green-700',
    },
    warning: {
      solid: 'bg-yellow-500 text-white hover:bg-yellow-600',
      subtle: 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20',
      surface: 'bg-muted text-yellow-600 border border-yellow-200 hover:bg-yellow-50 dark:hover:bg-yellow-950',
      outline: 'border-2 border-yellow-500 text-yellow-600 bg-transparent hover:bg-yellow-500/10',
      ghost: 'text-yellow-600 hover:bg-yellow-500/10',
      plain: 'text-yellow-600 hover:text-yellow-700',
    },
    danger: {
      solid: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      subtle: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
      surface: 'bg-muted text-destructive border border-destructive/20 hover:bg-destructive/10',
      outline: 'border-2 border-destructive text-destructive bg-transparent hover:bg-destructive/10',
      ghost: 'text-destructive hover:bg-destructive/10',
      plain: 'text-destructive hover:text-destructive/80',
    },
    blue: {
      solid: 'bg-blue-600 text-white hover:bg-blue-700',
      subtle: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20',
      surface: 'bg-muted text-blue-600 border border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950',
      outline: 'border-2 border-blue-600 text-blue-600 bg-transparent hover:bg-blue-500/10',
      ghost: 'text-blue-600 hover:bg-blue-500/10',
      plain: 'text-blue-600 hover:text-blue-700',
    },
    red: {
      solid: 'bg-red-600 text-white hover:bg-red-700',
      subtle: 'bg-red-500/10 text-red-600 hover:bg-red-500/20',
      surface: 'bg-muted text-red-600 border border-red-200 hover:bg-red-50 dark:hover:bg-red-950',
      outline: 'border-2 border-red-600 text-red-600 bg-transparent hover:bg-red-500/10',
      ghost: 'text-red-600 hover:bg-red-500/10',
      plain: 'text-red-600 hover:text-red-700',
    },
    green: {
      solid: 'bg-green-600 text-white hover:bg-green-700',
      subtle: 'bg-green-500/10 text-green-600 hover:bg-green-500/20',
      surface: 'bg-muted text-green-600 border border-green-200 hover:bg-green-50 dark:hover:bg-green-950',
      outline: 'border-2 border-green-600 text-green-600 bg-transparent hover:bg-green-500/10',
      ghost: 'text-green-600 hover:bg-green-500/10',
      plain: 'text-green-600 hover:text-green-700',
    },
    purple: {
      solid: 'bg-purple-600 text-white hover:bg-purple-700',
      subtle: 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20',
      surface: 'bg-muted text-purple-600 border border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950',
      outline: 'border-2 border-purple-600 text-purple-600 bg-transparent hover:bg-purple-500/10',
      ghost: 'text-purple-600 hover:bg-purple-500/10',
      plain: 'text-purple-600 hover:text-purple-700',
    },
    orange: {
      solid: 'bg-orange-600 text-white hover:bg-orange-700',
      subtle: 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20',
      surface: 'bg-muted text-orange-600 border border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950',
      outline: 'border-2 border-orange-600 text-orange-600 bg-transparent hover:bg-orange-500/10',
      ghost: 'text-orange-600 hover:bg-orange-500/10',
      plain: 'text-orange-600 hover:text-orange-700',
    },
    pink: {
      solid: 'bg-pink-600 text-white hover:bg-pink-700',
      subtle: 'bg-pink-500/10 text-pink-600 hover:bg-pink-500/20',
      surface: 'bg-muted text-pink-600 border border-pink-200 hover:bg-pink-50 dark:hover:bg-pink-950',
      outline: 'border-2 border-pink-600 text-pink-600 bg-transparent hover:bg-pink-500/10',
      ghost: 'text-pink-600 hover:bg-pink-500/10',
      plain: 'text-pink-600 hover:text-pink-700',
    },
    cyan: {
      solid: 'bg-cyan-600 text-white hover:bg-cyan-700',
      subtle: 'bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20',
      surface: 'bg-muted text-cyan-600 border border-cyan-200 hover:bg-cyan-50 dark:hover:bg-cyan-950',
      outline: 'border-2 border-cyan-600 text-cyan-600 bg-transparent hover:bg-cyan-500/10',
      ghost: 'text-cyan-600 hover:bg-cyan-500/10',
      plain: 'text-cyan-600 hover:text-cyan-700',
    },
    teal: {
      solid: 'bg-teal-600 text-white hover:bg-teal-700',
      subtle: 'bg-teal-500/10 text-teal-600 hover:bg-teal-500/20',
      surface: 'bg-muted text-teal-600 border border-teal-200 hover:bg-teal-50 dark:hover:bg-teal-950',
      outline: 'border-2 border-teal-600 text-teal-600 bg-transparent hover:bg-teal-500/10',
      ghost: 'text-teal-600 hover:bg-teal-500/10',
      plain: 'text-teal-600 hover:text-teal-700',
    },
    yellow: {
      solid: 'bg-yellow-500 text-white hover:bg-yellow-600',
      subtle: 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20',
      surface: 'bg-muted text-yellow-600 border border-yellow-200 hover:bg-yellow-50 dark:hover:bg-yellow-950',
      outline: 'border-2 border-yellow-500 text-yellow-600 bg-transparent hover:bg-yellow-500/10',
      ghost: 'text-yellow-600 hover:bg-yellow-500/10',
      plain: 'text-yellow-600 hover:text-yellow-700',
    },
    lime: {
      solid: 'bg-lime-600 text-white hover:bg-lime-700',
      subtle: 'bg-lime-500/10 text-lime-600 hover:bg-lime-500/20',
      surface: 'bg-muted text-lime-600 border border-lime-200 hover:bg-lime-50 dark:hover:bg-lime-950',
      outline: 'border-2 border-lime-600 text-lime-600 bg-transparent hover:bg-lime-500/10',
      ghost: 'text-lime-600 hover:bg-lime-500/10',
      plain: 'text-lime-600 hover:text-lime-700',
    },
    rose: {
      solid: 'bg-rose-600 text-white hover:bg-rose-700',
      subtle: 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20',
      surface: 'bg-muted text-rose-600 border border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950',
      outline: 'border-2 border-rose-600 text-rose-600 bg-transparent hover:bg-rose-500/10',
      ghost: 'text-rose-600 hover:bg-rose-500/10',
      plain: 'text-rose-600 hover:text-rose-700',
    },
    gray: {
      solid: 'bg-gray-600 text-white hover:bg-gray-700',
      subtle: 'bg-gray-500/10 text-gray-600 hover:bg-gray-500/20',
      surface: 'bg-muted text-gray-600 border border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-950',
      outline: 'border-2 border-gray-600 text-gray-600 bg-transparent hover:bg-gray-500/10',
      ghost: 'text-gray-600 hover:bg-gray-500/10',
      plain: 'text-gray-600 hover:text-gray-700',
    },
    neutral: {
      solid: 'bg-neutral-600 text-white hover:bg-neutral-700',
      subtle: 'bg-neutral-500/10 text-neutral-600 hover:bg-neutral-500/20',
      surface: 'bg-muted text-neutral-600 border border-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-950',
      outline: 'border-2 border-neutral-600 text-neutral-600 bg-transparent hover:bg-neutral-500/10',
      ghost: 'text-neutral-600 hover:bg-neutral-500/10',
      plain: 'text-neutral-600 hover:text-neutral-700',
    },
  };

  return colorMap[colorScheme]?.[variant] || colorMap.primary[variant];
};

const radiusStyles: Record<RadiusKey, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'solid',
      size = 'md',
      colorScheme = 'primary',
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      borderRadius = 'md',
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const classes = cn(
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      sizeStyles[size],
      getColorClasses(colorScheme, variant),
      radiusStyles[borderRadius],
      fullWidth && 'w-full',
      className
    );

    return (
      <button ref={ref} className={classes} disabled={isDisabled} {...props}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!loading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
        {loading && loadingText ? loadingText : children}
        {!loading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
