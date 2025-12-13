import React from 'react';
import { cn } from '@/lib/utils';
import { LayoutProps, getLayoutClasses } from '../../utils/layoutProps';

export type AspectRatioValue = '1:1' | '4:3' | '16:9' | '21:9' | '3:2' | '2:3' | '9:16' | number;

export interface AspectRatioProps extends LayoutProps {
  ratio?: AspectRatioValue;
  children: React.ReactNode;
  className?: string;
}

export interface AspectImageProps extends LayoutProps {
  src: string;
  alt: string;
  ratio?: AspectRatioValue;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
}

export interface AspectVideoProps extends LayoutProps {
  src: string;
  ratio?: AspectRatioValue;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  poster?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  className?: string;
}

export interface AspectIframeProps extends LayoutProps {
  src: string;
  ratio?: AspectRatioValue;
  title?: string;
  allow?: string;
  allowFullScreen?: boolean;
  sandbox?: string;
  loading?: 'lazy' | 'eager';
  className?: string;
}

const getRatioValue = (ratio: AspectRatioValue): number => {
  if (typeof ratio === 'number') return ratio;
  const ratios: Record<string, number> = {
    '1:1': 1,
    '4:3': 4 / 3,
    '16:9': 16 / 9,
    '21:9': 21 / 9,
    '3:2': 3 / 2,
    '2:3': 2 / 3,
    '9:16': 9 / 16,
  };
  return ratios[ratio] || 16 / 9;
};

export const AspectRatio: React.FC<AspectRatioProps> = ({
  ratio = '16:9',
  children,
  className,
  ...layoutProps
}) => {
  const layoutClasses = getLayoutClasses(layoutProps);
  const ratioValue = getRatioValue(ratio);
  const paddingBottom = `${(1 / ratioValue) * 100}%`;

  return (
    <div 
      className={cn('relative overflow-hidden', layoutClasses, className)}
      style={{ paddingBottom }}
    >
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
};

export const AspectImage: React.FC<AspectImageProps> = ({
  src,
  alt,
  ratio = '16:9',
  objectFit = 'cover',
  objectPosition = 'center',
  fallbackSrc,
  onLoad,
  onError,
  className,
  ...layoutProps
}) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const layoutClasses = getLayoutClasses(layoutProps);
  const ratioValue = getRatioValue(ratio);
  const paddingBottom = `${(1 / ratioValue) * 100}%`;

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
    onError?.();
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div 
      className={cn('relative overflow-hidden bg-muted', layoutClasses, className)}
      style={{ paddingBottom }}
    >
      <img
        src={imgSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'absolute inset-0 w-full h-full transition-opacity duration-300',
          !isLoaded && 'opacity-0',
          isLoaded && 'opacity-100'
        )}
        style={{ 
          objectFit, 
          objectPosition 
        }}
        loading="lazy"
      />
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
    </div>
  );
};

export const AspectVideo: React.FC<AspectVideoProps> = ({
  src,
  ratio = '16:9',
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  poster,
  objectFit = 'cover',
  onPlay,
  onPause,
  onEnded,
  className,
  ...layoutProps
}) => {
  const layoutClasses = getLayoutClasses(layoutProps);
  const ratioValue = getRatioValue(ratio);
  const paddingBottom = `${(1 / ratioValue) * 100}%`;

  return (
    <div 
      className={cn('relative overflow-hidden bg-black', layoutClasses, className)}
      style={{ paddingBottom }}
    >
      <video
        src={src}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        poster={poster}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        className="absolute inset-0 w-full h-full"
        style={{ objectFit }}
      />
    </div>
  );
};

export const AspectIframe: React.FC<AspectIframeProps> = ({
  src,
  ratio = '16:9',
  title = 'Embedded content',
  allow,
  allowFullScreen = true,
  sandbox,
  loading = 'lazy',
  className,
  ...layoutProps
}) => {
  const layoutClasses = getLayoutClasses(layoutProps);
  const ratioValue = getRatioValue(ratio);
  const paddingBottom = `${(1 / ratioValue) * 100}%`;

  return (
    <div 
      className={cn('relative overflow-hidden bg-muted', layoutClasses, className)}
      style={{ paddingBottom }}
    >
      <iframe
        src={src}
        title={title}
        allow={allow}
        allowFullScreen={allowFullScreen}
        sandbox={sandbox}
        loading={loading}
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
};

AspectRatio.displayName = 'AspectRatio';
AspectImage.displayName = 'AspectImage';
AspectVideo.displayName = 'AspectVideo';
AspectIframe.displayName = 'AspectIframe';
