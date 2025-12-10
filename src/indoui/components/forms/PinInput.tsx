import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SizeKey } from '../../theme/tokens';

export interface PinInputProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  size?: SizeKey;
  mask?: boolean;
  placeholder?: string;
  disabled?: boolean;
  isInvalid?: boolean;
  type?: 'alphanumeric' | 'number';
  className?: string;
}

const sizeClasses: Record<SizeKey, string> = {
  xs: 'h-8 w-8 text-sm',
  sm: 'h-9 w-9 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-14 w-14 text-xl',
  '2xl': 'h-16 w-16 text-2xl',
};

export const PinInput: React.FC<PinInputProps> = ({
  length = 4,
  value: controlledValue,
  defaultValue = '',
  onChange,
  onComplete,
  size = 'md',
  mask = false,
  placeholder = '○',
  disabled = false,
  isInvalid = false,
  type = 'number',
  className,
}) => {
  const [values, setValues] = useState<string[]>(
    (controlledValue || defaultValue).split('').concat(Array(length).fill('')).slice(0, length)
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValues(controlledValue.split('').concat(Array(length).fill('')).slice(0, length));
    }
  }, [controlledValue, length]);

  const focusInput = (index: number) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleChange = (index: number, inputValue: string) => {
    if (disabled) return;

    // Validate input based on type
    if (type === 'number' && !/^\d*$/.test(inputValue)) return;

    const newValues = [...values];
    const char = inputValue.slice(-1); // Take only the last character
    newValues[index] = char;
    setValues(newValues);

    const combined = newValues.join('');
    onChange?.(combined);

    // Auto-focus next input
    if (char && index < length - 1) {
      focusInput(index + 1);
    }

    // Check if complete
    if (newValues.every(v => v) && newValues.length === length) {
      onComplete?.(combined);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Backspace':
        if (!values[index] && index > 0) {
          focusInput(index - 1);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        focusInput(index - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        focusInput(index + 1);
        break;
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    
    if (type === 'number' && !/^\d*$/.test(pastedData)) return;

    const newValues = pastedData.split('').concat(Array(length).fill('')).slice(0, length);
    setValues(newValues);
    
    const combined = newValues.join('');
    onChange?.(combined);

    // Focus the next empty input or last input
    const nextEmptyIndex = newValues.findIndex(v => !v);
    focusInput(nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex);

    if (newValues.every(v => v)) {
      onComplete?.(combined);
    }
  };

  return (
    <div className={cn('flex gap-2', className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type={mask ? 'password' : 'text'}
          inputMode={type === 'number' ? 'numeric' : 'text'}
          value={values[index]}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={cn(
            'text-center rounded-md border bg-background',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary',
            'transition-all',
            sizeClasses[size],
            isInvalid ? 'border-destructive' : 'border-input',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          maxLength={1}
        />
      ))}
    </div>
  );
};
