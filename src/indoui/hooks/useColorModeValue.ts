// IndoUI useColorModeValue Hook
// Returns different values based on current color mode
// Supports color token resolution (e.g., "red.500", "blue.300")

import { useColorMode } from './useColorMode';
import { resolveColor } from '../utils/resolveColor';

/**
 * Returns a value based on the current color mode
 * Automatically resolves color tokens like "red.500" to their actual values
 * 
 * @example
 * // Simple usage
 * const bg = useColorModeValue('white', 'gray.900');
 * 
 * // With color tokens
 * const color = useColorModeValue('blue.500', 'blue.300');
 * 
 * // With any values
 * const padding = useColorModeValue(4, 6);
 */
export function useColorModeValue<T>(lightValue: T, darkValue: T): T {
  const { colorMode } = useColorMode();
  
  const rawValue = colorMode === 'dark' ? darkValue : lightValue;

  // If the value is a string, try to resolve it as a color token
  if (typeof rawValue === 'string') {
    const resolved = resolveColor(rawValue);
    return resolved as T;
  }

  return rawValue;
}

/**
 * Hook that returns raw values without color resolution
 * Useful when you don't want automatic color token resolution
 */
export function useColorModeValueRaw<T>(lightValue: T, darkValue: T): T {
  const { colorMode } = useColorMode();
  return colorMode === 'dark' ? darkValue : lightValue;
}
