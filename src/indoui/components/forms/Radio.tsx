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
  primary: 'border-primary',
  success: 'border-green-600',
  warning: 'border-yellow-500',
  danger: 'border-destructive',
};

const dotColorStyles: Record<string, string> = {
  primary: 'bg-primary',
  success: 'bg-green-600',
  warning: 'bg-yellow-500',
  danger: 'bg-destructive',
};

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ size = 'md', colorScheme = 'primary', label, isInvalid, className, disabled, checked, onChange, ...props }, ref) => {
    const sizeStyle = sizeStyles[size];

    const handleClick = () => {
      if (disabled) return;
      // Trigger onChange with a synthetic event
      if (onChange) {
        const syntheticEvent = {
          target: { value: props.value, checked: true },
          currentTarget: { value: props.value, checked: true },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <label
        className={cn(
          'inline-flex items-center gap-2 cursor-pointer select-none',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        onClick={handleClick}
      >
        <div className="relative">
          <input
            ref={ref}
            type="radio"
            className="sr-only"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            {...props}
          />
          <div
            className={cn(
              'flex items-center justify-center border-2 rounded-full transition-all duration-200',
              sizeStyle.box,
              checked ? colorStyles[colorScheme] : 'border-input bg-background',
              isInvalid && 'border-destructive',
              !disabled && 'hover:border-primary/70'
            )}
          >
            {checked && (
              <div className={cn('rounded-full transition-transform scale-100', sizeStyle.dot, dotColorStyles[colorScheme])} />
            )}
          </div>
        </div>
        {label && <span className={cn(sizeStyle.label, 'text-foreground')}>{label}</span>}
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
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div
      className={cn(
        'flex',
        direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        spacing === 1 && 'gap-1',
        spacing === 2 && 'gap-2',
        spacing === 3 && 'gap-3',
        spacing === 4 && 'gap-4',
        spacing === 5 && 'gap-5',
        spacing === 6 && 'gap-6',
      )}
      role="radiogroup"
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement<RadioProps>(child)) {
          const childValue = child.props.value as string;
          return React.cloneElement(child, {
            name,
            checked: childValue === currentValue,
            onChange: () => handleChange(childValue),
          });
        }
        return child;
      })}
    </div>
  );
};
