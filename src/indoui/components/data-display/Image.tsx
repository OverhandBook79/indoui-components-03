import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Image as ImageIcon } from 'lucide-react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
  fallbackSrc?: string;
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  aspectRatio?: '1/1' | '4/3' | '16/9' | '21/9' | 'auto';
}

const radiusStyles: Record<string, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

const fitStyles: Record<string, string> = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
};

const aspectStyles: Record<string, string> = {
  '1/1': 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-video',
  '21/9': 'aspect-[21/9]',
  auto: 'aspect-auto',
};

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  fallback,
  fallbackSrc,
  fit = 'cover',
  borderRadius = 'md',
  aspectRatio = 'auto',
  className,
  onError,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    setIsLoading(false);
    if (fallbackSrc) {
      e.currentTarget.src = fallbackSrc;
    }
    onError?.(e);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError && !fallbackSrc) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          radiusStyles[borderRadius],
          aspectStyles[aspectRatio],
          className
        )}
      >
        {fallback || <ImageIcon className="w-8 h-8" />}
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', radiusStyles[borderRadius], aspectStyles[aspectRatio], className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          'w-full h-full transition-opacity duration-300',
          fitStyles[fit],
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
};

Image.displayName = 'Image';