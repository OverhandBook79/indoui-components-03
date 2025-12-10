import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useColorMode } from '../hooks/useColorMode';
import { Button } from './forms/Button';
import { SizeKey } from '../theme/tokens';

export interface ColorModeSwitchProps {
  size?: SizeKey;
  variant?: 'solid' | 'outline' | 'ghost';
}

export const ColorModeSwitch: React.FC<ColorModeSwitchProps> = ({ size = 'md', variant = 'ghost' }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button
      onClick={toggleColorMode}
      variant={variant}
      size={size}
      aria-label={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}
    >
      {colorMode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};
