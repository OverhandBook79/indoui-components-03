import React from 'react';
import { cn } from '@/lib/utils';
import { ColorScheme, SizeKey } from '../../theme/tokens';

export interface CodeProps {
  children: React.ReactNode;
  colorScheme?: ColorScheme;
  size?: SizeKey;
  className?: string;
}

const sizeClasses: Record<SizeKey, string> = {
  xs: 'text-[10px] px-1 py-0.5',
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2 py-1',
  lg: 'text-base px-2 py-1',
  xl: 'text-lg px-2.5 py-1',
  '2xl': 'text-xl px-3 py-1.5',
};

export const Code: React.FC<CodeProps> = ({
  children,
  colorScheme = 'primary',
  size = 'md',
  className,
}) => {
  return (
    <code
      className={cn(
        'font-mono rounded bg-muted text-foreground',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </code>
  );
};

export interface KbdProps {
  children: React.ReactNode;
  size?: SizeKey;
  className?: string;
}

export const Kbd: React.FC<KbdProps> = ({
  children,
  size = 'md',
  className,
}) => {
  return (
    <kbd
      className={cn(
        'font-mono inline-flex items-center justify-center rounded border border-border bg-muted px-1.5 py-0.5 text-muted-foreground shadow-sm',
        size === 'xs' && 'text-[10px] px-1',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        size === 'lg' && 'text-base',
        size === 'xl' && 'text-lg px-2',
        size === '2xl' && 'text-xl px-2.5',
        className
      )}
    >
      {children}
    </kbd>
  );
};
