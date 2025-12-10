import React from 'react';
import { cn } from '@/lib/utils';
import { SizeKey } from '../../theme/tokens';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: SizeKey;
  colorScheme?: 'primary' | 'success' | 'warning' | 'danger';
  label?: string;
  isInvalid?: boolean;
}

const sizeStyles: Record<SizeKey, { box: string; dot: string; label: string }> = {
  xs: { box: 'h-3 w-3', dot: 'h-1.5 w-1.5', label: 'text-xs' },
  sm: { box: 'h-4 w-4', dot: 'h-2 w-2', label: 'text-sm' },
  md: { box: 'h-5 w-5', dot: 'h-2.5 w-2.5', label: 'text-sm' },
  lg: { box: 'h-6 w-6', dot: 'h-3 w-3', label: 'text-base' },
  xl: { box: 'h-7 w-7', dot: 'h-3.5 w-3.5', label: 'text-lg' },
  '2xl': { box: 'h-8 w-8', dot: 'h-4 w-4', label: 'text-xl' },
};

const colorStyles: Record<string, string> = {
  primary: 'data-[state=checked]:border-primary',
  success: 'data-[state=checked]:border-green-600',
  warning: 'data-[state=checked]:border-yellow-500',
  danger: 'data-[state=checked]:border-destructive',
};

const dotColorStyles: Record<string, string> = {
  primary: 'bg-primary',
  success: 'bg-green-600',
  warning: 'bg-yellow-500',
  danger: 'bg-destructive',
};

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ size = 'md', colorScheme = 'primary', label, isInvalid, className, disabled, checked, ...props }, ref) => {
    const sizeStyle = sizeStyles[size];

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
            ref={ref}
            type="radio"
            className="sr-only peer"
            checked={checked}
            disabled={disabled}
            {...props}
          />
          <div
            data-state={checked ? 'checked' : 'unchecked'}
            className={cn(
              'flex items-center justify-center border-2 rounded-full transition-all duration-200',
              sizeStyle.box,
              colorStyles[colorScheme],
              !checked && 'border-input bg-background',
              isInvalid && 'border-destructive',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2'
            )}
          >
            {checked && (
              <div className={cn('rounded-full', sizeStyle.dot, dotColorStyles[colorScheme])} />
            )}
          </div>
        </div>
        {label && <span className={sizeStyle.label}>{label}</span>}
      </label>
    );
  }
);

Radio.displayName = 'Radio';

export interface RadioGroupProps {
  children: React.ReactNode;
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  children,
  name,
  value,
  defaultValue,
  onChange,
  direction = 'vertical',
  spacing = 3,
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = value !== undefined ? value : internalValue;

  return (
    <div
      className={cn(
        'flex',
        direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        `gap-${spacing}`
      )}
      role="radiogroup"
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement<RadioProps>(child)) {
          return React.cloneElement(child, {
            name,
            checked: child.props.value === currentValue,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setInternalValue(e.target.value);
              onChange?.(e.target.value);
              child.props.onChange?.(e);
            },
          });
        }
        return child;
      })}
    </div>
  );
};
