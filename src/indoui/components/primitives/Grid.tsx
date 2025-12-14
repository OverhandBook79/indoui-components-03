import React from 'react';
import { cn } from '@/lib/utils';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number | string;
  rows?: number | string;
  gap?: number | string;
  columnGap?: number | string;
  rowGap?: number | string;
  templateColumns?: string;
  templateRows?: string;
  autoFlow?: 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense';
  alignItems?: 'start' | 'end' | 'center' | 'stretch';
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ 
    className, 
    columns, 
    rows, 
    gap, 
    columnGap, 
    rowGap, 
    templateColumns, 
    templateRows, 
    autoFlow,
    alignItems,
    justifyItems,
    children, 
    style,
    ...props 
  }, ref) => {
    const classes = cn(
      'grid',
      typeof columns === 'number' && `grid-cols-${columns}`,
      typeof rows === 'number' && `grid-rows-${rows}`,
      gap && (typeof gap === 'number' ? `gap-${gap}` : `gap-[${gap}]`),
      columnGap && (typeof columnGap === 'number' ? `gap-x-${columnGap}` : `gap-x-[${columnGap}]`),
      rowGap && (typeof rowGap === 'number' ? `gap-y-${rowGap}` : `gap-y-[${rowGap}]`),
      autoFlow === 'row' && 'grid-flow-row',
      autoFlow === 'column' && 'grid-flow-col',
      autoFlow === 'dense' && 'grid-flow-dense',
      autoFlow === 'row-dense' && 'grid-flow-row-dense',
      autoFlow === 'column-dense' && 'grid-flow-col-dense',
      alignItems === 'start' && 'items-start',
      alignItems === 'end' && 'items-end',
      alignItems === 'center' && 'items-center',
      alignItems === 'stretch' && 'items-stretch',
      justifyItems === 'start' && 'justify-items-start',
      justifyItems === 'end' && 'justify-items-end',
      justifyItems === 'center' && 'justify-items-center',
      justifyItems === 'stretch' && 'justify-items-stretch',
      className
    );

    const customStyle = {
      ...style,
      ...(typeof columns === 'string' && { gridTemplateColumns: columns }),
      ...(typeof rows === 'string' && { gridTemplateRows: rows }),
      ...(templateColumns && { gridTemplateColumns: templateColumns }),
      ...(templateRows && { gridTemplateRows: templateRows }),
    };

    return (
      <div ref={ref} className={classes} style={customStyle} {...props}>
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: number;
  rowSpan?: number;
  colStart?: number;
  colEnd?: number;
  rowStart?: number;
  rowEnd?: number;
}

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, colSpan, rowSpan, colStart, colEnd, rowStart, rowEnd, children, ...props }, ref) => {
    const classes = cn(
      colSpan && `col-span-${colSpan}`,
      rowSpan && `row-span-${rowSpan}`,
      colStart && `col-start-${colStart}`,
      colEnd && `col-end-${colEnd}`,
      rowStart && `row-start-${rowStart}`,
      rowEnd && `row-end-${rowEnd}`,
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

GridItem.displayName = 'GridItem';
