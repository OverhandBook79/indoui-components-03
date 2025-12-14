import React from 'react';
import { cn } from '@/lib/utils';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  size?: HeadingSize;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: string;
  noOfLines?: number;
}

const sizeMap: Record<HeadingSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
};

const weightMap = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Component = 'h2', size = '2xl', fontWeight = 'bold', color, noOfLines, className, style, children, ...props }, ref) => {
    const classes = cn(
      sizeMap[size],
      weightMap[fontWeight],
      'tracking-tight',
      color && `text-${color}`,
      noOfLines === 1 && 'truncate',
      noOfLines && noOfLines > 1 && 'line-clamp-' + noOfLines,
      className
    );

    return (
      <Component ref={ref} className={classes} style={style} {...props}>
        {children}
      </Component>
    );
  }
);

Heading.displayName = 'Heading';
