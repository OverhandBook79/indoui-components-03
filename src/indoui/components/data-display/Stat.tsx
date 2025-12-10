import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

export interface StatProps {
  children: React.ReactNode;
  className?: string;
}

export const Stat: React.FC<StatProps> = ({ children, className }) => {
  return (
    <div className={cn('flex flex-col', className)}>
      {children}
    </div>
  );
};

export interface StatLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const StatLabel: React.FC<StatLabelProps> = ({ children, className }) => {
  return (
    <dt className={cn('text-sm font-medium text-muted-foreground', className)}>
      {children}
    </dt>
  );
};

export interface StatNumberProps {
  children: React.ReactNode;
  className?: string;
}

export const StatNumber: React.FC<StatNumberProps> = ({ children, className }) => {
  return (
    <dd className={cn('text-2xl font-semibold text-foreground', className)}>
      {children}
    </dd>
  );
};

export interface StatHelpTextProps {
  children: React.ReactNode;
  className?: string;
}

export const StatHelpText: React.FC<StatHelpTextProps> = ({ children, className }) => {
  return (
    <span className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </span>
  );
};

export interface StatArrowProps {
  type: 'increase' | 'decrease';
  className?: string;
}

export const StatArrow: React.FC<StatArrowProps> = ({ type, className }) => {
  const Icon = type === 'increase' ? ArrowUp : ArrowDown;
  const colorClass = type === 'increase' ? 'text-green-500' : 'text-red-500';
  
  return (
    <Icon className={cn('h-4 w-4 inline-block', colorClass, className)} />
  );
};

export interface StatGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const StatGroup: React.FC<StatGroupProps> = ({ children, className }) => {
  return (
    <dl className={cn('flex flex-wrap gap-8', className)}>
      {children}
    </dl>
  );
};
