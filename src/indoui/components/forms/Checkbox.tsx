import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Minus } from 'lucide-react';
import { SizeKey, ColorScheme } from '../../theme/tokens';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: SizeKey;
  colorScheme?: ColorScheme;
  label?: string;
  isIndeterminate?: boolean;
  isInvalid?: boolean;
}

const sizeStyles: Record<SizeKey, { box: string; icon: string; label: string }> = {
  xs: { box: 'h-3 w-3', icon: 'h-2 w-2', label: 'text-xs' },
  sm: { box: 'h-4 w-4', icon: 'h-2.5 w-2.5', label: 'text-sm' },
  md: { box: 'h-5 w-5', icon: 'h-3 w-3', label: 'text-sm' },
  lg: { box: 'h-6 w-6', icon: 'h-4 w-4', label: 'text-base' },
  xl: { box: 'h-7 w-7', icon: 'h-5 w-5', label: 'text-lg' },
  '2xl': { box: 'h-8 w-8', icon: 'h-6 w-6', label: 'text-xl' },
};

const getColorStyles = (colorScheme: ColorScheme): { bg: string; border: string } => {
  const colorMap: Record<string, { bg: string; border: string }> = {
    primary: { bg: 'bg-primary', border: 'border-primary' },
    secondary: { bg: 'bg-secondary', border: 'border-secondary' },
    success: { bg: 'bg-green-600', border: 'border-green-600' },
    warning: { bg: 'bg-yellow-500', border: 'border-yellow-500' },
    danger: { bg: 'bg-destructive', border: 'border-destructive' },
    blue: { bg: 'bg-blue-600', border: 'border-blue-600' },
    red: { bg: 'bg-red-600', border: 'border-red-600' },
    green: { bg: 'bg-green-600', border: 'border-green-600' },
    yellow: { bg: 'bg-yellow-500', border: 'border-yellow-500' },
    purple: { bg: 'bg-purple-600', border: 'border-purple-600' },
    pink: { bg: 'bg-pink-600', border: 'border-pink-600' },
    cyan: { bg: 'bg-cyan-600', border: 'border-cyan-600' },
    teal: { bg: 'bg-teal-600', border: 'border-teal-600' },
    orange: { bg: 'bg-orange-600', border: 'border-orange-600' },
    lime: { bg: 'bg-lime-600', border: 'border-lime-600' },
    rose: { bg: 'bg-rose-600', border: 'border-rose-600' },
    gray: { bg: 'bg-gray-600', border: 'border-gray-600' },
    neutral: { bg: 'bg-neutral-600', border: 'border-neutral-600' },
  };
  return colorMap[colorScheme] || colorMap.primary;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ size = 'md', colorScheme = 'primary', label, isIndeterminate, isInvalid, className, disabled, checked, onChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked ?? false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = isIndeterminate ?? false;
      }
    }, [isIndeterminate]);

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

    const sizeStyle = sizeStyles[size];
    const colorStyle = getColorStyles(colorScheme);
    const isActive = isChecked || isIndeterminate;

    return (
      <label
        className={cn(
          'inline-flex items-center gap-2 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="checkbox"
            className="sr-only"
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            {...props}
          />
          <div
            className={cn(
              'flex items-center justify-center border-2 rounded transition-all duration-200',
              sizeStyle.box,
              isActive ? cn(colorStyle.bg, colorStyle.border, 'text-primary-foreground') : 'border-input bg-background text-transparent',
              isInvalid && 'border-destructive',
              'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2'
            )}
          >
            {isIndeterminate ? (
              <Minus className={cn(sizeStyle.icon, isActive ? 'text-primary-foreground' : 'text-transparent')} />
            ) : isChecked ? (
              <Check className={cn(sizeStyle.icon, isActive ? 'text-primary-foreground' : 'text-transparent')} />
            ) : null}
          </div>
        </div>
        {label && <span className={cn(sizeStyle.label, 'text-foreground')}>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';