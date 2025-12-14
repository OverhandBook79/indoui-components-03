import React from 'react';
import { cn } from '@/lib/utils';
import { RadiusKey } from '../../theme/tokens';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoaded?: boolean;
  borderRadius?: RadiusKey;
  fadeDuration?: number;
  speed?: number;
  startColor?: string;
  endColor?: string;
}

const radiusStyles: Record<RadiusKey, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ isLoaded, borderRadius = 'md', fadeDuration = 0.4, speed = 1.5, className, children, style, ...props }, ref) => {
    if (isLoaded) {
      return <>{children}</>;
    }

    const classes = cn(
      'animate-pulse bg-muted',
      radiusStyles[borderRadius],
      !children && 'h-4 w-full',
      className
    );

    return (
      <div
        ref={ref}
        className={classes}
        style={{
          animationDuration: `${speed}s`,
          ...style,
        }}
        {...props}
      >
        {children && <div className="invisible">{children}</div>}
      </div>
    );
  }
);

Skeleton.displayName = 'Skeleton';

export interface SkeletonTextProps {
  noOfLines?: number;
  spacing?: number;
  skeletonHeight?: string;
  isLoaded?: boolean;
  children?: React.ReactNode;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  noOfLines = 3,
  spacing = 3,
  skeletonHeight = '0.75rem',
  isLoaded,
  children,
}) => {
  if (isLoaded) {
    return <>{children}</>;
  }

  return (
    <div className={`flex flex-col gap-${spacing}`}>
      {Array.from({ length: noOfLines }).map((_, i) => (
        <Skeleton
          key={i}
          style={{
            height: skeletonHeight,
            width: i === noOfLines - 1 ? '80%' : '100%',
          }}
        />
      ))}
    </div>
  );
};

export interface SkeletonCircleProps {
  size?: string;
  isLoaded?: boolean;
  children?: React.ReactNode;
}

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  size = '3rem',
  isLoaded,
  children,
}) => {
  if (isLoaded) {
    return <>{children}</>;
  }

  return (
    <Skeleton
      borderRadius="full"
      style={{ width: size, height: size }}
    />
  );
};
