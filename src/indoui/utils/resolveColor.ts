// IndoUI Color Token Resolver
// Resolves color tokens like "red.500" to actual HSL values from theme

import { colorPalette, type ColorScheme, type ColorShade } from '../theme/tokens';

/**
 * Resolves a color token string (e.g., "red.500", "blue.300") to its HSL value
 * Falls back to the original value if it's not a valid token
 */
export function resolveColor(value: string): string {
  if (typeof value !== 'string') return value;

  // Detect pattern like "red.500"
  if (value.includes('.')) {
    const [colorName, shadeStr] = value.split('.');
    const shade = Number(shadeStr) as ColorShade;

    const palette = colorPalette[colorName as ColorScheme];
    if (palette && palette[shade]) {
      // Return as rgb() for maximum compatibility
      return `rgb(${palette[shade]})`;
    }
  }

  return value; // Return original value as fallback
}

/**
 * Resolves color with theme context (for dynamic theme scenarios)
 */
export function resolveColorWithTheme(theme: { colors: typeof colorPalette }, value: string): string {
  if (typeof value !== 'string') return value;

  if (value.includes('.')) {
    const [colorName, shadeStr] = value.split('.');
    const shade = Number(shadeStr) as ColorShade;

    const palette = theme.colors[colorName as ColorScheme];
    if (palette && palette[shade]) {
      return `rgb(${palette[shade]})`;
    }
  }

  return value;
}

/**
 * Get HSL value directly from color palette
 */
export function getColorValue(colorScheme: ColorScheme, shade: ColorShade = 500): string {
  const palette = colorPalette[colorScheme];
  if (palette && palette[shade]) {
    return `rgb(${palette[shade]})`;
  }
  return '';
}

/**
 * Get color as CSS variable compatible string
 */
export function getColorHSL(colorScheme: ColorScheme, shade: ColorShade = 500): string {
  const palette = colorPalette[colorScheme];
  if (palette && palette[shade]) {
    return palette[shade];
  }
  return '';
}
