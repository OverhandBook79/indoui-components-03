// IndoUI Variant System
// Complete variant styles for all components with colorScheme support

import type { ColorScheme } from './tokens';

export type Variant = 'solid' | 'subtle' | 'surface' | 'outline' | 'ghost' | 'plain';

// Generate variant classes for a given color scheme
export function getButtonVariantClasses(variant: Variant, colorScheme: ColorScheme = 'primary'): string {
  const baseClasses = 'transition-colors duration-200';
  
  // Map color schemes to Tailwind-compatible classes
  const colorMap: Record<ColorScheme, { bg: string; text: string; border: string; hover: string }> = {
    primary: { bg: 'bg-primary', text: 'text-primary', border: 'border-primary', hover: 'hover:bg-primary/90' },
    neutral: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted', hover: 'hover:bg-muted/80' },
    gray: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted', hover: 'hover:bg-muted/80' },
    red: { bg: 'bg-destructive', text: 'text-destructive', border: 'border-destructive', hover: 'hover:bg-destructive/90' },
    blue: { bg: 'bg-primary', text: 'text-primary', border: 'border-primary', hover: 'hover:bg-primary/90' },
    green: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-500', hover: 'hover:bg-green-600' },
    yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-500', hover: 'hover:bg-yellow-600' },
    pink: { bg: 'bg-pink-500', text: 'text-pink-600', border: 'border-pink-500', hover: 'hover:bg-pink-600' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-500', hover: 'hover:bg-purple-600' },
    cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600', border: 'border-cyan-500', hover: 'hover:bg-cyan-600' },
    lime: { bg: 'bg-lime-500', text: 'text-lime-600', border: 'border-lime-500', hover: 'hover:bg-lime-600' },
    rose: { bg: 'bg-rose-500', text: 'text-rose-600', border: 'border-rose-500', hover: 'hover:bg-rose-600' },
    brown: { bg: 'bg-amber-700', text: 'text-amber-700', border: 'border-amber-700', hover: 'hover:bg-amber-800' },
    maroon: { bg: 'bg-rose-900', text: 'text-rose-900', border: 'border-rose-900', hover: 'hover:bg-rose-950' },
    coral: { bg: 'bg-orange-400', text: 'text-orange-500', border: 'border-orange-400', hover: 'hover:bg-orange-500' },
    tan: { bg: 'bg-amber-200', text: 'text-amber-700', border: 'border-amber-300', hover: 'hover:bg-amber-300' },
    banana: { bg: 'bg-yellow-300', text: 'text-yellow-700', border: 'border-yellow-400', hover: 'hover:bg-yellow-400' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-500', hover: 'hover:bg-orange-600' },
    teal: { bg: 'bg-teal-500', text: 'text-teal-600', border: 'border-teal-500', hover: 'hover:bg-teal-600' },
    black: { bg: 'bg-gray-900', text: 'text-gray-900', border: 'border-gray-900', hover: 'hover:bg-black' },
    white: { bg: 'bg-white', text: 'text-white', border: 'border-white', hover: 'hover:bg-gray-100' },
    success: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-500', hover: 'hover:bg-green-600' },
    warning: { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-500', hover: 'hover:bg-yellow-600' },
    danger: { bg: 'bg-destructive', text: 'text-destructive', border: 'border-destructive', hover: 'hover:bg-destructive/90' },
    info: { bg: 'bg-primary', text: 'text-primary', border: 'border-primary', hover: 'hover:bg-primary/90' },
  };

  const colors = colorMap[colorScheme] || colorMap.primary;

  const variants: Record<Variant, string> = {
    solid: `${colors.bg} text-primary-foreground ${colors.hover} ${baseClasses}`,
    subtle: `${colors.bg}/10 ${colors.text} hover:${colors.bg}/20 ${baseClasses}`,
    surface: `bg-muted text-foreground hover:bg-muted/80 border border-border ${baseClasses}`,
    outline: `border ${colors.border} ${colors.text} hover:${colors.bg}/10 bg-transparent ${baseClasses}`,
    ghost: `text-foreground hover:bg-accent bg-transparent ${baseClasses}`,
    plain: `text-foreground hover:${colors.text} bg-transparent ${baseClasses}`,
  };

  return variants[variant] || variants.solid;
}

// Static button variants (for backward compatibility)
export const buttonVariants: Record<Variant, string> = {
  solid: 'bg-primary text-primary-foreground hover:bg-primary/90',
  subtle: 'bg-primary/10 text-primary hover:bg-primary/20',
  surface: 'bg-muted text-foreground hover:bg-muted/80 border border-border',
  outline: 'border border-primary text-primary hover:bg-primary/10 bg-transparent',
  ghost: 'text-foreground hover:bg-accent bg-transparent',
  plain: 'text-foreground hover:text-primary bg-transparent',
};

export const inputVariants: Record<'outline' | 'filled' | 'flushed', string> = {
  outline: 'border border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary',
  filled: 'bg-muted border-transparent focus:bg-background focus:border-primary',
  flushed: 'border-b border-input rounded-none bg-transparent focus:border-primary',
};

export const alertVariants: Record<'info' | 'success' | 'warning' | 'error', string> = {
  info: 'bg-primary/10 text-primary border-primary/20',
  success: 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400',
  warning: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400',
  error: 'bg-destructive/10 text-destructive border-destructive/20',
};

export const badgeVariants: Record<Variant, string> = {
  solid: 'bg-primary text-primary-foreground',
  subtle: 'bg-primary/10 text-primary',
  surface: 'bg-muted text-foreground border border-border',
  outline: 'border border-primary text-primary bg-transparent',
  ghost: 'text-foreground bg-transparent',
  plain: 'text-foreground bg-transparent',
};

// Size classes for components
export const sizeClasses = {
  button: {
    xs: 'h-6 px-2 text-xs rounded',
    sm: 'h-8 px-3 text-sm rounded-md',
    md: 'h-10 px-4 text-sm rounded-md',
    lg: 'h-12 px-6 text-base rounded-lg',
    xl: 'h-14 px-8 text-lg rounded-lg',
  },
  input: {
    xs: 'h-6 px-2 text-xs',
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
    xl: 'h-14 px-6 text-lg',
  },
  badge: {
    xs: 'px-1 py-0.5 text-xs',
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-2.5 py-1 text-base',
    xl: 'px-3 py-1.5 text-lg',
  },
};
