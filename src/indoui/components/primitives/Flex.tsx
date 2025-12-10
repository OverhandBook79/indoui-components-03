import React from 'react';
import { cn } from '@/lib/utils';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: number | string;
  flex?: string;
  inline?: boolean;
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction = 'row', wrap, justify, align, gap, flex, inline, children, ...props }, ref) => {
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
      gap && (typeof gap === 'number' ? `gap-${gap}` : `gap-[${gap}]`),
      flex && `flex-[${flex}]`,
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
