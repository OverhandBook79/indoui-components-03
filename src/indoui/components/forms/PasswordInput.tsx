import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { SizeKey } from '../../theme/tokens';

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: SizeKey;
  variant?: 'outline' | 'filled' | 'flushed';
  isInvalid?: boolean;
  showStrength?: boolean;
}

const sizeStyles: Record<SizeKey, string> = {
  xs: 'h-6 text-xs px-2',
  sm: 'h-8 text-sm px-2.5',
  md: 'h-10 text-sm px-3',
  lg: 'h-12 text-base px-4',
  xl: 'h-14 text-lg px-5',
  '2xl': 'h-16 text-xl px-6',
};

const variantStyles = {
  outline: 'border border-input bg-background hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20',
  filled: 'border-0 bg-muted hover:bg-muted/80 focus:bg-background focus:ring-2 focus:ring-primary/20',
  flushed: 'border-0 border-b-2 border-input rounded-none bg-transparent hover:border-primary focus:border-primary px-0',
};

const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-yellow-500' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-blue-500' };
  return { score, label: 'Strong', color: 'bg-green-500' };
};

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ size = 'md', variant = 'outline', isInvalid, showStrength, className, disabled, value, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState('');

    const currentValue = (value as string) ?? internalValue;
    const strength = showStrength ? getPasswordStrength(currentValue) : null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    return (
      <div className="w-full">
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={cn(
              'w-full rounded-md transition-all duration-200 outline-none pr-10',
              sizeStyles[size],
              variantStyles[variant],
              isInvalid && 'border-destructive focus:border-destructive focus:ring-destructive/20',
              disabled && 'opacity-50 cursor-not-allowed',
              'text-foreground placeholder:text-muted-foreground',
              className
            )}
            disabled={disabled}
            value={currentValue}
            onChange={handleChange}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        
        {showStrength && currentValue && strength && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors',
                    i <= strength.score ? strength.color : 'bg-muted'
                  )}
                />
              ))}
            </div>
            <p className={cn('text-xs', strength.color.replace('bg-', 'text-'))}>
              {strength.label}
            </p>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';