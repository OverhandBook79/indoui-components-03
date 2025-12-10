import React from 'react';
import { cn } from '@/lib/utils';
import { Link as RouterLink } from 'react-router-dom';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  isExternal?: boolean;
  color?: string;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  underline?: 'always' | 'hover' | 'none';
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, isExternal, color, fontWeight = 'normal', underline = 'hover', className, children, ...props }, ref) => {
    const classes = cn(
      'text-primary transition-colors duration-200',
      color && `text-${color}`,
      fontWeight === 'medium' && 'font-medium',
      fontWeight === 'semibold' && 'font-semibold',
      fontWeight === 'bold' && 'font-bold',
      underline === 'always' && 'underline',
      underline === 'hover' && 'hover:underline',
      underline === 'none' && 'no-underline',
      'hover:text-primary/80',
      className
    );

    if (to && !isExternal) {
      return (
        <RouterLink to={to} ref={ref as any} className={classes} {...(props as any)}>
          {children}
        </RouterLink>
      );
    }

    return (
      <a
        ref={ref}
        className={classes}
        {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
        {...props}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = 'Link';
