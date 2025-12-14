import React from 'react';
import { cn } from '@/lib/utils';

export interface ListProps {
  children: React.ReactNode;
  variant?: 'unordered' | 'ordered' | 'none';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface ListItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const spacingStyles: Record<string, string> = {
  sm: 'space-y-1',
  md: 'space-y-2',
  lg: 'space-y-3',
};

export const List: React.FC<ListProps> = ({
  children,
  variant = 'unordered',
  spacing = 'md',
  className,
}) => {
  const Component = variant === 'ordered' ? 'ol' : 'ul';

  return (
    <Component
      className={cn(
        spacingStyles[spacing],
        variant === 'unordered' && 'list-disc list-inside',
        variant === 'ordered' && 'list-decimal list-inside',
        variant === 'none' && 'list-none',
        className
      )}
    >
      {children}
    </Component>
  );
};

export const ListItem: React.FC<ListItemProps> = ({
  children,
  icon,
  className,
}) => {
  if (icon) {
    return (
      <li className={cn('flex items-start gap-2 list-none', className)}>
        <span className="flex-shrink-0 mt-0.5">{icon}</span>
        <span>{children}</span>
      </li>
    );
  }

  return <li className={className}>{children}</li>;
};

List.displayName = 'List';
ListItem.displayName = 'ListItem';