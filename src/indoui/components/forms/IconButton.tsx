import React from 'react';
import { cn } from '@/lib/utils';
import { SizeKey, ColorScheme } from '../../theme/tokens';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size?: SizeKey;
  variant?: 'solid' | 'subtle' | 'outline' | 'ghost';
  colorScheme?: ColorScheme;
  isRound?: boolean;
  isLoading?: boolean;
  'aria-label': string;
}

const sizeStyles: Record<SizeKey, string> = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-14 w-14',
  '2xl': 'h-16 w-16',
};

const iconSizeStyles: Record<SizeKey, string> = {
  xs: '[&>svg]:w-3 [&>svg]:h-3',
  sm: '[&>svg]:w-4 [&>svg]:h-4',
  md: '[&>svg]:w-5 [&>svg]:h-5',
  lg: '[&>svg]:w-6 [&>svg]:h-6',
  xl: '[&>svg]:w-7 [&>svg]:h-7',
  '2xl': '[&>svg]:w-8 [&>svg]:h-8',
};

const getVariantStyles = (variant: string, colorScheme: ColorScheme): string => {
  const baseColors: Record<string, { solid: string; subtle: string; outline: string; ghost: string }> = {
    primary: {
      solid: 'bg-primary text-primary-foreground hover:bg-primary/90',
      subtle: 'bg-primary/10 text-primary hover:bg-primary/20',
      outline: 'border border-primary text-primary hover:bg-primary/10',
      ghost: 'text-primary hover:bg-primary/10',
    },
    blue: {
      solid: 'bg-blue-600 text-white hover:bg-blue-700',
      subtle: 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
      outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20',
      ghost: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20',
    },
    red: {
      solid: 'bg-red-600 text-white hover:bg-red-700',
      subtle: 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400',
      outline: 'border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20',
      ghost: 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20',
    },
    green: {
      solid: 'bg-green-600 text-white hover:bg-green-700',
      subtle: 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400',
      outline: 'border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20',
      ghost: 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20',
    },
  };

  const colors = baseColors[colorScheme] || baseColors.primary;
  return colors[variant as keyof typeof colors] || colors.solid;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', variant = 'solid', colorScheme = 'primary', isRound = false, isLoading = false, disabled, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          sizeStyles[size],
          iconSizeStyles[size],
          getVariantStyles(variant, colorScheme),
          isRound ? 'rounded-full' : 'rounded-md',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          icon
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';