import React from 'react';
import { cn } from '@/lib/utils';

type ResponsiveValue<T> = T | { base?: T; sm?: T; md?: T; lg?: T; xl?: T; '2xl'?: T };

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  w?: ResponsiveValue<string>;
  h?: ResponsiveValue<string>;
  minW?: string;
  maxW?: string;
  minH?: string;
  maxH?: string;
  p?: ResponsiveValue<string | number>;
  px?: ResponsiveValue<string | number>;
  py?: ResponsiveValue<string | number>;
  pt?: string | number;
  pb?: string | number;
  pl?: string | number;
  pr?: string | number;
  m?: ResponsiveValue<string | number>;
  mx?: ResponsiveValue<string | number>;
  my?: ResponsiveValue<string | number>;
  mt?: string | number;
  mb?: string | number;
  ml?: string | number;
  mr?: string | number;
  bg?: string;
  color?: string;
  borderRadius?: string;
  display?: string;
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
  overflow?: 'hidden' | 'auto' | 'scroll' | 'visible';
}

const getSpacingClass = (prefix: string, value?: string | number): string => {
  if (value === undefined) return '';
  if (typeof value === 'number') return `${prefix}-${value}`;
  return `${prefix}-[${value}]`;
};

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ as: Component = 'div', className, children, style, ...props }, ref) => {
    const {
      w, h, minW, maxW, minH, maxH,
      p, px, py, pt, pb, pl, pr,
      m, mx, my, mt, mb, ml, mr,
      bg, color, borderRadius, display, position, overflow,
      ...rest
    } = props;

    const classes = cn(
      w && (typeof w === 'string' ? `w-[${w}]` : ''),
      h && (typeof h === 'string' ? `h-[${h}]` : ''),
      minW && `min-w-[${minW}]`,
      maxW && `max-w-[${maxW}]`,
      minH && `min-h-[${minH}]`,
      maxH && `max-h-[${maxH}]`,
      p && getSpacingClass('p', typeof p === 'object' ? p.base : p),
      px && getSpacingClass('px', typeof px === 'object' ? px.base : px),
      py && getSpacingClass('py', typeof py === 'object' ? py.base : py),
      pt && getSpacingClass('pt', pt),
      pb && getSpacingClass('pb', pb),
      pl && getSpacingClass('pl', pl),
      pr && getSpacingClass('pr', pr),
      m && getSpacingClass('m', typeof m === 'object' ? m.base : m),
      mx && getSpacingClass('mx', typeof mx === 'object' ? mx.base : mx),
      my && getSpacingClass('my', typeof my === 'object' ? my.base : my),
      mt && getSpacingClass('mt', mt),
      mb && getSpacingClass('mb', mb),
      ml && getSpacingClass('ml', ml),
      mr && getSpacingClass('mr', mr),
      bg && `bg-${bg}`,
      color && `text-${color}`,
      borderRadius && `rounded-${borderRadius}`,
      display && display,
      position,
      overflow && `overflow-${overflow}`,
      className
    );

    return (
      <Component ref={ref} className={classes} style={style} {...rest}>
        {children}
      </Component>
    );
  }
);

Box.displayName = 'Box';
