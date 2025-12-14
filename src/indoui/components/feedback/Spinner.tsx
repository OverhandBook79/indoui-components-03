import React from 'react';
import { cn } from '@/lib/utils';
import { SizeKey, ColorScheme } from '../../theme/tokens';

export interface SpinnerProps {
  size?: SizeKey;
  colorScheme?: ColorScheme;
  thickness?: 'thin' | 'normal' | 'thick';
  speed?: 'slow' | 'normal' | 'fast';
  label?: string;
  className?: string;
}

const sizeStyles: Record<SizeKey, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
  '2xl': 'w-12 h-12',
};

const thicknessStyles: Record<string, string> = {
  thin: 'border',
  normal: 'border-2',
  thick: 'border-4',
};

const speedStyles: Record<string, string> = {
  slow: 'animate-[spin_1.5s_linear_infinite]',
  normal: 'animate-spin',
  fast: 'animate-[spin_0.5s_linear_infinite]',
};

const colorStyles: Partial<Record<ColorScheme, string>> = {
  primary: 'border-primary/30 border-t-primary',
  success: 'border-green-600/30 border-t-green-600',
  warning: 'border-yellow-500/30 border-t-yellow-500',
  danger: 'border-destructive/30 border-t-destructive',
  info: 'border-blue-600/30 border-t-blue-600',
  blue: 'border-blue-600/30 border-t-blue-600',
  red: 'border-red-600/30 border-t-red-600',
  green: 'border-green-600/30 border-t-green-600',
  yellow: 'border-yellow-500/30 border-t-yellow-500',
  purple: 'border-purple-600/30 border-t-purple-600',
  pink: 'border-pink-600/30 border-t-pink-600',
  cyan: 'border-cyan-600/30 border-t-cyan-600',
  teal: 'border-teal-600/30 border-t-teal-600',
  orange: 'border-orange-600/30 border-t-orange-600',
  lime: 'border-lime-600/30 border-t-lime-600',
  rose: 'border-rose-600/30 border-t-rose-600',
  gray: 'border-gray-600/30 border-t-gray-600',
  neutral: 'border-neutral-600/30 border-t-neutral-600',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  colorScheme = 'primary',
  thickness = 'normal',
  speed = 'normal',
  label,
  className,
}) => {
  return (
    <div className={cn('inline-flex flex-col items-center gap-2', className)} role="status">
      <div
        className={cn(
          'rounded-full',
          sizeStyles[size],
          thicknessStyles[thickness],
          speedStyles[speed],
          colorStyles[colorScheme] || colorStyles.primary
        )}
      />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      <span className="sr-only">{label || 'Loading...'}</span>
    </div>
  );
};

Spinner.displayName = 'Spinner';