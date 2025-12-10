import React from 'react';
import { cn } from '@/lib/utils';

type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div' | 'label';
  size?: TextSize;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: string;
  noOfLines?: number;
  align?: 'left' | 'center' | 'right' | 'justify';
  decoration?: 'underline' | 'line-through' | 'none';
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case';
}

const sizeMap: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

const weightMap = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const alignMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ 
    as: Component = 'p', 
    size = 'md', 
    fontWeight = 'normal', 
    color, 
    noOfLines, 
    align,
    decoration,
    transform,
    className, 
    children, 
    ...props 
  }, ref) => {
    const classes = cn(
      sizeMap[size],
      weightMap[fontWeight],
      color && `text-${color}`,
      align && alignMap[align],
      decoration === 'underline' && 'underline',
      decoration === 'line-through' && 'line-through',
      decoration === 'none' && 'no-underline',
      transform,
      noOfLines === 1 && 'truncate',
      noOfLines && noOfLines > 1 && `line-clamp-${noOfLines}`,
      className
    );

    return (
      <Component ref={ref as any} className={classes} {...props}>
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text';
