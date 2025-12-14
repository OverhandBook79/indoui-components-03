import React from 'react';
import { cn } from '@/lib/utils';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  alignSelf?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: number | string;
  flex?: string;
  inline?: boolean;
  // Chakra-like shorthand
  w?: string;
  h?: string;
  minW?: string;
  maxW?: string;
  minH?: string;
  maxH?: string;
  p?: number | string;
  px?: number | string;
  py?: number | string;
  m?: number | string;
  mx?: number | string;
  my?: number | string;
}

const getSpacing = (prefix: string, value?: string | number): string => {
  if (value === undefined) return '';
  if (typeof value === 'number') return `${prefix}-${value}`;
  return `${prefix}-[${value}]`;
};

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction = 'row', wrap, justify, align, alignSelf, gap, flex, inline, 
     w, h, minW, maxW, minH, maxH, p, px, py, m, mx, my, children, ...props }, ref) => {
    const classes = cn(
      inline ? 'inline-flex' : 'flex',
      direction === 'column' && 'flex-col',
      direction === 'row-reverse' && 'flex-row-reverse',
      direction === 'column-reverse' && 'flex-col-reverse',
      wrap === 'wrap' && 'flex-wrap',
      wrap === 'nowrap' && 'flex-nowrap',
      wrap === 'wrap-reverse' && 'flex-wrap-reverse',
      justify === 'start' && 'justify-start',
      justify === 'end' && 'justify-end',
      justify === 'center' && 'justify-center',
      justify === 'between' && 'justify-between',
      justify === 'around' && 'justify-around',
      justify === 'evenly' && 'justify-evenly',
      align === 'start' && 'items-start',
      align === 'end' && 'items-end',
      align === 'center' && 'items-center',
      align === 'baseline' && 'items-baseline',
      align === 'stretch' && 'items-stretch',
      alignSelf === 'start' && 'self-start',
      alignSelf === 'end' && 'self-end',
      alignSelf === 'center' && 'self-center',
      alignSelf === 'baseline' && 'self-baseline',
      alignSelf === 'stretch' && 'self-stretch',
      gap && (typeof gap === 'number' ? `gap-${gap}` : `gap-[${gap}]`),
      flex && `flex-[${flex}]`,
      w && `w-[${w}]`,
      h && `h-[${h}]`,
      minW && `min-w-[${minW}]`,
      maxW && `max-w-[${maxW}]`,
      minH && `min-h-[${minH}]`,
      maxH && `max-h-[${maxH}]`,
      getSpacing('p', p),
      getSpacing('px', px),
      getSpacing('py', py),
      getSpacing('m', m),
      getSpacing('mx', mx),
      getSpacing('my', my),
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Flex.displayName = 'Flex';

export const HStack = React.forwardRef<HTMLDivElement, Omit<FlexProps, 'direction'>>(
  ({ children, ...props }, ref) => (
    <Flex ref={ref} direction="row" align="center" {...props}>
      {children}
    </Flex>
  )
);

HStack.displayName = 'HStack';

export const VStack = React.forwardRef<HTMLDivElement, Omit<FlexProps, 'direction'>>(
  ({ children, ...props }, ref) => (
    <Flex ref={ref} direction="column" align="center" {...props}>
      {children}
    </Flex>
  )
);

VStack.displayName = 'VStack';
