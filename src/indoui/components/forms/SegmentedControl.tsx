import React from 'react';
import { cn } from '@/lib/utils';

export interface SegmentedControlProps {
  options: { value: string; label: string; icon?: React.ReactNode; disabled?: boolean }[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

const sizeStyles: Record<string, { container: string; item: string }> = {
  sm: { container: 'p-0.5', item: 'px-3 py-1 text-xs' },
  md: { container: 'p-1', item: 'px-4 py-1.5 text-sm' },
  lg: { container: 'p-1', item: 'px-5 py-2 text-base' },
};

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  defaultValue,
  onChange,
  size = 'md',
  fullWidth = false,
  className,
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || options[0]?.value || '');
  const sizeStyle = sizeStyles[size];
  
  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <div
      className={cn(
        'inline-flex bg-muted rounded-lg p-1',
        sizeStyle.container,
        fullWidth && 'w-full',
        className
      )}
      role="tablist"
    >
      {options.map((option) => {
        const isSelected = currentValue === option.value;
        
        return (
          <button
            key={option.value}
            role="tab"
            type="button"
            aria-selected={isSelected}
            disabled={option.disabled}
            onClick={() => handleChange(option.value)}
            className={cn(
              'flex items-center justify-center gap-2 rounded-md font-medium transition-all',
              sizeStyle.item,
              fullWidth && 'flex-1',
              isSelected
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50',
              option.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

SegmentedControl.displayName = 'SegmentedControl';