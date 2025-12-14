import React from 'react';
import { cn } from '@/lib/utils';
import { SizeKey, ColorScheme } from '../../theme/tokens';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: SizeKey;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  colorScheme?: ColorScheme;
  showBorder?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const sizeClasses: Record<SizeKey, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-14 w-14 text-lg',
  '2xl': 'h-16 w-16 text-xl',
};

const radiusClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

const getInitials = (name: string): string => {
  const names = name.trim().split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = '',
  size = 'md',
  borderRadius = 'full',
  colorScheme = 'primary',
  showBorder = false,
  className,
  children,
}) => {
  const [imgError, setImgError] = React.useState(false);

  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium select-none overflow-hidden',
    'bg-primary/10 text-primary',
    sizeClasses[size],
    radiusClasses[borderRadius],
    showBorder && 'ring-2 ring-background',
    className
  );

  if (src && !imgError) {
    return (
      <span className={baseClasses}>
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      </span>
    );
  }

  return (
    <span className={baseClasses}>
      {children || getInitials(name) || '?'}
    </span>
  );
};

export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: SizeKey;
  spacing?: number;
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 3,
  size = 'md',
  spacing = -2,
  className,
}) => {
  const avatars = React.Children.toArray(children);
  const excess = avatars.length - max;
  const visibleAvatars = excess > 0 ? avatars.slice(0, max) : avatars;

  return (
    <div className={cn('flex items-center', className)} style={{ marginLeft: `${-spacing * 4}px` }}>
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          style={{ marginLeft: `${spacing * 4}px` }}
          className="relative"
        >
          {React.cloneElement(avatar as React.ReactElement, { size, showBorder: true })}
        </div>
      ))}
      {excess > 0 && (
        <div style={{ marginLeft: `${spacing * 4}px` }}>
          <Avatar size={size} showBorder>
            +{excess}
          </Avatar>
        </div>
      )}
    </div>
  );
};
