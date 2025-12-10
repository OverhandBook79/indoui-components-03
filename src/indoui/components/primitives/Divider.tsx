import React from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  thickness?: string;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', variant = 'solid', thickness = '1px', ...props }, ref) => {
    const isHorizontal = orientation === 'horizontal';
    
    const classes = cn(
      'bg-border',
      isHorizontal ? 'w-full' : 'h-full',
      variant === 'dashed' && 'border-dashed',
      variant === 'dotted' && 'border-dotted',
      className
    );

    const style = {
      [isHorizontal ? 'height' : 'width']: thickness,
      ...(variant !== 'solid' && {
        background: 'none',
        borderWidth: thickness,
        borderColor: 'hsl(var(--border))',
        borderStyle: variant,
        [isHorizontal ? 'borderTopWidth' : 'borderLeftWidth']: thickness,
      }),
    };

    return <div ref={ref} className={classes} style={style} {...props} />;
  }
);

Divider.displayName = 'Divider';

export const Spacer = () => <div className="flex-1" />;
