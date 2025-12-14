import React from 'react';
import { cn } from '@/lib/utils';
import { SizeKey } from '../../theme/tokens';

export interface TableProps {
  children: React.ReactNode;
  variant?: 'simple' | 'striped' | 'unstyled';
  size?: SizeKey;
  className?: string;
}

const sizeClasses: Record<SizeKey, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
  '2xl': 'text-xl',
};

export const Table: React.FC<TableProps> = ({
  children,
  variant = 'simple',
  size = 'md',
  className,
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn(
          'w-full border-collapse',
          sizeClasses[size],
          className
        )}
      >
        {children}
      </table>
    </div>
  );
};

export interface TableContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const TableContainer: React.FC<TableContainerProps> = ({ children, className }) => (
  <div className={cn('overflow-x-auto rounded-lg border border-border', className)}>
    {children}
  </div>
);

export interface TheadProps {
  children: React.ReactNode;
  className?: string;
}

export const Thead: React.FC<TheadProps> = ({ children, className }) => (
  <thead className={cn('bg-muted/50', className)}>{children}</thead>
);

export interface TbodyProps {
  children: React.ReactNode;
  className?: string;
}

export const Tbody: React.FC<TbodyProps> = ({ children, className }) => (
  <tbody className={cn('divide-y divide-border', className)}>{children}</tbody>
);

export interface TfootProps {
  children: React.ReactNode;
  className?: string;
}

export const Tfoot: React.FC<TfootProps> = ({ children, className }) => (
  <tfoot className={cn('bg-muted/30 font-medium', className)}>{children}</tfoot>
);

export interface TrProps {
  children: React.ReactNode;
  className?: string;
}

export const Tr: React.FC<TrProps> = ({ children, className }) => (
  <tr className={cn('hover:bg-muted/30 transition-colors', className)}>{children}</tr>
);

export interface ThProps {
  children: React.ReactNode;
  isNumeric?: boolean;
  className?: string;
}

export const Th: React.FC<ThProps> = ({ children, isNumeric, className }) => (
  <th
    className={cn(
      'px-4 py-3 text-left font-semibold text-muted-foreground',
      isNumeric && 'text-right',
      className
    )}
  >
    {children}
  </th>
);

export interface TdProps {
  children: React.ReactNode;
  isNumeric?: boolean;
  className?: string;
}

export const Td: React.FC<TdProps> = ({ children, isNumeric, className }) => (
  <td
    className={cn(
      'px-4 py-3',
      isNumeric && 'text-right',
      className
    )}
  >
    {children}
  </td>
);

export interface TableCaptionProps {
  children: React.ReactNode;
  placement?: 'top' | 'bottom';
  className?: string;
}

export const TableCaption: React.FC<TableCaptionProps> = ({
  children,
  placement = 'bottom',
  className,
}) => (
  <caption
    className={cn(
      'text-sm text-muted-foreground py-2',
      placement === 'top' && 'caption-top',
      className
    )}
  >
    {children}
  </caption>
);
