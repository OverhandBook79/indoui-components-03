import React from 'react';
import { cn } from '@/lib/utils';
import { SizeKey, ColorScheme } from '../../theme/tokens';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: SizeKey;
  colorScheme?: ColorScheme;
  label?: string;
  labelPosition?: 'left' | 'right';
  isInvalid?: boolean;
}

const sizeStyles: Record<SizeKey, { track: string; thumb: string; translate: string; label: string }> = {
  xs: { track: 'h-3 w-6', thumb: 'h-2 w-2', translate: 'translate-x-3', label: 'text-xs' },
  sm: { track: 'h-4 w-8', thumb: 'h-3 w-3', translate: 'translate-x-4', label: 'text-sm' },
  md: { track: 'h-5 w-10', thumb: 'h-4 w-4', translate: 'translate-x-5', label: 'text-sm' },
  lg: { track: 'h-6 w-12', thumb: 'h-5 w-5', translate: 'translate-x-6', label: 'text-base' },
  xl: { track: 'h-7 w-14', thumb: 'h-6 w-6', translate: 'translate-x-7', label: 'text-lg' },
  '2xl': { track: 'h-8 w-16', thumb: 'h-7 w-7', translate: 'translate-x-8', label: 'text-xl' },
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

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ size = 'md', colorScheme = 'primary', label, labelPosition = 'right', isInvalid, className, disabled, checked, onChange, defaultChecked, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked ?? checked ?? false);
    const sizeStyle = sizeStyles[size];
    const colorStyle = getColorStyles(colorScheme);

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (checked === undefined) {
        setIsChecked(e.target.checked);
      }
      onChange?.(e);
    };

    const switchElement = (
      <div className="relative inline-flex items-center">
        <input
          ref={ref}
          type="checkbox"
          className="sr-only peer"
          disabled={disabled}
          checked={isChecked}
          onChange={handleChange}
          {...props}
        />
        <div
          className={cn(
            'rounded-full transition-colors duration-200 cursor-pointer',
            sizeStyle.track,
            isChecked ? colorStyle : 'bg-muted',
            isInvalid && 'ring-2 ring-destructive',
            disabled && 'cursor-not-allowed opacity-50',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2'
          )}
        />
        <div
          className={cn(
            'absolute top-0.5 left-0.5 rounded-full shadow-sm transition-transform duration-200',
            sizeStyle.thumb,
            isChecked ? 'bg-primary-foreground' : 'bg-foreground dark:bg-background',
            isChecked && sizeStyle.translate
          )}
        />
      </div>
    );

    if (!label) {
      return <label className={cn('inline-flex', className)}>{switchElement}</label>;
    }

    return (
      <label
        className={cn(
          'inline-flex items-center gap-2 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        {labelPosition === 'left' && <span className={cn(sizeStyle.label, 'text-foreground')}>{label}</span>}
        {switchElement}
        {labelPosition === 'right' && <span className={cn(sizeStyle.label, 'text-foreground')}>{label}</span>}
      </label>
    );
  }
);

Switch.displayName = 'Switch';