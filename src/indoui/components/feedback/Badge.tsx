import React from 'react';
import { cn } from '@/lib/utils';
import { Variant } from '../../theme/variants';
import { SizeKey, RadiusKey, ColorScheme } from '../../theme/tokens';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: SizeKey;
  colorScheme?: ColorScheme;
  borderRadius?: RadiusKey;
}

const sizeStyles: Record<SizeKey, string> = {
  xs: 'px-1 py-0.5 text-[10px]',
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
  xl: 'px-3 py-1 text-sm',
  '2xl': 'px-4 py-1.5 text-base',
};

const radiusStyles: Record<RadiusKey, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

const getColorClasses = (colorScheme: ColorScheme, variant: Variant): string => {
  const colorMap: Record<string, { solid: string; subtle: string; surface: string; outline: string; ghost: string; plain: string }> = {
    primary: {
      solid: 'bg-primary text-primary-foreground',
      subtle: 'bg-primary/10 text-primary',
      surface: 'bg-background text-primary border border-primary/30',
      outline: 'border border-primary text-primary',
      ghost: 'text-primary',
      plain: 'text-primary',
    },
    secondary: {
      solid: 'bg-secondary text-secondary-foreground',
      subtle: 'bg-secondary/50 text-secondary-foreground',
      surface: 'bg-background text-secondary-foreground border border-border',
      outline: 'border border-secondary text-secondary-foreground',
      ghost: 'text-secondary-foreground',
      plain: 'text-secondary-foreground',
    },
    success: {
      solid: 'bg-green-600 text-white',
      subtle: 'bg-green-500/10 text-green-600',
      surface: 'bg-background text-green-600 border border-green-200',
      outline: 'border border-green-600 text-green-600',
      ghost: 'text-green-600',
      plain: 'text-green-600',
    },
    warning: {
      solid: 'bg-yellow-500 text-white',
      subtle: 'bg-yellow-500/10 text-yellow-600',
      surface: 'bg-background text-yellow-600 border border-yellow-200',
      outline: 'border border-yellow-500 text-yellow-600',
      ghost: 'text-yellow-600',
      plain: 'text-yellow-600',
    },
    danger: {
      solid: 'bg-destructive text-destructive-foreground',
      subtle: 'bg-destructive/10 text-destructive',
      surface: 'bg-background text-destructive border border-destructive/30',
      outline: 'border border-destructive text-destructive',
      ghost: 'text-destructive',
      plain: 'text-destructive',
    },
    neutral: {
      solid: 'bg-muted-foreground text-background',
      subtle: 'bg-muted text-muted-foreground',
      surface: 'bg-background text-muted-foreground border border-border',
      outline: 'border border-muted-foreground text-muted-foreground',
      ghost: 'text-muted-foreground',
      plain: 'text-muted-foreground',
    },
    blue: {
      solid: 'bg-blue-600 text-white',
      subtle: 'bg-blue-500/10 text-blue-600',
      surface: 'bg-background text-blue-600 border border-blue-200',
      outline: 'border border-blue-600 text-blue-600',
      ghost: 'text-blue-600',
      plain: 'text-blue-600',
    },
    red: {
      solid: 'bg-red-600 text-white',
      subtle: 'bg-red-500/10 text-red-600',
      surface: 'bg-background text-red-600 border border-red-200',
      outline: 'border border-red-600 text-red-600',
      ghost: 'text-red-600',
      plain: 'text-red-600',
    },
    green: {
      solid: 'bg-green-600 text-white',
      subtle: 'bg-green-500/10 text-green-600',
      surface: 'bg-background text-green-600 border border-green-200',
      outline: 'border border-green-600 text-green-600',
      ghost: 'text-green-600',
      plain: 'text-green-600',
    },
    yellow: {
      solid: 'bg-yellow-500 text-white',
      subtle: 'bg-yellow-500/10 text-yellow-600',
      surface: 'bg-background text-yellow-600 border border-yellow-200',
      outline: 'border border-yellow-500 text-yellow-600',
      ghost: 'text-yellow-600',
      plain: 'text-yellow-600',
    },
    purple: {
      solid: 'bg-purple-600 text-white',
      subtle: 'bg-purple-500/10 text-purple-600',
      surface: 'bg-background text-purple-600 border border-purple-200',
      outline: 'border border-purple-600 text-purple-600',
      ghost: 'text-purple-600',
      plain: 'text-purple-600',
    },
    orange: {
      solid: 'bg-orange-600 text-white',
      subtle: 'bg-orange-500/10 text-orange-600',
      surface: 'bg-background text-orange-600 border border-orange-200',
      outline: 'border border-orange-600 text-orange-600',
      ghost: 'text-orange-600',
      plain: 'text-orange-600',
    },
    pink: {
      solid: 'bg-pink-600 text-white',
      subtle: 'bg-pink-500/10 text-pink-600',
      surface: 'bg-background text-pink-600 border border-pink-200',
      outline: 'border border-pink-600 text-pink-600',
      ghost: 'text-pink-600',
      plain: 'text-pink-600',
    },
    cyan: {
      solid: 'bg-cyan-600 text-white',
      subtle: 'bg-cyan-500/10 text-cyan-600',
      surface: 'bg-background text-cyan-600 border border-cyan-200',
      outline: 'border border-cyan-600 text-cyan-600',
      ghost: 'text-cyan-600',
      plain: 'text-cyan-600',
    },
    teal: {
      solid: 'bg-teal-600 text-white',
      subtle: 'bg-teal-500/10 text-teal-600',
      surface: 'bg-background text-teal-600 border border-teal-200',
      outline: 'border border-teal-600 text-teal-600',
      ghost: 'text-teal-600',
      plain: 'text-teal-600',
    },
    lime: {
      solid: 'bg-lime-600 text-white',
      subtle: 'bg-lime-500/10 text-lime-600',
      surface: 'bg-background text-lime-600 border border-lime-200',
      outline: 'border border-lime-600 text-lime-600',
      ghost: 'text-lime-600',
      plain: 'text-lime-600',
    },
    rose: {
      solid: 'bg-rose-600 text-white',
      subtle: 'bg-rose-500/10 text-rose-600',
      surface: 'bg-background text-rose-600 border border-rose-200',
      outline: 'border border-rose-600 text-rose-600',
      ghost: 'text-rose-600',
      plain: 'text-rose-600',
    },
    gray: {
      solid: 'bg-gray-600 text-white',
      subtle: 'bg-gray-500/10 text-gray-600',
      surface: 'bg-background text-gray-600 border border-gray-200',
      outline: 'border border-gray-600 text-gray-600',
      ghost: 'text-gray-600',
      plain: 'text-gray-600',
    },
  };

  return colorMap[colorScheme]?.[variant] || colorMap.primary[variant];
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'subtle', size = 'md', colorScheme = 'primary', borderRadius = 'md', className, children, ...props }, ref) => {
    const classes = cn(
      'inline-flex items-center font-medium',
      sizeStyles[size],
      getColorClasses(colorScheme, variant),
      radiusStyles[borderRadius],
      className
    );

    return (
      <span ref={ref} className={classes} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
