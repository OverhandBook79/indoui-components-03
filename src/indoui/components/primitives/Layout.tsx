import React from 'react';
import { cn } from '@/lib/utils';

// ScrollArea - scrollable container
export interface ScrollAreaProps {
  children: React.ReactNode;
  maxHeight?: string | number;
  maxWidth?: string | number;
  className?: string;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  maxHeight,
  maxWidth,
  className,
}) => (
  <div
    className={cn(
      'overflow-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent',
      className
    )}
    style={{
      maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
      maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    }}
  >
    {children}
  </div>
);

// Float - floating element positioning
export interface FloatProps {
  children: React.ReactNode;
  placement?: 'left' | 'right';
  className?: string;
}

export const Float: React.FC<FloatProps> = ({ children, placement = 'right', className }) => (
  <div
    className={cn(
      placement === 'left' ? 'float-left mr-4 mb-2' : 'float-right ml-4 mb-2',
      className
    )}
  >
    {children}
  </div>
);

// Center - center content
export interface CenterProps {
  children: React.ReactNode;
  className?: string;
}

export const Center: React.FC<CenterProps> = ({ children, className }) => (
  <div className={cn('flex items-center justify-center', className)}>
    {children}
  </div>
);

// Bleed - break out of container
export interface BleedProps {
  children: React.ReactNode;
  className?: string;
}

export const Bleed: React.FC<BleedProps> = ({ children, className }) => (
  <div className={cn('-mx-4 md:-mx-8 lg:-mx-12', className)}>
    {children}
  </div>
);

// Wrap - flex wrap container
export interface WrapProps {
  children: React.ReactNode;
  spacing?: number;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  align?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
}

const justifyMap: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};

const alignMap: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

export const Wrap: React.FC<WrapProps> = ({
  children,
  spacing = 4,
  justify = 'start',
  align = 'start',
  className,
}) => (
  <div
    className={cn(
      'flex flex-wrap',
      justifyMap[justify],
      alignMap[align],
      className
    )}
    style={{ gap: `${spacing * 0.25}rem` }}
  >
    {children}
  </div>
);

ScrollArea.displayName = 'ScrollArea';
Float.displayName = 'Float';
Center.displayName = 'Center';
Bleed.displayName = 'Bleed';
Wrap.displayName = 'Wrap';