import React from 'react';
import { cn } from '@/lib/utils';
import { SizeKey, RadiusKey, ColorScheme } from '../../theme/tokens';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  size?: SizeKey;
  colorScheme?: ColorScheme;
  borderRadius?: RadiusKey;
  isIndeterminate?: boolean;
  hasStripe?: boolean;
  isAnimated?: boolean;
  showValue?: boolean;
}

const sizeStyles: Record<SizeKey, string> = {
  xs: 'h-1',
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
  xl: 'h-5',
  '2xl': 'h-6',
};

const getColorStyles = (colorScheme: ColorScheme): string => {
  const colorMap: Record<string, string> = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-green-600',
    warning: 'bg-yellow-500',
    danger: 'bg-destructive',
    blue: 'bg-blue-600',
    red: 'bg-red-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-600',
    pink: 'bg-pink-600',
    cyan: 'bg-cyan-600',
    teal: 'bg-teal-600',
    orange: 'bg-orange-600',
    lime: 'bg-lime-600',
    rose: 'bg-rose-600',
    gray: 'bg-gray-600',
    neutral: 'bg-neutral-600',
  };
  return colorMap[colorScheme] || colorMap.primary;
};

const radiusStyles: Record<RadiusKey, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      size = 'md',
      colorScheme = 'primary',
      borderRadius = 'full',
      isIndeterminate,
      hasStripe,
      isAnimated,
      showValue,
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const trackClasses = cn(
      'w-full bg-muted overflow-hidden relative',
      sizeStyles[size],
      radiusStyles[borderRadius],
      className
    );

    const barClasses = cn(
      'h-full transition-all duration-300 ease-out relative overflow-hidden',
      getColorStyles(colorScheme),
      radiusStyles[borderRadius],
      isIndeterminate && 'w-1/3 animate-[progress-indeterminate_1.5s_ease-in-out_infinite]'
    );

    return (
      <div className="w-full">
        <style>{`
          @keyframes progress-stripe {
            0% { background-position: 1rem 0; }
            100% { background-position: 0 0; }
          }
          @keyframes progress-indeterminate {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(400%); }
          }
        `}</style>
        <div ref={ref} className={trackClasses} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} {...props}>
          <div
            className={barClasses}
            style={{ 
              width: isIndeterminate ? undefined : `${percentage}%`,
            }}
          >
            {hasStripe && (
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: 'linear-gradient(45deg, rgba(128,128,128,0.3) 25%, transparent 25%, transparent 50%, rgba(128,128,128,0.3) 50%, rgba(128,128,128,0.3) 75%, transparent 75%, transparent)',
                  backgroundSize: '1rem 1rem',
                  animation: isAnimated ? 'progress-stripe 0.5s linear infinite' : undefined
                }}
              />
            )}
          </div>
        </div>
        {showValue && !isIndeterminate && (
          <div className="text-sm text-muted-foreground mt-1 text-right">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';
