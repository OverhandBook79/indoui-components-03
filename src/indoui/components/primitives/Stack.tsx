import React from 'react';
import { cn } from '@/lib/utils';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: number | string;
  gap?: number | string;
  direction?: 'horizontal' | 'vertical';
  align?: 'start' | 'end' | 'center' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around';
  wrap?: boolean;
  divider?: React.ReactNode;
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, spacing = 4, gap, direction = 'vertical', align, justify, wrap, divider, children, ...props }, ref) => {
    const isVertical = direction === 'vertical';
    const gapValue = gap ?? spacing;
    
    const classes = cn(
      'flex',
      isVertical ? 'flex-col' : 'flex-row',
      typeof gapValue === 'number' ? `gap-${gapValue}` : `gap-[${gapValue}]`,
      align === 'start' && 'items-start',
      align === 'end' && 'items-end',
      align === 'center' && 'items-center',
      align === 'stretch' && 'items-stretch',
      justify === 'start' && 'justify-start',
      justify === 'end' && 'justify-end',
      justify === 'center' && 'justify-center',
      justify === 'between' && 'justify-between',
      justify === 'around' && 'justify-around',
      wrap && 'flex-wrap',
      className
    );

    const childArray = React.Children.toArray(children).filter(Boolean);

    return (
      <div ref={ref} className={classes} {...props}>
        {divider
          ? childArray.map((child, index) => (
              <React.Fragment key={index}>
                {child}
                {index < childArray.length - 1 && divider}
              </React.Fragment>
            ))
          : children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';
