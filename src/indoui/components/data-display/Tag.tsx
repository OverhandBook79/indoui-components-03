import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { SizeKey, ColorScheme } from '../../theme/tokens';
import { Variant } from '../../theme/variants';

export interface TagProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: SizeKey;
  colorScheme?: ColorScheme;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onClose?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<SizeKey, string> = {
  xs: 'h-5 text-[10px] px-1.5 gap-0.5',
  sm: 'h-6 text-xs px-2 gap-1',
  md: 'h-7 text-sm px-2.5 gap-1',
  lg: 'h-8 text-sm px-3 gap-1.5',
  xl: 'h-9 text-base px-3 gap-1.5',
  '2xl': 'h-10 text-base px-4 gap-2',
};

const radiusClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

const variantClasses: Record<Variant, string> = {
  solid: 'bg-primary text-primary-foreground',
  subtle: 'bg-primary/10 text-primary',
  surface: 'bg-muted text-foreground border border-border',
  outline: 'border border-primary text-primary bg-transparent',
  ghost: 'text-primary bg-transparent hover:bg-primary/10',
  plain: 'text-foreground bg-transparent',
};

export const Tag: React.FC<TagProps> = ({
  children,
  variant = 'subtle',
  size = 'md',
  colorScheme = 'primary',
  borderRadius = 'md',
  onClose,
  leftIcon,
  rightIcon,
  className,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium',
        sizeClasses[size],
        radiusClasses[borderRadius],
        variantClasses[variant],
        className
      )}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity ml-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

export interface TagLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const TagLabel: React.FC<TagLabelProps> = ({ children, className }) => (
  <span className={cn('truncate', className)}>{children}</span>
);

export interface TagCloseButtonProps {
  onClick?: () => void;
  className?: string;
}

export const TagCloseButton: React.FC<TagCloseButtonProps> = ({ onClick, className }) => (
  <button
    onClick={onClick}
    className={cn('flex-shrink-0 hover:opacity-70 transition-opacity ml-0.5', className)}
  >
    <X className="h-3 w-3" />
  </button>
);
