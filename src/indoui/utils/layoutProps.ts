// Shared layout props utility for all IndoUI components
import { cn } from '@/lib/utils';

// Responsive value type supporting base, sm, md, lg, xl, 2xl breakpoints
export type ResponsiveValue<T> = T | { base?: T; sm?: T; md?: T; lg?: T; xl?: T; '2xl'?: T };

// Common layout props shared by all components
export interface LayoutProps {
  w?: ResponsiveValue<string | number>;
  h?: ResponsiveValue<string | number>;
  minW?: ResponsiveValue<string | number>;
  maxW?: ResponsiveValue<string | number>;
  minH?: ResponsiveValue<string | number>;
  maxH?: ResponsiveValue<string | number>;
  p?: ResponsiveValue<string | number>;
  px?: ResponsiveValue<string | number>;
  py?: ResponsiveValue<string | number>;
  pt?: ResponsiveValue<string | number>;
  pb?: ResponsiveValue<string | number>;
  pl?: ResponsiveValue<string | number>;
  pr?: ResponsiveValue<string | number>;
  m?: ResponsiveValue<string | number>;
  mx?: ResponsiveValue<string | number>;
  my?: ResponsiveValue<string | number>;
  mt?: ResponsiveValue<string | number>;
  mb?: ResponsiveValue<string | number>;
  ml?: ResponsiveValue<string | number>;
  mr?: ResponsiveValue<string | number>;
  display?: ResponsiveValue<'none' | 'block' | 'flex' | 'grid' | 'inline' | 'inline-block' | 'inline-flex'>;
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  overflow?: 'hidden' | 'auto' | 'scroll' | 'visible';
  // Flex props
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  alignSelf?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  justifySelf?: 'start' | 'end' | 'center' | 'stretch';
  flexDir?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  flex?: string | number;
  flexGrow?: number;
  flexShrink?: number;
  gap?: ResponsiveValue<number | string>;
  // Placement
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

// Breakpoint prefixes for responsive values
const breakpointPrefixes: Record<string, string> = {
  base: '',
  sm: 'sm:',
  md: 'md:',
  lg: 'lg:',
  xl: 'xl:',
  '2xl': '2xl:',
};

// Helper to parse size values (handles 'full', numbers, percentages, px values)
const parseSize = (value: string | number | undefined): string => {
  if (value === undefined) return '';
  if (typeof value === 'number') return `${value}`;
  if (value === 'full') return 'full';
  if (value.endsWith('%') || value.endsWith('px') || value.endsWith('rem') || value.endsWith('vh') || value.endsWith('vw')) {
    return `[${value}]`;
  }
  return value;
};

// Helper to get spacing class
const getSpacingClass = (prefix: string, value: string | number | undefined, breakpoint: string = ''): string => {
  if (value === undefined) return '';
  const bp = breakpoint ? `${breakpoint}:` : '';
  if (typeof value === 'number') return `${bp}${prefix}-${value}`;
  if (value === 'auto') return `${bp}${prefix}-auto`;
  return `${bp}${prefix}-[${value}]`;
};

// Helper to process responsive values
const processResponsive = <T>(
  prop: ResponsiveValue<T> | undefined,
  processor: (value: T, breakpoint: string) => string
): string[] => {
  if (prop === undefined) return [];
  
  if (typeof prop === 'object' && prop !== null && !Array.isArray(prop)) {
    const classes: string[] = [];
    const responsiveObj = prop as { base?: T; sm?: T; md?: T; lg?: T; xl?: T; '2xl'?: T };
    
    Object.entries(breakpointPrefixes).forEach(([key, prefix]) => {
      const value = responsiveObj[key as keyof typeof responsiveObj];
      if (value !== undefined) {
        const cls = processor(value, key === 'base' ? '' : key);
        if (cls) classes.push(cls);
      }
    });
    return classes;
  }
  
  return [processor(prop as T, '')];
};

// Main function to generate layout classes
export const getLayoutClasses = (props: LayoutProps): string => {
  const classes: string[] = [];
  
  // Width
  if (props.w !== undefined) {
    classes.push(...processResponsive(props.w, (v, bp) => {
      const size = parseSize(v);
      const prefix = bp ? `${bp}:` : '';
      if (size === 'full') return `${prefix}w-full`;
      if (typeof v === 'number') return `${prefix}w-${v}`;
      return `${prefix}w-${size}`;
    }));
  }
  
  // Height
  if (props.h !== undefined) {
    classes.push(...processResponsive(props.h, (v, bp) => {
      const size = parseSize(v);
      const prefix = bp ? `${bp}:` : '';
      if (size === 'full') return `${prefix}h-full`;
      if (typeof v === 'number') return `${prefix}h-${v}`;
      return `${prefix}h-${size}`;
    }));
  }
  
  // Min/Max dimensions
  if (props.minW !== undefined) {
    classes.push(...processResponsive(props.minW, (v, bp) => {
      const prefix = bp ? `${bp}:` : '';
      if (typeof v === 'number') return `${prefix}min-w-${v}`;
      return `${prefix}min-w-[${v}]`;
    }));
  }
  
  if (props.maxW !== undefined) {
    classes.push(...processResponsive(props.maxW, (v, bp) => {
      const prefix = bp ? `${bp}:` : '';
      if (typeof v === 'number') return `${prefix}max-w-${v}`;
      return `${prefix}max-w-[${v}]`;
    }));
  }
  
  if (props.minH !== undefined) {
    classes.push(...processResponsive(props.minH, (v, bp) => {
      const prefix = bp ? `${bp}:` : '';
      if (typeof v === 'number') return `${prefix}min-h-${v}`;
      return `${prefix}min-h-[${v}]`;
    }));
  }
  
  if (props.maxH !== undefined) {
    classes.push(...processResponsive(props.maxH, (v, bp) => {
      const prefix = bp ? `${bp}:` : '';
      if (typeof v === 'number') return `${prefix}max-h-${v}`;
      return `${prefix}max-h-[${v}]`;
    }));
  }
  
  // Padding
  ['p', 'px', 'py', 'pt', 'pb', 'pl', 'pr'].forEach((prop) => {
    const value = props[prop as keyof LayoutProps];
    if (value !== undefined) {
      classes.push(...processResponsive(value as ResponsiveValue<string | number>, (v, bp) => 
        getSpacingClass(prop, v, bp)
      ));
    }
  });
  
  // Margin
  ['m', 'mx', 'my', 'mt', 'mb', 'ml', 'mr'].forEach((prop) => {
    const value = props[prop as keyof LayoutProps];
    if (value !== undefined) {
      classes.push(...processResponsive(value as ResponsiveValue<string | number>, (v, bp) => 
        getSpacingClass(prop, v, bp)
      ));
    }
  });
  
  // Display
  if (props.display !== undefined) {
    classes.push(...processResponsive(props.display, (v, bp) => {
      const prefix = bp ? `${bp}:` : '';
      return `${prefix}${v}`;
    }));
  }
  
  // Position
  if (props.position) classes.push(props.position);
  
  // Overflow
  if (props.overflow) classes.push(`overflow-${props.overflow}`);
  
  // Flex justify
  const justifyMap: Record<string, string> = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };
  if (props.justify) classes.push(justifyMap[props.justify]);
  
