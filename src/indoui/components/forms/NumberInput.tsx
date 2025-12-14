import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';
import { SizeKey } from '../../theme/tokens';

export interface NumberInputProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  onChange?: (value: number) => void;
  size?: SizeKey;
  disabled?: boolean;
  isInvalid?: boolean;
  allowMouseWheel?: boolean;
  clampValueOnBlur?: boolean;
  showStepper?: boolean;
  className?: string;
}

const sizeClasses: Record<SizeKey, { input: string; button: string }> = {
  xs: { input: 'h-7 text-xs px-2', button: 'h-7 w-7 text-xs' },
  sm: { input: 'h-8 text-sm px-2.5', button: 'h-8 w-8 text-sm' },
  md: { input: 'h-10 text-sm px-3', button: 'h-10 w-10 text-sm' },
  lg: { input: 'h-11 text-base px-3.5', button: 'h-11 w-11 text-base' },
  xl: { input: 'h-12 text-lg px-4', button: 'h-12 w-12 text-lg' },
  '2xl': { input: 'h-14 text-xl px-5', button: 'h-14 w-14 text-xl' },
};

export const NumberInput: React.FC<NumberInputProps> = ({
  value: controlledValue,
  defaultValue = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
  precision = 0,
  onChange,
  size = 'md',
  disabled = false,
  isInvalid = false,
  allowMouseWheel = true,
  clampValueOnBlur = true,
  showStepper = true,
  className,
}) => {
  const [value, setValue] = useState(controlledValue ?? defaultValue);
  const [inputValue, setInputValue] = useState(value.toFixed(precision));

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
      setInputValue(controlledValue.toFixed(precision));
    }
  }, [controlledValue, precision]);

  const clamp = (num: number) => Math.max(min, Math.min(max, num));

  const updateValue = (newValue: number) => {
    const clamped = clamp(newValue);
    setValue(clamped);
    setInputValue(clamped.toFixed(precision));
    onChange?.(clamped);
  };

  const handleIncrement = () => {
    if (!disabled) {
      updateValue(value + step);
    }
  };

  const handleDecrement = () => {
    if (!disabled) {
      updateValue(value - step);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const parsed = parseFloat(inputValue);
    if (isNaN(parsed)) {
      setInputValue(value.toFixed(precision));
    } else {
      updateValue(clampValueOnBlur ? clamp(parsed) : parsed);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!allowMouseWheel || disabled) return;
    e.preventDefault();
    if (e.deltaY < 0) {
      handleIncrement();
    } else {
      handleDecrement();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement();
    }
  };

  const sizes = sizeClasses[size];
  const isAtMin = value <= min;
  const isAtMax = value >= max;

  return (
    <div className={cn('flex', className)}>
      {showStepper && (
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || isAtMin}
          className={cn(
            'flex items-center justify-center border border-r-0 border-input rounded-l-md',
            'bg-muted hover:bg-muted/80 transition-colors',
            sizes.button,
            (disabled || isAtMin) && 'opacity-50 cursor-not-allowed hover:bg-muted'
          )}
        >
          <Minus className="h-4 w-4" />
        </button>
      )}
      
      <input
        type="text"
        inputMode="decimal"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          'text-center border border-input bg-background',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:z-10',
          sizes.input,
          !showStepper && 'rounded-md',
          isInvalid && 'border-destructive',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
      
      {showStepper && (
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || isAtMax}
          className={cn(
            'flex items-center justify-center border border-l-0 border-input rounded-r-md',
            'bg-muted hover:bg-muted/80 transition-colors',
            sizes.button,
            (disabled || isAtMax) && 'opacity-50 cursor-not-allowed hover:bg-muted'
          )}
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
