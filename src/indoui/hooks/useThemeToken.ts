// IndoUI useThemeToken Hook
// Access theme tokens directly in components

import { 
  theme, 
  colorPalette, 
  sizes, 
  spacing, 
  radii, 
  fontSizes,
  shadows,
  type ColorScheme,
  type ColorShade,
  type SizeKey,
  type SpacingKey,
  type RadiusKey,
  type FontSizeKey,
  type ShadowKey,
} from '../theme/tokens';
import { resolveColor } from '../utils/resolveColor';

/**
 * Hook to access IndoUI theme tokens
 */
export function useThemeToken() {
  /**
   * Get a color value from the palette
   * @example getColor('red', 500) => 'rgb(239 68 68)'
   */
  const getColor = (colorScheme: ColorScheme, shade: ColorShade = 500): string => {
    const palette = colorPalette[colorScheme];
    if (palette && palette[shade]) {
      return `rgb(${palette[shade]})`;
    }
    return '';
  };

  /**
   * Resolve a color token string
   * @example resolveToken('red.500') => 'rgb(239 68 68)'
   */
  const resolveToken = (token: string): string => {
    return resolveColor(token);
  };

  /**
   * Get a size token value
   * @example getSize('md') => '1rem'
   */
  const getSize = (size: SizeKey): string => {
    return sizes[size] || size;
  };

  /**
   * Get a spacing token value
   * @example getSpacing(4) => '1rem'
   */
  const getSpacing = (space: SpacingKey): string => {
    return spacing[space] || String(space);
  };

  /**
   * Get a border radius token value
   * @example getRadius('lg') => '0.5rem'
   */
  const getRadius = (radius: RadiusKey): string => {
    return radii[radius] || radius;
  };

  /**
   * Get a font size token value
   * @example getFontSize('xl') => '1.25rem'
   */
  const getFontSize = (size: FontSizeKey): string => {
    return fontSizes[size] || size;
  };

  /**
   * Get a shadow token value
   * @example getShadow('md') => '0 4px 6px...'
   */
  const getShadow = (shadow: ShadowKey): string => {
    return shadows[shadow] || shadow;
  };

  return {
    theme,
    getColor,
    resolveToken,
    getSize,
    getSpacing,
    getRadius,
    getFontSize,
    getShadow,
    // Direct access to token objects
    colors: colorPalette,
    sizes,
    spacing,
    radii,
    fontSizes,
    shadows,
  };
}
