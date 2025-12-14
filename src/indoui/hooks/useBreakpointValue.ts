// IndoUI useBreakpointValue Hook
// Returns values based on current viewport breakpoint

import { useState, useEffect } from 'react';
import { breakpoints } from '../theme/tokens';

type BreakpointKey = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type ResponsiveValue<T> = {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};

/**
 * Returns the current breakpoint key based on window width
 */
function getBreakpoint(width: number): BreakpointKey {
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'base';
}

/**
 * Hook that returns a value based on the current viewport breakpoint
 * 
 * @example
 * const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
 * const padding = useBreakpointValue({ base: 2, sm: 4, lg: 8 });
 */
export function useBreakpointValue<T>(values: ResponsiveValue<T>): T | undefined {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointKey>(() => {
    if (typeof window !== 'undefined') {
      return getBreakpoint(window.innerWidth);
    }
    return 'base';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const newBreakpoint = getBreakpoint(window.innerWidth);
      setCurrentBreakpoint(newBreakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Find the value for current breakpoint, falling back to smaller breakpoints
  const breakpointOrder: BreakpointKey[] = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);

  for (let i = currentIndex; i >= 0; i--) {
    const key = breakpointOrder[i];
    if (values[key] !== undefined) {
      return values[key];
    }
  }

  return undefined;
}

/**
 * Hook that returns the current breakpoint key
 */
export function useBreakpoint(): BreakpointKey {
  const [breakpoint, setBreakpoint] = useState<BreakpointKey>(() => {
    if (typeof window !== 'undefined') {
      return getBreakpoint(window.innerWidth);
    }
    return 'base';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

/**
 * Check if the current breakpoint is at least the specified size
 */
export function useBreakpointUp(breakpoint: Exclude<BreakpointKey, 'base'>): boolean {
  const current = useBreakpoint();
  const order: BreakpointKey[] = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];
  return order.indexOf(current) >= order.indexOf(breakpoint);
}

/**
 * Check if the current breakpoint is at most the specified size
 */
export function useBreakpointDown(breakpoint: BreakpointKey): boolean {
  const current = useBreakpoint();
  const order: BreakpointKey[] = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];
  return order.indexOf(current) <= order.indexOf(breakpoint);
}
