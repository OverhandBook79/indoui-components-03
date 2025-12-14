import React from 'react';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useColorMode } from '@/indoui/hooks/useColorMode';

// ColorModeButton - compact button to toggle
export interface ColorModeButtonProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost';
  className?: string;
}

const sizeStyles: Record<string, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const iconSizes: Record<string, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const ColorModeButton: React.FC<ColorModeButtonProps> = ({
  size = 'md',
  variant = 'ghost',
  className,
}) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const variantStyles = {
    solid: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent',
    ghost: 'hover:bg-accent',
  };

  return (
    <button
      onClick={toggleColorMode}
      className={cn(
        'inline-flex items-center justify-center rounded-md transition-colors',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      aria-label={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}
    >
      {colorMode === 'dark' ? (
        <Sun className={iconSizes[size]} />
      ) : (
        <Moon className={iconSizes[size]} />
      )}
    </button>
  );
};

// LightMode - only renders in light mode
export interface LightModeProps {
  children: React.ReactNode;
}

export const LightMode: React.FC<LightModeProps> = ({ children }) => {
  const { colorMode } = useColorMode();
  if (colorMode !== 'light') return null;
  return <>{children}</>;
};

// DarkMode - only renders in dark mode
export interface DarkModeProps {
  children: React.ReactNode;
}

export const DarkMode: React.FC<DarkModeProps> = ({ children }) => {
  const { colorMode } = useColorMode();
  if (colorMode !== 'dark') return null;
  return <>{children}</>;
};

// Re-export hooks for convenience
export { useColorMode } from '@/indoui/hooks/useColorMode';
export { useColorModeValue, useColorModeValueRaw } from '@/indoui/hooks/useColorModeValue';

ColorModeButton.displayName = 'ColorModeButton';
LightMode.displayName = 'LightMode';
DarkMode.displayName = 'DarkMode';