  // Flex align
  const alignMap: Record<string, string> = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch',
  };
  if (props.align) classes.push(alignMap[props.align]);
  
  // Align self
  const alignSelfMap: Record<string, string> = {
    start: 'self-start',
    end: 'self-end',
    center: 'self-center',
    baseline: 'self-baseline',
    stretch: 'self-stretch',
  };
  if (props.alignSelf) classes.push(alignSelfMap[props.alignSelf]);
  
  // Justify self
  const justifySelfMap: Record<string, string> = {
    start: 'justify-self-start',
    end: 'justify-self-end',
    center: 'justify-self-center',
    stretch: 'justify-self-stretch',
  };
  if (props.justifySelf) classes.push(justifySelfMap[props.justifySelf]);
  
  // Flex direction
  const flexDirMap: Record<string, string> = {
    row: 'flex-row',
    column: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'column-reverse': 'flex-col-reverse',
  };
  if (props.flexDir) classes.push(flexDirMap[props.flexDir]);
  
  // Flex wrap
  const flexWrapMap: Record<string, string> = {
    wrap: 'flex-wrap',
    nowrap: 'flex-nowrap',
    'wrap-reverse': 'flex-wrap-reverse',
  };
  if (props.flexWrap) classes.push(flexWrapMap[props.flexWrap]);
  
  // Flex
  if (props.flex !== undefined) {
    classes.push(`flex-[${props.flex}]`);
  }
  
  // Flex grow/shrink
  if (props.flexGrow !== undefined) classes.push(`grow-[${props.flexGrow}]`);
  if (props.flexShrink !== undefined) classes.push(`shrink-[${props.flexShrink}]`);
  
  // Gap
  if (props.gap !== undefined) {
    classes.push(...processResponsive(props.gap, (v, bp) => {
      const prefix = bp ? `${bp}:` : '';
      if (typeof v === 'number') return `${prefix}gap-${v}`;
      return `${prefix}gap-[${v}]`;
    }));
  }
  
  return cn(...classes.filter(Boolean));
};

// Extract layout props from component props
export const extractLayoutProps = <T extends LayoutProps>(props: T): [LayoutProps, Omit<T, keyof LayoutProps>] => {
  const {
    w, h, minW, maxW, minH, maxH,
    p, px, py, pt, pb, pl, pr,
    m, mx, my, mt, mb, ml, mr,
    display, position, overflow,
    justify, align, alignSelf, justifySelf,
    flexDir, flexWrap, flex, flexGrow, flexShrink, gap,
    placement,
    ...rest
  } = props;
  
  const layoutProps: LayoutProps = {
    w, h, minW, maxW, minH, maxH,
    p, px, py, pt, pb, pl, pr,
    m, mx, my, mt, mb, ml, mr,
    display, position, overflow,
    justify, align, alignSelf, justifySelf,
    flexDir, flexWrap, flex, flexGrow, flexShrink, gap,
    placement,
  };
  
  return [layoutProps, rest as Omit<T, keyof LayoutProps>];
};
